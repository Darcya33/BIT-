const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

const healthStatus = document.querySelector("#health-status");
const enterpriseCount = document.querySelector("#enterprise-count");
const employedTotal = document.querySelector("#employed-total");
const unemployedTotal = document.querySelector("#unemployed-total");
const newHiresTotal = document.querySelector("#new-hires-total");
const enterpriseTableBody = document.querySelector("#enterprise-table-body");
const loginButton = document.querySelector("#login-button");
const loginResult = document.querySelector("#login-result");
const refreshButton = document.querySelector("#refresh-button");


async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  return response.json();
}


async function loadHealth() {
  try {
    const result = await requestJson("http://127.0.0.1:8000/health");
    healthStatus.textContent = `后端状态正常 | 版本 ${result.version}`;
  } catch (error) {
    healthStatus.textContent = "未连接到后端，请先启动 API 服务";
  }
}


async function loadOverview() {
  try {
    const result = await requestJson(`${API_BASE_URL}/stats/overview`);
    enterpriseCount.textContent = result.enterpriseCount;
    employedTotal.textContent = result.employedTotal;
    unemployedTotal.textContent = result.unemployedTotal;
    newHiresTotal.textContent = result.newHiresTotal;
  } catch (error) {
    enterpriseCount.textContent = "-";
    employedTotal.textContent = "-";
    unemployedTotal.textContent = "-";
    newHiresTotal.textContent = "-";
  }
}


async function loadEnterprises() {
  try {
    const rows = await requestJson(`${API_BASE_URL}/enterprises`);
    if (!rows.length) {
      enterpriseTableBody.innerHTML = '<tr><td colspan="5">暂无企业数据</td></tr>';
      return;
    }

    enterpriseTableBody.innerHTML = rows
      .map(
        (row) => `
          <tr>
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.social_credit_code}</td>
            <td>${row.contact_person}</td>
            <td>${row.contact_phone}</td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    enterpriseTableBody.innerHTML = '<tr><td colspan="5">企业数据加载失败，请检查后端服务</td></tr>';
  }
}


async function loginDemo() {
  loginResult.textContent = "正在调用登录接口...";
  try {
    const result = await requestJson(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "admin123",
      }),
    });
    loginResult.textContent = `${result.message}，当前角色：${result.role}`;
  } catch (error) {
    loginResult.textContent = "登录接口调用失败，请检查后端是否已启动";
  }
}


async function bootstrap() {
  await Promise.all([loadHealth(), loadOverview(), loadEnterprises()]);
}


loginButton.addEventListener("click", loginDemo);
refreshButton.addEventListener("click", bootstrap);

bootstrap();
