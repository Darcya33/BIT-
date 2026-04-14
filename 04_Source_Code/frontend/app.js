const API_CANDIDATES = [
  {
    apiBaseUrl: "http://127.0.0.1:8000/api/v1",
    healthUrl: "http://127.0.0.1:8000/health",
  },
  {
    apiBaseUrl: "http://127.0.0.1:8005/api/v1",
    healthUrl: "http://127.0.0.1:8005/health",
  },
];

let API_BASE_URL = API_CANDIDATES[0].apiBaseUrl;
let HEALTH_URL = API_CANDIDATES[0].healthUrl;

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
  workflowHistory: [],
  analysisSummary: null,
  analysisFilteredRecords: [],
  currentView: "dashboard",
  authMode: "login",
};

const healthStatus = document.querySelector("#health-status");
const sessionSummary = document.querySelector("#session-summary");
const loginForm = document.querySelector("#login-form");
const loginResult = document.querySelector("#login-result");
const logoutButton = document.querySelector("#logout-button");
const usernameInput = document.querySelector("#username-input");
const passwordInput = document.querySelector("#password-input");
const registerForm = document.querySelector("#register-form");
const registerResult = document.querySelector("#register-result");
const registerRoleInput = document.querySelector("#register-role-input");
const registerDisplayNameInput = document.querySelector("#register-display-name-input");
const registerUsernameInput = document.querySelector("#register-username-input");
const registerPasswordInput = document.querySelector("#register-password-input");
const registerOrganizationRow = document.querySelector("#register-organization-row");
const registerOrganizationLabel = document.querySelector("#register-organization-label");
const registerOrganizationInput = document.querySelector("#register-organization-input");
const registerEnterpriseFields = document.querySelector("#register-enterprise-fields");
const registerEnterpriseNameInput = document.querySelector("#register-enterprise-name-input");
const registerSocialCreditCodeInput = document.querySelector("#register-social-credit-code-input");
const registerContactPersonInput = document.querySelector("#register-contact-person-input");
const registerContactPhoneInput = document.querySelector("#register-contact-phone-input");
const registerIndustryTypeInput = document.querySelector("#register-industry-type-input");
const registerCityNameInput = document.querySelector("#register-city-name-input");
const registerProvinceNameInput = document.querySelector("#register-province-name-input");
const registerReportingRuleInput = document.querySelector("#register-reporting-rule-input");
const authModeButtons = document.querySelectorAll(".auth-switch-button");
const demoAccountList = document.querySelector("#demo-account-list");
const navButtons = document.querySelectorAll(".nav-button");
const appViews = document.querySelectorAll(".app-view");
const refreshButton = document.querySelector("#refresh-button");
const refreshRecordsButton = document.querySelector("#refresh-records-button");
const refreshReviewButton = document.querySelector("#refresh-review-button");
const refreshAnalysisButton = document.querySelector("#refresh-analysis-button");
const enterpriseTableBody = document.querySelector("#enterprise-table-body");
const employmentTableBody = document.querySelector("#employment-table-body");
const unemploymentTableBody = document.querySelector("#unemployment-table-body");
const reviewQueueBody = document.querySelector("#review-queue-body");
const analysisTableBody = document.querySelector("#analysis-table-body");
const analysisTimelineList = document.querySelector("#analysis-timeline-list");
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
const analysisTotalRecords = document.querySelector("#analysis-total-records");
const analysisDraftCount = document.querySelector("#analysis-draft-count");
const analysisApprovedCount = document.querySelector("#analysis-approved-count");
const analysisRejectedCount = document.querySelector("#analysis-rejected-count");
const analysisHalfMonthCount = document.querySelector("#analysis-half-month-count");
const analysisMonthlyCount = document.querySelector("#analysis-monthly-count");
const analysisFilterForm = document.querySelector("#analysis-filter-form");
const analysisRecordTypeFilter = document.querySelector("#analysis-record-type-filter");
const analysisStatusFilter = document.querySelector("#analysis-status-filter");
const analysisPeriodFilter = document.querySelector("#analysis-period-filter");
const analysisEnterpriseFilter = document.querySelector("#analysis-enterprise-filter");
const analysisFilterResult = document.querySelector("#analysis-filter-result");
const resetAnalysisFilterButton = document.querySelector("#reset-analysis-filter-button");
const exportAnalysisButton = document.querySelector("#export-analysis-button");
const roleHomeTitle = document.querySelector("#role-home-title");
const roleHomeCopy = document.querySelector("#role-home-copy");
const roleTaskList = document.querySelector("#role-task-list");

const roleViewMap = {
  admin: ["dashboard", "enterprises", "reports", "analysis"],
  enterprise: ["dashboard", "enterprises", "reports", "analysis"],
  city_reviewer: ["dashboard", "analysis", "review"],
  province_reviewer: ["dashboard", "analysis", "review"],
};

const roleHomeMap = {
  guest: {
    title: "角色主页说明",
    copy: "登录后系统将根据身份加载对应功能入口和任务说明。",
    tasks: [
      "管理员可查看系统概览并维护企业基础信息。",
      "企业填报人员可维护企业资料、录入数据并提交审核。",
      "市级审核人员负责处理企业上报记录的初审。",
      "省级审核人员负责处理终审和退回意见。",
    ],
  },
  admin: {
    title: "管理员主页",
    copy: "管理员负责维护企业基础资料、查看运行概览并保证系统基础信息准确。",
    tasks: [
      "查看企业总量、就业总量、失业总量和待审状态概览。",
      "新增企业档案或维护现有企业基础信息。",
      "查看查询统计页和流程留痕。",
    ],
  },
  enterprise: {
    title: "企业填报主页",
    copy: "企业用户负责维护本企业资料、录入就业失业数据并跟踪审核结果。",
    tasks: [
      "维护本企业联系人、地区、报送规则等基础信息。",
      "录入就业与失业数据并保存为草稿。",
      "查看退回意见后重新提交记录进入审核链路。",
    ],
  },
  city_reviewer: {
    title: "市级审核主页",
    copy: "市级审核人员负责对企业上报记录进行初审，并决定是否提交省级复核。",
    tasks: [
      "查看待市级审核记录。",
      "填写审核意见并执行通过或退回。",
      "通过查询统计查看当前流程分布。",
    ],
  },
  province_reviewer: {
    title: "省级审核主页",
    copy: "省级审核人员负责终审处理，形成最终通过或退回结果。",
    tasks: [
      "查看待省级审核记录。",
      "执行终审通过或终审退回。",
      "查看审核时间线和最近业务记录。",
    ],
  },
};

function getAuthHeaders() {
  if (!state.currentUser) {
    return {};
  }

  return {
    "X-User-Id": String(state.currentUser.id),
    "X-User-Role": state.currentUser.role,
  };
}

async function resolveApiBase() {
  for (const candidate of API_CANDIDATES) {
    try {
      const response = await fetch(candidate.healthUrl);
      if (!response.ok) {
        continue;
      }

      API_BASE_URL = candidate.apiBaseUrl;
      HEALTH_URL = candidate.healthUrl;
      return;
    } catch (error) {
      continue;
    }
  }
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
      `,
    )
    .join("");

  demoAccountList.querySelectorAll("button[data-account]").forEach((button) => {
    button.addEventListener("click", () => {
      const account = demoAccounts.find((item) => item.username === button.dataset.account);
      setAuthMode("login");
      usernameInput.value = account.username;
      passwordInput.value = account.password;
    });
  });
}

function setAuthMode(mode) {
  state.authMode = mode;
  authModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === mode);
  });
  loginForm.classList.toggle("hidden", mode !== "login");
  loginResult.classList.toggle("hidden", mode !== "login");
  registerForm.classList.toggle("hidden", mode !== "register");
  registerResult.classList.toggle("hidden", mode !== "register");
}

function updateRegisterRoleFields() {
  const role = registerRoleInput.value;
  const isEnterprise = role === "enterprise";

  registerEnterpriseFields.classList.toggle("hidden", !isEnterprise);
  registerOrganizationRow.classList.toggle("hidden", isEnterprise);

  if (role === "admin") {
    registerOrganizationLabel.textContent = "所属管理单位";
    registerOrganizationInput.placeholder = "例如：省级平台管理中心";
  } else if (role === "city_reviewer") {
    registerOrganizationLabel.textContent = "所属市级机构";
    registerOrganizationInput.placeholder = "例如：昆明市人社局";
  } else if (role === "province_reviewer") {
    registerOrganizationLabel.textContent = "所属省级机构";
    registerOrganizationInput.placeholder = "例如：云南省人社厅";
  } else {
    registerOrganizationLabel.textContent = "所属单位";
    registerOrganizationInput.placeholder = "请输入所属单位或机构";
  }
}

function updateNavigationByRole() {
  const allowedViews = state.currentUser ? roleViewMap[state.currentUser.role] || ["dashboard"] : ["dashboard"];

  navButtons.forEach((button) => {
    button.classList.toggle("hidden", !allowedViews.includes(button.dataset.view));
  });

  if (!allowedViews.includes(state.currentView)) {
    setActiveView(allowedViews[0]);
  }
}

function updateRoleHome() {
  const key = state.currentUser?.role || "guest";
  const config = roleHomeMap[key] || roleHomeMap.guest;

  roleHomeTitle.textContent = config.title;
  roleHomeCopy.textContent = config.copy;
  roleTaskList.innerHTML = config.tasks.map((task) => `<li>${task}</li>`).join("");
}

function getDefaultViewByRole(role) {
  if (role === "enterprise") {
    return "reports";
  }
  if (["city_reviewer", "province_reviewer"].includes(role)) {
    return "review";
  }
  return "dashboard";
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

function formatTime(value) {
  if (!value) {
    return "未记录";
  }
  const text = String(value).replace("T", " ");
  return text.length > 16 ? text.slice(0, 16) : text;
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
  const options = state.enterprises.map((enterprise) => `<option value="${enterprise.id}">${enterprise.name}</option>`).join("");

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
    tableBody.innerHTML = '<tr><td colspan="8">请先登录后再查看记录。</td></tr>';
    return;
  }

  if (!records.length) {
    tableBody.innerHTML = '<tr><td colspan="8">暂无记录</td></tr>';
    return;
  }

  tableBody.innerHTML = records
    .map((record) => {
      const latestComment = record.province_review_comment || record.city_review_comment || "-";
      const submitButton = ["draft", "city_rejected"].includes(record.workflow_status) && ["enterprise", "admin"].includes(state.currentUser.role)
        ? `<button type="button" data-submit-type="${recordType}" data-submit-id="${record.id}">${record.workflow_status === "draft" ? "提交上报" : "重新提交"}</button>`
        : record.workflow_status === "province_rejected" && ["enterprise", "admin"].includes(state.currentUser.role)
          ? `<button type="button" data-submit-type="${recordType}" data-submit-id="${record.id}">重新提交</button>`
          : '<span class="badge">已提交或只读</span>';

      return `
        <tr>
          <td>${record.id}</td>
          <td>${record.enterprise_name}</td>
          <td>${record.report_period}</td>
          <td>${recordType === "employment" ? record.employed_count : record.unemployed_count}</td>
          <td>${recordType === "employment" ? record.new_hires : record.layoffs}</td>
          <td>${mapStatusLabel(record.workflow_status)}</td>
          <td>${latestComment}</td>
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
        const approveLabel = state.currentUser.role === "province_reviewer" ? "终审通过" : "通过";
        const rejectLabel = state.currentUser.role === "province_reviewer" ? "终审退回" : "退回";
        actionHtml = `
          <div class="table-actions">
            <button type="button" data-review-action="approve" data-review-type="${record.record_type}" data-review-id="${record.id}">${approveLabel}</button>
            <button type="button" class="ghost-button" data-review-action="reject" data-review-type="${record.record_type}" data-review-id="${record.id}">${rejectLabel}</button>
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
      reviewRecord(button.dataset.reviewType, Number(button.dataset.reviewId), button.dataset.reviewAction);
    });
  });
}

function buildCombinedRecords() {
  const employmentRows = state.employmentRecords.map((record) => ({
    ...record,
    record_type: "employment",
    primary_value: record.employed_count,
    secondary_value: record.new_hires,
  }));
  const unemploymentRows = state.unemploymentRecords.map((record) => ({
    ...record,
    record_type: "unemployment",
    primary_value: record.unemployed_count,
    secondary_value: record.layoffs,
  }));
  return [...employmentRows, ...unemploymentRows].sort((left, right) => right.id - left.id);
}

function renderAnalysisSummary() {
  if (!state.currentUser || !state.analysisSummary) {
    analysisTotalRecords.textContent = "-";
    analysisDraftCount.textContent = "-";
    analysisApprovedCount.textContent = "-";
    analysisRejectedCount.textContent = "-";
    analysisHalfMonthCount.textContent = "-";
    analysisMonthlyCount.textContent = "-";
    return;
  }

  analysisTotalRecords.textContent = state.analysisSummary.totalRecordCount;
  analysisDraftCount.textContent = state.analysisSummary.draftCount;
  analysisApprovedCount.textContent = state.analysisSummary.approvedCount;
  analysisRejectedCount.textContent = state.analysisSummary.rejectedCount;
  analysisHalfMonthCount.textContent = state.analysisSummary.halfMonthCount;
  analysisMonthlyCount.textContent = state.analysisSummary.monthlyCount;
}

function renderAnalysisTable() {
  if (!state.currentUser) {
    analysisTableBody.innerHTML = '<tr><td colspan="7">请先登录后再查看查询结果。</td></tr>';
    return;
  }

  if (!state.analysisFilteredRecords.length) {
    analysisTableBody.innerHTML = '<tr><td colspan="7">当前条件下暂无匹配记录。</td></tr>';
    return;
  }

  analysisTableBody.innerHTML = state.analysisFilteredRecords
    .map((record) => {
      const comment = record.province_review_comment || record.city_review_comment || "-";
      return `
        <tr>
          <td>${record.record_type === "employment" ? "就业" : "失业"}</td>
          <td>${record.enterprise_name}</td>
          <td>${record.report_period}</td>
          <td>${record.primary_value}</td>
          <td>${record.secondary_value}</td>
          <td>${mapStatusLabel(record.workflow_status)}</td>
          <td>${comment}</td>
        </tr>
      `;
    })
    .join("");
}

function renderAnalysisTimeline() {
  if (!state.currentUser) {
    analysisTimelineList.innerHTML = `
      <article>
        <strong>请先登录</strong>
        <p class="muted">登录后可查看当前身份相关的审核时间线。</p>
      </article>
    `;
    return;
  }

  if (!state.workflowHistory.length) {
    analysisTimelineList.innerHTML = `
      <article>
        <strong>暂无时间线数据</strong>
        <p class="muted">当前身份尚未产生可展示的时间线记录。</p>
      </article>
    `;
    return;
  }

  analysisTimelineList.innerHTML = state.workflowHistory
    .map((record) => {
      const typeLabel = record.record_type === "employment" ? "就业记录" : "失业记录";
      const comment = record.province_review_comment || record.city_review_comment || "无审核意见";
      return `
        <article>
          <strong>${record.enterprise_name} · ${typeLabel} · ${record.report_period}</strong>
          <p class="muted">状态：${mapStatusLabel(record.workflow_status)} | 创建：${formatTime(record.created_at)} | 提交：${formatTime(record.submitted_at)}</p>
          <p class="muted">市级处理：${formatTime(record.city_reviewed_at)} | 省级处理：${formatTime(record.province_reviewed_at)}</p>
          <p>${comment}</p>
        </article>
      `;
    })
    .join("");
}

function applyAnalysisFilters() {
  const typeValue = analysisRecordTypeFilter.value;
  const statusValue = analysisStatusFilter.value;
  const periodKeyword = analysisPeriodFilter.value.trim();
  const enterpriseKeyword = analysisEnterpriseFilter.value.trim();

  state.analysisFilteredRecords = buildCombinedRecords().filter((record) => {
    const matchesType = typeValue === "all" || record.record_type === typeValue;
    const matchesStatus = statusValue === "all" || record.workflow_status === statusValue;
    const matchesPeriod = !periodKeyword || record.report_period.includes(periodKeyword);
    const matchesEnterprise = !enterpriseKeyword || record.enterprise_name.includes(enterpriseKeyword);
    return matchesType && matchesStatus && matchesPeriod && matchesEnterprise;
  });

  analysisFilterResult.textContent = `当前共匹配 ${state.analysisFilteredRecords.length} 条记录。`;
  renderAnalysisTable();
}

function exportAnalysisRecords() {
  if (!state.analysisFilteredRecords.length) {
    analysisFilterResult.textContent = "当前没有可导出的筛选结果。";
    return;
  }

  const headers = ["记录类型", "企业名称", "报送周期", "主值", "补充值", "状态", "审核意见"];
  const rows = state.analysisFilteredRecords.map((record) => [
    record.record_type === "employment" ? "就业" : "失业",
    record.enterprise_name,
    record.report_period,
    record.primary_value,
    record.secondary_value,
    mapStatusLabel(record.workflow_status),
    record.province_review_comment || record.city_review_comment || "",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((item) => `"${String(item).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const downloadUrl = URL.createObjectURL(blob);
  link.href = downloadUrl;
  link.download = "employment_analysis_export.csv";
  link.click();
  URL.revokeObjectURL(downloadUrl);
  analysisFilterResult.textContent = `已导出 ${state.analysisFilteredRecords.length} 条记录。`;
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

async function loadAnalysisSummary() {
  if (!state.currentUser) {
    state.analysisSummary = null;
    renderAnalysisSummary();
    return;
  }

  try {
    state.analysisSummary = await requestJson(`${API_BASE_URL}/stats/analysis`, {
      headers: getAuthHeaders(),
    });
    renderAnalysisSummary();
  } catch (error) {
    state.analysisSummary = null;
    renderAnalysisSummary();
    analysisFilterResult.textContent = error.message;
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
    employmentTableBody.innerHTML = `<tr><td colspan="8">${error.message}</td></tr>`;
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
    unemploymentTableBody.innerHTML = `<tr><td colspan="8">${error.message}</td></tr>`;
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

async function loadWorkflowHistory() {
  if (!state.currentUser) {
    state.workflowHistory = [];
    renderAnalysisTimeline();
    return;
  }

  try {
    state.workflowHistory = await requestJson(`${API_BASE_URL}/workflow/history`, {
      headers: getAuthHeaders(),
    });
    renderAnalysisTimeline();
  } catch (error) {
    state.workflowHistory = [];
    analysisTimelineList.innerHTML = `
      <article>
        <strong>时间线加载失败</strong>
        <p class="muted">${error.message}</p>
      </article>
    `;
  }
}

async function applySession(user, message, source = "login") {
  state.currentUser = user;
  updateSessionSummary();
  updateNavigationByRole();
  updateRoleHome();
  setActiveView(getDefaultViewByRole(user.role));

  if (source === "register") {
    registerResult.textContent = message;
    loginResult.textContent = `${user.display_name} 已登录到系统。`;
  } else {
    loginResult.textContent = message;
  }

  await Promise.all([
    loadOverview(),
    loadEnterprises(),
    loadEmploymentRecords(),
    loadUnemploymentRecords(),
    loadWorkflowQueue(),
    loadAnalysisSummary(),
    loadWorkflowHistory(),
  ]);
  applyAnalysisFilters();
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
    sessionSummary.textContent = "当前未登录";
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

    await applySession(result.user, `${result.message}，当前角色：${result.user.role}`);
  } catch (error) {
    loginResult.textContent = error.message;
  }
}

async function handleRegister(event) {
  event.preventDefault();
  registerResult.textContent = "正在提交注册信息...";

  const role = registerRoleInput.value;
  const payload = {
    username: registerUsernameInput.value.trim(),
    password: registerPasswordInput.value.trim(),
    display_name: registerDisplayNameInput.value.trim(),
    role,
  };

  if (role === "enterprise") {
    Object.assign(payload, {
      enterprise_name: registerEnterpriseNameInput.value.trim(),
      social_credit_code: registerSocialCreditCodeInput.value.trim(),
      contact_person: registerContactPersonInput.value.trim(),
      contact_phone: registerContactPhoneInput.value.trim(),
      industry_type: registerIndustryTypeInput.value.trim(),
      city_name: registerCityNameInput.value.trim(),
      province_name: registerProvinceNameInput.value.trim(),
      reporting_frequency_rule: registerReportingRuleInput.value,
    });
  } else {
    payload.organization_name = registerOrganizationInput.value.trim();
  }

  try {
    const result = await requestJson(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setAuthMode("login");
    usernameInput.value = payload.username;
    passwordInput.value = payload.password;
    await applySession(result.user, result.message, "register");
  } catch (error) {
    registerResult.textContent = error.message;
  }
}

function handleLogout() {
  state.currentUser = null;
  state.enterprises = [];
  state.employmentRecords = [];
  state.unemploymentRecords = [];
  state.workflowQueue = [];
  state.workflowHistory = [];
  state.analysisSummary = null;
  state.analysisFilteredRecords = [];
  updateSessionSummary();
  updateNavigationByRole();
  updateRoleHome();
  renderEnterpriseTable();
  renderRecordTable(employmentTableBody, state.employmentRecords, "employment");
  renderRecordTable(unemploymentTableBody, state.unemploymentRecords, "unemployment");
  renderWorkflowQueue();
  renderAnalysisSummary();
  renderAnalysisTable();
  renderAnalysisTimeline();
  updateEnterpriseFormByRole();
  setAuthMode("login");
  setActiveView("dashboard");
  loginResult.textContent = "已退出登录。";
  analysisFilterResult.textContent = "登录后可筛选当前身份可见的业务记录。";
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
    await Promise.all([
      loadEmploymentRecords(),
      loadOverview(),
      loadWorkflowQueue(),
      loadAnalysisSummary(),
      loadWorkflowHistory(),
    ]);
    applyAnalysisFilters();
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
    await Promise.all([
      loadUnemploymentRecords(),
      loadOverview(),
      loadWorkflowQueue(),
      loadAnalysisSummary(),
      loadWorkflowHistory(),
    ]);
    applyAnalysisFilters();
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
      loadAnalysisSummary(),
      loadWorkflowHistory(),
    ]);
    applyAnalysisFilters();
  } catch (error) {
    if (recordType === "employment") {
      employmentFormResult.textContent = error.message;
    } else {
      unemploymentFormResult.textContent = error.message;
    }
  }
}

async function reviewRecord(recordType, recordId, action) {
  const isProvince = state.currentUser?.role === "province_reviewer";
  const approvePrompt = isProvince ? "请输入终审通过意见" : "请输入审核通过意见";
  const rejectPrompt = isProvince ? "请输入省级退回原因" : "请输入市级退回原因";
  const approveDefault = isProvince ? "终审通过" : "审核通过";
  const rejectDefault = isProvince ? "请根据省级意见修改后重新提交" : "请补充后重新提交";
  const comment = window.prompt(
    action === "approve" ? approvePrompt : rejectPrompt,
    action === "approve" ? approveDefault : rejectDefault,
  );
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
      loadAnalysisSummary(),
      loadWorkflowHistory(),
    ]);
    applyAnalysisFilters();
  } catch (error) {
    reviewQueueBody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
  }
}

async function bootstrap() {
  renderDemoAccounts();
  setAuthMode("login");
  updateRegisterRoleFields();
  await resolveApiBase();
  await loadHealth();
  updateNavigationByRole();
  updateRoleHome();
  renderEnterpriseTable();
  renderRecordTable(employmentTableBody, state.employmentRecords, "employment");
  renderRecordTable(unemploymentTableBody, state.unemploymentRecords, "unemployment");
  renderWorkflowQueue();
  renderAnalysisSummary();
  renderAnalysisTable();
  renderAnalysisTimeline();
  updateEnterpriseFormByRole();
  updatePeriodControls(employmentReportMonth, employmentHalfRow, employmentPeriodHint, employmentHalfSelector);
  updatePeriodControls(unemploymentReportMonth, unemploymentHalfRow, unemploymentPeriodHint, unemploymentHalfSelector);
}

loginForm.addEventListener("submit", handleLogin);
registerForm.addEventListener("submit", handleRegister);
logoutButton.addEventListener("click", handleLogout);
registerRoleInput.addEventListener("change", updateRegisterRoleFields);
authModeButtons.forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
});
refreshButton.addEventListener("click", async () => {
  await Promise.all([loadOverview(), loadEnterprises()]);
});
refreshRecordsButton.addEventListener("click", async () => {
  await Promise.all([
    loadEmploymentRecords(),
    loadUnemploymentRecords(),
    loadWorkflowQueue(),
    loadOverview(),
    loadAnalysisSummary(),
    loadWorkflowHistory(),
  ]);
  applyAnalysisFilters();
});
refreshReviewButton.addEventListener("click", async () => {
  await Promise.all([loadWorkflowQueue(), loadOverview(), loadWorkflowHistory()]);
  applyAnalysisFilters();
});
refreshAnalysisButton.addEventListener("click", async () => {
  await Promise.all([
    loadAnalysisSummary(),
    loadWorkflowHistory(),
    loadEmploymentRecords(),
    loadUnemploymentRecords(),
  ]);
  applyAnalysisFilters();
});
enterpriseForm.addEventListener("submit", saveEnterprise);
employmentForm.addEventListener("submit", createEmploymentRecord);
unemploymentForm.addEventListener("submit", createUnemploymentRecord);
analysisFilterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyAnalysisFilters();
});
resetAnalysisFilterButton.addEventListener("click", () => {
  analysisRecordTypeFilter.value = "all";
  analysisStatusFilter.value = "all";
  analysisPeriodFilter.value = "";
  analysisEnterpriseFilter.value = "";
  applyAnalysisFilters();
});
exportAnalysisButton.addEventListener("click", exportAnalysisRecords);
resetEnterpriseButton.addEventListener("click", () => updateEnterpriseFormByRole());
employmentReportMonth.addEventListener("change", () => updatePeriodControls(employmentReportMonth, employmentHalfRow, employmentPeriodHint, employmentHalfSelector));
employmentHalfSelector.addEventListener("change", () => updatePeriodControls(employmentReportMonth, employmentHalfRow, employmentPeriodHint, employmentHalfSelector));
unemploymentReportMonth.addEventListener("change", () => updatePeriodControls(unemploymentReportMonth, unemploymentHalfRow, unemploymentPeriodHint, unemploymentHalfSelector));
unemploymentHalfSelector.addEventListener("change", () => updatePeriodControls(unemploymentReportMonth, unemploymentHalfRow, unemploymentPeriodHint, unemploymentHalfSelector));
navButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

bootstrap();
