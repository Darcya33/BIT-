## 云南省企业就业失业数据采集系统

本目录存放课程作业的软件系统源码与运行说明。当前版本已在原有课程版闭环基础上，新增统一登录/注册入口、按角色进入不同主页的认证逻辑，以及更偏政务风格的界面骨架。

## 技术选型

- 后端：FastAPI + SQLite
- 前端：原生 HTML + CSS + JavaScript
- 配置管理：Git + GitHub

## 当前目录结构

```text
04_Source_Code/
├─ backend/
│  ├─ app/
│  │  ├─ api/routes/
│  │  ├─ core/
│  │  ├─ db/
│  │  └─ models/
│  └─ requirements.txt
├─ frontend/
│  ├─ assets/
│  ├─ app.js
│  ├─ index.html
│  └─ styles.css
├─ Demo_Script_v1.0.md
└─ README.md
```

## 后端已完成内容

1. FastAPI 应用入口与健康检查接口。
2. SQLite 数据库初始化脚本。
3. 多角色认证、注册、企业、就业、失业、统计五类路由。
4. 默认演示账号与演示数据初始化。
5. 报表周期、审核状态、角色权限相关字段预留。
6. 企业上报与市级/省级审核工作流接口。
7. 退回后重新提交的状态流转支持。

## 前端已完成内容

1. 统一登录/注册入口与演示账号快捷填充。
2. 登录后按角色加载主页和可见导航。
3. 统计概览卡片。
4. 企业信息列表与新增/编辑表单。
5. 就业与失业数据录入表单。
6. 草稿提交、审核队列、市级审核、省级审核与退回意见展示。
7. 响应式布局与移动端基础兼容。

## 本地运行方式

### 1. 启动后端

在仓库根目录执行：

```powershell
Set-Location 04_Source_Code/backend
e:/桌面/云南省企业就业失业数据采集系统/.venv/Scripts/python.exe -m uvicorn app.main:app --reload
```

后端启动后访问：

- 根地址：http://127.0.0.1:8000/
- 健康检查：http://127.0.0.1:8000/health
- 接口文档：http://127.0.0.1:8000/docs

### 2. 打开前端

直接在浏览器中打开 [frontend/index.html](frontend/index.html) 即可查看页面骨架。若需避免浏览器跨域或本地文件限制，可使用 VS Code Live Server 或任意静态文件服务打开 frontend 目录。

## 演示账号

- 用户名：admin
- 密码：admin123
- 用户名：enterprise_demo
- 密码：enterprise123
- 用户名：city_reviewer
- 密码：city123456
- 用户名：province_reviewer
- 密码：province123

## 当前新增能力说明

1. 登录与注册共用统一认证入口。
2. 注册时根据身份动态展示不同信息字段。
3. 注册成功后直接进入对应身份主页。
4. 管理员、企业、市级审核、省级审核使用不同的主页说明和导航权限。
5. 前端视觉已调整为更克制的政务风格第一版。

## 配套交付材料

1. 演示脚本：Demo_Script_v1.0.md
2. 项目计划与甘特表：见 01_Project_Plan 目录。
3. 变更单：见 03_Change_Requests 目录。
4. 配置管理历史说明：见 02_CM_History 目录。

## 下一阶段计划

1. 补充查询统计页、审核时间线与页面细节。
2. 将移动端适配整理成单独说明与截图证据。
3. 补充实际截图证据并完成课程提交包整理。
4. 继续推进最终演示版打磨。

