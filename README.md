# 安德生物工作室 · 离线镜像

把 [lilinbio.com](https://www.lilinbio.com) 的**生物学教学模型库**完整搬到本地，做成断网也能用的版本。

- **29 个交互教学模型**全部落地（含 Three.js 3D 模型与全部素材）
- **938 道题库快照**（含 300 道高考真题），带考点归属、答案解析与配图
- **零依赖后端**：只用 Python 标准库，一条命令起站
- **本地账号**：邮箱 + 密码，密码用 PBKDF2-HMAC-SHA256 哈希存储

---

## 一、在线看（不用装任何东西）

仓库启用了 GitHub Pages，模型库可以直接在浏览器里点开：

**👉 https://azlove2021.github.io/ander-studio-models/**

29 个模型都能直接打开、交互、播放动画，支持三套外观主题。

> 题库部分需要本地服务（要跑 `server.py` 提供接口），Pages 上只有模型库。
> 需要完整功能请看下面第二节。

## 二、本地跑（完整功能）

需要 [Python 3.8+](https://www.python.org/downloads/)，不需要装任何第三方库。

```bash
git clone https://github.com/azlove2021/ander-studio-offline.git
cd ander-studio-offline
python server.py          # 默认 8080 端口
```

浏览器打开 <http://127.0.0.1:8080/>。Windows 下也可以直接双击 **`启动.bat`**。

| 页面 | 地址 | 说明 |
|---|---|---|
| 教学模型库 | `/models.html` | 29 个模型总览，带搜索与模块筛选 |
| 题库 | `/question-bank.html` | 938 道快照，可按考点/题型/难度/年份筛选 |
| 首页 | `/` | 站点原始首页 |
| 登录 | `/account/login` | 邮箱 + 密码 |

**登录方式**：任意邮箱 + 任意 ≥6 位密码。首次使用的邮箱会自动创建本地账号。

---

## 导出一个模型单独用

每个模型都是自包含应用，可以单独拷给同事或学生。

```bash
python _tools/export_model.py photosynthesis   # 导出单个
python _tools/export_model.py --all            # 导出全部 29 个
```

导出后目录里会生成 `打开模型.bat`，对方双击即可运行。

> ⚠️ **不能直接双击 index.html**。模型使用 ES module，浏览器的安全策略禁止 `file://` 加载模块脚本，必须经 HTTP 打开。`打开模型.bat` 就是干这个的（需要 Python）。

---

## 目录结构

```
server.py                离线服务（仅标准库，零依赖）
启动.bat                  Windows 双击启动
models.html              教学模型库总览（数据内联，双击可用）
question-bank.html       题库页
_local/qbank.js          题库页驱动（复用线上 library-view.js 渲染）

model-releases/
  catalog.json           29 个模型的元数据
  models/                各模型完整包（421 文件 / 16MB）

_data/
  questions.json         938 道题（含考点归属 nodes 字段）
  answers.json           答案与解析
  accounts.json          本地账号库（已 gitignore，不会入库）

api/questions/items/     题目配图
assets/                  站点 CSS / JS / 图片 / 字体

_tools/
  fetch_models.py        抓取 / 增量补齐模型包
  fetch_missing.py       按缺失清单补齐模型素材
  fetch_questions.py     抓取题目、答案与配图
  fetch_node_map.py      遍历考点目录，建立题目归属
  export_model.py        导出可独立运行的模型包
  build_models_index.py  重新生成 models.html
  verify_live_gap.py     完整性验证：线上 vs 本地资源比对
  verify_deep_gap.py     完整性验证：交互后资源比对
  crawl.py               抓取站点静态资源
```

---

## 完整性是怎么验证的

不用「扫 404」这种有盲区的方式（只能发现请求失败的资源，发现不了本地从未请求过的）。这里是**反向取证**：

用真实浏览器打开线上模型，监听 `page.on("request")` 采集线上实际加载的全部资源路径，再与本地逐文件比对。

| 验证项 | 线上 | 本地 | 结论 |
|---|---|---|---|
| 初始加载资源 | 564 个 | 命中 564 | **0 缺失** |
| 交互后新增 | 点完全部 stage tab 与控件 | 564（无变化） | **无按需加载遗漏** |
| 运行时错误 | 29 个逐页检查 | — | **29/29 无报错** |
| 渲染一致性 | 本地 vs 线上同尺寸截图像素差 | — | 差异 **0.000%** ~ 0.756% |

差异热力图显示，`photosynthesis` 那 0.756% 全部落在**文字标签的抗锯齿**上，图形、色块、箭头零差异。

复现：

```bash
python _tools/verify_live_gap.py
python _tools/verify_deep_gap.py
```

### 抓取时的两个坑（留给以后维护的人）

模型的素材有两类引用是**静态解析抓不到的**：

1. `assets/${id}.png` —— 在 JS 里动态拼接，爬虫解析 HTML/CSS 看不到；
2. `import "vendor/three.module.min.js"` —— ES module import，同样看不到。

后果是 8 个 3D 模型缺 Three.js 直接白屏。解法见 `_tools/fetch_missing.py`：
用真实浏览器逐个打开模型，收集所有 404 请求路径再批量补齐。模型更新后若出现新素材，重跑这个流程即可。

另外接口有两条硬约束（实测得出）：

- 列表接口 `POST /api/questions/browse` 的 **pageSize 上限 20**，超出返回 400；
- 答案接口 `/api/questions/answers` **单次最多 20 条**；
- 请求必须同时带 `Cookie`、`x-ander-csrf`、`Origin`、`Referer`，缺一即 403。

---

## 加载速度

服务端对文本资源做了 gzip，并给静态资源加了 1 天强缓存：

| 资源 | 原始 | 传输 |
|---|---|---|
| `vendor/three.module.min.js` | 671 KB | **167 KB** |
| `assets/teaching-traces.json` | 1.35 MB | 944 KB |

第一次打开 3D 模型约 1–3 秒，**第二次走缓存基本秒开**。

---

## 说明与许可

- 本仓库是**个人学习与教学用途**的离线镜像，站内内容（模型、题库、图文）的知识产权归原作者所有。
- 请勿用于商业分发或二次售卖。
- 公开仓库意味着任何人都能 clone 下来。若只想给特定的人看，请把仓库改为 Private（GitHub 仓库页 → Settings → Danger Zone → Change visibility）。
- 抓取脚本仅用于备份自己有权访问的内容，请遵守目标站点的使用条款。

## 相关仓库

- [`ander-studio-models`](https://github.com/azlove2021/ander-studio-models) —— 纯静态模型库，GitHub Pages 直接托管，无需安装任何东西。
