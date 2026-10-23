/* ============================================================
   第三部分：目录与文件结构解析
   ============================================================ */
(function () {
  if (!window.CNE) return;

  window.CNE.addPart({
    id: 'p3',
    name: '第三部分 · 摸清它',
    short: 'PART 03',
    color: 'var(--green)',
    sections: [

      /* ------------------------------------------------ 15 */
      {
        id: 'folders',
        num: '15',
        title: '目录总览：每个文件夹放什么',
        en: 'FOLDER BY FOLDER',
        tags: ['目录结构', 'assets', 'mods', 'source'],
        simple: [
          { p: "先记住三层：**`source/` 是引擎源码（别动）**，**`assets/` 是官方资源（可以改，但更新会覆盖）**，**`mods/` 是你自己的东西（放这里最安全）**。" },
          { p: "除此之外 `songs/` 在 `assets/` 里，一首歌一个文件夹；`data/` 里全是配置；`images/` 里全是图。就这三句话，能解决八成「文件放哪」的问题。" }
        ],
        core: [
          { h: '根目录' },
          {
            table: {
              head: ['名字', '是什么', '你要不要管'],
              rows: [
                ['`source/`', '引擎的 Haxe 源码，编译成可执行文件', '不改（本文只讲外部脚本）'],
                ['`assets/`', '官方资源 + 全部软编码配置', '**经常要改/加文件**'],
                ['`mods/`', '模组目录，每个子文件夹是一套覆盖资源', '**你的主战场**'],
                ['`addons/`', '插件目录，叠加在所有 mod 之上的小补丁', '做公共组件时用'],
                ['`art/`', '宣传图、FLA 源文件、设计稿', '基本不管'],
                ['`building/`', '编译与安装脚本（`cne-windows.bat` 等）', '想自己编译才看'],
                ['`commandline/`', '命令行工具源码（编译/优化/安装）', '基本不管'],
                ['`.github/`', 'GitHub Actions 工作流（自动构建）', '不管'],
                ['.vscode/', '编辑器配置', '不管'],
                ['`project.xml`', '编译配置（库、窗口、资源、宏）', '自己编译才改'],
                ['`CHANGELOG.md`', '更新日志', '想看历史就翻'],
                ['`FEATURES.md`', '特性清单', '**值得读一遍**'],
                ['`PATCHNOTES.md`', '版本补丁说明', '值得读'],
                ['`README.md`', '项目说明 / 使用规约', '值得读'],
                ['`LICENSE`', 'Apache 2.0 许可证', '了解即可'],
                ['`hxformat.json`', `代码格式化规则`, '交 PR 才用'],
                ['`shell.nix`', 'Nix 开发环境', '不管']
              ]
            }
          },

          { h: '`assets/` 里每个文件夹' },
          {
            table: {
              head: ['文件夹', '放什么'],
              rows: [
                ['`data/`', '**所有软编码配置**：人物、舞台、周、字体、音符类型、脚本、状态脚本、对话、编辑器布局'],
                ['`images/`', '所有图片：人物、图标、背景、菜单、音符、对话、编辑器 UI'],
                ['`songs/`', '每首歌一个文件夹：谱面、音频、脚本、事件'],
                ['`sounds/`', '音效：菜单音、对话音、编辑器音、过场音'],
                ['`music/`', '菜单音乐、游戏结束音乐、暂停音乐'],
                ['`shaders/`', 'GLSL 着色器（`.frag`），`engine/` 下是引擎自用的'],
                ['`fonts/`', '字体文件（`.ttf` / `.otf`）'],
                ['`languages/`', '语言包（`en` `es` `it` `pl` `pt`），含翻译 XML 与本地化图片'],
                ['`videos/`', '视频过场（`.mp4` 等）']
              ]
            }
          },

          { h4: '完整目录树（按本仓库实际统计，括号内是文件数）' },
          { p: "上面是「人话版」，下面是**照着仓库跑出来的全量**。找不到某个文件该放哪时，直接在这张树上对照。" },
          { code: { lang: 'ini', title: 'assets/ 全量目录树', src: 'assets/\n├─ data/                      (103)\n│  ├─ alphabet/                  (2)\n│  ├─ characters/                (29)\n│  ├─ config/                    (3)\n│  ├─ dialogue/                  (12)\n│  ├─ editors/                   (7)\n│  ├─ notes/                     (2)\n│  ├─ scripts/                   (3)\n│  ├─ splashes/                  (4)\n│  ├─ stages/                    (16)\n│  ├─ states/                    (1)\n│  ├─ titlescreen/               (2)\n│  └─ weeks/                     (19)\n├─ fonts/                     (4)\n├─ images/                    (427)\n│  ├─ characters/                (59)\n│  ├─ credits/                   (1)\n│  ├─ dialogue/                  (16)\n│  ├─ editors/                   (110)\n│  ├─ game/                      (42)\n│  ├─ icons/                     (19)\n│  ├─ menus/                     (73)\n│  └─ stages/                    (103)\n├─ languages/                 (71)\n│  ├─ en/                        (5)\n│  ├─ es/                        (19)\n│  ├─ it/                        (15)\n│  ├─ pl/                        (26)\n│  └─ pt/                        (5)\n├─ music/                     (18)\n│  └─ pixel/                     (8)\n├─ shaders/                   (16)\n│  └─ engine/                    (10)\n├─ songs/                     (206)\n│  └─ （23 首歌，每首一个文件夹：charts/ meta.json song/ scripts/）\n├─ sounds/                    (184)\n│  ├─ cutscenes/                 (14)\n│  ├─ dialogue/                  (14)\n│  ├─ editors/                   (34)\n│  ├─ jeffGameover/              (50)\n│  ├─ menu/                      (8)\n│  └─ pixel/                     (22)\n└─ videos/                    (1)' } },

          { h4: '上面表里没细说的几处' },
          {
            kv: [
              ['`data/config/` 只有 3 个文件', '`discord.json`、`freeplaySonglist.txt`、`menuItems.txt`。**`flags.ini` 和 `modpack.ini` 默认不存在** —— 需要改配置时自己新建（见第 42 节）'],
              ['`data/events/` 默认不存在', '加自定义事件时才建，放 `events.json`（见第 24 节）'],
              ['`data/config/options.xml`', 'mod 自定义设置项，**不是目录**，是 mod 里的一个文件（见第 39 节）'],
              ['`data/config/controls.xml`', 'mod 自定义按键分类（见第 40 节）'],
              ['`data/dialogue/boxes/*.hx`', '对话框脚本 —— 对话框也能挂脚本，和 `boxes/*.xml` 同名'],
              ['`languages/<代码>/assets/`', '**本地化图片**：主菜单按钮是图不是字，所以翻译要连带换图（`es` `it` `pl` 有，`en` `pt` 没有）'],
              ['`sounds/cutscenes/`', '过场音效；`sounds/dialogue/` 是打字/翻页音'],
              ['`sounds/jeffGameover/`', '游戏结束（Jeff）相关音效，共 50 个'],
              ['`sounds/pixel/` 与 `music/pixel/`', '像素模式（Week 6）专用的音效与音乐'],
              ['`shaders/engine/`', '引擎自用着色器（血条、灰化、过渡等），别乱改'],
              ['`images/editors/` 有 110 个文件', '四套编辑器共用的 UI 素材，是全仓库第二大的图片目录']
            ]
          },

          { h: '`assets/data/` 详解（最核心的一层）' },
          {
            table: {
              head: ['子目录/文件', '作用'],
              rows: [
                ['`characters/`', '人物 XML（`bf.xml`、`dad.xml`…），同名 `.hx` 是人物脚本'],
                ['`stages/`', '舞台 XML + 舞台脚本（`philly.xml` / `philly.hx`）'],
                ['`weeks/`', '`weeks/`（周定义 XML）、`characters/`（周展示角色）、`weeks.txt`（排序）'],
                ['`notes/`', '音符类型脚本（`Alt Anim Note.hx` 这种）'],
                ['`scripts/`', '通用脚本（`pixel.hx`、`week6-pause.hx`…），也可被歌曲引用'],
                ['`states/`', '软编码状态脚本：给任意 State 挂脚本（基础游戏里只有 `StageEditor.hx`）'],
                ['`events/`', '自定义事件的 JSON 定义（**默认不存在**，加事件时才建）'],
                ['`splashes/`', '音符溅射（打击特效）配置 XML'],
                ['`titlescreen/`', '标题界面配置 XML + 随机吐槽文本'],
                ['`dialogue/`', '对话框 `boxes/`（XML + 可选 `.hx`）与立绘 `characters/`'],
                ['`alphabet/`', '字体拼字配置（`normal.xml`、`bold.xml`）'],
                ['`config/`', '**运行时配置**：`menuItems.txt`、`freeplaySonglist.txt`、`discord.json`；`flags.ini` / `modpack.ini` 默认不存在'],
                ['`editors/`', '编辑器界面布局（`layouts/stage/*.xml`）'],
                ['`alphabet.xml`', '根目录的这份是默认字体配置'],
                ['`discord.hx`', 'Discord 状态脚本（改显示内容就改它）'],
                ['`specialThanks.txt`', '制作名单里的特别感谢']
              ]
            }
          },

          { h: '`assets/images/` 详解' },
          {
            table: {
              head: ['子目录', '作用'],
              rows: [
                ['`characters/`', '人物贴图（按人物名建子文件夹，如 `characters/bf/`）'],
                ['`icons/`', '血条图标，`icons/<名字>/icon.png`'],
                ['`stages/`', '舞台背景，`stages/<舞台名>/`'],
                ['`menus/`', '菜单：`mainmenu/`、`options/`、`storymenu/`、`titlescreen/`、`pauseAlt/`、`update/`'],
                ['`game/`', '游戏内素材：`notes/`（音符）、`splashes/`、`score/`、`cutscenes/`'],
                ['`dialogue/`', '对话框与立绘'],
                ['`editors/`', '编辑器 UI 素材（`ui/`、`icons/`、`charter/`、`warnings/`）'],
                ['`credits/`', '制作名单用图']
              ]
            }
          },

          { h: '`source/` 里有什么（只为了让你看得懂报错）' },
          {
            table: {
              head: ['路径', '内容'],
              rows: [
                ['`funkin/backend/`', '底层：资源、谱面解析、脚本引擎、着色器、系统、工具'],
                ['`funkin/game/`', '游戏本体：`PlayState`、`Character`、`Stage`、`Note`、`Strums`'],
                ['`funkin/menus/`', '菜单：标题、主菜单、自由、故事、暂停、Mod 切换、制作名单'],
                ['`funkin/editors/`', '四个编辑器 + 全套 UI 组件'],
                ['`funkin/options/`', '设置系统（选项类型、分类、改键）'],
                ['`funkin/savedata/`', '存档'],
                ['`hscript/`', 'HScript 解释器的补丁/配置'],
                ['`haxe/`', 'Haxe 标准库的部分实现（`format`、`xml`）'],
                ['`lime/`', 'Lime 的补丁'],
                ['`external/`', '原生扩展链接（Mac）']
              ]
            }
          },

          { h: '`mods/` 的规矩' },
          { p: "`mods/` 下**每个子文件夹就是一个 mod**，文件夹内部结构直接对应 `assets/`（没有 `assets/` 这一层）：" },
          { code: { lang: 'ini', title: '一个最小 mod 的目录树', src: 'mods/\n└─ my-mod/\n   ├─ data/\n   │  ├─ config/\n   │  │  └─ modpack.ini      ← 元数据（名字/描述/API 版本）\n   │  ├─ characters/\n   │  │  └─ mychar.xml\n   │  └─ stages/\n   │     └─ mystage.xml\n   ├─ images/\n   │  └─ characters/\n   │     └─ mychar/\n   │        ├─ mychar.png\n   │        └─ mychar.xml    ← 图集\n   └─ songs/\n      └─ mysong/\n         ├─ meta.json\n         ├─ charts/hard.json\n         └─ song/Inst.ogg' } },
          {
            ul: [
              "**zip 也行**：把 `my-mod` 文件夹直接压成 `my-mod.zip` 丢进 `mods/`，但**压缩包里必须是 `data/` `songs/` 直接位于根**，不能再套一层文件夹。",
              "**addons/** 同理，但它是「叠加在所有 mod 之上的补丁」，用 `[LOW]` / `[HIGH]` 前缀控制加载优先级。",
              "**`cnemod.zip`**：`mods/<名字>/cnemod.zip` 这种形式也支持。"
            ]
          },
          { callout: { kind: 'tip', title: '最省心的做法', text: "永远把东西放 `mods/<你的mod>/`，不要改 `assets/`。这样引擎更新时你的内容不会被覆盖，也能一键切换回原版对比。" } }
        ],
        deep: [
          { h: '目录 → 代码：谁在读这些文件夹' },
          {
            table: {
              head: ['文件夹', '读取它的代码', '通过什么函数'],
              rows: [
                ['`data/characters/`', '`Character.hx`', '`Paths.character(name)`'],
                ['`data/stages/`', '`Stage.hx`', '`Paths.xml(\"stages/\" + name)`'],
                ['`data/weeks/`', '`WeekData.hx` / `StoryWeeklist`', '`Paths.xml(\"weeks/weeks/\" + name)`'],
                ['`data/events/`', '`EventsData.reloadEvents()`', '`Paths.getFolderContent(\"data/events/\")`'],
                ['`data/notes/`', '`PlayState`', '按音符类型名找 `.hx`'],
                ['`data/states/`', '`MusicBeatState` / `MusicBeatSubstate`', '按 State 类名找 `.hx`'],
                ['`songs/<歌>/charts/`', '`Chart.hx`', '`Paths.chart(song, diff, variant)`'],
                ['`songs/<歌>/song/`', '`PlayState`', '`Paths.inst()` / `Paths.voices()`'],
                ['`songs/<歌>/scripts/`', '`PlayState`', '扫描目录'],
                ['`shaders/`', '`FunkinShader`', '`Paths.fragShader(name)`'],
                ['`images/`', '`Paths.image()`', '自动找 `.png/.jpg`'],
                ['`sounds/` + `music/`', '`Paths.sound()` / `Paths.music()`', '自动试多种扩展名'],
                ['`videos/`', '`Paths.video()`', '自动试 `.mp4/.webm/.mkv/.mov`']
              ]
            }
          },
          { p: "理解这张表的价值在于：**你知道改哪个文件会影响哪里**。比如想让某个角色换个贴图，改 `images/characters/<名字>/` 就够，不用碰 XML。" },

          { h: '一首歌的完整结构' },
          { code: { lang: 'ini', title: 'songs/<歌名>/ 的标准结构', src: 'songs/\n└─ bopeebo/\n   ├─ meta.json              ← 歌的元数据（BPM、难度、图标、颜色）\n   ├─ events.json            ← 这首歌的事件轨道（可选）\n   ├─ charts/\n   │  ├─ easy.json\n   │  ├─ normal.json\n   │  └─ hard.json           ← 文件名就是难度名\n   ├─ song/\n   │  ├─ Inst.ogg            ← 伴奏\n   │  ├─ Voices.ogg          ← 人声（可选）\n   │  ├─ Inst-erect.ogg      ← 变体专用伴奏\n   │  └─ Voices-erect.ogg\n   ├─ scripts/\n   │  ├─ zoom.hx             ← 只对这首歌生效的脚本\n   │  └─ hard/               ← 只对 hard 难度生效\n   │     └─ extra.hx\n   └─ cutscene.hx            ← 过场脚本（可选）' } },
          { p: "要点：**难度 = 文件名**。加一个 `expert.json` 就等于加了一个难度（还要在 `meta.json` 的 `difficulties` 里登记，或者在编辑器里建）。**变体 = 子目录**：`charts/erect/hard.json` 表示 `erect` 变体的 hard 难度。" },

          { h: '两个容易搞混的目录' },
          {
            kv: [
              ['`data/scripts/`', '跨歌曲复用的通用脚本。舞台脚本、暂停脚本、像素脚本都在这'],
              ['`songs/<歌>/scripts/`', '**只**对这首歌生效。做歌专属演出放这里'],
              ['`data/charts/`', '旧版遗留路径，现在会打弃用警告，别再用'],
              ['`data/states/`', '不是「歌的状态」，是「界面的脚本」，比如 `PlayState.hx` 的补丁']
            ]
          }
        ]
      },

      /* ------------------------------------------------ 16 */
      {
        id: 'mod-files',
        num: '16',
        title: '基础模组文件：格式与配置',
        en: 'MOD FILE FORMATS',
        tags: ['人物', '舞台', '歌', '图标', '音符', '配置'],
        simple: [
          { p: "做 mod 其实就是「按它的格式放文件」。这一节把最常用的几类文件的**命名规则 + 配置格式**列清楚，不含任何图片/音频文件本身。" },
          { p: "记住一个通用规律：**一个东西 = 一个 XML（配置）+ 一个同名文件夹（图片）**。人物是这样，舞台是这样，图标也是这样。" }
        ],
        core: [
          { h: '① 人物（Character）' },
          {
            kv: [
              ['配置文件', '`data/characters/<名字>.xml`'],
              ['可选脚本', '`data/characters/<名字>.hx`（同名就自动加载）'],
              ['贴图', '`images/characters/<名字>.png` + 同名 `.xml` 图集'],
              ['多图集', '`images/characters/<名字>/1.png`、`2.png`… 自动合并'],
              ['Animate 图集', '`images/characters/<名字>/Animation.json` + `spritemap1.png`'],
              ['引用方式', '`meta.json` 或舞台 XML 里写人物名（不带路径、不带扩展名）']
            ]
          },
          { p: "人物 XML 的核心是 `<anim>` 节点：每个动画要给出**名字**、**图集里的前缀**、**偏移**、**帧率**、**是否循环**。详见下一节「XML 完全解剖」。" },

          { h: '② 舞台（Stage）' },
          {
            kv: [
              ['配置文件', '`data/stages/<名字>.xml`'],
              ['可选脚本', '`data/stages/<名字>.hx`'],
              ['贴图', '`images/stages/<名字>/` 下随意命名，XML 里按文件名引用'],
              ['引用方式', '`meta.json` 的 `stage` 字段，或歌曲谱面数据里的 stage']
            ]
          },

          { h: '③ 周（Week）' },
          {
            kv: [
              ['周定义', '`data/weeks/weeks/<名字>.xml`'],
              ['排序', '`data/weeks/weeks.txt`（一行一个周文件名）'],
              ['周角色', '`data/weeks/characters/<名字>.xml`'],
              ['周图标', '`images/menus/storymenu/weeks/<sprite>.png`'],
              ['难度图', '`images/menus/storymenu/difficulties/<难度>.png`']
            ]
          },

          { h: '④ 歌（Song）' },
          { p: "一首歌的主体是 `meta.json`（元数据）+ `charts/<难度>.json`（谱面）+ `song/Inst.ogg`（音频）。完整结构见上一节的目录树。" },
          { p: "`meta.json` 的常用字段：" },
          {
            table: {
              head: ['字段', '类型', '作用'],
              rows: [
                ['`displayName`', '字符串', '自由游玩里显示的歌名'],
                ['`icon`', '字符串', '血条图标名（`icons/<名字>/`）'],
                ['`color`', '颜色字符串', '自由游玩背景色，如 `#9271FD`'],
                ['`bpm`', '数字', 'BPM'],
                ['`stepsPerBeat`', '整数', '每拍几步（通常 4）'],
                ['`beatsPerMeasure`', '整数', '每小节几拍（通常 4）'],
                ['`difficulties`', '字符串数组', '可用难度，如 `[\"easy\",\"normal\",\"hard\"]`'],
                ['`needsVoices`', '布尔', '是否需要人声轨'],
                ['`opponentModeAllowed`', '布尔', '是否允许对手模式'],
                ['`coopAllowed`', '布尔', '是否允许双人模式'],
                ['`stage`', '字符串', '可选，指定舞台'],
                ['`customValues`', '对象', '可选，自定义键值，脚本用 `SONG.meta.customValues.x` 读']
              ]
            }
          },

          { h: '⑤ 血条图标（Health Icon）' },
          {
            kv: [
              ['静态图标', '`images/icons/<名字>/icon.png`（单张图）'],
              ['动画图标', '同目录 + 同名 `.xml` 图集，动画名用 `losing` / `neutral`'],
              ['尺寸建议', '150×150，图标会随血量在「输/赢」两帧之间切换'],
              ['引用', '人物 XML 的 `icon` 属性，或 `meta.json` 的 `icon`']
            ]
          },
          { callout: { kind: 'info', title: '阈值', text: "动画图标默认在血量 0% 时播 `losing`、20% 以上播 `neutral`（`HealthIcon` 里的 `[[0,\"losing\"],[20,\"neutral\"]]`）。" } },

          { h: '⑥ 音符类型（Note Type）' },
          { p: "不是图片，而是脚本：`data/notes/<类型名>.hx`。谱面里把音符的 type 设成这个名字，脚本就会在该音符命中/未命中时被调用。" },
          { code: { lang: 'haxe', title: 'data/notes/Alt Anim Note.hx（官方自带示例）', src: "function onNoteHit(event)\n\tif (event.noteType == \"Alt Anim Note\")\n\t\tevent.animSuffix = \"-alt\";" } },

          { h: '⑦ 音符溅射（Splash）' },
          { p: "`data/splashes/<名字>.xml`，按四条轨道（id 0=左, 1=下, 2=上, 3=右）配置命中时播的动画。默认用 `default.xml`。" },

          { h: '⑧ 提示文字 / 标题界面' },
          {
            kv: [
              ['标题界面', '`data/titlescreen/titlescreen.xml`'],
              ['随机吐槽', '`data/titlescreen/introText.txt`（一行一句，`--` 分隔两段）'],
              ['字体拼字', '`data/alphabet/*.xml`'],
              ['编辑器布局', '`data/editors/layouts/stage/*.xml`（做编辑器 UI 才用）']
            ]
          },

          { h: '⑨ 对话（Cutscene / Dialogue）' },
          {
            kv: [
              ['对话框样式', '`data/dialogue/boxes/<名字>.xml`（可选同名 `.hx` 加逻辑）'],
              ['对话立绘', '`data/dialogue/characters/<名字>.xml`（可选 `.hx`）'],
              ['对话内容', '写在歌曲的对话文件里（XML/JSON，见官方 Wiki 的 Cutscenes 页）']
            ]
          },

          { h: '⑩ 配置类文本文件' },
          {
            table: {
              head: ['文件', '作用', '格式'],
              rows: [
                ['`data/config/menuItems.txt`', '主菜单项', '一行一项'],
                ['`data/config/freeplaySonglist.txt`', '自由游玩歌单', '一行一首，空行=间隔'],
                ['`data/weeks/weeks.txt`', '周的排序', '一行一个文件名'],
                ['`data/config/discord.json`', 'Discord RPC 的 clientID 与图标 key', 'JSON'],
                ['`data/config/flags.ini`', '引擎级开关（**默认不存在，需要时自己建**）', 'INI'],
                ['`data/config/modpack.ini`', 'mod 元数据 + Flags + 状态重定向', 'INI'],
                ['`assets/languages/<代码>/`', '语言包', '`config.ini` + 4 个 XML']
              ]
            }
          },
          { p: "`modpack.ini` 的最小可用版本长这样：" },
          { code: { lang: 'ini', title: 'mods/my-mod/data/config/modpack.ini', src: '[Common]\nNAME="My Mod"\nDESCRIPTION="A test mod"\nAUTHOR="you"\nVERSION="1.0"\nAPI_VERSION=3\n\n[Flags]\n# 关掉警告页与语言选择\nDISABLE_WARNING_SCREEN=true\nDISABLE_LANGUAGES=true' } },
          { h4: '变体（Variation）：同一首歌的第二套谱面' },
          { p: "「变体」= 同一首歌的另一套谱面/音频，比如 `erect` 版、`pico` 版。它不是新歌，是**同一首歌的分支**。" },
          { code: { lang: 'ini', title: '目录结构（一个歌 + 一个变体）', src: 'songs/mysong/\n├─ meta.json                 ← 主版本（基础难度列表）\n├─ charts/\n│  ├─ normal.json            ← 主版本 normal\n│  └─ erect/                 ← 变体目录，目录名 = 变体名\n│     └─ normal.json         ← 变体的 normal\n└─ song/\n   ├─ Inst.ogg               ← 主版本伴奏\n   ├─ Voices.ogg\n   ├─ Inst-erect.ogg         ← 变体伴奏（后缀 = 变体名）\n   └─ Voices-erect.ogg' } },
          {
            ol: [
              "**建目录**：`charts/<变体名>/`，把变体的谱面放进去（文件名仍是难度名）。",
              "**放音频**：`song/Inst-<变体名>.ogg`、`song/Voices-<变体名>.ogg`（没有就回退到主版本音频）。",
              "**写 meta**：变体自己的 `meta.json` 放在 `charts/<变体名>/meta.json`，只需要写和主版本**不同**的字段。",
              "**登记**：主 `meta.json` 的 `variants` 数组里加上变体名（引擎也会自动扫描目录）。",
              "**验证**：进自由游玩，难度行会显示成 `HARD (ERECT)` 这种形式。"
            ]
          },
          { code: { lang: 'json', title: 'charts/erect/meta.json（只写差异）', src: '{\n\t"name": "mysong",\n\t"variant": "erect",\n\t"displayName": "My Song (Erect)",\n\t"bpm": 180,\n\t"difficulties": ["normal", "hard"]\n}' } },
          {
            kv: [
              ['变体名从哪来', '`charts/` 下的目录名 / `meta.variant` 字段'],
              ['音频后缀', '`Inst-<变体>` / `Voices-<变体>`（由 `instSuffix` / `vocalsSuffix` 控制，默认就是变体名）'],
              ['难度独立', '每个变体可以有自己的难度列表'],
              ['继承', '变体的 meta 只覆盖你写了的字段，其余沿用主版本'],
              ['在代码里取', '`PlayState.variation`（静态，可能是 null）']
            ]
          },
          { code: { lang: 'haxe', title: '脚本里判断当前是不是变体', src: 'function postCreate() {\n\tif (PlayState.variation == "erect") {\n\t\t// 变体专属演出\n\t\ttrace("这是 erect 版");\n\t}\n}' } },
          { callout: { kind: 'warn', title: '两个必踩的坑', text: "① **音频不换也要放对名字**：只写 `Inst.ogg` 而变体谱面用的是 180 BPM，音画会全错位。② **难度名要和主版本区分**：两个版本都有 `normal` 时，自由游玩里会显示成 `NORMAL` 和 `NORMAL (ERECT)`，别搞混。" } }
        ],
        deep: [
          { h: '`meta.json` 里值得注意的几个' },
          {
            ul: [
              "`difficulties` 不写会怎样？引擎会扫描 `charts/` 目录自动推断，但顺序可能不如你意，**建议显式写**。",
              "`customValues` 是 1.1.0 之后加的：谱面和人物都能挂自定义属性，脚本用 `SONG.meta.customValues.foo` 或 `character.extras.foo` 读。",
              "`color` 必须是 `#RRGGBB` 字符串，写成数字会解析失败导致背景变成默认色。",
              "变体的 `meta.json` 只需要写和父级**不同**的字段，其余继承。"
            ]
          },
          { h: '谱面 JSON 的结构（了解即可）' },
          { p: "Codename 的谱面是 JSON，核心是 `notes`（音符数组）+ `events`（事件数组）+ `song`（歌曲元信息）。每个音符大致包含：时间（毫秒）、方向（0~3 或更多）、长度（长按）、类型。" },
          { p: "**不建议手写谱面**，用编辑器。手写只在「批量改某个数值」时才有意义（比如把所有音符整体前移 10ms）。" },

          { h: '命名必须对上的地方（踩坑率最高）' },
          {
            table: {
              head: ['东西', '必须一致的两个名字'],
              rows: [
                ['人物', 'XML 文件名 = 引用它的名字（不带 `.xml`）'],
                ['人物贴图', '`images/characters/<名字>.png` 与 `.xml` 图集同名'],
                ['舞台', '`data/stages/<名字>.xml` 与 `meta.json` 的 `stage`'],
                ['歌', '`songs/` 下的文件夹名 = `meta.json` 所在目录名 = 周 XML 里 `<song>` 的内容'],
                ['难度', '`charts/<难度>.json` 的文件名 = `meta.json` 里 `difficulties` 的项'],
                ['变体', '`charts/<变体>/` 目录名 = `song/Inst-<变体>.ogg` 的后缀'],
                ['图标', '`icons/<icon>/icon.png` 的目录名 = 人物 XML 的 `icon` 属性'],
                ['着色器', '`shaders/<名字>.frag` 的文件名 = `new FunkinShader(\"<名字>\")`']
              ]
            }
          },
          { h: '资源优先级' },
          { p: "同一个路径存在多份时，优先级大致是：**mod（当前选中的）> addon > 语言包 > 官方 assets**。同名即覆盖，没有「合并」的概念 —— 一个 XML 被覆盖就是整份被替换，不会逐节点合并。" },
          { p: "所以想「在原版基础上加一点」，正确做法是把原版文件**复制过来再改**，而不是只写你要加的那一行。" },
          { h: 'Animate 图集（`.json` + `spritemap`）' },
          { p: "除了 Sparrow（一张 PNG + 一个 XML），人物还支持 **Animate Atlas**（Flash/Animate 导出）。区别是帧不是按坐标切，而是按**帧标签**取。" },
          { code: { lang: 'ini', title: 'Animate 图集的目录长什么样', src: 'images/characters/bf-animate/\n├─ Animation.json        ← 帧数据（符号 / 图层 / 帧标签 / 时长）\n├─ spritemap1.png        ← 图集\n├─ spritemap1.json       ← 图集坐标（引擎会用）\n└─ TextureAtlas/\n   └─ spritemap1/\n      └─ ...              ← 部分导出工具会带这个目录' } },
          {
            kv: [
              ['根节点怎么写', '`<character sprite="characters/bf-animate" swfMode="true">`'],
              ['`<anim>` 怎么写', '`<anim name="idle" anim="BF Idle" label="true" isAnimate="true" />`'],
              ['`anim` 填什么', '**帧标签名**（不是前缀）'],
              ['`label="true"`', '按标签匹配；不写就按前缀匹配，Animate 图集里通常匹配不到'],
              ['`isAnimate="true"`', '按 Animate 图集解析这一条动画'],
              ['`swfMode`', '兼容旧版 Animate 导出的坐标模式']
            ]
          },
          { callout: { kind: 'warn', title: 'Animate 人物的两个默认差异', text: "① 引擎对 Animate 人物**默认关闭 `centercam`**（因为它的包围盒不可靠）。② `filterQuality` 建议 `high`，否则缩小时糊。" } },
          { p: "导出建议：Animate 里把每一段动画做成**独立的时间轴/符号**，帧标签名起成人能读的（`BF Idle`、`BF Sing LEFT`），这样 XML 里直接写标签名就行。" },

          { h: '音符溅射（Splash）也能脚本化' },
          { p: "`data/splashes/*.xml` 只定义「长什么样」，真正「什么时候播、播在哪」是 `SplashHandler` 管的。它会在播放前后发事件，你可以拦。" },
          {
            table: {
              head: ['API', '用途'],
              rows: [
                ['`SplashHandler.showSplash(name, strum)`', '在某个箭头上播一个溅射'],
                ['`getSplashGroup(name)`', '取（或加载）一组溅射配置，`name` 对应 `data/splashes/<name>.xml`'],
                ['`SplashShowEvent`', '播溅射前后触发，可读 `name` / `splash` / `strum` / `group`'],
                ['`Splash.strum` / `Splash.strumID`', '这个溅射挂在哪条箭头 / 哪一轨'],
                ['`Splash.copyFrom(source)`', '复制一份现成配置']
              ]
            }
          },
          { code: { lang: 'haxe', title: '用事件拦下溅射，改成自己的动画', src: 'import funkin.backend.scripting.events.splash.SplashShowEvent;\n\nfunction onSplashShow(e:SplashShowEvent) {\n\t// 只处理玩家这一侧的\n\tif (e.strum != null && e.strum.__strumLine != null) {\n\t\t// 比如：把溅射放大一点\n\t\te.splash.scale.set(1.2, 1.2);\n\t\te.splash.updateHitbox();\n\t}\n}\n\n// 也可以主动播一个\nfunction playCustom(strum) {\n\tif (PlayState.instance != null)\n\t\tPlayState.instance.splashHandler.showSplash("default", strum);\n}' } }
        ]
      },

      /* ------------------------------------------------ 17 */
      {
        id: 'xml-anatomy',
        num: '17',
        title: 'XML 完全解剖：逐行讲透',
        en: 'XML ANATOMY',
        tags: ['XML', '舞台', '人物', '周', '属性表'],
        simple: [
          { p: "Codename 里几乎所有「配置」都是 XML。它的规律很朴素：**一个根节点 + 一堆子节点 + 属性写在尖括号里**。" },
          { p: "这一节的完整版（**普通 / 详细**档）里有「点一行、讲一行」的解剖器。这里先给你一个最小的舞台 XML，感受一下结构：" },
          { code: { lang: 'xml', title: '最小的舞台 XML', src: '<stage zoom="0.9">\n\t<!-- 背景图 -->\n\t<sprite name="bg" sprite="bg" x="0" y="0" />\n\n\t<!-- 三个角色站位 -->\n\t<girlfriend x="300" y="120" />\n\t<dad x="620" y="140" />\n\t<boyfriend x="900" y="150" />\n</stage>' } },
          { p: "看出来了吗？**每个尖括号就是一个东西**，`name` / `x` / `y` 是它的属性。整份 XML 就是「摆什么东西、放在哪」。下面按类型拆。" }
        ],
        core: [
          { h: '通用规则' },
          {
            ol: [
              "第一行通常是 `<!DOCTYPE ...>`，这只是个标记，引擎不严格校验，但建议保留。",
              "根节点一个（`<stage>` / `<character>` / `<week>` / `<splashes>` / `<titlestate>` / `<alphabetFont>`）。",
              "属性用双引号，值都是字符串，引擎自己转数字/布尔/颜色。",
              "布尔值只认 `\"true\"` / `\"false\"`（小写）。",
              "颜色用 `#RRGGBB` 或 `#AARRGGBB`。",
              "节点顺序**有意义**：同层级越靠后的越画在上面。"
            ]
          },

          { h: '① 舞台 XML' },
          { p: "最小的舞台长这样（就是官方的 `stages/stage.xml`）：" },
          { xml: {
            title: 'data/stages/stage.xml',
            lines: [
              { c: '<!DOCTYPE codename-engine-stage>', n: '文档类型声明。标识「这是一个 Codename 舞台文件」，引擎据此识别；删掉一般也能读，但建议留着。' },
              { c: '<stage zoom="0.9" name="stage" folder="stages/default/" startCamPosY="600" startCamPosX="1000">', n: '根节点。`zoom` 是默认镜头缩放（越小看得越远）；`name` 是舞台显示名；`folder` 是下面所有 sprite 的贴图公共前缀（省得每个都写全路径）；`startCamPosX/Y` 是开局镜头位置。' },
              { c: '\t<sprite name="bg"               x="-600" y="-200"   sprite="stageback"       scroll="0.9" />', n: '一个静态精灵。`name` 是它在脚本里的变量名（脚本里直接写 `bg` 就能拿到）；`x/y` 是坐标；`sprite` 是贴图名（前面会自动拼上 `folder`）；`scroll` 是滚动因子，0.9 表示比镜头慢一点，产生视差。' },
              { c: '\t<sprite name="stageFront"       x="-600" y="600"    sprite="stagefront"      scroll="0.9" />', n: '前景层。它和 bg 用同样的 scroll，但因为**写在后面**，所以绘制在 bg 之上。' },
              { c: '\t<girlfriend />', n: 'GF 的位置锚点。节点**所在的位置决定图层顺序** —— 这里在 bg 之后、dad 之前，所以 GF 会画在背景上方、其他角色下方。' },
              { c: '\t<dad />', n: '对手（Dad）的锚点。不写 x/y 时用默认位置（x=100, y=100, scroll=1, 朝向右侧）。' },
              { c: '\t<boyfriend />', n: '玩家（BF）锚点。默认 x=770, y=100，并且默认水平翻转。' },
              { c: '\t<sprite name="stageCurtains"    x="-500" y="-300"   sprite="stagecurtains"   scroll="1.3" />', n: '幕布。scroll=1.3 表示比镜头**更快**，看起来更靠近观众，形成前景遮挡效果。' },
              { c: '</stage>', n: '根节点结束。' }
            ]
          } },

          { h: '舞台根节点能写的属性' },
          {
            table: {
              head: ['属性', '作用'],
              rows: [
                ['`name`', '舞台名（显示/调试用）'],
                ['`zoom`', '默认镜头缩放'],
                ['`startCamPosX` / `startCamPosY`', '开局镜头位置'],
                ['`folder`', '所有 sprite 的贴图公共前缀，自动补结尾 `/`'],
                ['（其他任意属性）', '会被存进 `stage.extra`，脚本可以读，等于自定义参数']
              ]
            }
          },

          { h: '舞台里能出现的节点' },
          {
            table: {
              head: ['节点', '作用', '必需属性'],
              rows: [
                ['`<sprite>` / `<spr>` / `<sparrow>`', '静态或动画精灵', '`name` `sprite`'],
                ['`<solid>` / `<box>`', '纯色块', '`name` `width` `height`'],
                ['`<boyfriend>` / `<bf>` / `<player>`', 'BF 锚点', '无'],
                ['`<girlfriend>` / `<gf>`', 'GF 锚点', '无'],
                ['`<dad>` / `<opponent>`', 'Dad 锚点', '无'],
                ['`<character name=\"x\">` / `<char>`', '自定义角色锚点', '`name`'],
                ['`<ratings x y>` / `<combo>`', '判定文字位置', '无'],
                ['`<high-memory>`', '包一层：只在**非**低内存模式加载', '无'],
                ['`<low-memory>`', '包一层：只在低内存模式加载', '无'],
                ['`<use-extension script=\"x\">` / `<ext>`', '给这个舞台挂一个外部脚本', '`script`'],
                ['`<property name type value>`', '给元素设任意属性（见下）', '三个都要']
              ]
            }
          },

          { h: '元素属性全表（`<sprite>` 最常用）' },
          {
            table: {
              head: ['属性', '类型', '作用'],
              rows: [
                ['`name`', '字符串', '脚本里的变量名'],
                ['`sprite`', '字符串', '贴图名'],
                ['`x` / `y`', '数字', '坐标'],
                ['`scroll` / `scrollx` / `scrolly`', '数字', '滚动因子（视差）'],
                ['`scale` / `scalex` / `scaley`', '数字', '缩放'],
                ['`graphicSize` / `graphicSizex/y`', '整数', '按像素设定尺寸'],
                ['`width` / `height`', '数字', '强制宽高'],
                ['`angle`', '数字', '旋转角度'],
                ['`skewx` / `skewy`', '数字', '斜切'],
                ['`alpha`', '0~1', '透明度'],
                ['`color`', '颜色', '整体染色'],
                ['`blend`', '字符串', '混合模式（`add` / `multiply` / `screen`… ）'],
                ['`antialiasing`', '布尔', '抗锯齿（像素风关掉更清晰）'],
                ['`flipX` / `flipY`', '布尔', '翻转'],
                ['`zoomfactor`', '数字', '跟随镜头缩放的程度'],
                ['`anglefactor`', '数字', '跟随镜头旋转的程度'],
                ['`type`', '`none`/`beat`/`loop`', '动画类型：不播/跟拍/循环'],
                ['`beatInterval`', '整数', '每隔几拍播一次（默认 1）'],
                ['`beatOffset`', '整数', '节拍偏移'],
                ['`playOnCountdown`', '布尔', '倒计时期间就开播'],
                ['`updateHitbox`', '布尔', '按当前帧重算碰撞框']
              ]
            }
          },
          { p: "`<sprite>` 里还能套 `<anim>`，给多帧图集定义动画：" },
          { code: { lang: 'xml', title: '给舞台元素加一段跟拍动画', src: '<sprite name="speakers" sprite="speakers" x="100" y="200" type="beat" beatInterval="2">\n\t<anim name="idle" anim="speakers idle" fps="24" loop="true" />\n\t<anim name="bump" anim="speakers bump" fps="24" loop="false" x="0" y="-8" />\n</sprite>' } },

          { h: '② 人物 XML' },
          { xml: {
            title: 'data/characters/bf.xml（官方原文件）',
            lines: [
              { c: '<!DOCTYPE codename-engine-character>', n: '声明这是人物配置。' },
              { c: '<character y="350" sprite="bf" flipX="true" isPlayer="true" icon="bf" color="#31B0D1">', n: '根节点。`y` 是全局纵向偏移（人物整体上移/下移）；`sprite` 是贴图名（默认等于人物名）；`flipX` 水平翻转（BF 默认朝右，所以要翻）；`isPlayer` 决定朝向逻辑与偏移方向；`icon` 血条图标名；`color` 图标主色。' },
              { c: '\t<anim name="idle" anim="BF idle dance" x="-5" y="0" fps="24" loop="false"/>', n: '一个动画。`name` 是引擎认的**动画标识**（`idle` 是待机，必须是这个名字）；`anim` 是图集里的**帧前缀**；`x/y` 是这个动画的**偏移修正**；`fps` 帧率；`loop` 是否循环。' },
              { c: '\t<anim name="singUP" anim="BF NOTE UP0" x="-39" y="27" fps="24" loop="false"/>', n: '上键的唱歌动画。`singUP` / `singDOWN` / `singLEFT` / `singRIGHT` 是四个必须的动画名。' },
              { c: '\t<anim name="singLEFT" anim="BF NOTE LEFT0" x="6" y="-7" fps="24" loop="false"/>', n: '左键唱歌动画。注意每个方向的 x/y 偏移都不一样 —— 这就是为什么人物 XML 里的偏移很重要。' },
              { c: '\t<anim name="singRIGHT" anim="BF NOTE RIGHT0" x="-48" y="-6" fps="24" loop="false"/>', n: '右键。' },
              { c: '\t<anim name="singDOWN" anim="BF NOTE DOWN0" x="-17" y="-50" fps="24" loop="false"/>', n: '下键。' },
              { c: '\t<anim name="singUPmiss" anim="BF NOTE UP MISS" x="-35" y="27" fps="24" loop="false"/>', n: '`singUPmiss` 是**漏掉**上键时播的动画（带 miss 后缀），四个方向各一个。没有也可以，会回退到普通 sing。' },
              { c: '\t<anim name="singLEFTmiss" anim="BF NOTE LEFT MISS" x="6" y="19" fps="24" loop="false"/>', n: '左 miss。' },
              { c: '\t<anim name="singRIGHTmiss" anim="BF NOTE RIGHT MISS" x="-44" y="22" fps="24" loop="false"/>', n: '右 miss。' },
              { c: '\t<anim name="singDOWNmiss" anim="BF NOTE DOWN MISS" x="-16" y="-19" fps="24" loop="false"/>', n: '下 miss。' },
              { c: '\t<anim name="hey" anim="BF HEY" x="-3" y="6" fps="24" loop="false"/>', n: '自定义动画。`name` 随便起（`hey`），脚本里 `boyfriend.playAnim(\"hey\")` 就能播。' },
              { c: '\t<anim name="scared" anim="BF idle shaking" x="-6" y="1" fps="24" loop="true"/>', n: '另一个自定义动画，这里 `loop=\"true\"` 表示循环。' },
              { c: '\t<anim name="hit" anim="BF hit" x="13" y="19" fps="24" loop="false"/>', n: '受击动画。' },
              { c: '\t<anim name="pre-attack" anim="bf pre attack" x="-47" y="-36" fps="24" loop="false"/>', n: '自定义动画（带连字符的名字完全合法）。' },
              { c: '\t<anim name="attack" anim="boyfriend attack" x="289" y="270" fps="24" loop="false"/>', n: '注意这里的偏移很大（289/270），说明这段动画在原图里位置偏移很多，靠偏移把它拉回正确位置。' },
              { c: '\t<anim name="dodge" anim="boyfriend dodge" x="-8" y="-13" fps="24" loop="false"/>', n: '最后一个自定义动画。' },
              { c: '</character>', n: '结束。' }
            ]
          } },

          { h: '人物根节点能写的属性' },
          {
            table: {
              head: ['属性', '作用'],
              rows: [
                ['`sprite`', '贴图名（默认等于文件名）'],
                ['`x` / `y`', '全局偏移'],
                ['`isPlayer`', '是否玩家（影响朝向与偏移方向）'],
                ['`flipX`', '水平翻转'],
                ['`icon`', '血条图标名'],
                ['`color`', '图标主色'],
                ['`scale`', '整体缩放'],
                ['`antialiasing`', '抗锯齿'],
                ['`holdTime`', '唱歌姿势持续时间（`-1` 表示不限）'],
                ['`camx` / `camy`', '镜头偏移'],
                ['`gameOverChar`', '死亡时用哪个角色做「灵魂」'],
                ['`defFps`', '默认帧率（会应用到没写 fps 的动画）'],
                ['`centercam`', '镜头是否对准角色中心'],
                ['`swfMode`', 'Animate 图集相关'],
                ['`filterQuality`', '`high`/`medium`/`low`/`rudy`'],
                ['`interval`', '跳舞间隔（拍）'],
                ['（任意自定义属性）', '会进 `character.extras`，脚本可读']
              ]
            }
          },
          { p: "`<anim>` 支持的全部属性：" },
          {
            table: {
              head: ['属性', '作用'],
              rows: [
                ['`name`', '动画标识（引擎按这个名播）'],
                ['`anim`', '图集帧前缀'],
                ['`x` / `y`', '动画偏移'],
                ['`fps`', '帧率'],
                ['`loop`', '是否循环'],
                ['`forced`', '是否强制打断当前动画'],
                ['`indices`', '指定帧序号，如 `0,1,2,5`（可用范围 `1-5`）'],
                ['`label`', '`true` 时按「帧标签」而不是前缀匹配（Animate）'],
                ['`isAnimate`', '`true` 时按 Animate 图集解析'],
                ['`type`', '`none`/`beat`/`loop`']
              ]
            }
          },

          { h: '②-b `<spritesheet>`：一个人物用多张图集' },
          { p: "人物默认只加载一张图集：`sprite` 属性指定的那个（不写就等于文件名）。但你可以用 `<spritesheet>` **再挂任意多张**，引擎会把它们**合并成一套帧**，动画就能跨图集取帧。" },
          { code: { lang: 'xml', title: 'data/characters/bf.xml（多图集示例）', src: '<character sprite="characters/bf" x="0" y="0" icon="bf">\n\n\t<!-- 额外图集：死亡精灵、旧版贴图、特殊表情…… -->\n\t<spritesheet path="characters/bf-death" />\n\t<spritesheet path="characters/bf-old" />\n\n\t<anim name="idle" anim="BF idle dance" fps="24" loop="true" />\n\n\t<!-- 这一帧来自 bf-death 图集 -->\n\t<anim name="firstDeath" anim="BF Dies" fps="24" />\n</character>' } },
          {
            table: {
              head: ['写法', '说明'],
              rows: [
                ['`<spritesheet path="characters/bf-death" />`', '**推荐**：`path` 属性，路径相对 `images/`，不带扩展名'],
                ['`<spritesheet>characters/bf-death</spritesheet>`', '等价：把路径写在节点文本里'],
                ['`<sheet ... />`', '`sheet` 是 `spritesheet` 的别名，两种都能用'],
                ['（不写任何 `<spritesheet>`）', '只用 `sprite` 指定的那一张']
              ]
            }
          },
          {
            kv: [
              ['合并在哪', '`XMLUtil.appendSpriteSheetsFromXML()` → `Paths.getMultiFrames()`'],
              ['默认那张还在吗', '**在**。`sprite` 指定的图集永远排第一个，`<spritesheet>` 是往后追加'],
              ['顺序有关系吗', '有。**先加载的图集优先** —— 两张图集都有 `BF idle` 前缀时，用前面的'],
              ['路径有什么要求', '`path` 相对 `images/`，不带 `.png` / `.xml`；引擎会自动找同名的图 + 图集'],
              ['找不到会怎样', '跳过这张图集并打一条 `Could not find a BitmapData asset` 警告，**不会崩**'],
              ['重复写会怎样', '同一路径写两次只加载一次，并打一条 `was already added` 警告']
            ]
          },
          { p: "舞台 XML 里的 `<sprite>` 节点**同样支持** `<spritesheet>`，用法完全一样 —— 一个舞台元素也可以由多张图集拼出来。" },
          { code: { lang: 'xml', title: '舞台元素用多图集', src: '<stage folder="stages/my-stage/">\n\t<sprite name="crowd" sprite="crowd">\n\t\t<spritesheet path="stages/my-stage/crowd-night" />\n\t\t<anim name="idle" anim="crowd idle" fps="12" loop="true" />\n\t</sprite>\n</stage>' } },
          { callout: { kind: 'tip', title: '什么时候该用', text: "三种典型场景：① 人物后期加了新动画但不想重做整张图集；② 死亡/复活精灵是单独一套；③ 同一个角色有多种画风（白天/夜晚、旧版/新版）。" } },
          { callout: { kind: 'warn', title: '最常见的错', text: "把 `<spritesheet>` 写在了 `<character>` 外面（比如写进某个 `<anim>` 里）。它必须是**根节点的直接子节点**，和 `<anim>` 平级。" } },

          { h: '③ 周 XML' },
          { xml: {
            title: 'data/weeks/weeks/week1.xml',
            lines: [
              { c: '<!DOCTYPE codename-engine-week>', n: '声明这是周配置。' },
              { c: '<week name="DADDY DEAREST" chars="dad,bf,gf" sprite="week1">', n: '根节点。`name` 是周标题（显示在故事模式顶部）；`chars` 是周角色列表，逗号分隔，**最多 3 个**，对应 `data/weeks/characters/` 下的同名 XML；`sprite` 是周图标名。' },
              { c: '\t<song>Bopeebo</song>', n: '第一首歌。内容是 `songs/` 下的**文件夹名**（不是 displayName）。' },
              { c: '\t<song>Fresh</song>', n: '第二首。' },
              { c: '\t<song>Dadbattle</song>', n: '第三首。这一周打完就算通关。' },
              { c: '</week>', n: '结束。' }
            ]
          } },

          { h: '④ 溅射 XML' },
          { p: "`data/splashes/default.xml` 控制命中时的打击特效。四个 `<strum id=\"0~3\">` 分别对应左/下/上/右，每个里面两个动画（`splashleft1` / `splashleft2` 这种命名是引擎约定的）。" },
          { code: { lang: 'xml', title: 'data/splashes/default.xml（节选）', src: '<splashes sprite="game/splashes/default" alpha="0.6">\n\t<strum id="0"> <!-- LEFT -->\n\t\t<anim name="splashleft1" anim="note impact 1 purple" fps="24" x="0" y="0" />\n\t\t<anim name="splashleft2" anim="note impact 2 purple" fps="24" x="0" y="0" />\n\t</strum>\n\t<strum id="1"> <!-- DOWN -->\n\t\t<anim name="splashdown1" anim="note impact 1 blue" fps="24" x="0" y="0" />\n\t</strum>\n</splashes>' } },

          { h: '⑤ 标题界面 XML' },
          { p: "`data/titlescreen/titlescreen.xml` 用 `<sprites>` 定义标题元素，用 `<intro>` 定义 16 拍的开场时间轴。" },
          { code: { lang: 'xml', title: 'titlescreen.xml 的骨架', src: '<titlestate>\n\t<sprites folder="menus/titlescreen">\n\t\t<sprite name="logo" sprite="logo" x="-150" y="-100" beatInterval="1"/>\n\t\t<sprite name="gf" sprite="gf" x="512" y="50" beatInterval="1">\n\t\t\t<anim name="danceLeft"  anim="gfDance" indices="30,0,1,2,3,4,5,6,7" />\n\t\t\t<anim name="danceRight" anim="gfDance" indices="15,16,17,18,19,20" />\n\t\t</sprite>\n\t</sprites>\n\n\t<intro length="16">\n\t\t<text beat="1"><line text="ninjamuffin99" /></text>\n\t\t<text beat="4" />   <!-- 空 = 清屏 -->\n\t\t<text beat="9"><introtext line="1" /></text>\n\t\t<text beat="7"><sprite path="menus/titlescreen/newgrounds_logo" scale="0.8"/></text>\n\t</intro>\n</titlestate>' } },

          { h: '⑥ 字体 XML（Alphabet）' },
          { p: "`data/alphabet/normal.xml` 定义「怎么把一个字符拼出来」：每行默认动画 + 每个字符的例外。" },
          { code: { lang: 'xml', title: 'alphabet/normal.xml 的结构', src: '<alphabetFont fps="12" advance="30" lineGap="70" colorMode="offsets">\n\t<spritesheet>menus/alphabet</spritesheet>\n\n\t<defaultAnim casing="upper">character-LOWERLETTER-capital</defaultAnim>\n\t<defaultAnim casing="lower">character-LOWERLETTER-lowercase</defaultAnim>\n\t<defaultAnim>LETTER</defaultAnim>\n\n\t<anim char="g" y="-15">character-g-lowercase</anim>\n</alphabetFont>' } },
          { p: "`<defaultAnim>` 里的 `LETTER` / `LOWERLETTER` 是占位符，会被实际字符替换（大写/小写两种）。`<anim char=\"x\">` 用来给个别字符做特殊偏移。`colorMode` 取 `tint` / `offsets` / `none`。" },
          { callout: { kind: 'warn', title: '常见报错', text: "字体里的字符显示为空白 → 图集里没有对应前缀的帧；引擎不会崩，但会静默缺字。做多语言时尤其注意。" } }
        ],
        deep: [
          { h: '`<property>` 节点：万能属性写入器' },
          { p: "有时候你想设的属性没有专门的 XML 写法（比如某个 FlxSprite 的字段），就用 `<property>`：" },
          { code: { lang: 'xml', title: '语法', src: '<property name="字段名" type="类型" value="值" />\n<!-- 支持点号路径，写到嵌套对象里 -->\n<property name="offset.x" type="float" value="12" />' } },
          {
            table: {
              head: ['type 可写', '解析成'],
              rows: [
                ['`float` / `number` / `f`', '浮点数'],
                ['`int` / `integer` / `i`', '整数'],
                ['`bool` / `boolean` / `b`', '布尔（只认 `true`）'],
                ['`string` / `str` / `text` / `s`', '字符串'],
                ['`color` / `c`', '颜色（`FlxColor.fromString`）']
              ]
            }
          },
          { p: "写错类型不会崩，只会在日志里打一条警告并跳过 —— 这也是排查「我设了没生效」的第一现场。" },

          { h: '`use-extension`：给 XML 挂脚本' },
          { p: "舞台和人物的 XML 里都能写：" },
          { code: { lang: 'xml', src: '<use-extension script="myStageScript" folder="data/scripts/" isShortLived="true" loadBefore="true" importStageSprites="true" />' } },
          {
            kv: [
              ['`script`', '脚本名（会自动补 `.hx`）'],
              ['`folder`', '脚本所在目录，默认 `data/scripts/`'],
              ['`isShortLived`', '加载完舞台就销毁这个脚本（适合「一次性改点东西」）'],
              ['`loadBefore`', '是否在解析 XML **之前**加载（默认 `true`）'],
              ['`importStageSprites`', '是否把舞台精灵注入脚本变量（默认 `false`）']
            ]
          },

          { h: 'XML 解析的先后顺序（决定你能拿到什么）' },
          {
            ol: [
              "读取根节点属性（zoom / folder / startCamPos…）。",
              "收集子节点，把 `high-memory` / `low-memory` 展开。",
              "先加载 `loadBefore=true` 的扩展脚本。",
              "逐个节点创建对象（sprite / solid / 角色锚点 / 自定义角色）。",
              "每个节点创建完，套用它的 `<property>` 子节点。",
              "全部建完，把精灵注入脚本变量（`setStagesSprites`）。",
              "销毁 `isShortLived` 的脚本。"
            ]
          },
          { p: "所以：**在 `create()` 里能拿到所有精灵，但改不了它们的创建过程**；想干预创建过程要挂 `onStageNodeParsed` 事件。" },

          { h: '几个不写会踩的坑' },
          {
            ul: [
              "**自闭合标签必须闭合**：`<sprite ... />` 少个 `/` 会让整个 XML 解析失败，然后舞台变成一个空黑屏。",
              "**属性值里的 `&` 要写成 `&amp;`**，否则 XML 非法。",
              "**`name` 重复**会互相覆盖：后创建的把先创建的顶掉，脚本里只剩一个。",
              "**人物 XML 的 `sprite` 属性和文件名不一致**时，引擎会去找 `sprite` 指定的贴图，但脚本/谱面里引用的是文件名 —— 容易查半天。",
              "**XML 编码必须是 UTF-8 无 BOM**。带 BOM 有时会让第一个节点名变成乱码。"
            ]
          }
        ]
      }

    ]
  });
})();
