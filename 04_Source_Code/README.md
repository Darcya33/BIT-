## 云南省企业就业失业数据采集系统

本目录存放课程作业的软件系统源码与运行说明。当前已进入 v0.3 计划下的第二周实现阶段，已完成多角色登录、企业信息管理第一页，以及“半月报 + 审核状态”相关数据模型预留。

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
└─ README.md
```

## 后端已完成内容

1. FastAPI 应用入口与健康检查接口。
2. SQLite 数据库初始化脚本。
3. 多角色认证、企业、就业、失业、统计五类路由。
4. 默认演示账号与演示数据初始化。
5. 报表周期、审核状态、角色权限相关字段预留。

## 前端已完成内容

1. 多角色登录表单与演示账号快捷填充。
2. 登录后的工作台布局与视图切换。
3. 统计概览卡片。
4. 企业信息列表与新增/编辑表单。
5. 审核工作台占位视图，为后续市级、省级审核功能扩展做准备。

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

## 下一阶段计划

1. 完成就业与失业数据录入页。
2. 将半月报和整月报规则纳入录入表单与校验逻辑。
3. 继续实现企业上报、市级审核、省级审核流程。
4. 补充移动端适配与查询统计完善。

