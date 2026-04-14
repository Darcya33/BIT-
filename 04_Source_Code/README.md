## 云南省企业就业失业数据采集系统

本目录存放课程作业的软件系统源码与运行说明。当前已进入 v0.3 计划下的第二周实现阶段，已完成多角色登录、企业信息管理第一页、就业失业录入、企业上报、市级审核，以及省级审核闭环的第一版实现。

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
6. 企业上报与市级/省级审核工作流接口。
7. 退回后重新提交的状态流转支持。

## 前端已完成内容

1. 多角色登录表单与演示账号快捷填充。
2. 登录后的工作台布局与视图切换。
3. 统计概览卡片。
4. 企业信息列表与新增/编辑表单。
5. 就业与失业数据录入表单。
6. 草稿提交、审核队列、市级审核、省级审核与退回意见展示。

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

1. 补充审核记录时间线和更细的状态展示。
2. 补充移动端适配与查询统计完善。
3. 整理 CM 历史截图、README 和变更关闭说明。
4. 继续推进最终演示版打磨。

