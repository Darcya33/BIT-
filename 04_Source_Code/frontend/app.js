const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
const HEALTH_URL = "http://127.0.0.1:8000/health";

const demoAccounts = [
  { username: "admin", password: "admin123", roleLabel: "系统管理员" },
  { username: "enterprise_demo", password: "enterprise123", roleLabel: "企业填报人员" },
  { username: "city_reviewer", password: "city123456", roleLabel: "市级审核人员" },
  { username: "province_reviewer", password: "province123", roleLabel: "省级审核人员" },
];

const state = {
  currentUser: null,
  enterprises: [],
  currentView: "dashboard",
};

const healthStatus = document.querySelector("#health-status");
const sessionSummary = document.querySelector("#session-summary");
const loginForm = document.querySelector("#login-form");
const loginResult = document.querySelector("#login-result");
const logoutButton = document.querySelector("#logout-button");
const usernameInput = document.querySelector("#username-input");
const passwordInput = document.querySelector("#password-input");
const demoAccountList = document.querySelector("#demo-account-list");
const navButtons = document.querySelectorAll(".nav-button");
const appViews = document.querySelectorAll(".app-view");
const refreshButton = document.querySelector("#refresh-button");
const enterpriseTableBody = document.querySelector("#enterprise-table-body");
const enterpriseForm = document.querySelector("#enterprise-form");
const enterpriseFormTitle = document.querySelector("#enterprise-form-title");
const enterpriseFormHint = document.querySelector("#enterprise-form-hint");
const enterpriseFormResult = document.querySelector("#enterprise-form-result");
const resetEnterpriseButton = document.querySelector("#reset-enterprise-button");
const enterpriseIdInput = document.querySelector("#enterprise-id-input");
const enterpriseNameInput = document.querySelector("#enterprise-name-input");
const socialCreditCodeInput = document.querySelector("#social-credit-code-input");
const contactPersonInput = document.querySelector("#contact-person-input");
const contactPhoneInput = document.querySelector("#contact-phone-input");
const industryTypeInput = document.querySelector("#industry-type-input");
const cityNameInput = document.querySelector("#city-name-input");
const provinceNameInput = document.querySelector("#province-name-input");
const reportingFrequencyRuleInput = document.querySelector("#reporting-frequency-rule-input");

const enterpriseCount = document.querySelector("#enterprise-count");
const employedTotal = document.querySelector("#employed-total");
const unemployedTotal = document.querySelector("#unemployed-total");
const newHiresTotal = document.querySelector("#new-hires-total");
const cityPendingCount = document.querySelector("#city-pending-count");
const provincePendingCount = document.querySelector("#province-pending-count");


function getAuthHeaders() {
  if (!state.currentUser) {
    return {};
  }

  return {
    "X-User-Id": String(state.currentUser.id),
    "X-User-Role": state.currentUser.role,
  };
}


async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let detail = `请求失败: ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody.detail) {
        detail = errorBody.detail;
      }
    } catch (error) {
      detail = `请求失败: ${response.status}`;
    }
    throw new Error(detail);
  }
  return response.json();
}


function renderDemoAccounts() {
  demoAccountList.innerHTML = demoAccounts
    .map(
      (account) => `
        <article class="account-item">
          <strong>${account.roleLabel}</strong>
          <div class="muted">用户名：${account.username}</div>
          <div class="muted">密码：${account.password}</div>
          <button type="button" data-account="${account.username}">填入账号</button>
        </article>
      `
    )
    .join("");

  demoAccountList.querySelectorAll("button[data-account]").forEach((button) => {
    button.addEventListener("click", () => {
      const account = demoAccounts.find((item) => item.username === button.dataset.account);
      usernameInput.value = account.username;
      passwordInput.value = account.password;
    });
  });
}


async function loadHealth() {
  try {
    const result = await requestJson(HEALTH_URL);
    healthStatus.textContent = `后端状态正常 | 版本 ${result.version}`;
  } catch (error) {
    healthStatus.textContent = "未连接到后端，请先启动 API 服务";
  }
}


function updateSessionSummary() {
  if (!state.currentUser) {
    sessionSummary.textContent = "尚未登录";
    return;
  }

  sessionSummary.textContent = `${state.currentUser.display_name} | ${state.currentUser.organization_name || "未绑定机构"}`;
}


function setActiveView(viewName) {
  state.currentView = viewName;
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewName);
  });
  appViews.forEach((view) => {
    view.classList.toggle("hidden", view.id !== `${viewName}-view`);
  });
}


function fillEnterpriseForm(enterprise = null) {
  if (!enterprise) {
    enterpriseIdInput.value = "";
    enterpriseNameInput.value = "";
    socialCreditCodeInput.value = "";
    contactPersonInput.value = "";
    contactPhoneInput.value = "";
    industryTypeInput.value = "数字服务";
    cityNameInput.value = "昆明市";
    provinceNameInput.value = "云南省";
    reportingFrequencyRuleInput.value = "Q1_HALF_MONTH_OTHER_MONTHLY";
    return;
  }

  enterpriseIdInput.value = enterprise.id;
  enterpriseNameInput.value = enterprise.name;
  socialCreditCodeInput.value = enterprise.social_credit_code;
  contactPersonInput.value = enterprise.contact_person;
  contactPhoneInput.value = enterprise.contact_phone;
  industryTypeInput.value = enterprise.industry_type;
  cityNameInput.value = enterprise.city_name;
  provinceNameInput.value = enterprise.province_name;
  reportingFrequencyRuleInput.value = enterprise.reporting_frequency_rule;
}


function updateEnterpriseFormByRole() {
  if (!state.currentUser) {
    enterpriseForm.classList.add("hidden");
    enterpriseFormTitle.textContent = "企业信息表单";
    enterpriseFormHint.textContent = "请先登录后再进行企业信息管理。";
    enterpriseFormResult.textContent = "请先登录后再进行企业信息管理。";
    return;
  }

  if (["city_reviewer", "province_reviewer"].includes(state.currentUser.role)) {
    enterpriseForm.classList.add("hidden");
    enterpriseFormTitle.textContent = "企业信息只读查看";
    enterpriseFormHint.textContent = "审核角色当前阶段仅可查看企业列表，无修改权限。";
    enterpriseFormResult.textContent = "当前角色为审核角色，只读查看企业信息。";
    return;
  }

  enterpriseForm.classList.remove("hidden");

  if (state.currentUser.role === "admin") {
    enterpriseFormTitle.textContent = "新增或编辑企业信息";
    enterpriseFormHint.textContent = "管理员可新增企业，也可点击表格中的编辑按钮修改现有企业。";
    fillEnterpriseForm();
    return;
  }

  if (state.currentUser.role === "enterprise") {
    enterpriseFormTitle.textContent = "维护本企业信息";
    enterpriseFormHint.textContent = "企业用户只能编辑本企业信息，不能新增其他企业。";
    const enterprise = state.enterprises.find((item) => item.id === state.currentUser.enterprise_id) || null;
    fillEnterpriseForm(enterprise);
  }
}


function renderEnterpriseTable() {
  if (!state.currentUser) {
    enterpriseTableBody.innerHTML = '<tr><td colspan="7">请先登录后再查看企业信息。</td></tr>';
    return;
  }

  if (!state.enterprises.length) {
    enterpriseTableBody.innerHTML = '<tr><td colspan="7">暂无企业数据</td></tr>';
    return;
  }

  enterpriseTableBody.innerHTML = state.enterprises
    .map((enterprise) => {
      let actionHtml = '<span class="badge">只读</span>';

      if (state.currentUser.role === "admin") {
        actionHtml = `<div class="table-actions"><button type="button" data-edit-id="${enterprise.id}">编辑</button></div>`;
      }

      if (state.currentUser.role === "enterprise" && state.currentUser.enterprise_id === enterprise.id) {
        actionHtml = `<div class="table-actions"><button type="button" data-edit-id="${enterprise.id}">维护本企业</button></div>`;
      }

      return `
        <tr>
          <td>${enterprise.id}</td>
          <td>${enterprise.name}</td>
          <td>${enterprise.industry_type}</td>
          <td>${enterprise.province_name} / ${enterprise.city_name}</td>
          <td>${enterprise.reporting_frequency_rule === "Q1_HALF_MONTH_OTHER_MONTHLY" ? "一季度半月报" : "整月报"}</td>
          <td>${enterprise.contact_person} / ${enterprise.contact_phone}</td>
          <td>${actionHtml}</td>
        </tr>
      `;
    })
    .join("");

  enterpriseTableBody.querySelectorAll("button[data-edit-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const enterprise = state.enterprises.find((item) => item.id === Number(button.dataset.editId));
      fillEnterpriseForm(enterprise);
      enterpriseFormResult.textContent = `已加载企业 ${enterprise.name} 的信息，可继续编辑。`;
    });
  });
}


async function loadOverview() {
  if (!state.currentUser) {
    enterpriseCount.textContent = "-";
    employedTotal.textContent = "-";
    unemployedTotal.textContent = "-";
    newHiresTotal.textContent = "-";
    cityPendingCount.textContent = "-";
    provincePendingCount.textContent = "-";
    return;
  }

  try {
    const result = await requestJson(`${API_BASE_URL}/stats/overview`, {
      headers: getAuthHeaders(),
    });
    enterpriseCount.textContent = result.enterpriseCount;
    employedTotal.textContent = result.employedTotal;
    unemployedTotal.textContent = result.unemployedTotal;
    newHiresTotal.textContent = result.newHiresTotal;
    cityPendingCount.textContent = result.cityPendingCount;
    provincePendingCount.textContent = result.provincePendingCount;
  } catch (error) {
    enterpriseCount.textContent = "-";
    employedTotal.textContent = "-";
    unemployedTotal.textContent = "-";
    newHiresTotal.textContent = "-";
    cityPendingCount.textContent = "-";
    provincePendingCount.textContent = "-";
  }
}


async function loadEnterprises() {
  if (!state.currentUser) {
    state.enterprises = [];
    renderEnterpriseTable();
    updateEnterpriseFormByRole();
    return;
  }

  try {
    const rows = await requestJson(`${API_BASE_URL}/enterprises`, {
      headers: getAuthHeaders(),
    });
    state.enterprises = rows;
    renderEnterpriseTable();
    updateEnterpriseFormByRole();
  } catch (error) {
    state.enterprises = [];
    enterpriseTableBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
  }
}


async function handleLogin(event) {
  event.preventDefault();
  loginResult.textContent = "正在调用登录接口...";

  try {
    const result = await requestJson(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim(),
      }),
    });

    state.currentUser = result.user;
    updateSessionSummary();
    loginResult.textContent = `${result.message}，当前角色：${result.user.role}`;
    setActiveView(result.user.role === "enterprise" ? "enterprises" : "dashboard");
    await Promise.all([loadOverview(), loadEnterprises()]);
  } catch (error) {
    loginResult.textContent = error.message;
  }
}


function handleLogout() {
  state.currentUser = null;
  state.enterprises = [];
  updateSessionSummary();
  renderEnterpriseTable();
  updateEnterpriseFormByRole();
  setActiveView("dashboard");
  loginResult.textContent = "已退出登录。";
}


async function saveEnterprise(event) {
  event.preventDefault();

  if (!state.currentUser) {
    enterpriseFormResult.textContent = "请先登录后再保存企业信息。";
    return;
  }

  if (!["admin", "enterprise"].includes(state.currentUser.role)) {
    enterpriseFormResult.textContent = "当前角色只读，无权修改企业信息。";
    return;
  }

  const payload = {
    name: enterpriseNameInput.value.trim(),
    social_credit_code: socialCreditCodeInput.value.trim(),
    contact_person: contactPersonInput.value.trim(),
    contact_phone: contactPhoneInput.value.trim(),
    industry_type: industryTypeInput.value.trim(),
    city_name: cityNameInput.value.trim(),
    province_name: provinceNameInput.value.trim(),
    reporting_frequency_rule: reportingFrequencyRuleInput.value,
  };

  const enterpriseId = enterpriseIdInput.value.trim();
  const isUpdate = Boolean(enterpriseId);
  const url = isUpdate ? `${API_BASE_URL}/enterprises/${enterpriseId}` : `${API_BASE_URL}/enterprises`;
  const method = isUpdate ? "PUT" : "POST";

  try {
    const result = await requestJson(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    enterpriseFormResult.textContent = result.message;
    await loadEnterprises();
    await loadOverview();

    if (state.currentUser.role === "admin") {
      fillEnterpriseForm();
    }
  } catch (error) {
    enterpriseFormResult.textContent = error.message;
  }
}


async function bootstrap() {
  renderDemoAccounts();
  await loadHealth();
  renderEnterpriseTable();
  updateEnterpriseFormByRole();
}


loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);
refreshButton.addEventListener("click", async () => {
  await Promise.all([loadOverview(), loadEnterprises()]);
});
enterpriseForm.addEventListener("submit", saveEnterprise);
resetEnterpriseButton.addEventListener("click", () => updateEnterpriseFormByRole());
navButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

bootstrap();
