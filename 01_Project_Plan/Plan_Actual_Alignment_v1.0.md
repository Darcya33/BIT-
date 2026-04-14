# 项目计划与实际执行对照说明 v1.0

## 1. 文档目的

本文档用于解释项目计划文件、甘特任务表与 Git 提交记录之间的对应关系，说明哪些内容属于计划基线，哪些内容属于实际执行结果，避免课程提交时出现“计划时间顺序与提交时间顺序不一致”的理解偏差。

## 2. 基本结论

结论如下：

1. [01_Project_Plan/Gantt_Task_Table_v0.3.csv](01_Project_Plan/Gantt_Task_Table_v0.3.csv) 反映的是变更后的计划基线，不是实际自然周开发日历。
2. Git 提交记录反映的是实际执行留痕，多个计划阶段在实际开发中被合并为几次更大的迭代批次完成。
3. 因此，两者在“自然时间长度”上不完全一致，但在“任务先后顺序和依赖关系”上是基本一致的。

## 3. 为什么会出现不一致

本项目在完成初版计划和系统骨架后，收到两项正式变更：

1. CR-001：一季度由月报调整为半月报。
2. CR-002：增加企业上报、市级审核、省级审核、手机端支持，并延长项目周期。

在此基础上，[01_Project_Plan/Project_Plan_v0.3.md](01_Project_Plan/Project_Plan_v0.3.md) 和 [01_Project_Plan/Gantt_Task_Table_v0.3.csv](01_Project_Plan/Gantt_Task_Table_v0.3.csv) 将项目表达为“10 周阶段化推进”版本，目的是让计划更完整、更符合课程项目管理要求。

但在实际执行中，为了尽快形成可演示闭环，多个周任务被压缩合并为连续迭代批次，因此 Git 提交集中发生在少数几个工作日内。这属于“计划阶段表达”和“实际压缩执行”之间的正常差异。

## 4. 文档撰写原则

课程文档建议按以下口径表述：

1. 甘特图与 v0.3 计划用于说明“原定阶段安排”和“任务依赖顺序”。
2. Git 提交历史用于说明“实际执行留痕”和“各阶段成果落地顺序”。
3. 若计划阶段在实际执行中被合并实现，应写为“提前合并迭代完成”，而不是写成计划错误。

## 5. 计划任务与实际提交对照

| 计划任务 | 甘特编号 | 计划阶段 | 实际提交或成果 | 对照结论 |
| --- | --- | --- | --- | --- |
| 项目启动与范围冻结 | T01 | 第 1 周 | d92dccd docs: add project plan v0.1 | 一致 |
| WBS 与详细计划 | T02 | 第 1 周 | 0d233a0 docs: add project plan v0.2 and gantt table | 一致 |
| 技术方案与前后端骨架 | T03 | 第 1 周 | 7e6ca34 feat: add day 3 project skeleton | 一致 |
| 登录与多角色权限 | T04 | 第 2 周 | 527d129 feat: add week 2 auth and enterprise management | 一致 |
| 企业信息管理 | T05 | 第 2 周 | 527d129 feat: add week 2 auth and enterprise management | 一致 |
| 报表周期模型改造 | T06 | 第 3 周 | ca49eca feat: add reporting workflow and city review | 与填报开发合并完成 |
| 就业数据录入 | T07 | 第 3 周 | ca49eca feat: add reporting workflow and city review | 一致 |
| 失业数据录入 | T08 | 第 3 周 | ca49eca feat: add reporting workflow and city review | 一致 |
| 查询筛选 | T09 | 第 4 周 | 当前已有基础列表与状态展示 | 部分完成 |
| 统计与导出 | T10 | 第 4 周 | 当前已有统计概览，导出未完全收口 | 部分完成 |
| 企业上报流程 | T11 | 第 5 周 | ca49eca feat: add reporting workflow and city review | 与第 3 周开发合并推进 |
| 市级审核流程 | T12 | 第 6 周 | ca49eca feat: add reporting workflow and city review | 提前合并完成 |
| 省级审核流程 | T13 | 第 7 周 | 9bab90e feat: complete province review workflow | 一致 |
| 企业端手机适配 | T14 | 第 8 周 | 9bab90e feat: complete province review workflow | 基础完成 |
| 审核端手机适配 | T15 | 第 8 周 | 9bab90e feat: complete province review workflow | 基础完成 |
| 全链路联调与回归测试 | T16 | 第 9 周 | 接口联调和流程验证已执行 | 技术完成，测试文档待加强 |
| 变更验证与关闭说明 | T17 | 第 9 周 | a25bf1d docs: add change closure summary | 一致 |
| 材料归档与答辩准备 | T18 | 第 10 周 | ebdde2c docs: add cm history and demo materials；6f536ad docs: add final project plan | 正在收口 |

## 6. 实际执行批次说明

为了便于答辩或书面说明，可将实际执行总结为以下批次：

### 批次 A：计划与骨架阶段

- 对应提交：d92dccd、0d233a0、7e6ca34。
- 对应计划：T01、T02、T03。

### 批次 B：多角色与企业管理阶段

- 对应提交：527d129。
- 对应计划：T04、T05。

### 批次 C：填报、上报、市级审核合并阶段

- 对应提交：ca49eca。
- 对应计划：T06、T07、T08、T11、T12 的课程版实现。

### 批次 D：省级审核与移动端基础适配阶段

- 对应提交：9bab90e。
- 对应计划：T13、T14、T15。

### 批次 E：配置管理与最终文档收口阶段

- 对应提交：ebdde2c、6f536ad、a25bf1d。
- 对应计划：T17、T18，并补充最终项目计划总稿。

## 7. 你在文档里应该怎么写

建议直接使用以下口径：

“项目在 v0.3 计划中按照 10 周阶段化方式进行规划，以体现变更后的完整任务分解和依赖关系；在实际执行中，为保证课程演示版快速形成业务闭环，部分周任务采用了合并迭代方式提前完成。因此，Git 提交时间较为集中，但任务实施顺序与甘特图主线依赖关系保持一致。最终项目通过计划基线、提交记录、变更单和配置管理文档共同证明计划与执行的一致性。”

## 8. 建议采用的最终口径

最终提交时，不建议删除或重写 v0.3 甘特图，而应保留它作为计划基线，并引用本文档说明“计划与实际执行存在压缩合并，但顺序可对照、成果可追溯”。这样写最稳，也最符合项目管理材料的表达方式。