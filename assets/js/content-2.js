/* 三档阅读数据 */
(function () {
  if (!window.CNE) return;

  window.CNE.addPart({
  "id": "p2",
  "name": "第二部分 · 用它",
  "short": "PART 02",
  "color": "var(--cyan)",
  "sections": [
    {
      "id": "boot-and-map",
      "num": "05",
      "title": "启动与界面地图",
      "en": "BOOT & SCREEN MAP",
      "tags": [
        "启动流程",
        "界面总览"
      ],
      "simple": [
        {
          "p": "打开游戏后，你其实会经过这么几个画面：**启动警告页（可以关掉）→ 标题界面 → 主菜单 → 你选的界面**。"
        },
        {
          "p": "**主菜单那几个入口分别去哪**：`STORY MODE` 是故事模式（按周打，一周几首歌连着）；`FREEPLAY` 是自由游玩（所有歌随便挑）；`OPTIONS` 是设置；`CREDITS` 是制作名单。"
        },
        {
          "p": "**进歌之后**：按 `ESC` 是**暂停**（不是退出游戏），暂停菜单里有继续/重开/调难度/进设置。想彻底退出回主菜单，选 `Exit to menu`。"
        },
        {
          "p": "**想跳过菜单直接进某首歌**（做测试时非常省时间）：给 exe 加参数，比如 `CodenameEngine.exe -song bopeebo hard`，详见第 43 节。"
        },
        {
          "p": "**左下角那行小字**是引擎版本 + 构建号（比如 `#1392`）。报 bug 时把这行一起发过去，比说「最新版」有用得多。"
        }
      ],
      "core": [
        {
          "h": "启动时会经过哪些界面"
        },
        {
          "table": {
            "head": [
              "顺序",
              "界面",
              "你会看到什么",
              "怎么过"
            ],
            "rows": [
              [
                "1",
                "预加载 / 启动画面",
                "引擎 LOGO、加载条",
                "自动"
              ],
              [
                "2",
                "警告页 WarningState（可选）",
                "免责声明，红黄标记的重点句",
                "按确认键"
              ],
              [
                "3",
                "模组配置警告（仅开发者模式）",
                "modpack.ini 缺失或 API 过旧时弹出",
                "按提示修复或忽略"
              ],
              [
                "4",
                "标题界面 TitleState",
                "LOGO、GF、滚动作者名单、Press Enter",
                "按两次 Enter"
              ],
              [
                "5",
                "主菜单 MainMenuState",
                "四个菜单项 + 背景",
                "方向键 + Enter"
              ],
              [
                "6",
                "自由游玩 / 故事模式",
                "歌单或周目",
                "Enter 进歌"
              ],
              [
                "7",
                "打歌 PlayState",
                "谱面、血条、分数",
                "—"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "为什么我从来没见过警告页",
            "text": "因为 `Flags.DISABLE_WARNING_SCREEN` 默认为 `true`。想让它出现，在 `data/config/flags.ini` 里把它设成 `false`。"
          }
        },
        {
          "h": "界面地图（记住这张图就不迷路）"
        },
        {
          "ul": [
            "**标题界面** → 主菜单：唯一出口就是 Enter。",
            "**主菜单** → 故事 / 自由 / 设置 / 名单；`Backspace` 回标题；`TAB` 开 Mod 菜单。",
            "**自由游玩** → 选歌 → 选难度（左右键）→ Enter 开始。",
            "**故事模式** → 选周（上下）→ 选难度（左右）→ Enter 开始整周。",
            "**打歌中** → `Enter` 暂停 → Resume / Restart / Controls / Options / Exit。",
            "**任何界面** → `F3` 看帧数，`F2` 开控制台（需开发者模式），`7` 进编辑器（需开发者模式）。"
          ]
        },
        {
          "h": "第一次进游戏建议做的事"
        },
        {
          "ol": [
            "进 **设置 → 游玩**，把 `Song Offset` 调一下（戴耳机打歌的话这个很关键）。",
            "进 **设置 → 外观**，确认帧率不是 30（默认 120）。",
            "进 **设置 → 控制**，把按键改成你习惯的（默认 A S W D）。",
            "回主菜单，按 `TAB` 看一眼 Mod 菜单长什么样 —— 以后所有 mod 都从这儿切。"
          ]
        }
      ],
      "deep": [
        {
          "h": "启动细节"
        },
        {
          "p": "`Main` 在 `preInit` 阶段做了几件容易被忽略的事：注册 DPI 感知（Windows 上 125%/150% 缩放不再糊）、解析命令行参数、**修正工作目录**（所以从快捷方式启动也能正确找到 assets）、初始化日志与崩溃处理器。"
        },
        {
          "p": "随后 `MainState` 会清理 `.temp` 临时目录、保存一次设置、重置资源库列表，再依次加载：addons（按 `[LOW]` / `[HIGH]` 前缀决定优先级）→ 选中的 mod → `flags.ini` / `modpack.ini` → 存档 → 语言 → 全局脚本。**你看到的「加载中」大部分时间花在这里**。"
        },
        {
          "p": "命令行还支持直接进游戏：`-song bopeebo -diff hard` 之类可以跳过菜单直接开打，做测试很方便。"
        },
        {
          "h": "启动流程：从 exe 到主菜单，中间过了几个状态"
        },
        {
          "p": "很多人以为「打开游戏就是主菜单」，其实中间至少经过 3 个状态。搞清这条链，你才知道「我想改的那个界面」到底叫什么。"
        },
        {
          "ol": [
            "`Main` 初始化：读命令行、修工作目录、加载 `mods/` 与 `addons/`、注册语言包。",
            "`MainState`：一切的总调度。它决定接下来去哪 —— 有 `-song` 就直接进打歌，有更新就进更新页。",
            "`TitleState`：标题 + 16 拍开场动画，结束后自动跳主菜单（也可按键跳过）。",
            "`MainMenuState`：主菜单。从这里进自由游玩 / 故事模式 / 设置 / 制作名单 / Mod 切换。",
            "打歌时：`PlayState`（+ 可选的 `DialogueCutscene` 过场、`PauseSubState` 暂停）。"
          ]
        },
        {
          "table": {
            "head": [
              "界面",
              "类名",
              "文件"
            ],
            "rows": [
              [
                "标题",
                "`TitleState`",
                "`funkin/menus/TitleState.hx`"
              ],
              [
                "主菜单",
                "`MainMenuState`",
                "`funkin/menus/MainMenuState.hx`"
              ],
              [
                "自由游玩",
                "`FreeplayState`",
                "`funkin/menus/FreeplayState.hx`"
              ],
              [
                "故事模式",
                "`StoryMenuState`",
                "`funkin/menus/StoryMenuState.hx`"
              ],
              [
                "设置",
                "`OptionsMenu`",
                "`funkin/options/OptionsMenu.hx`"
              ],
              [
                "制作名单",
                "`CreditsMain`",
                "`funkin/menus/credits/CreditsMain.hx`"
              ],
              [
                "打歌",
                "`PlayState`",
                "`funkin/game/PlayState.hx`"
              ],
              [
                "暂停",
                "`PauseSubState`",
                "`funkin/menus/PauseSubState.hx`"
              ]
            ]
          }
        },
        {
          "p": "**关键**：这些类名同时就是「状态脚本」的文件名。想看/改任何一个界面，先看它有没有 `data/states/<类名>.hx` 这一层。"
        },
        {
          "code": {
            "lang": "ini",
            "title": "一份脚本能挂到哪些界面",
            "src": "data/states/TitleState.hx      → 只影响标题\ndata/states/MainMenuState.hx   → 只影响主菜单\ndata/states/PlayState.hx       → 只影响打歌\ndata/global.hx                 → 影响所有界面"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "换界面不用改源码",
            "text": "想整个换掉某个界面，用 `StateRedirects`（第 41 节）；想在上面加东西，用状态脚本。两条路都不用碰 Haxe 源码。"
          }
        },
        {
          "h": "状态切换时发生了什么（为什么脚本里 `state` 会变）"
        },
        {
          "p": "每次 `FlxG.switchState(...)` 都会走一次「退出旧状态 → 创建新状态 → 挂脚本」的流程。所以脚本里的 `state` 是**创建那一刻**的值，别把它存进 `static` 里反复用。"
        }
      ]
    },
    {
      "id": "title-screen",
      "num": "06",
      "title": "标题界面",
      "en": "TITLE SCREEN",
      "tags": [
        "TitleState",
        "XML",
        "开场动画"
      ],
      "simple": [
        {
          "p": "标题界面就是**一段约 16 拍的动画 + 一句随机吐槽**，播完自动进主菜单。按 `Enter` 或空格可以跳过。"
        },
        {
          "p": "它不是代码画的，是**一个 XML 描述的时间轴**：`data/titlescreen/titlescreen.xml`。里面写「第 1 拍显示 ninjamuffin99、第 4 拍清屏、第 7 拍显示 Newgrounds logo……」。"
        },
        {
          "p": "**想换成自己的**：改那个 XML 里的 `beat`（第几拍出现）和 `<sprite>` 的 `path`（用哪张图）；想换吐槽文字就改 `data/titlescreen/introText.txt`，一行一句，`--` 分成上下两段。**全程不用写代码**。"
        },
        {
          "p": "logo 想加个呼吸/漂浮效果，就得写一小段脚本（`data/states/TitleState.hx`），这在第 23 节有模板。"
        }
      ],
      "core": [
        {
          "h": "界面上有什么"
        },
        {
          "ul": [
            "**LOGO**：`menus/titlescreen/logo`，会跟着节拍轻微缩放。",
            "**GF**：`menus/titlescreen/gf`，两段动画 `danceLeft` / `danceRight` 交替，每拍切一次。",
            "**作者名单 intro**：从第 1 拍开始，按 `titlescreen.xml` 里 `<text beat=\"n\">` 的时间轴逐行出现，共 16 拍。",
            "**随机吐槽**：`data/titlescreen/introText.txt` 里随机抽一行，按 `--` 分成两段填进名单的空位（就是原版那个「wacky」句子）。",
            "**Press Enter**：`menus/titlescreen/titleEnter`，两帧动画 `idle` / `press`。"
          ]
        },
        {
          "h": "交互"
        },
        {
          "ol": [
            "第一次按确认键：跳过 intro（白闪 + 清屏）。",
            "第二次按确认键：播放 press 动画 → 白闪 → 2 秒后进主菜单。",
            "如果开了自动更新检查，会先查一次更新，有新版就跳到更新界面。"
          ]
        },
        {
          "callout": {
            "kind": "dev",
            "title": "冷知识",
            "text": "这一版的标题界面**没有** splash 文本（那种一闪而过的梗文字）。splash 在本引擎里指的是打歌时的「音符溅射」，别搞混。"
          }
        }
      ],
      "deep": [
        {
          "h": "XML 里能配的东西"
        },
        {
          "p": "`<titlestate>` 下有两个主要节点：`<sprites folder=\"...\">` 和 `<intro length=\"16\">`。"
        },
        {
          "ul": [
            "`<sprites folder>`：指定贴图目录，里面的 `<sprite name sprite x y beatInterval>` 会生成 `FunkinSprite`，并注册到 `titleScreenSprites` 里（脚本能按 name 取到）。",
            "`<titleEnter sprite x y>`（可选）：替换默认的 Press Enter 贴图。",
            "`<intro length>`：intro 总拍数。",
            "`<text beat=\"n\">`：第 n 拍显示什么；里面可以放 `<line text=\"...\"/>` 多行文本、`<sprite path=\"...\" scale=\"...\"/>` 图片、`<introtext line=\"1|2\"/>` 引用随机吐槽的第几段。",
            "空的 `<text beat=\"n\"/>` 等于**清屏**。"
          ]
        },
        {
          "p": "这些节点的样式（Skew 的字体、Alphabet 的动画）来自 `data/alphabet/*.xml`；如果某个标题字显示不出来，先去检查字体 XML 里有没有那个字符的 `<anim>`。"
        },
        {
          "h": "`TitleState` 的内部结构"
        },
        {
          "table": {
            "head": [
              "字段",
              "类型",
              "说明"
            ],
            "rows": [
              [
                "`curWacky`",
                "`Array<String>`",
                "当前那一对随机吐槽（`introText.txt` 里的一行，被 `--` 拆成两段）"
              ],
              [
                "`titleLength`",
                "`Int`",
                "开场总长（拍），来自 XML 的 `<intro length=\"16\">`"
              ],
              [
                "`titleLines`",
                "`Map<Int, IntroText>`",
                "第几拍 → 该显示什么"
              ],
              [
                "`titleSprites`",
                "`Map<String, FlxSprite>`",
                "XML 里声明的所有精灵"
              ],
              [
                "`lines`",
                "`Array`",
                "实际要画的元素序列"
              ]
            ]
          }
        },
        {
          "p": "开源引擎里标题界面的最大不同：**它是数据驱动的**。`data/titlescreen/titlescreen.xml` 里的 `<intro>` 就是时间轴，`beat` 属性是「第几拍触发」："
        },
        {
          "code": {
            "lang": "xml",
            "src": "<intro length=\"16\">\n\t<text beat=\"1\"><line text=\"ninjamuffin99\" /></text>\n\t<text beat=\"4\" />                        <!-- 空 = 清屏 -->\n\t<text beat=\"7\"><sprite path=\"menus/titlescreen/newgrounds_logo\" scale=\"0.8\"/></text>\n\t<text beat=\"9\"><introtext line=\"1\" /></text>   <!-- 引用 introText.txt 的第 1 段 -->\n</intro>"
          }
        },
        {
          "h": "三个常见修改与它们改哪里"
        },
        {
          "table": {
            "head": [
              "想改",
              "改哪"
            ],
            "rows": [
              [
                "换开场文字",
                "`data/titlescreen/introText.txt`（一行一条，`--` 分两段）"
              ],
              [
                "换开场节奏/顺序",
                "`titlescreen.xml` 的 `<intro>` 里挪 `beat`"
              ],
              [
                "换字体/logo/加精灵",
                "`titlescreen.xml` 的 `<sprites>` 与 `<sprite>`"
              ],
              [
                "整个改成自己的动画",
                "写 `data/states/TitleState.hx` 覆盖 `create`"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "用状态脚本加一个自己的标题元素",
            "src": "function postCreate() {\n\t// 在原版标题上加一行小字\n\tvar tip = new FlxText(0, FlxG.height - 40, FlxG.width, \"按 ENTER 开始\", 18);\n\ttip.setFormat(Paths.font(\"vcr.ttf\"), 18, 0xFFFFFFFF, CENTER);\n\tadd(tip);\n}\n\n// 在开场结束、跳主菜单之前插一脚\nfunction onIntroEnd() {\n\ttrace(\"标题动画播完了\");\n}"
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "跳过逻辑",
            "text": "开场可以被按键跳过（`Enter` / `Space` 都能跳）。想禁掉或改键，就在状态脚本里改 `skipIntro` 相关字段，或直接拦住按键。"
          }
        }
      ]
    },
    {
      "id": "main-menu",
      "num": "07",
      "title": "主菜单与 Mod 切换",
      "en": "MAIN MENU & MODS",
      "tags": [
        "MainMenuState",
        "ModSwitchMenu",
        "menuItems"
      ],
      "simple": [
        {
          "p": "主菜单的按钮**不是写死的**，是一行一行读出来的：`data/config/menuItems.txt`。格式是 `id:显示名`，比如 `freeplay:FREEPLAY`。"
        },
        {
          "p": "想加自己的入口？加一行 `mything:MY THING`，再用状态脚本拦「选中」事件决定它跳哪去（第 23 节）。想删原版入口就删那行 —— 但**别删 freeplay**，不然玩家找不到歌。"
        },
        {
          "p": "**`TAB` 键是切 mod**。切 mod 会让整个游戏重载（等于重启），所以切完你之前的状态全没了 —— 这不是 bug。"
        },
        {
          "p": "左下角显示版本号；鼠标点它也能触发（彩蛋）。"
        }
      ],
      "core": [
        {
          "h": "菜单项怎么来的"
        },
        {
          "p": "`MainMenuState` 读取 `data/config/menuItems.txt`，一行一个菜单项，然后按名字去 `menus/mainmenu/<名字>` 找贴图（以及 `basic` / `white` 两套动画）。选中的项会变成白色高亮。"
        },
        {
          "p": "名字同时决定跳转目标：`story mode` → 故事、`freeplay` → 自由、`options` → 设置、`credits` 或 `donate` → 制作名单。所以**自定义菜单项需要脚本配合**（用 `onSelectItem` 事件接管）。"
        },
        {
          "h": "左下角那行字"
        },
        {
          "p": "显示版本号 + 提交号 + `[TAB] Open Mods menu`。点它也能打开 Mod 菜单 —— 鼠标党福音。"
        },
        {
          "h": "Mod 切换菜单"
        },
        {
          "ul": [
            "列表来自 `mods/` 下的**文件夹**和 **zip 包**，最后一项固定是「Disable Mods」（回到原版）。",
            "名称和描述取 `mods/<名字>/data/config/modpack.ini` 的 `[Common] NAME / DESCRIPTION`；没配置就显示文件夹名（开启 `legacyModMenuNames` 时总是显示文件夹名）。",
            "当前 mod 会绿色高亮 + 波浪文字效果。",
            "`TAB` 切到 **Addons** 分页：勾选/取消 `mods/addons/` 里的 addon，结果记在 `Options.disabledAddons`，下次选 mod 时生效。",
            "确认切换会重建 `MainState`，等于软重启。"
          ]
        },
        {
          "callout": {
            "kind": "tip",
            "title": "实用",
            "text": "做 mod 时把 `modpack.ini` 的 `NAME` / `DESCRIPTION` 写好，测试时一眼就能认出哪个是你自己的 mod。"
          }
        },
        {
          "h": "背景"
        },
        {
          "p": "背景是 `menus/menuBG` + 一层 `menus/menuDesat` 粉色遮罩；开启 `flashingMenu` 时遮罩会闪烁。镜头会缓慢跟随当前选中项，所以视觉上菜单项是「浮动」的。"
        }
      ],
      "deep": [
        {
          "h": "开发者模式下的额外入口"
        },
        {
          "p": "开了开发者模式后，在主菜单按 `7` 会打开 **编辑器选择器（EditorPicker）**：竖直排列的几个大色条，滚轮或上下键选择，确认后进入对应编辑器，另有一项是「Wiki」会直接开浏览器。"
        },
        {
          "p": "没开开发者模式时按 `7`，只有音效、没有界面；**连按三次**才会在底部提示一句「You have to enable DEVELOPER MODE in the miscellaneous settings!」—— 这是官方故意藏的。"
        },
        {
          "h": "脚本钩子"
        },
        {
          "ul": [
            "`onChangeItem`（MenuChangeEvent）：切换选中项时触发，可以改动画/音效。",
            "`onSelectItem`（NameEvent）：确认选择时触发，**可以改名从而改变跳转目标**，也可以 Cancel 掉不让它跳。",
            "对应脚本路径：`data/states/MainMenuState.hx`（软编码 State 机制）。"
          ]
        },
        {
          "h": "主菜单项是「读文件」读出来的"
        },
        {
          "p": "主菜单不是写死的 5 个按钮，而是读 `data/config/menuItems.txt`。**一行一个菜单项**，格式是「id:显示名」。"
        },
        {
          "code": {
            "lang": "ini",
            "title": "data/config/menuItems.txt",
            "src": "story:STORY MODE\nfreeplay:FREEPLAY\noptions:OPTIONS\ncredits:CREDITS\n# 注释行会被忽略"
          }
        },
        {
          "kv": [
            [
              "冒号左边",
              "菜单 id —— 决定按下去跳哪个状态（`story` → `StoryMenuState`）"
            ],
            [
              "冒号右边",
              "显示名（会过大写化处理）"
            ],
            [
              "想加自己的",
              "加一行 `mything:MY THING`，再用状态脚本拦 `onSelect` 自己处理"
            ],
            [
              "想删原版的",
              "删掉那一行即可；但别把 `freeplay` 删了，很多人找不到歌"
            ]
          ]
        },
        {
          "h": "`MainMenuState` 的可改字段"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`canAccessDebugMenus`",
                "能不能打开编辑器/调试菜单（默认 = `!Flags.DISABLE_EDITORS`）"
              ],
              [
                "`menuItems`",
                "实际渲染的菜单项数组（改它 = 改按钮）"
              ],
              [
                "`curSelected`",
                "当前选中项"
              ],
              [
                "`grpItems`",
                "承载按钮的组（想加装饰元素就 `add()` 到别处）"
              ]
            ]
          }
        },
        {
          "h": "Mod 切换：`TAB` 背后发生了什么"
        },
        {
          "ol": [
            "`TAB` → 打开 `ModSwitchMenu`（一个子状态），列出 `mods/` 下所有合法 mod。",
            "选中后调 `ModsFolder.switchMod(name)` —— 它会**重建整个 `MainState`**。",
            "所以切 mod 之后，**之前状态里的一切对象都失效**：静态变量、缓存的 Sprite、闭包全不能用。",
            "`Options.lastLoadedMod` 会记住你的选择，下次启动自动加载。"
          ]
        },
        {
          "code": {
            "lang": "haxe",
            "title": "用脚本加一个自己的菜单项",
            "src": "// 在 MainMenuState 的状态脚本里\nfunction postCreate() {\n\t// 在最下面加一行提示（不改按钮）\n\tvar hint = new FlxText(20, FlxG.height - 30, 0, \"按 TAB 切换 Mod\", 14);\n\thint.setFormat(Paths.font(\"vcr.ttf\"), 14, 0xFF888888);\n\tadd(hint);\n}\n\n// 想在选中某个菜单项时干别的事\nfunction onSelect(id:String) {\n\tif (id == \"credits\") {\n\t\t// 比如改成打开自己的网页\n\t\tCoolUtil.openURL(\"https://github.com/zeelingAQ/codename-engine-manual\");\n\t}\n}"
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "`menuItems.txt` 改坏了会怎样",
            "text": "读不出来就是**空菜单**（没有按钮可点）。改之前备份，或者先用状态脚本在代码里改 `menuItems` 试效果。"
          }
        }
      ]
    },
    {
      "id": "freeplay",
      "num": "08",
      "title": "自由游玩（Freeplay）",
      "en": "FREEPLAY",
      "tags": [
        "FreeplayState",
        "歌单",
        "难度",
        "变体"
      ],
      "simple": [
        {
          "p": "自由游玩就是「所有歌的列表」。**歌不是你手动登记的**，是引擎去扫 `songs/` 目录，每个文件夹算一首，读里面的 `meta.json` 拿歌名和 BPM。"
        },
        {
          "p": "**左右箭头切的是难度**（Easy/Normal/Hard），难度来自谱面文件名；如果这首歌有变体（比如 `erect` 版），会显示成 `HARD (ERECT)` 这样。"
        },
        {
          "p": "**默认只显示当前 mod 的歌**（这个行为叫 `override`）。也就是说你装了 mod 之后原来的歌可能全不见了 —— 这是设计如此，想合并就把 `SONGS_LIST_MOD_MODE` 改成 `append`（第 42 节）。"
        },
        {
          "p": "没打过的歌难度是暗的？说明这首歌没有这个难度的谱面文件，不是 bug。"
        }
      ],
      "core": [
        {
          "h": "歌单的三种来源"
        },
        {
          "ol": [
            "`data/config/freeplaySonglist.txt` —— **优先**，一行一首歌，空行会在列表里变成间隔。",
            "`data/freeplaySonglist.txt` —— 旧路径，仍能用但会打警告。",
            "都没有 → 自动扫描 `songs/` 下所有子文件夹（排除 `charts` / `scripts` / `song` 这三个特殊子目录）。"
          ]
        },
        {
          "h": "每首歌显示什么"
        },
        {
          "ul": [
            "**歌名**：取 `meta.json` 的 `displayName`，用 `Alphabet` 字体（默认 `bold`）。",
            "**图标**：取 `meta.json` 的 `icon`，比如 `gf`。",
            "**背景色**：取 `meta.json` 的 `color`，界面背景会在切歌时渐变过去。",
            "**最高分**：按「歌 + 难度 + 模式」分开存，所以开 Co-op 的分数不会和单人混在一起。"
          ]
        },
        {
          "h": "难度与变体（Variation）"
        },
        {
          "p": "这是 Codename 比较特别的地方：难度不只有 easy/normal/hard，还可以有**变体**（variation）。变体是「同一首歌的另一套谱面/音频」，比如 `pico` 的 `erect` 版。界面上会显示成 `HARD (ERECT)` 这种形式。"
        },
        {
          "ul": [
            "基础难度来自 `meta.json` 的 `difficulties` 数组。",
            "每个变体有自己的 `meta.json`，里面的难度会拼接在后面。",
            "切难度时引擎会记下 `freeplayLastSong / Difficulty / Variation`，下次进来还在原位。"
          ]
        },
        {
          "h": "模式切换"
        },
        {
          "p": "按 `CHANGE_MODE`（默认 `TAB`）循环切换 **Solo → Opponent → Co-op**。只有 `meta.json` 里 `opponentModeAllowed` / `coopAllowed` 为 `true` 时才能切。"
        },
        {
          "h": "操作"
        },
        {
          "table": {
            "head": [
              "操作",
              "按键"
            ],
            "rows": [
              [
                "上下选歌",
                "↑ / ↓ 或鼠标悬停"
              ],
              [
                "左右切难度",
                "← / →"
              ],
              [
                "切换 Solo / Opponent / Co-op",
                "TAB"
              ],
              [
                "开始",
                "Enter 或鼠标点击"
              ],
              [
                "返回主菜单",
                "Backspace 或鼠标右键"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "dev",
            "title": "注意",
            "text": "这一版**没有**字母搜索框，也**没有**按字母排序。列表顺序 = txt 里的顺序或目录扫描顺序。想要排序，就自己维护 `freeplaySonglist.txt`。"
          }
        }
      ],
      "deep": [
        {
          "h": "变体的文件组织"
        },
        {
          "p": "变体在 `songs/<歌名>/` 下用一套并行结构表示：谱面放在 `charts/<变体>/<难度>.json`，音频可以放 `song/Inst-<变体>.ogg`。引擎在 `Paths.chart()` 里拼这个路径，所以命名必须对上。"
        },
        {
          "h": "脚本钩子"
        },
        {
          "ul": [
            "`onSongSelect`（FreeplaySongSelectEvent）：选歌时触发，可以改 `songName` / 难度，或 Cancel。",
            "`onAlphaUpdate`（FreeplayAlphaUpdateEvent）：列表滚动时逐项触发，可以做「越远越透明」之类的效果。",
            "`data/states/FreeplayState.hx` 可以整体接管这个界面。"
          ]
        },
        {
          "h": "歌单到底是怎么拼出来的（源码级）"
        },
        {
          "p": "「为什么我的 mod 装上之后原版的歌全没了」——答案在这段逻辑里。`FreeplaySonglist.get()` 按 `SONGS_LIST_MOD_MODE` 决定拼接顺序："
        },
        {
          "table": {
            "head": [
              "模式",
              "实际执行顺序",
              "结果"
            ],
            "rows": [
              [
                "`override`（默认）",
                "先 MODS，**只有在 MODS 一首都没找到时**才补 SOURCE",
                "mod 有歌 → 原版全消失"
              ],
              [
                "`prepend`",
                "MODS → SOURCE",
                "mod 的歌在前"
              ],
              [
                "`append`",
                "SOURCE → MODS",
                "mod 的歌在后"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "`override` 是个容易误伤的默认值",
            "text": "很多人第一次做 mod 会发现原版歌单空了——因为默认 `override`。想让自己的歌排进去，用 `SONGS_LIST_MOD_MODE=\"append\"`。"
          }
        },
        {
          "h": "`freeplaySonglist.txt`：手动指定顺序和曲目"
        },
        {
          "p": "不想用「扫目录」的自动顺序，就用 txt 手动列。**一行一首**，可以带子目录前缀："
        },
        {
          "code": {
            "lang": "ini",
            "title": "data/config/freeplaySonglist.txt",
            "src": "bopeebo\nfresh\ndadbattle\n# 嵌套目录也行\nmy-album/song1\nmy-album/song2"
          }
        },
        {
          "kv": [
            [
              "新的正确路径",
              "`data/config/freeplaySonglist.txt`"
            ],
            [
              "旧的废弃路径",
              "`data/freeplaySonglist.txt` —— 还能读，但日志会警告 `is deprecated`"
            ],
            [
              "扫描兜底",
              "没有 txt 时才去扫 `songs/` 目录"
            ],
            [
              "每个条目",
              "会调 `Chart.loadChartMeta()` 读它的 `meta.json`"
            ],
            [
              "嵌套目录",
              "支持子文件夹；**文件夹会排在歌曲前面**（代码里专门做了 `endsWith(\"/\")` 的分流）"
            ]
          ]
        },
        {
          "p": "顺带一个细节：`getSongsFromSource()` 的返回值是**反的** —— 找到歌返回 `false`，没找到返回 `true`。`override` 模式就是靠「返回 true 才补 SOURCE」来工作的。读源码时别被绕进去。"
        }
      ]
    },
    {
      "id": "story-mode",
      "num": "09",
      "title": "故事模式",
      "en": "STORY MODE",
      "tags": [
        "StoryMenuState",
        "周",
        "weeks.txt"
      ],
      "simple": [
        {
          "p": "故事模式 = **按周打歌**。一周（week）就是一个 XML，里面写着这周有哪几首歌、用什么角色站台、难度图标长什么样。"
        },
        {
          "p": "周的先后顺序由 `data/weeks/weeks.txt` 决定，一行一个文件名。**不在这个文件里的周不会显示**。"
        },
        {
          "p": "**必须一整周打完才算通关**；中途退出或者只打了一首，成绩不记录。这就是为什么它比自由游玩「有仪式感」。"
        },
        {
          "p": "想加自己的一周：建 `data/weeks/weeks/myweek.xml` + 在 `weeks.txt` 加一行 + 准备一张周难度图。第 16 节有完整示例。"
        }
      ],
      "core": [
        {
          "h": "界面上有什么"
        },
        {
          "ul": [
            "顶部黑条：本周累计得分 `WEEK SCORE`。",
            "周标题 + 彩色背景（颜色来自周 XML 的 `bgColor`）。",
            "周图标：`menus/storymenu/weeks/<sprite>`，当前周会白/青色闪烁。",
            "左右箭头 + 难度图：`menus/storymenu/difficulties/<难度小写>`。",
            "`TRACKS` + 本周歌曲列表（取每首歌的 `displayName`）。",
            "最多三个周角色，会跟着节拍跳舞，选中周时播 `confirm` 动画。"
          ]
        },
        {
          "h": "周的来源"
        },
        {
          "ol": [
            "`data/weeks/weeks.txt` —— 一行一个周文件名，用来**排序**。",
            "`data/weeks/weeks/*.xml` —— 每个周一个文件。",
            "没有 txt 时会自动扫描 XML 目录。"
          ]
        },
        {
          "h": "一周的 XML 结构"
        },
        {
          "p": "非常短，就一个 `<week>` 加若干 `<song>`："
        },
        {
          "code": {
            "lang": "xml",
            "title": "data/weeks/weeks/week1.xml",
            "src": "<!DOCTYPE codename-engine-week>\n<week name=\"DADDY DEAREST\" chars=\"dad,bf,gf\" sprite=\"week1\">\n\t<song>Bopeebo</song>\n\t<song>Fresh</song>\n\t<song>Dadbattle</song>\n</week>"
          }
        },
        {
          "kv": [
            [
              "`name`",
              "周标题（显示在顶部）"
            ],
            [
              "`chars`",
              "周角色，逗号分隔，最多 3 个，对应 `data/weeks/characters/<名字>.xml`"
            ],
            [
              "`sprite`",
              "周图标名（`menus/storymenu/weeks/<sprite>`）"
            ],
            [
              "`bgColor`",
              "可选，背景色调"
            ],
            [
              "`<song>`",
              "歌曲文件夹名（不是 displayName）"
            ]
          ]
        }
      ],
      "deep": [
        {
          "h": "周角色与普通角色的区别"
        },
        {
          "p": "`data/weeks/characters/` 里的 XML 和 `data/characters/` 结构一样，但**只用于故事模式展示**：它们只会播 `idle` / `danceLeft` / `danceRight` / `confirm` 这几种动画，不需要 sing 动画。所以周角色可以做得比游戏角色轻很多。"
        },
        {
          "h": "为什么我的周不显示"
        },
        {
          "ul": [
            "`weeks.txt` 里写了但 XML 不存在 → 跳过。",
            "XML 里 `<song>` 的名字和 `songs/` 下的文件夹名不一致 → 那一首会加载失败。",
            "周的 `chars` 指向的角色 XML 不存在 → 周角色为空，但周本身还在。",
            "`modpack.ini` 的 `[Flags]` 把周列表模式改成了 override，导致你的周被盖掉。"
          ]
        },
        {
          "h": "`StoryMenuState` 的字段全表"
        },
        {
          "table": {
            "head": [
              "字段",
              "类型",
              "说明"
            ],
            "rows": [
              [
                "`weeks`",
                "`Array<WeekData>`",
                "所有周（按 `weeks.txt` 排序）"
              ],
              [
                "`weekList`",
                "`StoryWeeklist`",
                "周的来源管理（原版/mod 合并）"
              ],
              [
                "`curWeek` / `curDifficulty`",
                "`Int`",
                "当前选中的周 / 难度下标"
              ],
              [
                "`canSelect`",
                "`Bool`",
                "能不能左右切换（进歌时会被锁）"
              ],
              [
                "`lockdown`",
                "`Bool`",
                "锁定后禁止返回（打完这一周前出不去）"
              ],
              [
                "`weekSprites`",
                "`FlxTypedGroup<MenuItem>`",
                "右侧的周列表"
              ],
              [
                "`characterSprites`",
                "`FlxTypedGroup<FunkinSprite>`",
                "中间站着的周角色"
              ],
              [
                "`characters`",
                "`Map<String, WeekCharacter>`",
                "周角色名 → 配置"
              ],
              [
                "`tracklist` / `weekTitle` / `scoreText`",
                "`FlxText`",
                "右侧三块文字"
              ],
              [
                "`intendedScore` / `lerpScore`",
                "`Float`",
                "本周分数（会滚动到目标值）"
              ],
              [
                "`difficultySprites`",
                "`Map<String, FlxSprite>`",
                "难度小图标"
              ],
              [
                "`scoreMessage`",
                "`String`",
                "`WEEK SCORE:{0}` 这种模板"
              ]
            ]
          }
        },
        {
          "h": "一个周由哪些文件组成"
        },
        {
          "code": {
            "lang": "ini",
            "title": "data/weeks/",
            "src": "weeks.txt                      ← 周的顺序（一行一个文件名）\nweeks/week1.xml                ← 周定义：名字、歌曲、角色、难度图\ncharacters/week1.xml           ← 周列表里站着的那排角色\n# 图片：\nimages/menus/storymenu/weeks/<name>.png\nimages/menus/storymenu/difficulties/<难度>.png"
          }
        },
        {
          "kv": [
            [
              "`weeks.txt` 决定什么",
              "顺序 + 哪些周会出现（不在里面的不显示）"
            ],
            [
              "周难度从哪来",
              "每个 `<song>` 的 `difficulties` 合并"
            ],
            [
              "难度锁",
              "没有对应谱面的难度不会出现"
            ],
            [
              "分数从哪读",
              "`FunkinSave.getWeekHighscore(name, diff)`，打过的周会显示分数"
            ]
          ]
        },
        {
          "h": "故事模式里的「强制」行为"
        },
        {
          "ul": [
            "**`lockdown`**：进第一首之后就不能切周、不能回菜单，直到整周打完。想做「一周连续挑战」就开它。",
            "**结算累加**：`PlayState.campaignScore` / `campaignMisses` 跨歌曲累计（第 29 节有字段表）。",
            "**完成后回菜单**：整周打完会回 `StoryMenuState` 并刷新分数。"
          ]
        },
        {
          "code": {
            "lang": "haxe",
            "title": "用脚本改周列表 / 加一周",
            "src": "// 在 StoryMenuState 的状态脚本里\nfunction postCreate() {\n\t// 例：把第二周的显示名改掉\n\tif (weeks.length > 1)\n\t\tweeks[1].name = \"我的特制周\";\n\n\t// 例：默认选中第三周\n\t// curWeek = 2;\n}\n\n// 换周时的钩子\nfunction onChangeWeek(old:Int, cur:Int) {\n\ttrace(\"从第 \" + old + \" 周切到第 \" + cur + \" 周\");\n}"
          }
        }
      ]
    },
    {
      "id": "pause-menu",
      "num": "10",
      "title": "暂停菜单",
      "en": "PAUSE MENU",
      "tags": [
        "PauseSubState",
        "Gitaroo",
        "选项"
      ],
      "simple": [
        {
          "p": "打歌时按 `ESC` 出的是**暂停菜单**，默认六个选项：继续、重开、换难度、练习模式、设置、回菜单。"
        },
        {
          "p": "**这个菜单也是脚本画出来的**（不是写死的界面）。它由 `data/scripts/` 里一个暂停脚本生成，你可以整个换掉 —— 换成你自己风格的暂停界面，甚至做个带立绘的。"
        },
        {
          "p": "暂停的时候游戏**还在内存里**，只是不再更新画面逻辑。所以暂停脚本里可以放心读当前歌曲信息、角色状态。"
        },
        {
          "p": "有个 10% 概率触发的「Gitaroo」彩蛋暂停画面。测试时嫌烦的话，把 `Flags.GITAROO_CHANCE` 设成 0。"
        }
      ],
      "core": [
        {
          "h": "选项说明"
        },
        {
          "table": {
            "head": [
              "选项",
              "作用"
            ],
            "rows": [
              [
                "Resume",
                "继续打歌"
              ],
              [
                "Restart Song",
                "重开本曲（带过渡动画）"
              ],
              [
                "Change Controls",
                "直接打开键位设置子界面"
              ],
              [
                "Change Options",
                "直接打开设置，返回后回到游戏"
              ],
              [
                "Exit to menu",
                "回到自由游玩或故事模式（看你是从哪进来的）"
              ],
              [
                "Exit to charter",
                "回到谱面编辑器（仅在编辑器内试玩时出现）"
              ]
            ]
          }
        },
        {
          "p": "右上角会显示：曲名、难度、`Blue balled: N`（这首歌死了几次）、以及当前是不是 Co-op / Opponent 模式。"
        },
        {
          "h": "触发条件"
        },
        {
          "ul": [
            "必须已经过了倒计时（`startedCountdown`），且 `canPause` 为真。",
            "脚本可以监听 `onGamePause`（PauseGameEvent）来禁止暂停或改动选项。",
            "`excludeList` 可以让某些场景（比如过场）不弹暂停菜单。"
          ]
        },
        {
          "callout": {
            "kind": "info",
            "title": "关于 Gitaroo",
            "text": "概率来自 `Flags.GITAROO_CHANCE`，默认 `0.1`（10%）。代码注释里写的是 1/1000，但实际生效的是 10% —— 这种注释与实现不一致的情况在引擎里不算罕见，以代码为准。"
          }
        }
      ],
      "deep": [
        {
          "h": "暂停脚本能改什么"
        },
        {
          "p": "暂停界面本身也是可脚本化的（`PauseSubState.script`，默认指向 `data/scripts/` 下的暂停脚本）。脚本里能拿到 `PauseCreationEvent`，它的字段允许你："
        },
        {
          "ul": [
            "替换 `music`（暂停时放的音乐）。",
            "改写 `options` 数组 —— 也就是**整个菜单项列表**，可以加自己的项。",
            "`cancel()` 掉默认 UI，完全自己画。"
          ]
        },
        {
          "p": "确认选项时会派发 `onSelectOption`（NameEvent），你可以在里面拦下自定义项。切换选中项时派发 `onChangeItem`。"
        },
        {
          "p": "顺带说一句：退出到谱面编辑器这条路径在「编辑器里试玩」时特别有用 —— 改完谱直接暂停跳回去，不用退出重进。"
        },
        {
          "h": "暂停菜单其实是「一个脚本」"
        },
        {
          "p": "`PauseSubState` 有个静态字段 `script`，默认值来自 `Flags.DEFAULT_PAUSE_SCRIPT`。**暂停菜单的每一项、每个按钮，都是这个脚本建出来的** —— 你可以整个换掉。"
        },
        {
          "code": {
            "lang": "ini",
            "title": "换掉整份暂停菜单",
            "src": "# 在 flags.ini 或 modpack.ini 里\n[Flags]\nDEFAULT_PAUSE_SCRIPT=\"my-pause\"\n\n# 然后把脚本放这：\n# data/scripts/my-pause.hx"
          }
        },
        {
          "h": "`PauseSubState` 会给脚本发这些回调"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`postCreate()`",
                "菜单建好之后"
              ],
              [
                "`update(elapsed)`",
                "每帧"
              ],
              [
                "`onChangeItem(event)`",
                "上下切换选项"
              ],
              [
                "`onSelectOption(event)`",
                "按下确认"
              ],
              [
                "`destroy()`",
                "关闭时"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "最小自定义暂停脚本",
            "src": "var items:Array<String> = [];\nvar curSelected:Int = 0;\nvar grp:FlxTypedGroup<Alphabet>;\n\nfunction postCreate() {\n\t// 注意：所有元素都要加到这个 substate 上\n\tvar bg = new FlxSprite().makeGraphic(FlxG.width, FlxG.height, 0x99000000);\n\tbg.scrollFactor.set();\n\tadd(bg);\n\n\titems = [\"继续\", \"重开\", \"回主菜单\"];\n\t// ……建按钮、定位、加进 grp ……\n}\n\nfunction update(elapsed:Float) {\n\tif (FlxG.keys.justPressed.UP)   changeItem(-1);\n\tif (FlxG.keys.justPressed.DOWN) changeItem(1);\n}\n\nfunction onChangeItem(e) {\n\t// e.value 是新下标\n}\n\nfunction onSelectOption(e) {\n\t// 这里自己决定「选中某项要干嘛」\n}"
          }
        },
        {
          "h": "默认暂停菜单的 6 项"
        },
        {
          "p": "默认脚本提供：**Resume / Restart Song / Change Difficulty / Toggle Practice Mode / Options / Exit to menu**。这些名字和顺序来自 `Flags.DEFAULT_PAUSE_ITEMS`（第 42 节）。"
        },
        {
          "h": "三个常见的暂停玩法"
        },
        {
          "table": {
            "head": [
              "玩法",
              "怎么做"
            ],
            "rows": [
              [
                "暂停时不可重开",
                "关掉 Restart 那项，或在 `onSelectOption` 里拦截"
              ],
              [
                "暂停时播 BGM",
                "在 `postCreate` 里 `FlxG.sound.playMusic(...)`，`destroy` 里停"
              ],
              [
                "暂停时显示谱面信息",
                "读 `PlayState.SONG.meta` 画到屏幕上"
              ],
              [
                "双人暂停不暂停对手",
                "不要 `pause()` 整个 PlayState，只冻结玩家侧"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "Gitaroo 彩蛋",
            "text": "有个低概率触发的「Gitaroo」暂停画面（`Flags.GITAROO_CHANCE`，默认 0.1）。测试时把它设 0 就不会突然冒出来。"
          }
        },
        {
          "h": "暂停期间还在跑什么"
        },
        {
          "p": "暂停是「叠了一个子状态」，**`PlayState` 本身还在**：它的 `update` 不跑，但音频对象、相机、你已经建好的 Sprite 都还在内存里。所以暂停脚本里可以放心读 `PlayState.instance` 的字段。"
        }
      ]
    },
    {
      "id": "settings",
      "num": "11",
      "title": "设置界面：每一项都讲透",
      "en": "OPTIONS / SETTINGS",
      "tags": [
        "Options",
        "设置",
        "全部选项"
      ],
      "simple": [
        {
          "p": "设置界面分成几页（用左右箭头或上下翻），大致是：**画面、音量、控制、游戏、外观、杂项**。下面说最该动的几个。"
        },
        {
          "p": "**下滚（Downscroll）**：音符从下往上还是从上往下掉。第一次玩建议试一下，很多人换了下滚瞬间准了。"
        },
        {
          "p": "**音画偏移（Offset）**：你按得准但老出 Good，就是这个值不对。正数表示「判定往后推」，单位毫秒。调法：打一首熟悉的歌，看命中偏差是偏早还是偏晚，每次 ±10 试。"
        },
        {
          "p": "**音量**：分主音量、音乐、音效三个。只想安静写谱就把音乐调小、音效保留。"
        },
        {
          "p": "**帧率**：默认 120。低配机器调到 60 更稳；高刷屏可以拉到 240，但注意 240 下每帧只有 4 毫秒预算。"
        },
        {
          "p": "**低内存模式 / 流式音频**：老电脑或机械硬盘建议都打开，能显著减少卡顿。"
        },
        {
          "callout": {
            "kind": "tip",
            "title": "改完记得退出设置页",
            "text": "设置是在你**离开设置界面**时才真正存盘的，直接在设置里强退会丢。"
          }
        }
      ],
      "core": [
        {
          "h": "① 控制 / Controls"
        },
        {
          "p": "给 P1 和 P2 分别改键，分成几组：**音符键（4 个）**、**界面键（9 个）**、**音量键（3 个）**、**引擎键（2 个）**，开发者模式再多 **开发者键（4 个）**。"
        },
        {
          "table": {
            "head": [
              "分组",
              "包含"
            ],
            "rows": [
              [
                "Notes",
                "左 / 下 / 上 / 右 四个音符键"
              ],
              [
                "UI",
                "左 / 下 / 上 / 右 / 确认 / 返回 / 重置 / 暂停 / 切换模式"
              ],
              [
                "Volume",
                "音量+ / 音量- / 静音"
              ],
              [
                "Engine",
                "切换 Mod / FPS 计数器"
              ],
              [
                "Developer（仅开发者模式）",
                "开发者菜单 / 控制台 / 重载状态 / 检查器"
              ]
            ]
          }
        },
        {
          "p": "按下确认键进入改键状态，再按任意键绑定；一个功能可以绑多个键。手柄按键（十字键、摇杆、A/B/START/Y）也在同一套系统里。"
        },
        {
          "h": "② 游玩 / Gameplay"
        },
        {
          "table": {
            "head": [
              "中文名",
              "英文/ID",
              "作用与效果"
            ],
            "rows": [
              [
                "下滚",
                "Downscroll",
                "谱面从上往下落（默认从下往上）。很多人打惯了 Psych 会开这个。"
              ],
              [
                "幽灵点击",
                "Ghost Tapping",
                "空按不算 Miss。关了之后，没音符时乱按会掉血掉连击。"
              ],
              [
                "居中轨道",
                "Centered Fields",
                "把四条轨道挪到屏幕中间，而不是左右分开（部分 mod 依赖这个）。"
              ],
              [
                "暴露内容",
                "Naughtyness",
                "允许「不雅」内容（血腥/擦边演出）。关掉后相关素材会被跳过。"
              ],
              [
                "节拍缩放",
                "Camera Zoom on Beat",
                "每拍镜头轻微推拉。关了画面更稳，但少了节奏感。"
              ],
              [
                "失焦暂停",
                "Auto Pause",
                "切出窗口自动暂停。多显示器/边聊边玩建议开。"
              ],
              [
                "歌曲偏移",
                "Song Offset",
                "音画同步校准，单位毫秒，范围 -999~999。判定偏早就调负，偏晚调正。"
              ],
              [
                "音乐音量",
                "Music Volume",
                "主音乐音量（0~1）。"
              ],
              [
                "音效音量",
                "SFX Volume",
                "按键音、菜单音等音效音量。"
              ]
            ]
          }
        },
        {
          "p": "**高级（Advanced）** 里还有两项："
        },
        {
          "kv": [
            [
              "Streamed Music",
              "音乐流式加载（边读边放），省内存；极少数机器上会有轻微延迟。"
            ],
            [
              "Streamed Vocals",
              "人声同样流式加载。开着更省内存。"
            ]
          ]
        },
        {
          "h": "③ 外观 / Appearance"
        },
        {
          "table": {
            "head": [
              "中文名",
              "ID",
              "作用与效果"
            ],
            "rows": [
              [
                "帧率上限",
                "Framerate",
                "30 ~ 240。拉到最大会显示「Unlimited」。默认 120。帧率越高越吃显卡。"
              ],
              [
                "FPS 计数器",
                "FPS Counter",
                "开启后屏幕上显示帧率与内存；按 F3 可切换详细程度。"
              ],
              [
                "菜单闪烁",
                "Flashing Menu",
                "主菜单背景的粉色遮罩闪烁。光敏性癫痫患者建议关闭。"
              ],
              [
                "彩色血条",
                "Colored Health Bar",
                "血条颜色跟随当前人物图标的主色，而不是固定红绿。"
              ],
              [
                "第六周像素完美",
                "Week 6 Pixel Perfect",
                "像素周用整数缩放，像素不糊、不撕裂。"
              ],
              [
                "Discord 状态",
                "Discord RPC",
                "在 Discord 里显示「正在玩 Codename Engine / 当前歌曲」。"
              ],
              [
                "画质",
                "Quality",
                "低 / 高 / 自定义。低 = 关抗锯齿 + 低内存 + 关游戏内着色器。"
              ],
              [
                "抗锯齿",
                "Antialiasing",
                "抗锯齿开关；像素风建议关。"
              ],
              [
                "低内存模式",
                "Low Memory Mode",
                "只加载舞台 XML 里 `low-memory` 分组的元素，显著省内存。"
              ],
              [
                "游戏内着色器",
                "Gameplay Shaders",
                "允许打歌时启用着色器特效（色差、暗角等）。关掉能明显提性能。"
              ],
              [
                "仅 GPU 位图",
                "GPU Only Bitmaps",
                "位图只留显存、不留内存副本。省内存，但部分机器会花屏（mac/web 默认关闭）。"
              ]
            ]
          }
        },
        {
          "p": "开了 FPS 计数器后，会多出一个 **FPS 高级** 子菜单，可以分别开关五类信息：Conductor（拍点/BPM）、Flixel（对象数/相机数）、System（CPU/GPU/内存）、Assets（资源库树）、Stats（绘制调用）。"
        },
        {
          "h": "④ 语言 / Language"
        },
        {
          "p": "列出 `assets/languages/` 下所有可用语言，选中立即生效。语言包只翻译界面文字，不影响 mod 自带文本。"
        },
        {
          "h": "⑤ 杂项 / Miscellaneous"
        },
        {
          "table": {
            "head": [
              "中文名",
              "ID",
              "作用与效果"
            ],
            "rows": [
              [
                "开发者模式",
                "Developer Mode",
                "**总开关**。开了才有：编辑器、控制台、检查器、Debug 设置、开发者改键。"
              ],
              [
                "模组配置警告",
                "Allow Config Warning",
                "mod 的 `modpack.ini` 缺失或 API 过旧时是否弹提示。"
              ],
              [
                "测试版更新",
                "Beta Updates",
                "自动更新时是否接受 beta 通道。"
              ],
              [
                "检查更新",
                "Check for Updates",
                "手动查一次更新，有新版会直接进更新界面。"
              ],
              [
                "重置存档",
                "Reset Save Data",
                "清空分数与设置存档。**不可撤销**，慎点。"
              ]
            ]
          }
        },
        {
          "h": "⑥ Debug（仅开发者模式可见）"
        },
        {
          "table": {
            "head": [
              "选项",
              "作用"
            ],
            "rows": [
              [
                "Show Console",
                "打开 Windows 原生控制台窗口（看日志）"
              ],
              [
                "Use Native Console",
                "用原生控制台替代内置 ImGui 控制台"
              ],
              [
                "Resizable Editors",
                "允许编辑器窗口缩放"
              ],
              [
                "Bypass Editor Resize",
                "跳过编辑器的最小尺寸限制"
              ],
              [
                "Editor SFX",
                "编辑器里的按钮/操作音效"
              ],
              [
                "Charter Pretty Print",
                "保存谱面 JSON 时格式化缩进"
              ],
              [
                "Character Pretty Print",
                "保存人物 XML 时格式化缩进"
              ],
              [
                "Stage Pretty Print",
                "保存舞台 XML 时格式化缩进"
              ],
              [
                "Swap Event Sides",
                "编辑器里把事件栏放到另一侧"
              ],
              [
                "Intensive Blur",
                "编辑器弹窗用高质量模糊（关掉更快）"
              ],
              [
                "Charter Auto Saves",
                "谱面编辑器自动保存总开关"
              ],
              [
                "Charter Auto Save Time",
                "自动保存间隔（60~600 秒）"
              ],
              [
                "Charter Auto Save Warning Time",
                "自动保存倒计时提示时长（0~15 秒）"
              ],
              [
                "Charter Auto Saves Separate Folder",
                "自动保存写到 `autosaves/` 而不是覆盖原文件"
              ],
              [
                "Song Offset Affect Editors",
                "编辑器里是否也应用歌曲偏移"
              ],
              [
                "Legacy Mod Menu Names",
                "Mod 菜单只显示文件夹名"
              ],
              [
                "Legacy Memory Counter",
                "内存计数器用旧样式（GC 峰值）"
              ],
              [
                "ImGui Multi Viewport",
                "允许 ImGui 窗口拖出主窗口"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "调参顺序建议",
            "text": "卡顿 → 先关「游戏内着色器」，再开「低内存模式」，最后才降帧率。判定不准 → 只调 `Song Offset`，别去动帧率。"
          }
        }
      ],
      "deep": [
        {
          "h": "设置是怎么存的"
        },
        {
          "p": "设置存在 `Options` 这个类里，编译时由宏 `OptionsMacro` 自动生成存档读写代码，运行时绑到 `FlxSave`。存档路径由 `project.xml` 的 `SAVE_OPTIONS_PATH` / `SAVE_OPTIONS_NAME` 决定（默认 `CodenameEngine/options`），在系统的应用数据目录下，不在游戏目录里。"
        },
        {
          "p": "所以：**删游戏目录不会重置设置**。要重置，要么用「重置存档」，要么手动去 `%APPDATA%` 之类的地方删。"
        },
        {
          "h": "改设置的三种方式"
        },
        {
          "ul": [
            "图形界面：设置菜单（推荐）。",
            "脚本：直接改 `Options.xxx = true`，然后 `Options.save()`。注意有些选项需要 `Options.applySettings()` 才生效。",
            "配置文件：`flags.ini` / `modpack.ini` 的 `[Flags]` 段 —— 但那是**引擎级 Flag**，和玩家设置是两套东西，别混。"
          ]
        },
        {
          "h": "几个容易误解的选项"
        },
        {
          "ul": [
            "`Quality = Custom` 不是「更好的画质」，而是「不再被预设覆盖，三个子开关自己说了算」。",
            "`GPU Only Bitmaps` **不是**越开越快：它省内存，但某些驱动上会让图片变黑。",
            "`Streamed Music` 关掉会更稳但更吃内存 —— 低配机器反而应该**开**着。",
            "`Ghost Tapping` 关掉之后，很多人会突然发现自己「其实一直在乱按」。"
          ]
        },
        {
          "h": "设置项的完整字段表（`Options` 里全部 86 个非按键字段）"
        },
        {
          "p": "界面上的每一项背后都是 `Options` 的一个静态字段，改它等于改设置。下面是**按功能分组**的全表（默认值取自源码）。"
        },
        {
          "h4": "画面 / 显示"
        },
        {
          "table": {
            "head": [
              "字段",
              "默认",
              "含义"
            ],
            "rows": [
              [
                "`naughtyness`",
                "`true`",
                "主菜单「彩蛋」开关"
              ],
              [
                "`downscroll`",
                "`false`",
                "下滚"
              ],
              [
                "`centeredFields`",
                "`false`",
                "按居中方式排轨道（对应 Flag `ALLOW_CENTERED_FIELDS`）"
              ],
              [
                "`flashingMenu`",
                "`true`",
                "主菜单闪烁动画"
              ],
              [
                "`camZoomOnBeat`",
                "`true`",
                "跟拍镜头缩放"
              ],
              [
                "`antialiasing`",
                "`true`",
                "全局抗锯齿"
              ],
              [
                "`week6PixelPerfect`",
                "`true`",
                "Week 6 像素完美渲染"
              ],
              [
                "`colorHealthBar`",
                "`true`",
                "血条变色（按角色主色）"
              ],
              [
                "`intensiveBlur`",
                "`true`",
                "高质量模糊（关掉更省 GPU）"
              ],
              [
                "`quality`",
                "`1`",
                "画质档位（影响纹理过滤等）"
              ],
              [
                "`gpuOnlyBitmaps`",
                "`true`（mac/web 为 false）",
                "位图只留显存"
              ],
              [
                "`lowMemoryMode`",
                "`false`",
                "低内存模式（只加载 `low-memory` 分组的舞台元素）"
              ],
              [
                "`splashesEnabled`",
                "`true`",
                "打击溅射特效"
              ],
              [
                "`gameplayShaders`",
                "`true`",
                "游戏内 shader"
              ]
            ]
          }
        },
        {
          "h4": "FPS 计数器（6 个子开关）"
        },
        {
          "table": {
            "head": [
              "字段",
              "默认",
              "含义"
            ],
            "rows": [
              [
                "`fpsCounter`",
                "`true`",
                "F3 面板总开关"
              ],
              [
                "`fpsCounterConductor`",
                "`true`",
                "显示节拍信息"
              ],
              [
                "`fpsCounterFlixel`",
                "`true`",
                "显示 Flixel 状态"
              ],
              [
                "`fpsCounterSystem`",
                "`true`",
                "显示系统信息"
              ],
              [
                "`fpsCounterAssets`",
                "`true`",
                "显示资源统计"
              ],
              [
                "`fpsCounterStats`",
                "`true`",
                "显示 `totalDC` 等渲染统计（**做性能优化就看这个**）"
              ]
            ]
          }
        },
        {
          "h4": "系统 / 运行时"
        },
        {
          "table": {
            "head": [
              "字段",
              "默认",
              "含义"
            ],
            "rows": [
              [
                "`autoPause`",
                "`true`",
                "失焦自动暂停"
              ],
              [
                "`discordRPC`",
                "`true`",
                "Discord 状态"
              ],
              [
                "`betaUpdates`",
                "`false`",
                "接收测试版更新"
              ],
              [
                "`allowConfigWarning`",
                "`true`",
                "显示 mod 配置警告页"
              ],
              [
                "`useNativeConsole`",
                "`false`",
                "用 Windows 原生控制台而不是游戏内控制台"
              ],
              [
                "`imguiMultiViewport`",
                "`true`（linux 为 false）",
                "ImGui 多视口"
              ],
              [
                "`framerate`",
                "`120`",
                "帧率上限"
              ],
              [
                "`devMode`",
                "`false`",
                "开发者模式（开关一堆隐藏界面）"
              ],
              [
                "`legacyMemoryCounter`",
                "`false`",
                "旧版内存计数器"
              ],
              [
                "`legacyModMenuNames`",
                "`false`",
                "Mod 菜单用旧命名"
              ],
              [
                "`lastLoadedMod`",
                "`null`",
                "上次加载的 mod（启动时自动选）"
              ],
              [
                "`disabledAddons`",
                "`[]`",
                "被禁用的 addons 列表"
              ]
            ]
          }
        },
        {
          "h4": "音频"
        },
        {
          "table": {
            "head": [
              "字段",
              "默认",
              "含义"
            ],
            "rows": [
              [
                "`volume`",
                "`1`",
                "主音量"
              ],
              [
                "`volumeMusic`",
                "`1`",
                "音乐音量"
              ],
              [
                "`volumeSFX`",
                "`1`",
                "音效音量"
              ],
              [
                "`streamedMusic`",
                "`true`",
                "音乐流式加载（低配应开）"
              ],
              [
                "`streamedVocals`",
                "`true`",
                "人声流式加载"
              ],
              [
                "`songOffset`",
                "`0`",
                "打歌偏移（毫秒）"
              ],
              [
                "`songOffsetAffectEditors`",
                "`false`",
                "偏移是否也作用于编辑器"
              ]
            ]
          }
        },
        {
          "h4": "编辑器（`editor*` / `charter*`）"
        },
        {
          "table": {
            "head": [
              "字段",
              "默认",
              "含义"
            ],
            "rows": [
              [
                "`editorSFX`",
                "`true`",
                "编辑器音效"
              ],
              [
                "`editorsResizable`",
                "`true`",
                "编辑器窗口可缩放"
              ],
              [
                "`bypassEditorsResize`",
                "`false`",
                "强制允许缩放"
              ],
              [
                "`maxUndos`",
                "`120`",
                "撤销栈上限"
              ],
              [
                "`editorCharterPrettyPrint`",
                "`false`",
                "谱面 JSON 美化输出"
              ],
              [
                "`editorCharacterPrettyPrint`",
                "`true`",
                "人物 XML 美化输出"
              ],
              [
                "`editorStagePrettyPrint`",
                "`true`",
                "舞台 XML 美化输出"
              ],
              [
                "`charterSwapEventSides`",
                "`false`",
                "事件轨道左右互换"
              ],
              [
                "`charterMetronomeEnabled`",
                "`false`",
                "节拍器"
              ],
              [
                "`charterShowSections`",
                "`true`",
                "显示小节分隔线"
              ],
              [
                "`charterShowBeats`",
                "`true`",
                "显示拍分隔线"
              ],
              [
                "`charterShowCameraHighlights`",
                "`true`",
                "显示相机事件高亮"
              ],
              [
                "`charterEnablePlaytestScripts`",
                "`true`",
                "试玩时也跑脚本"
              ],
              [
                "`charterRainbowWaveforms`",
                "`false`",
                "彩虹波形"
              ],
              [
                "`charterLowDetailWaveforms`",
                "`false`",
                "低精度波形"
              ],
              [
                "`charterAutoSaves`",
                "`true`",
                "自动保存"
              ],
              [
                "`charterAutoSaveTime`",
                "`300`",
                "自动保存间隔（秒）"
              ],
              [
                "`charterAutoSaveWarningTime`",
                "`5`",
                "保存前提示秒数"
              ],
              [
                "`charterAutoSavesSeparateFolder`",
                "`false`",
                "存到独立目录"
              ],
              [
                "`charterPauseQuant`",
                "`false`",
                "暂停时按拍对齐"
              ],
              [
                "`characterHitbox` / `characterCamera` / `characterAxis`",
                "`true`",
                "人物编辑器里的三个显示开关"
              ],
              [
                "`characterDragging`",
                "`true`",
                "允许鼠标拖动偏移"
              ],
              [
                "`playAnimOnOffset`",
                "`false`",
                "调偏移时自动播动画"
              ],
              [
                "`stageSelected`",
                "`null`",
                "上次打开的舞台"
              ]
            ]
          }
        },
        {
          "h4": "控制台过滤器（13 个）"
        },
        {
          "p": "`F2` 控制台里每个过滤按钮对应一个字段，默认全 `true`（都显示）："
        },
        {
          "code": {
            "lang": "haxe",
            "src": "consoleTimeFilter      consoleTypeFilter\nconsoleInfoFilter      consoleWarningFilter\nconsoleErrorFilter     consoleTraceFilter\nconsoleVerboseFilter   consoleCommandsFilter\nconsoleClassFilter     consoleFunctionFilter\nconsoleBasicTypesFilter consoleObjectsFilter\nconsoleScriptsFilter\n\n// 另有\nconsoleCountDuplicatedOutput  // 重复日志合并计数，默认 true"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "怎么用这张表",
            "text": "想让玩家默认就关掉某个效果？在你的 mod 里 `Options.xxx = false;`（记得 `Options.save()`）。**别直接改源码里的默认值** —— 那是给所有人改的。"
          }
        }
      ]
    },
    {
      "id": "dev-mode",
      "num": "12",
      "title": "开发者模式：和普通模式差在哪",
      "en": "DEVELOPER MODE",
      "tags": [
        "devMode",
        "编辑器",
        "控制台",
        "差异清单"
      ],
      "simple": [
        {
          "p": "开发者模式是**一整套权限**，不是单个开关。打开之后你会多出：`F2` 控制台、`F3` 帧率面板、`F4` 场景检查器、`F5` 重载，以及编辑器入口。"
        },
        {
          "p": "**怎么开**：设置里找 `Developer Mode` 打开。**还有一个隐藏入口**：在主菜单按 `7`（`DEV_ACCESS` 键），能直接进「编辑器选择器」—— 这个只看 `DISABLE_EDITORS`，不看 devMode。"
        },
        {
          "p": "**`F4` 检查器最有用**：打歌时按 `F4`，点画面里任何东西，右侧会列出它的全部字段（位置、缩放、透明度、当前动画）。改数字画面立刻变 —— 调位置就靠它，调好了抄回 XML。"
        },
        {
          "p": "**发布 mod 时**：想彻底关掉编辑器，必须在 `flags.ini` 写 `DISABLE_EDITORS=true`，只关 devMode 是关不干净的。"
        },
        {
          "p": "`trace()` 的输出不受 devMode 影响，永远打到控制台/终端。想在发布版里静音，用 `#if debug` 包起来。"
        }
      ],
      "core": [
        {
          "h": "一句话总结"
        },
        {
          "p": "开发者模式 = 解锁 **4 个调试按键 + 1 个设置分类 + 1 组改键项 + 编辑器入口 + 控制台 + 检查器**。打歌体验本身完全不变。"
        },
        {
          "h": "差异清单（逐条）"
        },
        {
          "table": {
            "head": [
              "#",
              "差异",
              "非开发者模式",
              "开发者模式"
            ],
            "rows": [
              [
                "1",
                "`7` 键",
                "只有音效 + 连按三次的提示文字",
                "打开编辑器选择器（EditorPicker）"
              ],
              [
                "2",
                "`F2` 控制台",
                "完全无响应",
                "打开/关闭 ImGui 控制台"
              ],
              [
                "3",
                "`F4` 检查器",
                "完全无响应",
                "对象树 + 属性编辑 + 3D Gizmo"
              ],
              [
                "4",
                "`F5` 重载",
                "完全无响应",
                "重载当前 State（`Shift+F5` 重载全局脚本）"
              ],
              [
                "5",
                "设置界面",
                "5 个分类",
                "多一个 **Debug** 分类"
              ],
              [
                "6",
                "改键界面",
                "4 个分组",
                "多一个 **Developer** 分组（4 个键）"
              ],
              [
                "7",
                "打歌中按 `7`",
                "无反应",
                "跳回谱面编辑器继续改谱"
              ],
              [
                "8",
                "启动时",
                "不检查 mod 配置",
                "检查 `modpack.ini` / API 版本，必要时弹警告"
              ],
              [
                "9",
                "控制台命令",
                "—",
                "20+ 条内置命令（见下一节）"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "dev",
            "title": "注意",
            "text": "**F3（帧率）不是开发者功能**。只要你开了「FPS 计数器」，F3 就能用，不需要开发者模式。"
          }
        },
        {
          "h": "什么时候该开"
        },
        {
          "ul": [
            "做谱面、做人物、做舞台 —— 必开。",
            "写脚本调试 —— 必开，不然看日志得去翻文件。",
            "只是玩 mod —— 不用开。开着反而会多出警告弹窗。",
            "录视频/截图 —— 建议关掉，免得 F3 的字幕入镜。"
          ]
        },
        {
          "h": "编辑器入口长什么样"
        },
        {
          "p": "按 `7` 之后是一屏竖直的大色条，从上到下大致是：**Chart Editor（谱面）**、**Character Editor（人物）**、**Stage Editor（舞台）**、**Alphabet Editor（字体）**、**Wiki（官网）**，debug 构建还会多一个 **UI Debug**。滚轮或上下键选，确认进入。"
        }
      ],
      "deep": [
        {
          "h": "为什么非开发者模式按 7 没反应"
        },
        {
          "p": "这四个按键在 `Controls` 里标了 `@:devModeOnly`，编译时宏会把它们的 getter 改写成 `return Options.devMode && 按键检测`。也就是说**根本没进检测逻辑**，不是「检测到但不处理」。所以改键界面里也看不到它们。"
        },
        {
          "h": "F5 与 Shift+F5 的区别"
        },
        {
          "ul": [
            "`F5`：`FlxG.resetState()` —— 当前状态整个重建，脚本重新加载。改完脚本按这个。",
            "`Shift+F5`：只重载**全局脚本**（`data/globals/` 与 mod 的 `global.hx`），不动当前状态。改全局钩子时用。"
          ]
        },
        {
          "p": "顺带一提：F5 在**编辑器里**曾经会破坏编辑器状态，这一版已经修了；但在编辑器里重载仍然要小心未保存的改动。"
        },
        {
          "h": "开发者模式到底开了什么"
        },
        {
          "p": "`Options.devMode` 一旦为 `true`，下面这些会**同时**解锁。它不是「一个设置」，是一整套权限。"
        },
        {
          "table": {
            "head": [
              "解锁的东西",
              "怎么触发",
              "受 devMode 控制",
              "它到底能干什么"
            ],
            "rows": [
              [
                "游戏内控制台",
                "`F2`",
                "是",
                "看日志、敲命令、直接执行 HScript 代码"
              ],
              [
                "帧率/统计面板",
                "`F3`",
                "是",
                "见本节正文"
              ],
              [
                "舞台检查器（点选对象）",
                "`F4`",
                "是",
                "见本节正文"
              ],
              [
                "重载当前界面",
                "`F5`",
                "是",
                "改完脚本/XML 不用退游戏，一条命令重来"
              ],
              [
                "重载全部脚本",
                "`Shift+F5`",
                "是",
                "连 global.hx 一起重载，改全局逻辑时用"
              ],
              [
                "UI 调试器",
                "`7`（游戏内）",
                "是",
                "列出界面元素的坐标与层级，排查布局问题"
              ],
              [
                "编辑器**菜单入口**",
                "主菜单里的 Edit",
                "是",
                "见本节正文"
              ],
              [
                "开发者按键分类（4 个）",
                "设置 → 控制",
                "是",
                "见本节正文"
              ]
            ]
          }
        },
        {
          "h": "但编辑器还有一条**独立**入口（很多人不知道）"
        },
        {
          "p": "在主菜单按 `DEV_ACCESS`（默认键 **`7`**），会直接打开 `EditorPicker` —— 这个判断**只看 `canAccessDebugMenus`，不看 `devMode`**："
        },
        {
          "code": {
            "lang": "haxe",
            "title": "MainMenuState 里的真实判断",
            "src": "if (canAccessDebugMenus) {\n\tif (controls.DEV_ACCESS) {\n\t\tpersistentUpdate = false;\n\t\tpersistentDraw = true;\n\t\topenSubState(new funkin.editors.EditorPicker());\n\t}\n}\n\n// canAccessDebugMenus 的默认值：\n// public var canAccessDebugMenus:Bool = !Flags.DISABLE_EDITORS;"
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "所以「关 devMode」≠「没编辑器」",
            "text": "想让玩家绝对进不去编辑器，**必须** `DISABLE_EDITORS=true`（第 42 节）。只关 `devMode` 只是藏了菜单入口，按 `7` 照样开。"
          }
        },
        {
          "code": {
            "lang": "ini",
            "title": "发行时到底该关什么",
            "src": "[Flags]\n# 真正关掉编辑器（连按 7 也进不去）\nDISABLE_EDITORS=true\n\n# 关掉启动警告页（想留就删掉这行）\nDISABLE_WARNING_SCREEN=true\n\n# 关掉语言选择（做单语言版本时）\nDISABLE_LANGUAGES=true"
          }
        },
        {
          "h": "用脚本判断「我该不该显示调试信息」"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "if (Options.devMode) {\n\t// 只有开发者模式才画这些\n\tadd(new FlxText(10, 10, 0, \"DEBUG: notes=\" + PlayState.instance.notes.length, 12));\n}"
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "`trace` 不受 devMode 影响",
            "text": "`trace` 永远输出到 stdout（终端/控制台缓冲区），devMode 只决定**游戏内控制台**看不看得见。要完全静默就用 `#if debug` 包起来。"
          }
        }
      ]
    },
    {
      "id": "console-and-fps",
      "num": "13",
      "title": "控制台、检查器与帧率面板",
      "en": "CONSOLE / INSPECTOR / FPS",
      "tags": [
        "ConsoleUI",
        "F2",
        "F4",
        "F3",
        "调试"
      ],
      "simple": [
        {
          "p": "**`F2` 是游戏内控制台**：上面滚日志、下面敲命令。日志会标颜色：白=普通、黄=警告、红=错误。**找 bug 先看最后一条红色**。"
        },
        {
          "p": "控制台里能敲引擎命令（比如 `loadSong bopeebo hard` 直接进歌），也能敲 **HScript 代码**（比如 `PlayState.instance.health = 2` 直接改血量）。它先找命令，找不到就当代码执行，很好用。"
        },
        {
          "p": "**`F3` 是帧率面板**：FPS、内存、对象数、以及 `totalDC`（绘制调用次数）。**优化就看 totalDC**：几百算正常，上千就要查是不是散图太多。"
        },
        {
          "p": "面板的每一块都能单独关（设置里有 6 个子开关），嫌挡视线就只留 FPS。"
        },
        {
          "p": "日志里如果出现 `文件名:行号`，那个行号是**脚本自己的行号**，不是引擎的，直接去对应 `.hx` 找即可。"
        }
      ],
      "core": [
        {
          "h": "控制台（F2）"
        },
        {
          "p": "底部弹出一个可输入的面板。你输入的东西会先当**命令**找，找不到就**当 HScript 代码执行**并把结果打出来。所以它既是命令行，也是一个即时求值的 REPL。"
        },
        {
          "ul": [
            "`Tab` 补全、`↑` `↓` 翻历史。",
            "输出可以按类型过滤（Info / Warning / Error / Trace / Verbose）和按内容搜索。",
            "可以一键复制日志、清屏、改配色。",
            "输入的对象可以是命令、类名、函数名、脚本变量 —— 补全列表会跟着变。"
          ]
        },
        {
          "h": "内置命令（20 条）"
        },
        {
          "table": {
            "head": [
              "命令",
              "参数",
              "作用"
            ],
            "rows": [
              [
                "`help`",
                "[对象]",
                "列出所有命令，或列出某个对象的字段"
              ],
              [
                "`clear`",
                "—",
                "清空控制台输出"
              ],
              [
                "`pause`",
                "—",
                "手动切换暂停"
              ],
              [
                "`loadSong`",
                "[歌] [难度] [变体] [对手] [双人]",
                "直接进某首歌"
              ],
              [
                "`endSong`",
                "—",
                "立刻结束当前歌曲"
              ],
              [
                "`loadWeek`",
                "[周名] [难度]",
                "直接进某个周"
              ],
              [
                "`switchMod`",
                "[名字]",
                "切换 mod"
              ],
              [
                "`reloadMod`",
                "—",
                "重载当前 mod"
              ],
              [
                "`reloadState`",
                "—",
                "重载当前界面"
              ],
              [
                "`goToPlayState`",
                "—",
                "跳到打歌界面"
              ],
              [
                "`goToMainMenu`",
                "—",
                "回主菜单"
              ],
              [
                "`goToStoryMode`",
                "—",
                "去故事模式"
              ],
              [
                "`goToFreeplay`",
                "—",
                "去自由游玩"
              ],
              [
                "`goToOptions`",
                "—",
                "去设置"
              ],
              [
                "`goToCredits`",
                "—",
                "去制作名单"
              ],
              [
                "`goToTitle`",
                "[reset]",
                "回标题界面"
              ],
              [
                "`goToModState`",
                "[名字]",
                "跳到某个软编码 State"
              ],
              [
                "`goToCharter`",
                "[歌] [难度] [变体]",
                "打开谱面编辑器"
              ],
              [
                "`goToCharacterEditor`",
                "[人物名]",
                "打开人物编辑器"
              ],
              [
                "`goToStageEditor`",
                "[舞台名]",
                "打开舞台编辑器"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "最常用的两条",
            "text": "`loadSong bopeebo hard` —— 改完谱一键试听；`goToCharter` —— 打歌时发现问题立刻回去改。"
          }
        },
        {
          "h": "检查器（F4）"
        },
        {
          "p": "左侧是**对象树**：当前 State → 子对象 → 子对象的子对象。点一个对象，右侧列出它的**所有属性**，可以直接改数值、切枚举、拖滑条，改动立刻反映到画面上。"
        },
        {
          "ul": [
            "支持 FlxSprite / FlxGroup / 角色 / 舞台元素，也支持 3D 对象（foxlite 的 `FoxObject`）。",
            "3D 对象会画出包围盒和 Gizmo，方便你对位置。",
            "改坏了？`F5` 重载状态即可复原（除非你保存了）。"
          ]
        },
        {
          "h": "帧率面板（F3）"
        },
        {
          "table": {
            "head": [
              "区块",
              "内容"
            ],
            "rows": [
              [
                "FPS",
                "实时帧率 + 最近 15 帧的最低值（`/1%`）"
              ],
              [
                "MEM",
                "内存占用（GC 用量 / 进程工作集）"
              ],
              [
                "Conductor",
                "歌曲位置、拍、步、小节、BPM、拍号"
              ],
              [
                "Flixel",
                "当前 State 名、对象数、相机数、位图数、声音数"
              ],
              [
                "System",
                "系统、CPU、GPU、显存、内存、GC 状态"
              ],
              [
                "Assets",
                "所有已加载的资源库（含来源 mod 与前缀）"
              ],
              [
                "Stats",
                "绘制调用数（totalDC / stageDC / stage3DDC）"
              ]
            ]
          }
        },
        {
          "p": "按 `F3` 在「隐藏 → 简易 → 详细」之间循环。详细模式下文字可以被选中复制 —— 报 bug 时很有用。"
        }
      ],
      "deep": [
        {
          "h": "控制台的求值环境"
        },
        {
          "p": "它内置了一个 HScript 解释器，并且预置了脚本层能用的所有全局名字（`FlxG`、`PlayState`、`Options`、`Conductor`、`Paths`、`Flags`、`CoolUtil`…），外加当前所有脚本的变量表和 `Script.staticVariables`。"
        },
        {
          "p": "所以你可以直接在控制台里试代码："
        },
        {
          "code": {
            "lang": "haxe",
            "title": "在控制台里直接执行",
            "src": "PlayState.instance.health = 2\nPlayState.instance.songScore += 50000\ntrace(PlayState.instance.curSong)\nConductor.bpm = 200"
          }
        },
        {
          "p": "切换状态时控制台变量会被重置，这是刻意的 —— 避免拿到已经销毁的对象。"
        },
        {
          "h": "检查器的边界"
        },
        {
          "p": "检查器只能改**已存在的对象**的属性，不能凭空造对象（那是脚本的事）。另外它显示的是运行时对象，所以脚本里 `new` 出来但没 `add` 的东西是找不到的。"
        },
        {
          "h": "控制台命令：从注册到执行"
        },
        {
          "p": "`ConsoleCommandManager` 只有 5 个方法，但它是 mod 扩展控制台的唯一入口。"
        },
        {
          "table": {
            "head": [
              "方法",
              "作用"
            ],
            "rows": [
              [
                "`registerCommand(cmd)`",
                "注册一条命令（切 mod 时自动注销）"
              ],
              [
                "`unregisterCommand(cmd)`",
                "手动注销"
              ],
              [
                "`getCommand(name)`",
                "按名字取命令对象"
              ],
              [
                "`tryExecute(line)`",
                "执行一行（返回 `Bool`：找没找到并执行）"
              ],
              [
                "`unregisterModdedCommands()`",
                "清掉所有来自 mod 的命令"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "注册一条自己的命令",
            "src": "import funkin.backend.system.console.ConsoleCommandManager;\n\n// 命令对象需要 name / description / 执行回调\n// 具体字段以 ConsoleCommandManager 里的命令类型为准\n\nfunction onConsoleReady() {\n\t// 大多数情况你不需要自己注册，直接在脚本里写函数\n\t// 然后在控制台敲函数名反而更快\n}\n\n// 更省事的做法：控制台本身支持直接执行 HScript\n// 敲 myFunc(\"abc\") 就能调你脚本里的函数"
          }
        },
        {
          "h": "控制台里的三个面板"
        },
        {
          "table": {
            "head": [
              "面板",
              "作用"
            ],
            "rows": [
              [
                "日志区",
                "按级别过滤的日志流（13 个过滤开关，见第 11 节）"
              ],
              [
                "输入区",
                "敲命令或 HScript，`↑`/`↓` 翻历史"
              ],
              [
                "检查器",
                "按 `F4` 打开，能点选场景里的对象看/改属性"
              ]
            ]
          }
        },
        {
          "h": "`F3` 面板到底显示了什么"
        },
        {
          "p": "`F3` 的内容由 `Options` 里 6 个开关控制（第 11 节有全表），每一块对应一个来源："
        },
        {
          "table": {
            "head": [
              "开关",
              "显示内容"
            ],
            "rows": [
              [
                "`fpsCounter`",
                "总开关（关掉下面全没）"
              ],
              [
                "`fpsCounterConductor`",
                "当前 BPM / 拍 / step / 歌曲位置"
              ],
              [
                "`fpsCounterFlixel`",
                "Flixel 状态名、对象数、更新/绘制耗时"
              ],
              [
                "`fpsCounterSystem`",
                "系统内存、平台"
              ],
              [
                "`fpsCounterAssets`",
                "已加载资源数量"
              ],
              [
                "`fpsCounterStats`",
                "**`totalDC` / `stageDC`（绘制调用）** —— 做性能优化只看这个"
              ]
            ]
          }
        },
        {
          "h": "检查器（`F4`）的正确用法"
        },
        {
          "ol": [
            "打歌时按 `F4`，进入点选模式。",
            "点场景里任意一个 Sprite → 右侧列出它的全部字段（`x` `y` `scale` `alpha` `shader`…）。",
            "改一个值，画面**立刻**跟着变 —— 这是最快的「调数值」方式。",
            "调好了把数值抄回 XML/脚本，**别指望它保存**。"
          ]
        },
        {
          "callout": {
            "kind": "tip",
            "title": "改不动的字段",
            "text": "检查器改的是运行时对象，所以像 `animation.curAnim.name` 这种「会被 `update` 每帧覆盖」的字段，改完下一帧就被冲掉了。要持久改，得改 XML 或在脚本里每帧设。"
          }
        }
      ]
    },
    {
      "id": "editors",
      "num": "14",
      "title": "编辑界面：三套编辑器能做什么",
      "en": "THE EDITORS",
      "tags": [
        "Charter",
        "Character",
        "Stage",
        "Alphabet",
        "特效"
      ],
      "simple": [
        {
          "p": "引擎自带四个编辑器，都在主菜单的编辑入口里（或按 `7`）：**谱面编辑器**、**人物编辑器**、**舞台编辑器**、**字体（Alphabet）编辑器**。"
        },
        {
          "p": "**谱面编辑器**最常用：左边是时间轴，中间是音符网格，上面是菜单。放音符点左键，拖长按，`Enter` 直接试玩，`Space` 播放/暂停，`A`/`D` 前后跳小节。"
        },
        {
          "p": "**人物编辑器**：调每张动画的偏移、看命中框、切动画。左边方向键微调 1px，`Shift+方向键` 5px，`Ctrl+R` 清零。"
        },
        {
          "p": "**舞台编辑器**：拖元素、改层级、看镜头范围。存盘时按列表顺序写 XML，所以**列表顺序 = 图层顺序**。"
        },
        {
          "p": "**四个编辑器都要求 mod 是文件夹形式**。如果 mod 是 zip，编辑器写不进去，会提示 `Compressed Library Detected`。"
        },
        {
          "p": "所有编辑器都有自动保存（默认 5 分钟一次），存在 `autosaves/` 下，不会覆盖你手动存的文件。"
        }
      ],
      "core": [
        {
          "h": "通用界面"
        },
        {
          "p": "所有编辑器共用一套 UI 组件：顶栏菜单、可折叠窗口、下拉框、滑条、数值框、色轮、文件浏览器、右键菜单、通知条。弹窗出现时背景会自动加模糊（`Intensive Blur` 可关）。"
        },
        {
          "p": "**撤销/重做**是统一的：`Ctrl+Z` / `Ctrl+Y`，默认最多 120 步。有未保存改动时窗口标题会带 `*`，关闭时会拦你。"
        },
        {
          "h": "① 谱面编辑器 Charter"
        },
        {
          "p": "这是最复杂的一个，顶栏有 8 个菜单：**File / Edit / Chart / View / Song / Note / Snap / Playback**。"
        },
        {
          "table": {
            "head": [
              "能做",
              "说明"
            ],
            "rows": [
              [
                "放音符",
                "左键点击网格；`Shift` 点击不吸附"
              ],
              [
                "长按音符（Sustain）",
                "拖拽拉长；`E` 加长、`Q` 缩短"
              ],
              [
                "框选 / 多选",
                "拖拽超过 20px 进入框选，`Shift`/`Ctrl` 加减选"
              ],
              [
                "复制拖动",
                "`Alt` + 拖动"
              ],
              [
                "涂擦删除",
                "右键拖动"
              ],
              [
                "Note Types",
                "`0`~`9` 切换音效类型，类型本身可编辑"
              ],
              [
                "事件",
                "同一步可以叠多个事件，参数按类型自动生成控件"
              ],
              [
                "书签",
                "打标记，一键跳转"
              ],
              [
                "难度创建",
                "在编辑器里直接新建难度"
              ],
              [
                "变体创建",
                "基于当前歌派生一个变体"
              ],
              [
                "播放变速",
                "0.25x ~ 2x，同时改音高"
              ],
              [
                "自动保存",
                "默认每 5 分钟，可配置"
              ],
              [
                "试玩",
                "`Enter` 从头、`Shift+Enter` 从当前位置"
              ]
            ]
          }
        },
        {
          "p": "常用快捷键："
        },
        {
          "table": {
            "head": [
              "操作",
              "按键"
            ],
            "rows": [
              [
                "保存全部",
                "`Ctrl+S`"
              ],
              [
                "撤销 / 重做",
                "`Ctrl+Z` / `Ctrl+Y`"
              ],
              [
                "播放 / 暂停",
                "`Space`"
              ],
              [
                "前后一小节",
                "`A` / `D`"
              ],
              [
                "前后一步",
                "`W` / `S`"
              ],
              [
                "吸附加 / 减",
                "`X` / `Z`"
              ],
              [
                "缩放",
                "`Ctrl` + 滚轮"
              ],
              [
                "从头到尾",
                "`Home` / `End`"
              ],
              [
                "加相机事件（对手）",
                "`O`"
              ],
              [
                "加相机事件（玩家）",
                "`P`"
              ],
              [
                "试玩",
                "`Enter` / `Shift+Enter`"
              ]
            ]
          }
        },
        {
          "h": "② 人物编辑器 Character Editor"
        },
        {
          "ul": [
            "**动画列表**：每个动画一张卡片，可拖动排序；卡片上有名字、动画前缀、偏移、帧率、循环、标签、帧序列。",
            "**偏移调整**：方向键 1px、`Shift`+方向键 5px、`Ctrl+R` 清零；也可以直接拖角色。",
            "**Ghost 叠影**：把别的动画半透明叠上来，方便对位（做 sing 动画神器）。",
            "**Gizmo**：显示判定框和相机中心十字。",
            "**属性面板**：全局偏移、缩放、翻转、抗锯齿、相机偏移、图标、图标主色、sing 持续时间。",
            "**创建向导**：给名字 + 拖进图片，自动按动画名猜 `singLEFT/RIGHT/UP/DOWN` / `idle`，生成 XML。"
          ]
        },
        {
          "h": "③ 舞台编辑器 Stage Editor"
        },
        {
          "ul": [
            "**四类元素**：精灵（sprite）、色块（solid/box）、角色（dad/gf/bf/char）、未知节点（保留原始 XML 用）。",
            "**变换手柄**：8 个缩放手柄、中心移动、旋转圆环、四边斜切。",
            "**属性**：坐标、滚动因子、缩放、角度、缩放因子、斜切、透明度、混合模式、动画类型、内存分组。",
            "**直接改 XML**：`Shift` + 点击元素可以直接编辑它的原始 XML。",
            "**层级**：右侧列表的顺序就是绘制顺序，也就是写回 XML 的节点顺序。"
          ]
        },
        {
          "h": "④ Alphabet 编辑器"
        },
        {
          "p": "编辑 `data/alphabet/*.xml`：为每个字符指定由哪些「组件」拼成（组件 = 一段动画 + 偏移 + 缩放 + 旋转 + 翻转）。适合做那种一个字由多个贴图拼出来的花体标题。"
        },
        {
          "h": "这些编辑器能做出的「特效」"
        },
        {
          "table": {
            "head": [
              "效果",
              "在哪做",
              "怎么配"
            ],
            "rows": [
              [
                "视差滚动背景",
                "舞台",
                "给不同 sprite 不同的 `scroll` 值"
              ],
              [
                "跟随节拍弹跳的元素",
                "舞台",
                "`type=\"beat\"` + `beatInterval`"
              ],
              [
                "多图层叠加/透明",
                "舞台",
                "`alpha` / `blend`"
              ],
              [
                "倾斜/旋转的物件",
                "舞台",
                "`angle` / `skewx` / `skewy`"
              ],
              [
                "镜头推拉节奏",
                "谱面事件",
                "Camera Zoom / Camera Bop"
              ],
              [
                "瞬间白闪/色闪",
                "谱面事件",
                "Camera Flash"
              ],
              [
                "镜头横扫",
                "谱面事件",
                "Camera Movement"
              ],
              [
                "变速段",
                "谱面事件",
                "BPM Change / Continuous BPM Change"
              ],
              [
                "谱面流速变化",
                "谱面事件",
                "Scroll Speed Change"
              ],
              [
                "角色换姿势",
                "谱面事件",
                "Play Animation / Alt Animation Toggle"
              ]
            ]
          }
        },
        {
          "gallery": [
            {
              "src": "assets/img/charter-events-1.png",
              "cap": "谱面编辑器的事件系统设计稿（仓库 art/design ideas 目录）"
            },
            {
              "src": "assets/img/charter-events-2.png",
              "cap": "事件条与参数面板的早期设计稿"
            }
          ]
        }
      ],
      "deep": [
        {
          "h": "谱面编辑器里那些「别的引擎没有」的"
        },
        {
          "ul": [
            "**同一步叠多个事件**：原版一个时间点只能挂一个事件，这里可以堆叠，做「同时闪 + 推镜 + 变速」不用挤时间点。",
            "**多声道 vocals**：每个 strumline 可以有自己的 vocals 后缀，做对唱/合唱不用拆歌。",
            "**strumline 自定义**：角色列表、类型（对手/玩家/额外）、舞台位置、缩放、间距、HUD 坐标、可见性、按键数量（1~1000）、独立或继承流速 —— 等于内置了「多轨」支持。",
            "**播放变速不改谱**：变速只是播放速度，时间轴上的音符位置不变，所以可以慢速精修。",
            "**自动保存到独立目录**：`autosaves/hard_10-23_18-40.json` 这种命名，不会覆盖你手动的存档。"
          ]
        },
        {
          "h": "编辑器写文件写到哪"
        },
        {
          "p": "编辑器直接写 `assets/` 或当前 mod 下对应目录。如果 mod 是 **zip 包**，写不进去 —— 启动时会弹「Compressed Library Detected!」提示。想用编辑器，mod 必须是**文件夹**形式。"
        },
        {
          "h": "几个坑"
        },
        {
          "ul": [
            "人物编辑器里改 `defaultAimFPS` 会**同步改掉所有帧率等于旧默认值的动画**，这是设计如此，不是 bug。",
            "舞台编辑器保存时按列表顺序写节点，所以**调整列表顺序 = 调整图层顺序**，别乱拖。",
            "Alphabet 编辑器的撤销/重做在这一版还没做完（菜单项是灰的），改之前先备份 XML。",
            "所有编辑器都假设你开着开发者模式；关掉之后已打开的编辑器不会自动关，但下次进不来。"
          ]
        },
        {
          "h": "⑧ 谱面编辑器：全部菜单快捷键（源码逐条抽出）"
        },
        {
          "p": "下面三张表是从 `Charter.hx` 的 `topMenu` 定义里逐条抽出来的，**不是回忆**。带 `—` 的是只能点菜单、没有快捷键的项。"
        },
        {
          "h4": "File / Edit / Chart"
        },
        {
          "table": {
            "head": [
              "菜单",
              "项",
              "快捷键"
            ],
            "rows": [
              [
                "File",
                "Save",
                "`Ctrl+S`"
              ],
              [
                "File",
                "Save As...",
                "`Ctrl+Shift+S`"
              ],
              [
                "File",
                "Save Global Events",
                "`Ctrl+B+S`"
              ],
              [
                "File",
                "Save Global Events As...",
                "—"
              ],
              [
                "File",
                "Save Chart without Local Events",
                "`Ctrl+Alt+S`"
              ],
              [
                "File",
                "Save Chart without Local Events As...",
                "—"
              ],
              [
                "File",
                "Save Meta",
                "`Ctrl+M+S`"
              ],
              [
                "File",
                "Save Meta As...",
                "—"
              ],
              [
                "File",
                "Export For FNF Legacy...",
                "—"
              ],
              [
                "File",
                "Export For Psych Engine...",
                "—"
              ],
              [
                "File",
                "Exit",
                "—"
              ],
              [
                "Edit",
                "Undo",
                "`Ctrl+Z`"
              ],
              [
                "Edit",
                "Redo",
                "`Ctrl+Y` 或 `Ctrl+Shift+Z`"
              ],
              [
                "Edit",
                "Copy",
                "`Ctrl+C`"
              ],
              [
                "Edit",
                "Paste",
                "`Ctrl+V`"
              ],
              [
                "Edit",
                "Cut",
                "`Ctrl+X`"
              ],
              [
                "Edit",
                "Delete",
                "`Del`"
              ],
              [
                "Edit",
                "Delete Stacked Notes",
                "`Shift+Del`"
              ],
              [
                "Chart",
                "Playtest",
                "`Enter`"
              ],
              [
                "Chart",
                "Playtest here",
                "`Shift+Enter`"
              ],
              [
                "Chart",
                "Playtest as opponent",
                "`Ctrl+Enter`"
              ],
              [
                "Chart",
                "Playtest as opponent here",
                "`Ctrl+Shift+Enter`"
              ],
              [
                "Chart",
                "Enable scripts during playtesting",
                "—"
              ],
              [
                "Chart",
                "Edit chart data",
                "—"
              ],
              [
                "Chart",
                "Edit metadata information",
                "—"
              ]
            ]
          }
        },
        {
          "h4": "View / Playback"
        },
        {
          "table": {
            "head": [
              "菜单",
              "项",
              "快捷键"
            ],
            "rows": [
              [
                "View",
                "Zoom in",
                "`Ctrl+小键盘 +`"
              ],
              [
                "View",
                "Zoom out",
                "`Ctrl+小键盘 -`"
              ],
              [
                "View",
                "Reset Zoom",
                "`Ctrl+小键盘 0`"
              ],
              [
                "View",
                "Show Sections Separator",
                "—（开关）"
              ],
              [
                "View",
                "Show Beats Separator",
                "—（开关）"
              ],
              [
                "View",
                "Show Camera Highlights",
                "—（开关）"
              ],
              [
                "View",
                "Rainbow Waveforms",
                "—（开关）"
              ],
              [
                "View",
                "Low Detail Waveforms",
                "—（开关）"
              ],
              [
                "View",
                "Scroll Left",
                "`Shift+←`"
              ],
              [
                "View",
                "Scroll Right",
                "`Shift+→`"
              ],
              [
                "View",
                "Reset Scroll",
                "`Shift+↓`"
              ],
              [
                "Playback",
                "Play/Pause",
                "`Space`"
              ],
              [
                "Playback",
                "Align time to grid",
                "—"
              ],
              [
                "Playback",
                "Reset Speed",
                "—"
              ],
              [
                "Playback",
                "Go back a section",
                "`A`"
              ],
              [
                "Playback",
                "Go forward a section",
                "`D`"
              ],
              [
                "Playback",
                "Go to start of section",
                "`Shift+S`"
              ],
              [
                "Playback",
                "Go back a step",
                "`W`"
              ],
              [
                "Playback",
                "Go forward a step",
                "`S`"
              ],
              [
                "Playback",
                "Metronome",
                "—（开关）"
              ]
            ]
          }
        },
        {
          "h4": "Song / Note / Snap（动态菜单）与鼠标操作"
        },
        {
          "p": "这三个菜单的内容是动态生成的（歌曲列表、音符类型列表、吸附档位），所以没有写死在 `topMenu` 里。以下是这些环节里**写在输入处理中**的按键与鼠标操作："
        },
        {
          "table": {
            "head": [
              "操作",
              "按键 / 鼠标"
            ],
            "rows": [
              [
                "跳到开头 / 结尾",
                "`Home` / `End`"
              ],
              [
                "加对手相机事件",
                "`O`（`Shift` = 不量化，`Alt` = 非全局）"
              ],
              [
                "加玩家相机事件",
                "`P`（同上）"
              ],
              [
                "拉长 / 缩短长按",
                "`E` / `Q`"
              ],
              [
                "切换音符类型",
                "`0`~`9` 与小键盘数字"
              ],
              [
                "全选 / 选小节 / 选整条轨道",
                "`Ctrl+A` / `Ctrl+Shift+A` / `Ctrl+Shift+L`"
              ],
              [
                "吸附档位 + / -",
                "`X` / `Z`"
              ],
              [
                "播放速度 +25% / -25%",
                "`.` / `,`"
              ],
              [
                "放置音符",
                "左键（`Shift` = 不吸附）"
              ],
              [
                "框选",
                "拖拽 > 20px（`Shift`/`Ctrl` 加减选）"
              ],
              [
                "复制拖动",
                "`Alt` + 拖动"
              ],
              [
                "涂擦删除",
                "右键拖动"
              ],
              [
                "右键点空白",
                "弹出 Edit 菜单"
              ],
              [
                "上下滚动时间轴 / 缩放 / 侧滚",
                "滚轮 / `Ctrl`+滚轮 / `Shift`+滚轮"
              ],
              [
                "锁定 / 解锁轨道拖动",
                "`K`"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "说明",
            "text": "动态菜单里的键位来自键盘处理代码，不同版本可能微调。**菜单里能点到的项永远是最准的** —— 记不住就点菜单，旁边会标快捷键。"
          }
        },
        {
          "h": "⑨ 人物编辑器：全部菜单快捷键"
        },
        {
          "table": {
            "head": [
              "菜单",
              "项",
              "快捷键"
            ],
            "rows": [
              [
                "File",
                "Save",
                "`Ctrl+S`"
              ],
              [
                "File",
                "Save As...",
                "`Ctrl+Shift+S`"
              ],
              [
                "File",
                "Exit",
                "—"
              ],
              [
                "Edit",
                "Copy Offset",
                "`Ctrl+C`"
              ],
              [
                "Edit",
                "Paste Offset",
                "`Ctrl+V`"
              ],
              [
                "Edit",
                "Undo",
                "`Ctrl+Z`"
              ],
              [
                "Edit",
                "Redo",
                "`Ctrl+Y` / `Ctrl+Shift+Z`"
              ],
              [
                "Edit",
                "Edit information",
                "—"
              ],
              [
                "Edit",
                "Edit sprite",
                "—"
              ],
              [
                "Offset",
                "Move Left / Up / Down / Right",
                "`←` `↑` `↓` `→`（1px）"
              ],
              [
                "Offset",
                "Move Extra Left / Up / Down / Right",
                "`Shift+方向键`（5px）"
              ],
              [
                "Offset",
                "Drag Offsets With Mouse?",
                "—（开关）"
              ],
              [
                "Offset",
                "Clear Offsets",
                "`Ctrl+R`"
              ],
              [
                "View",
                "Zoom in / out / Reset",
                "`Ctrl+小键盘 +/-/0`"
              ],
              [
                "View",
                "Character Hitbox?",
                "—（开关）"
              ],
              [
                "View",
                "Character Camera?",
                "—（开关）"
              ],
              [
                "View",
                "XY Axis?",
                "—（开关）"
              ],
              [
                "Animation",
                "Play Animation",
                "`Space`"
              ],
              [
                "Animation",
                "Stop Animation",
                "—"
              ],
              [
                "Animation",
                "Change Animation ↑ / ↓",
                "`W` / `S`"
              ]
            ]
          }
        },
        {
          "h": "⑩ 舞台编辑器：全部菜单快捷键"
        },
        {
          "table": {
            "head": [
              "菜单",
              "项",
              "快捷键"
            ],
            "rows": [
              [
                "File",
                "Save",
                "`Ctrl+S`"
              ],
              [
                "File",
                "Save As...",
                "`Ctrl+Shift+S`"
              ],
              [
                "File",
                "Exit",
                "—"
              ],
              [
                "Edit",
                "Undo",
                "`Ctrl+Z`"
              ],
              [
                "Edit",
                "Redo",
                "`Ctrl+Shift+Z`"
              ],
              [
                "Select",
                "Select All",
                "`Ctrl+A`"
              ],
              [
                "Select",
                "Deselect",
                "`Ctrl+D`"
              ],
              [
                "Select",
                "Inverse Selection",
                "`Ctrl+Shift+I`"
              ],
              [
                "View",
                "Zoom in / out / Reset",
                "`Ctrl+小键盘 +/-/0`"
              ],
              [
                "View",
                "Focus Dad / GF / BF",
                "（用工具栏按钮）"
              ],
              [
                "Editor",
                "新建 / 编辑 / 删除元素",
                "（工具栏按钮 / 点击元素）"
              ],
              [
                "—",
                "直接编辑某个元素的原始 XML",
                "`Shift` + 点击元素"
              ]
            ]
          }
        },
        {
          "h": "⑪ Alphabet 编辑器：能改哪些东西"
        },
        {
          "p": "它编辑的是 `data/alphabet/<字体名>.xml` —— 也就是「**一个字符由哪些贴图组件拼出来**」。菜单只有四组："
        },
        {
          "table": {
            "head": [
              "菜单",
              "项",
              "作用"
            ],
            "rows": [
              [
                "File",
                "Save / Save As / Exit",
                "存盘 / 另存 / 退出"
              ],
              [
                "Edit",
                "Undo / Redo",
                "撤销 / 重做（**这一版还是灰的**）"
              ],
              [
                "Edit",
                "Delete Current Glyph",
                "删掉当前字符"
              ],
              [
                "Edit",
                "Edit Main Data",
                "改全局参数：fps、advance、lineGap、forceCase、colorMode、三种 backup prefix"
              ],
              [
                "View",
                "Zoom in / out / Reset",
                "预览缩放"
              ],
              [
                "Tape",
                "Move Tape Left / Right",
                "中间那条「字带」左右切字符"
              ]
            ]
          }
        },
        {
          "ul": [
            "**三个按钮**：New Glyph（新建字符）/ Edit Glyph（改当前字符）/ Delete Glyph（删）。",
            "**组件（component）**：一个字符可以由多段动画叠出来，每段有 `anim` 前缀、`x/y`、`scaleX/Y`、`angle`、`flipX/Y`、`colorMode`、`outline` 引用。",
            "**微调**：选中组件后用 `I` `J` `K` `L` 挪位置（比拖鼠标准）。",
            "**colorMode** 三选一：`tint`（乘算，适合白字）、`offsets`（加算，适合黑字）、`none`。",
            "**底部会有红字 `Unable to find: xxx`**：说明某个组件在图集里找不到对应动画，逐条列出来。"
          ]
        }
      ]
    }
  ]
});
})();
