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
  employmentRecords: [],
  unemploymentRecords: [],
  workflowQueue: [],
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
const refreshRecordsButton = document.querySelector("#refresh-records-button");
const refreshReviewButton = document.querySelector("#refresh-review-button");
const enterpriseTableBody = document.querySelector("#enterprise-table-body");
const employmentTableBody = document.querySelector("#employment-table-body");
const unemploymentTableBody = document.querySelector("#unemployment-table-body");
const reviewQueueBody = document.querySelector("#review-queue-body");
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
const employmentForm = document.querySelector("#employment-form");
const unemploymentForm = document.querySelector("#unemployment-form");
const employmentEnterpriseSelect = document.querySelector("#employment-enterprise-select");
const unemploymentEnterpriseSelect = document.querySelector("#unemployment-enterprise-select");
const employmentReportMonth = document.querySelector("#employment-report-month");
const unemploymentReportMonth = document.querySelector("#unemployment-report-month");
const employmentHalfRow = document.querySelector("#employment-half-row");
const unemploymentHalfRow = document.querySelector("#unemployment-half-row");
const employmentHalfSelector = document.querySelector("#employment-half-selector");
const unemploymentHalfSelector = document.querySelector("#unemployment-half-selector");
const employmentCountInput = document.querySelector("#employment-count-input");
const unemploymentCountInput = document.querySelector("#unemployment-count-input");
const newHiresInput = document.querySelector("#new-hires-input");
const layoffsInput = document.querySelector("#layoffs-input");
const employmentPeriodHint = document.querySelector("#employment-period-hint");
const unemploymentPeriodHint = document.querySelector("#unemployment-period-hint");
const employmentFormResult = document.querySelector("#employment-form-result");
const unemploymentFormResult = document.querySelector("#unemployment-form-result");

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


function mapStatusLabel(status) {
  const dictionary = {
    draft: "草稿",
    city_pending: "待市级审核",
    city_rejected: "市级退回",
    province_pending: "待省级审核",
    province_rejected: "省级退回",
    approved: "审核通过",
  };
  return dictionary[status] || status;
}


function isQ1Month(monthValue) {
  if (!monthValue || !monthValue.includes("-")) {
    return false;
  }
  const month = monthValue.split("-")[1];
  return ["01", "02", "03"].includes(month);
}


function buildReportMeta(monthValue, halfValue) {
  if (isQ1Month(monthValue)) {
    return {
      report_type: "half_month",
      report_period: `${monthValue}-${halfValue}`,
      periodLabel: `${monthValue} ${halfValue === "H1" ? "上半月" : "下半月"}`,
    };
  }

  return {
    report_type: "monthly",
    report_period: monthValue,
    periodLabel: `${monthValue} 整月`,
  };
}


function updatePeriodControls(monthInput, halfRow, hintNode, halfSelector) {
  const monthValue = monthInput.value;
  if (isQ1Month(monthValue)) {
    halfRow.classList.remove("hidden");
    const meta = buildReportMeta(monthValue, halfSelector.value);
    hintNode.textContent = `当前月份属于一季度，需按半月报提交：${meta.periodLabel}`;
    return;
  }

  halfRow.classList.add("hidden");
  const meta = buildReportMeta(monthValue, halfSelector.value);
  hintNode.textContent = `当前月份按整月报提交：${meta.periodLabel}`;
}


function populateEnterpriseSelects() {
  const options = state.enterprises
    .map((enterprise) => `<option value="${enterprise.id}">${enterprise.name}</option>`)
    .join("");

  employmentEnterpriseSelect.innerHTML = options || '<option value="">暂无企业</option>';
  unemploymentEnterpriseSelect.innerHTML = options || '<option value="">暂无企业</option>';

  if (state.currentUser?.role === "enterprise" && state.currentUser.enterprise_id) {
    employmentEnterpriseSelect.value = String(state.currentUser.enterprise_id);
    unemploymentEnterpriseSelect.value = String(state.currentUser.enterprise_id);
    employmentEnterpriseSelect.disabled = true;
    unemploymentEnterpriseSelect.disabled = true;
  } else {
    employmentEnterpriseSelect.disabled = false;
    unemploymentEnterpriseSelect.disabled = false;
  }
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


function renderRecordTable(tableBody, records, recordType) {
  if (!state.currentUser) {
    tableBody.innerHTML = '<tr><td colspan="7">请先登录后再查看记录。</td></tr>';
    return;
  }

  if (!records.length) {
    tableBody.innerHTML = '<tr><td colspan="7">暂无记录</td></tr>';
    return;
  }

  tableBody.innerHTML = records
    .map((record) => {
      const submitButton = ["draft", "city_rejected"].includes(record.workflow_status) && ["enterprise", "admin"].includes(state.currentUser.role)
        ? `<button type="button" data-submit-type="${recordType}" data-submit-id="${record.id}">提交上报</button>`
        : '<span class="badge">已提交或只读</span>';

      return `
        <tr>
          <td>${record.id}</td>
          <td>${record.enterprise_name}</td>
          <td>${record.report_period}</td>
          <td>${recordType === "employment" ? record.employed_count : record.unemployed_count}</td>
          <td>${recordType === "employment" ? record.new_hires : record.layoffs}</td>
          <td>${mapStatusLabel(record.workflow_status)}</td>
          <td><div class="table-actions">${submitButton}</div></td>
        </tr>
      `;
    })
    .join("");

  tableBody.querySelectorAll("button[data-submit-id]").forEach((button) => {
    button.addEventListener("click", () => submitRecord(button.dataset.submitType, Number(button.dataset.submitId)));
  });
}


function renderWorkflowQueue() {
  if (!state.currentUser) {
    reviewQueueBody.innerHTML = '<tr><td colspan="7">请先登录后再查看审核队列。</td></tr>';
    return;
  }

  if (!state.workflowQueue.length) {
    reviewQueueBody.innerHTML = '<tr><td colspan="7">当前角色暂无待处理记录。</td></tr>';
    return;
  }

  reviewQueueBody.innerHTML = state.workflowQueue
    .map((record) => {
      let actionHtml = '<span class="badge">查看中</span>';
      if (["city_reviewer", "province_reviewer"].includes(state.currentUser.role)) {
        actionHtml = `
          <div class="table-actions">
            <button type="button" data-review-action="approve" data-review-type="${record.record_type}" data-review-id="${record.id}">通过</button>
            <button type="button" class="ghost-button" data-review-action="reject" data-review-type="${record.record_type}" data-review-id="${record.id}">退回</button>
          </div>
        `;
      }

      const comment = record.province_review_comment || record.city_review_comment || "-";
      return `
        <tr>
          <td>${record.record_type === "employment" ? "就业" : "失业"}</td>
          <td>${record.enterprise_name}</td>
          <td>${record.report_period}</td>
          <td>${mapStatusLabel(record.workflow_status)}</td>
          <td>${record.report_value}</td>
          <td>${comment}</td>
          <td>${actionHtml}</td>
        </tr>
      `;
    })
    .join("");

  reviewQueueBody.querySelectorAll("button[data-review-id]").forEach((button) => {
    button.addEventListener("click", () => {
      reviewRecord(
        button.dataset.reviewType,
        Number(button.dataset.reviewId),
        button.dataset.reviewAction,
      );
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
    populateEnterpriseSelects();
    renderEnterpriseTable();
    updateEnterpriseFormByRole();
  } catch (error) {
    state.enterprises = [];
    enterpriseTableBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
  }
}


async function loadEmploymentRecords() {
  if (!state.currentUser) {
    state.employmentRecords = [];
    renderRecordTable(employmentTableBody, state.employmentRecords, "employment");
    return;
  }

  try {
    state.employmentRecords = await requestJson(`${API_BASE_URL}/employment-records`, {
      headers: getAuthHeaders(),
    });
    renderRecordTable(employmentTableBody, state.employmentRecords, "employment");
  } catch (error) {
    employmentTableBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
  }
}


async function loadUnemploymentRecords() {
  if (!state.currentUser) {
    state.unemploymentRecords = [];
    renderRecordTable(unemploymentTableBody, state.unemploymentRecords, "unemployment");
    return;
  }

  try {
    state.unemploymentRecords = await requestJson(`${API_BASE_URL}/unemployment-records`, {
      headers: getAuthHeaders(),
    });
    renderRecordTable(unemploymentTableBody, state.unemploymentRecords, "unemployment");
  } catch (error) {
    unemploymentTableBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
  }
}


async function loadWorkflowQueue() {
  if (!state.currentUser) {
    state.workflowQueue = [];
    renderWorkflowQueue();
    return;
  }

  try {
    state.workflowQueue = await requestJson(`${API_BASE_URL}/workflow/queue`, {
      headers: getAuthHeaders(),
    });
    renderWorkflowQueue();
  } catch (error) {
    reviewQueueBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
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
    if (result.user.role === "enterprise") {
      setActiveView("reports");
    } else if (["city_reviewer", "province_reviewer"].includes(result.user.role)) {
      setActiveView("review");
    } else {
      setActiveView("dashboard");
    }
    await Promise.all([
      loadOverview(),
      loadEnterprises(),
      loadEmploymentRecords(),
      loadUnemploymentRecords(),
      loadWorkflowQueue(),
    ]);
  } catch (error) {
    loginResult.textContent = error.message;
  }
}


function handleLogout() {
  state.currentUser = null;
  state.enterprises = [];
  state.employmentRecords = [];
  state.unemploymentRecords = [];
  state.workflowQueue = [];
  updateSessionSummary();
  renderEnterpriseTable();
  renderRecordTable(employmentTableBody, state.employmentRecords, "employment");
  renderRecordTable(unemploymentTableBody, state.unemploymentRecords, "unemployment");
  renderWorkflowQueue();
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


async function createEmploymentRecord(event) {
  event.preventDefault();

  if (!state.currentUser) {
    employmentFormResult.textContent = "请先登录后再创建就业记录。";
    return;
  }

  const monthValue = employmentReportMonth.value;
  const meta = buildReportMeta(monthValue, employmentHalfSelector.value);
  const payload = {
    enterprise_id: Number(employmentEnterpriseSelect.value),
    report_type: meta.report_type,
    report_period: meta.report_period,
    employed_count: Number(employmentCountInput.value),
    new_hires: Number(newHiresInput.value),
  };

  try {
    const result = await requestJson(`${API_BASE_URL}/employment-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    employmentFormResult.textContent = `${result.message}，当前状态为草稿。`;
    await Promise.all([loadEmploymentRecords(), loadOverview(), loadWorkflowQueue()]);
  } catch (error) {
    employmentFormResult.textContent = error.message;
  }
}


async function createUnemploymentRecord(event) {
  event.preventDefault();

  if (!state.currentUser) {
    unemploymentFormResult.textContent = "请先登录后再创建失业记录。";
    return;
  }

  const monthValue = unemploymentReportMonth.value;
  const meta = buildReportMeta(monthValue, unemploymentHalfSelector.value);
  const payload = {
    enterprise_id: Number(unemploymentEnterpriseSelect.value),
    report_type: meta.report_type,
    report_period: meta.report_period,
    unemployed_count: Number(unemploymentCountInput.value),
    layoffs: Number(layoffsInput.value),
  };

  try {
    const result = await requestJson(`${API_BASE_URL}/unemployment-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    unemploymentFormResult.textContent = `${result.message}，当前状态为草稿。`;
    await Promise.all([loadUnemploymentRecords(), loadOverview(), loadWorkflowQueue()]);
  } catch (error) {
    unemploymentFormResult.textContent = error.message;
  }
}


async function submitRecord(recordType, recordId) {
  try {
    const result = await requestJson(`${API_BASE_URL}/workflow/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        record_type: recordType,
        record_id: recordId,
      }),
    });

    if (recordType === "employment") {
      employmentFormResult.textContent = result.message;
    } else {
      unemploymentFormResult.textContent = result.message;
    }

    await Promise.all([
      loadEmploymentRecords(),
      loadUnemploymentRecords(),
      loadWorkflowQueue(),
      loadOverview(),
    ]);
  } catch (error) {
    if (recordType === "employment") {
      employmentFormResult.textContent = error.message;
    } else {
      unemploymentFormResult.textContent = error.message;
    }
  }
}


async function reviewRecord(recordType, recordId, action) {
  const comment = window.prompt(action === "approve" ? "请输入审核通过意见" : "请输入退回原因", action === "approve" ? "审核通过" : "请补充后重新提交");
  if (!comment) {
    return;
  }

  try {
    await requestJson(`${API_BASE_URL}/workflow/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        record_type: recordType,
        record_id: recordId,
        action,
        review_comment: comment,
      }),
    });

    await Promise.all([
      loadEmploymentRecords(),
      loadUnemploymentRecords(),
      loadWorkflowQueue(),
      loadOverview(),
    ]);
  } catch (error) {
    reviewQueueBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
  }
}


async function bootstrap() {
  renderDemoAccounts();
  await loadHealth();
  renderEnterpriseTable();
  renderRecordTable(employmentTableBody, state.employmentRecords, "employment");
  renderRecordTable(unemploymentTableBody, state.unemploymentRecords, "unemployment");
  renderWorkflowQueue();
  updateEnterpriseFormByRole();
  updatePeriodControls(employmentReportMonth, employmentHalfRow, employmentPeriodHint, employmentHalfSelector);
  updatePeriodControls(unemploymentReportMonth, unemploymentHalfRow, unemploymentPeriodHint, unemploymentHalfSelector);
}


loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);
refreshButton.addEventListener("click", async () => {
  await Promise.all([loadOverview(), loadEnterprises()]);
});
refreshRecordsButton.addEventListener("click", async () => {
  await Promise.all([loadEmploymentRecords(), loadUnemploymentRecords(), loadWorkflowQueue(), loadOverview()]);
});
refreshReviewButton.addEventListener("click", async () => {
  await Promise.all([loadWorkflowQueue(), loadOverview()]);
});
enterpriseForm.addEventListener("submit", saveEnterprise);
employmentForm.addEventListener("submit", createEmploymentRecord);
unemploymentForm.addEventListener("submit", createUnemploymentRecord);
resetEnterpriseButton.addEventListener("click", () => updateEnterpriseFormByRole());
employmentReportMonth.addEventListener("change", () => updatePeriodControls(employmentReportMonth, employmentHalfRow, employmentPeriodHint, employmentHalfSelector));
employmentHalfSelector.addEventListener("change", () => updatePeriodControls(employmentReportMonth, employmentHalfRow, employmentPeriodHint, employmentHalfSelector));
unemploymentReportMonth.addEventListener("change", () => updatePeriodControls(unemploymentReportMonth, unemploymentHalfRow, unemploymentPeriodHint, unemploymentHalfSelector));
unemploymentHalfSelector.addEventListener("change", () => updatePeriodControls(unemploymentReportMonth, unemploymentHalfRow, unemploymentPeriodHint, unemploymentHalfSelector));
navButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

bootstrap();
