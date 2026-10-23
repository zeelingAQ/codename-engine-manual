# CODENAME ENGINE // 拆解手册

![静态](https://img.shields.io/badge/%E7%BA%AF%E9%9D%99%E6%80%81-HTML%2FCSS%2FJS-38d9f2?style=flat-square)
![无广告](https://img.shields.io/badge/%E5%B9%BF%E5%91%8A-0-57ef5f?style=flat-square)
![无后端](https://img.shields.io/badge/%E5%90%8E%E7%AB%AF-0-c24b99?style=flat-square)
![版本](https://img.shields.io/badge/Codename%20Engine-%231392%20%2F%20v1.1.0-ffd447?style=flat-square)

**Codename Engine（Friday Night Funkin' 引擎）的中文使用与外部脚本开发文档。**

不是官方 Wiki 的翻译，而是一份「拿到引擎之后，从能玩到能改」的实战手册：
界面与设置逐项讲透、目录与 XML 逐行解剖、外部脚本（HScript / 着色器 / NDLL / 3D / 事件）
全部给出可直接复制的完整示例，最后附一份按源码整理的 API 速查与配置排错。

![预览](assets/img/thumbnail.png)

> **在线预览**：`https://<你的用户名>.github.io/codename-engine-manual/`
> **仓库地址**：`https://github.com/<你的用户名>/codename-engine-manual`
> 部署后把这两处的 `<你的用户名>` 换成你的 GitHub 用户名即可。

### 它解决什么问题

官方 Wiki 停更在几年前，网上教程大多是旧版本。这份文档按 **#1392 的源码实读**重写，
并且明确标注「哪些行为会随版本变」——不保证永远正确，但保证**每条结论都能对上源码**。

### 亮点

- **三档阅读**：简单（够上手）／普通（讲原理）／详细（百科全书），随切随看，位置不丢。
- **138 段可复制代码**：全部放在 `<pre><code>` 里转义展示，右上角一键复制。
- **XML 逐行解剖器**：点任意一行，下面告诉你这一行在干什么。
- **按源码抽的全表**：PlayState 字段、回调、事件对象、195 个 Flags、编辑器 109 条菜单快捷键……
- **纯静态**：无框架、无 CDN、无统计、无评论区；整个目录丢进 GitHub Pages 就能跑。
- **附带 TXT 版**：同一份内容生成的纯文本，方便离线/手机看。

### 三分钟上手

| 我想… | 看这里 |
|---|---|
| 先随便逛逛 | 直接打开 `index.html`，或你的 Pages 地址 |
| 搞清楚文件该放哪 | 第 15–17 节（目录 / 模组文件 / XML） |
| 让角色/舞台动起来 | 第 14 节（编辑器）、第 23 节（调源码功能） |
| 写着色器 | 第 19 节 |
| 做 3D | 第 21 节 |
| 加自定义事件 / 打包 | 第 24 节 |
| 查 API / 查报错 | 第 27–38 节（参考手册）、第 46 节（报错速查） |
| 只想看纯文本 | [`CodenameEngine-使用与开发说明.txt`](CodenameEngine-使用与开发说明.txt) |

### 版本

- 对应引擎：**Windows Builds #1392**（v1.1.0 / Mod API v3）
- 整理时间：**2026-10-23**
- 制作：**一人制作**

> ⚠ **本网页（或本版本）不保证对后续更新完全有效。**
> 引擎迭代很快，遇到冲突请以官方 Wiki 与你手上版本的实际表现为准：
> <https://codename-engine.com/wiki/>

---

## 一、这个仓库里有什么

```
.
├─ index.html                        ← 网页入口（直接用浏览器打开也能看）
├─ assets/
│  ├─ css/style.css                  ← 全部样式
│  ├─ js/app.js                      ← 渲染与交互（原生 JS，无依赖）
│  ├─ js/content-1.js                ← 第一部分内容
│  ├─ js/content-2.js                ← 第二部分内容
│  ├─ js/content-3.js                ← 第三部分内容
│  ├─ js/content-4.js                ← 第四部分内容
│  ├─ js/content-5.js                ← 第五部分内容（API / 脚本 / 数据 / 过场 / 存档）
│  ├─ js/content-6.js                ← 第六部分内容（配置与排错）
│  ├─ img/                           ← 截图与图标（来自引擎仓库 art/ 与 assets/images/）
│  └─ video/                         ← 演示视频位（可选，见下文）
├─ tools/build-txt.js                ← TXT 生成脚本（改完内容跑一下即可同步）
├─ tools/selfcheck.js                ← 交付前自检（结构 / 引用 / 资源 / TXT 同步）
├─ tools/serve.js                    ← 本地预览用静态服务器（node tools/serve.js）
└─ CodenameEngine-使用与开发说明.txt   ← 纯文本版（由上面的脚本生成）
```

内容与网页是**同源**的：TXT 由 `tools/build-txt.js` 读取同一份 `content-*.js` 生成，
改一处两边都变，不会出现「网页更新了、TXT 还是老的」这种事故。

---

## 二、部署到 GitHub Pages（免费、公开可查）

### 方式 A：网页界面操作（推荐，不用命令行）

1. 在 GitHub 上新建仓库 **`codename-engine-manual`**，可见性选 **Public**（名字别改，改了 Pages 地址也会变）。
2. 把本目录**所有文件**上传到仓库根目录（拖拽上传即可，注意 `index.html` 必须在根目录）。
3. 打开仓库 → **Settings** → 左侧 **Pages**。
4. **Source** 选 `Deploy from a branch`，**Branch** 选 `main`、目录选 `/ (root)`，点 **Save**。
5. 等 1～2 分钟，页面顶部会出现网址：`https://<你的用户名>.github.io/codename-engine-manual/`。
6. 打开它，把网址发给别人，任何人都能看（Public 仓库 + Pages 默认公开）。

### 方式 B：命令行

```bash
git init
git add .
git commit -m "docs: Codename Engine 中文拆解手册（Build #1392）"
git branch -M main
git remote add origin https://github.com/<你的用户名>/codename-engine-manual.git
git push -u origin main
```

然后在仓库的 **Settings → Pages** 里按上面第 4 步设置即可。

### 注意事项

- **不要**把文件放进子文件夹再指望根路径能跑；`index.html` 必须在仓库根。
- 仓库必须是 **Public**，否则 Pages 需要付费方案才能公开访问。
- 首次部署有缓存，改了文件没生效时按 `Ctrl+F5` 强制刷新。
- 本页**不需要任何构建步骤**，也没有 `node_modules`；`tools/` 只是本地小工具，不上传也不影响网页。

---

## 三、本地预览

直接双击 `index.html` 就能看（复制按钮对 `file://` 也做了兼容）。

如果想更接近线上环境：

```bash
# 任选其一
npx serve .
python -m http.server 8080
```

然后访问 <http://localhost:8080/>。

---

## 四、怎么改内容

所有正文都在 `assets/js/content-*.js` 里，每节的数据结构长这样：

```js
{
  id: 'shaders',            // 锚点 ID，也是搜索用的 key
  num: '19',                // 章节号
  title: '着色器专项',
  en: 'SHADERS / .FRAG',
  tags: ['GLSL', '.frag'],
  simple: [ ... ],          // 「简单」模式的内容
  core:   [ ... ],          // 「普通」模式的内容
  deep:   [ ... ]           // 「详细」模式 = core + deep
}
```

区块类型（`core` / `simple` / `deep` 数组里的对象）：

| 写法 | 效果 |
| --- | --- |
| `{ p: '文字' }` | 段落（支持 `**粗体**`、`` `代码` ``、`[文字](链接)`） |
| `{ h: '标题' }` / `{ h4: '小标题' }` | 三级 / 四级标题 |
| `{ ul: ['a', 'b'] }` / `{ ol: [...] }` | 无序 / 有序列表 |
| `{ kv: [['键', '值']] }` | 定义表 |
| `{ table: { head: [...], rows: [[...]] } }` | 表格 |
| `{ code: { lang: 'haxe', title: '文件名', src: '...' } }` | 代码块（自动高亮 + 一键复制） |
| `{ callout: { kind: 'tip', title: '', text: '' } }` | 提示块（`info` / `tip` / `warn` / `dev`） |
| `{ xml: { title: '', lines: [{ c: '代码', n: '注解' }] } }` | XML 逐行解剖器 |
| `{ img: { src, cap } }` / `{ gallery: [...] }` | 单图 / 图库（点击放大） |
| `{ video: { src, cap } }` | 视频位（文件存在才显示播放器） |

改完正文后，重新生成 TXT：

```bash
node tools/build-txt.js
```

---

## 五、演示视频（可选）

页面里的视频位默认是占位卡片。把录好的视频放到：

```
assets/video/demo.mp4
```

刷新页面就会自动变成播放器；没有这个文件时不会报错、也不会显示破图。

<!-- 内部备注（不渲染）：拍摄视频前网页已公开，视频位先留空，页面在录制前就已经可以上线。 -->

---

## 六、设计说明

- **三种阅读模式**：简单 / 普通 / 详细，同一份内容三种裁剪，切换时滚动位置锚定当前章节。
- **谱面式目录**：左侧导航按五部分分组，音符箭头随分组旋转，滚动时高亮当前节。
- **血条式进度**：顶部细条 + 右侧圆环，同时显示「读完几节 / 总字数」。
- **XML 逐行解剖**：点任意一行，下方给出这一行的作用（第三部分专讲 XML，别处不再重复）。
- **代码一键复制**：复制成功会弹一个「PERFECT」判定动画；所有代码都先转义再着色，不会被浏览器当成标签解析。
- **命令面板**：`Ctrl+K` 或 `/` 搜索章节，`↑↓` 选择，`Enter` 跳转。
- **无评论区**：刻意不做。文档只负责讲清楚。
- **零依赖**：没有框架、没有 CDN、没有统计脚本，断网也能看。

快捷键：`1` `2` `3` 切换模式，`J` / `K` 上下章，`G` 然后 `T` 回顶部，`?` 看全部。

---

## 七、素材与版权

- 引擎截图与图标来自 Codename Engine 仓库（`art/`、`assets/images/`），版权归 **Codename Crew** 所有，仅作说明用途。
- Codename Engine 以 **Apache License 2.0** 发布，另有官方使用规约，做 mod / 子引擎前请阅读仓库 README 的 *Usage Info*。
- 本文档正文为「一人制作」整理，基于源码与资源目录实读，非官方文档。

---

## 八、免责声明

本文档整理于 **2026-10-23**，对应 **Windows Builds #1392**。
引擎仍在快速迭代，接口、目录、行为都可能变化。
**本网页（或本版本）不保证对后续更新完全有效** —— 遇到冲突，请以官方 Wiki 与你手上版本的实际表现为准。
