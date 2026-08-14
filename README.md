# 篮球生涯模拟器 · 从青训到传奇

参照 [football-life.pages.dev](https://football-life.pages.dev/) 的「足球生涯模拟器」制作的篮球版本。纯前端、单机、本地存档，无需服务器。

## 玩法

- 选一个国籍和位置，从 16 岁青训打到退役
- 转会、伤病、绝杀、关键罚球、抢七、国家队生死战，每个决定都算数
- 一生之敌：同位置、同年出道的宿敌陪你斗一辈子，总得分、冠军、MVP 逐年对位
- 每个赛季沉淀生涯高光：场均 30+、场均三双、50 分之夜、冠军+FMVP
- 40+ 个决策事件：训练、交易截止日、全明星、扣篮/三分大赛、更衣室、媒体
- 三种节奏：速通（每 3 季一次决策）/ 标准（每 2 季）/ 沉浸（每季）
- 生涯结束自动生成可保存、可分享的「生涯战绩卡」
- 历史档案：每一局自动留档，随时翻回任意一局的战绩卡
- 称号图鉴：30 个称号，拿到过的显示你当时那句话
- 编号系统：复制本局编号发给朋友，输入编号即可复现同一段生涯

## 运行

任意静态服务器即可（模块脚本需要 http 环境，直接双击打开 index.html 不行）：

```bash
# 方式一：Node
npx serve .

# 方式二：Python
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 部署（Cloudflare Pages）

把本目录直接拖进 Cloudflare Pages（构建命令留空，输出目录选根目录或留空），部署后即可得到和参考站一样的 `xxx.pages.dev` 地址。

## 部署（GitHub Pages，自动）

仓库已内置 `.github/workflows/deploy.yml`：每次推送到 `main` 分支，GitHub Actions 会自动把本站部署到 GitHub Pages，地址为：

`https://lastdance2077.github.io/basketballCareerSimulator/`

## 文件结构

```text
index.html       入口
style.css        样式（深色主题）
favicon.svg      图标
js/data.js       数据层：国家、球队联赛、位置、事件、称号
js/engine.js     引擎：生涯模拟、赛季结算、大赛、决策、退役、称号判定
js/ui.js         UI：首页/建档/生涯/结算/档案/图鉴/分享图
test/            引擎无头测试与浏览器冒烟测试
```

## 测试

```bash
node test/sim.js     # 生涯流程与确定性测试
node test/fuzz.js    # 40 局随机生涯模糊测试
node test/smoke.mjs  # 浏览器全流程冒烟测试（需本机 Chrome/Edge）
```
