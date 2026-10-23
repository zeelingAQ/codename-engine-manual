/* ============================================================
   第二部分：引擎使用与界面说明
   ============================================================ */
(function () {
  if (!window.CNE) return;

  window.CNE.addPart({
    id: 'p2',
    name: '第二部分 · 用它',
    short: 'PART 02',
    color: 'var(--cyan)',
    sections: [

      /* ------------------------------------------------ 05 */
      {
        id: 'boot-and-map',
        num: '05',
        title: '启动与界面地图',
        en: 'BOOT & SCREEN MAP',
        tags: ['启动流程', '界面总览'],
        simple: [
          { p: "双击 exe，你会看到：预加载画面 →（可能有一次警告页）→ 标题界面 → 按 Enter → 主菜单。主菜单有四个选项：**故事模式 / 自由游玩 / 设置 / 制作名单**。" },
          { p: "游戏里按 `Enter` 是暂停，主菜单按 `TAB` 是切换 mod，这两点先记住，后面全是细节。" }
        ],
        core: [
          { h: '启动时会经过哪些界面' },
          {
            table: {
              head: ['顺序', '界面', '你会看到什么', '怎么过'],
              rows: [
                ['1', '预加载 / 启动画面', '引擎 LOGO、加载条', '自动'],
                ['2', '警告页 WarningState（可选）', '免责声明，红黄标记的重点句', '按确认键'],
                ['3', '模组配置警告（仅开发者模式）', 'modpack.ini 缺失或 API 过旧时弹出', '按提示修复或忽略'],
                ['4', '标题界面 TitleState', 'LOGO、GF、滚动作者名单、Press Enter', '按两次 Enter'],
                ['5', '主菜单 MainMenuState', '四个菜单项 + 背景', '方向键 + Enter'],
                ['6', '自由游玩 / 故事模式', '歌单或周目', 'Enter 进歌'],
                ['7', '打歌 PlayState', '谱面、血条、分数', '—']
              ]
            }
          },
          { callout: { kind: 'info', title: '为什么我从来没见过警告页', text: "因为 `Flags.DISABLE_WARNING_SCREEN` 默认为 `true`。想让它出现，在 `data/config/flags.ini` 里把它设成 `false`。" } },

          { h: '界面地图（记住这张图就不迷路）' },
          {
            ul: [
              "**标题界面** → 主菜单：唯一出口就是 Enter。",
              "**主菜单** → 故事 / 自由 / 设置 / 名单；`Backspace` 回标题；`TAB` 开 Mod 菜单。",
              "**自由游玩** → 选歌 → 选难度（左右键）→ Enter 开始。",
              "**故事模式** → 选周（上下）→ 选难度（左右）→ Enter 开始整周。",
              "**打歌中** → `Enter` 暂停 → Resume / Restart / Controls / Options / Exit。",
              "**任何界面** → `F3` 看帧数，`F2` 开控制台（需开发者模式），`7` 进编辑器（需开发者模式）。"
            ]
          },

          { h: '第一次进游戏建议做的事' },
          {
            ol: [
              "进 **设置 → 游玩**，把 `Song Offset` 调一下（戴耳机打歌的话这个很关键）。",
              "进 **设置 → 外观**，确认帧率不是 30（默认 120）。",
              "进 **设置 → 控制**，把按键改成你习惯的（默认 A S W D）。",
              "回主菜单，按 `TAB` 看一眼 Mod 菜单长什么样 —— 以后所有 mod 都从这儿切。"
            ]
          }
        ],
        deep: [
          { h: '启动细节' },
          { p: "`Main` 在 `preInit` 阶段做了几件容易被忽略的事：注册 DPI 感知（Windows 上 125%/150% 缩放不再糊）、解析命令行参数、**修正工作目录**（所以从快捷方式启动也能正确找到 assets）、初始化日志与崩溃处理器。" },
          { p: "随后 `MainState` 会清理 `.temp` 临时目录、保存一次设置、重置资源库列表，再依次加载：addons（按 `[LOW]` / `[HIGH]` 前缀决定优先级）→ 选中的 mod → `flags.ini` / `modpack.ini` → 存档 → 语言 → 全局脚本。**你看到的「加载中」大部分时间花在这里**。" },
          { p: "命令行还支持直接进游戏：`-song bopeebo -diff hard` 之类可以跳过菜单直接开打，做测试很方便。" }
        ]
      },

      /* ------------------------------------------------ 06 */
      {
        id: 'title-screen',
        num: '06',
        title: '标题界面',
        en: 'TITLE SCREEN',
        tags: ['TitleState', 'XML', '开场动画'],
        simple: [
          { p: "标题界面就是「Press Enter to Begin」那个画面。它其实**不是硬编码的**：LOGO、GF、跳动的作者名单，全部由 `assets/data/titlescreen/titlescreen.xml` 控制。" },
          { p: "想换成你自己的标题？改这个 XML + 换图片就行，不用写一行代码。" }
        ],
        core: [
          { h: '界面上有什么' },
          {
            ul: [
              "**LOGO**：`menus/titlescreen/logo`，会跟着节拍轻微缩放。",
              "**GF**：`menus/titlescreen/gf`，两段动画 `danceLeft` / `danceRight` 交替，每拍切一次。",
              "**作者名单 intro**：从第 1 拍开始，按 `titlescreen.xml` 里 `<text beat=\"n\">` 的时间轴逐行出现，共 16 拍。",
              "**随机吐槽**：`data/titlescreen/introText.txt` 里随机抽一行，按 `--` 分成两段填进名单的空位（就是原版那个「wacky」句子）。",
              "**Press Enter**：`menus/titlescreen/titleEnter`，两帧动画 `idle` / `press`。"
            ]
          },

          { h: '交互' },
          {
            ol: [
              "第一次按确认键：跳过 intro（白闪 + 清屏）。",
              "第二次按确认键：播放 press 动画 → 白闪 → 2 秒后进主菜单。",
              "如果开了自动更新检查，会先查一次更新，有新版就跳到更新界面。"
            ]
          },
          { callout: { kind: 'dev', title: '冷知识', text: "这一版的标题界面**没有** splash 文本（那种一闪而过的梗文字）。splash 在本引擎里指的是打歌时的「音符溅射」，别搞混。" } }
        ],
        deep: [
          { h: 'XML 里能配的东西' },
          { p: "`<titlestate>` 下有两个主要节点：`<sprites folder=\"...\">` 和 `<intro length=\"16\">`。" },
          {
            ul: [
              "`<sprites folder>`：指定贴图目录，里面的 `<sprite name sprite x y beatInterval>` 会生成 `FunkinSprite`，并注册到 `titleScreenSprites` 里（脚本能按 name 取到）。",
              "`<titleEnter sprite x y>`（可选）：替换默认的 Press Enter 贴图。",
              "`<intro length>`：intro 总拍数。",
              "`<text beat=\"n\">`：第 n 拍显示什么；里面可以放 `<line text=\"...\"/>` 多行文本、`<sprite path=\"...\" scale=\"...\"/>` 图片、`<introtext line=\"1|2\"/>` 引用随机吐槽的第几段。",
              "空的 `<text beat=\"n\"/>` 等于**清屏**。"
            ]
          },
          { p: "这些节点的样式（Skew 的字体、Alphabet 的动画）来自 `data/alphabet/*.xml`；如果某个标题字显示不出来，先去检查字体 XML 里有没有那个字符的 `<anim>`。" }
        ]
      },

      /* ------------------------------------------------ 07 */
      {
        id: 'main-menu',
        num: '07',
        title: '主菜单与 Mod 切换',
        en: 'MAIN MENU & MODS',
        tags: ['MainMenuState', 'ModSwitchMenu', 'menuItems'],
        simple: [
          { p: "主菜单默认四项：**story mode / freeplay / options / credits**。这个列表不是写死的 —— 它读的是 `assets/data/config/menuItems.txt`，你可以自己加行、删行、改顺序。" },
          { p: "按 `TAB` 打开 Mod 菜单：左边选 mod，`TAB` 再按一次切到 addons 分页，选完按确认键就会重载进那个 mod。" }
        ],
        core: [
          { h: '菜单项怎么来的' },
          { p: "`MainMenuState` 读取 `data/config/menuItems.txt`，一行一个菜单项，然后按名字去 `menus/mainmenu/<名字>` 找贴图（以及 `basic` / `white` 两套动画）。选中的项会变成白色高亮。" },
          { p: "名字同时决定跳转目标：`story mode` → 故事、`freeplay` → 自由、`options` → 设置、`credits` 或 `donate` → 制作名单。所以**自定义菜单项需要脚本配合**（用 `onSelectItem` 事件接管）。" },

          { h: '左下角那行字' },
          { p: "显示版本号 + 提交号 + `[TAB] Open Mods menu`。点它也能打开 Mod 菜单 —— 鼠标党福音。" },

          { h: 'Mod 切换菜单' },
          {
            ul: [
              "列表来自 `mods/` 下的**文件夹**和 **zip 包**，最后一项固定是「Disable Mods」（回到原版）。",
              "名称和描述取 `mods/<名字>/data/config/modpack.ini` 的 `[Common] NAME / DESCRIPTION`；没配置就显示文件夹名（开启 `legacyModMenuNames` 时总是显示文件夹名）。",
              "当前 mod 会绿色高亮 + 波浪文字效果。",
              "`TAB` 切到 **Addons** 分页：勾选/取消 `mods/addons/` 里的 addon，结果记在 `Options.disabledAddons`，下次选 mod 时生效。",
              "确认切换会重建 `MainState`，等于软重启。"
            ]
          },
          { callout: { kind: 'tip', title: '实用', text: "做 mod 时把 `modpack.ini` 的 `NAME` / `DESCRIPTION` 写好，测试时一眼就能认出哪个是你自己的 mod。" } },

          { h: '背景' },
          { p: "背景是 `menus/menuBG` + 一层 `menus/menuDesat` 粉色遮罩；开启 `flashingMenu` 时遮罩会闪烁。镜头会缓慢跟随当前选中项，所以视觉上菜单项是「浮动」的。" }
        ],
        deep: [
          { h: '开发者模式下的额外入口' },
          { p: "开了开发者模式后，在主菜单按 `7` 会打开 **编辑器选择器（EditorPicker）**：竖直排列的几个大色条，滚轮或上下键选择，确认后进入对应编辑器，另有一项是「Wiki」会直接开浏览器。" },
          { p: "没开开发者模式时按 `7`，只有音效、没有界面；**连按三次**才会在底部提示一句「You have to enable DEVELOPER MODE in the miscellaneous settings!」—— 这是官方故意藏的。", },
          { h: '脚本钩子' },
          {
            ul: [
              "`onChangeItem`（MenuChangeEvent）：切换选中项时触发，可以改动画/音效。",
              "`onSelectItem`（NameEvent）：确认选择时触发，**可以改名从而改变跳转目标**，也可以 Cancel 掉不让它跳。",
              "对应脚本路径：`data/states/MainMenuState.hx`（软编码 State 机制）。"
            ]
          }
        ]
      },

      /* ------------------------------------------------ 08 */
      {
        id: 'freeplay',
        num: '08',
        title: '自由游玩（Freeplay）',
        en: 'FREEPLAY',
        tags: ['FreeplayState', '歌单', '难度', '变体'],
        simple: [
          { p: "自由游玩就是选歌界面：上下选歌，**左右切难度**，Enter 开始。右上角显示你在这首歌的最高分。" },
          { p: "歌单来自 `assets/data/config/freeplaySonglist.txt`。如果这个文件不存在，引擎会自动扫描 `songs/` 文件夹。" }
        ],
        core: [
          { h: '歌单的三种来源' },
          {
            ol: [
              "`data/config/freeplaySonglist.txt` —— **优先**，一行一首歌，空行会在列表里变成间隔。",
              "`data/freeplaySonglist.txt` —— 旧路径，仍能用但会打警告。",
              "都没有 → 自动扫描 `songs/` 下所有子文件夹（排除 `charts` / `scripts` / `song` 这三个特殊子目录）。"
            ]
          },

          { h: '每首歌显示什么' },
          {
            ul: [
              "**歌名**：取 `meta.json` 的 `displayName`，用 `Alphabet` 字体（默认 `bold`）。",
              "**图标**：取 `meta.json` 的 `icon`，比如 `gf`。",
              "**背景色**：取 `meta.json` 的 `color`，界面背景会在切歌时渐变过去。",
              "**最高分**：按「歌 + 难度 + 模式」分开存，所以开 Co-op 的分数不会和单人混在一起。"
            ]
          },

          { h: '难度与变体（Variation）' },
          { p: "这是 Codename 比较特别的地方：难度不只有 easy/normal/hard，还可以有**变体**（variation）。变体是「同一首歌的另一套谱面/音频」，比如 `pico` 的 `erect` 版。界面上会显示成 `HARD (ERECT)` 这种形式。" },
          {
            ul: [
              "基础难度来自 `meta.json` 的 `difficulties` 数组。",
              "每个变体有自己的 `meta.json`，里面的难度会拼接在后面。",
              "切难度时引擎会记下 `freeplayLastSong / Difficulty / Variation`，下次进来还在原位。"
            ]
          },

          { h: '模式切换' },
          { p: "按 `CHANGE_MODE`（默认 `TAB`）循环切换 **Solo → Opponent → Co-op**。只有 `meta.json` 里 `opponentModeAllowed` / `coopAllowed` 为 `true` 时才能切。" },

          { h: '操作' },
          {
            table: {
              head: ['操作', '按键'],
              rows: [
                ['上下选歌', '↑ / ↓ 或鼠标悬停'],
                ['左右切难度', '← / →'],
                ['切换 Solo / Opponent / Co-op', 'TAB'],
                ['开始', 'Enter 或鼠标点击'],
                ['返回主菜单', 'Backspace 或鼠标右键']
              ]
            }
          },
          { callout: { kind: 'dev', title: '注意', text: "这一版**没有**字母搜索框，也**没有**按字母排序。列表顺序 = txt 里的顺序或目录扫描顺序。想要排序，就自己维护 `freeplaySonglist.txt`。" } }
        ],
        deep: [
          { h: '变体的文件组织' },
          { p: "变体在 `songs/<歌名>/` 下用一套并行结构表示：谱面放在 `charts/<变体>/<难度>.json`，音频可以放 `song/Inst-<变体>.ogg`。引擎在 `Paths.chart()` 里拼这个路径，所以命名必须对上。" },
          { h: '脚本钩子' },
          {
            ul: [
              "`onSongSelect`（FreeplaySongSelectEvent）：选歌时触发，可以改 `songName` / 难度，或 Cancel。",
              "`onAlphaUpdate`（FreeplayAlphaUpdateEvent）：列表滚动时逐项触发，可以做「越远越透明」之类的效果。",
              "`data/states/FreeplayState.hx` 可以整体接管这个界面。"
            ]
          }
        ]
      },

      /* ------------------------------------------------ 09 */
      {
        id: 'story-mode',
        num: '09',
        title: '故事模式',
        en: 'STORY MODE',
        tags: ['StoryMenuState', '周', 'weeks.txt'],
        simple: [
          { p: "故事模式就是原版那种「一周三首歌连着打」。上下选周、左右选难度、Enter 开始整周。" },
          { p: "周不是写死的，是 `assets/data/weeks/weeks/` 下的 XML。想加自己的一周，加一个 XML 就行。" }
        ],
        core: [
          { h: '界面上有什么' },
          {
            ul: [
              "顶部黑条：本周累计得分 `WEEK SCORE`。",
              "周标题 + 彩色背景（颜色来自周 XML 的 `bgColor`）。",
              "周图标：`menus/storymenu/weeks/<sprite>`，当前周会白/青色闪烁。",
              "左右箭头 + 难度图：`menus/storymenu/difficulties/<难度小写>`。",
              "`TRACKS` + 本周歌曲列表（取每首歌的 `displayName`）。",
              "最多三个周角色，会跟着节拍跳舞，选中周时播 `confirm` 动画。"
            ]
          },

          { h: '周的来源' },
          {
            ol: [
              "`data/weeks/weeks.txt` —— 一行一个周文件名，用来**排序**。",
              "`data/weeks/weeks/*.xml` —— 每个周一个文件。",
              "没有 txt 时会自动扫描 XML 目录。"
            ]
          },

          { h: '一周的 XML 结构' },
          { p: "非常短，就一个 `<week>` 加若干 `<song>`：" },
          { code: { lang: 'xml', title: 'data/weeks/weeks/week1.xml', src: '<!DOCTYPE codename-engine-week>\n<week name="DADDY DEAREST" chars="dad,bf,gf" sprite="week1">\n\t<song>Bopeebo</song>\n\t<song>Fresh</song>\n\t<song>Dadbattle</song>\n</week>' } },
          {
            kv: [
              ['`name`', '周标题（显示在顶部）'],
              ['`chars`', '周角色，逗号分隔，最多 3 个，对应 `data/weeks/characters/<名字>.xml`'],
              ['`sprite`', '周图标名（`menus/storymenu/weeks/<sprite>`）'],
              ['`bgColor`', '可选，背景色调'],
              ['`<song>`', '歌曲文件夹名（不是 displayName）']
            ]
          }
        ],
        deep: [
          { h: '周角色与普通角色的区别' },
          { p: "`data/weeks/characters/` 里的 XML 和 `data/characters/` 结构一样，但**只用于故事模式展示**：它们只会播 `idle` / `danceLeft` / `danceRight` / `confirm` 这几种动画，不需要 sing 动画。所以周角色可以做得比游戏角色轻很多。" },
          { h: '为什么我的周不显示' },
          {
            ul: [
              "`weeks.txt` 里写了但 XML 不存在 → 跳过。",
              "XML 里 `<song>` 的名字和 `songs/` 下的文件夹名不一致 → 那一首会加载失败。",
              "周的 `chars` 指向的角色 XML 不存在 → 周角色为空，但周本身还在。",
              "`modpack.ini` 的 `[Flags]` 把周列表模式改成了 override，导致你的周被盖掉。"
            ]
          }
        ]
      },

      /* ------------------------------------------------ 10 */
      {
        id: 'pause-menu',
        num: '10',
        title: '暂停菜单',
        en: 'PAUSE MENU',
        tags: ['PauseSubState', 'Gitaroo', '选项'],
        simple: [
          { p: "打歌时按 `Enter`（P1）或 `Esc`（P2）暂停。菜单有：继续、重开、改键位、设置、退出到菜单、退出到谱面编辑器。" },
          { p: "有 10% 概率会触发「Gitaroo 暂停」彩蛋 —— 背景音乐和按钮全变成另一套风格。" }
        ],
        core: [
          { h: '选项说明' },
          {
            table: {
              head: ['选项', '作用'],
              rows: [
                ['Resume', '继续打歌'],
                ['Restart Song', '重开本曲（带过渡动画）'],
                ['Change Controls', '直接打开键位设置子界面'],
                ['Change Options', '直接打开设置，返回后回到游戏'],
                ['Exit to menu', '回到自由游玩或故事模式（看你是从哪进来的）'],
                ['Exit to charter', '回到谱面编辑器（仅在编辑器内试玩时出现）']
              ]
            }
          },
          { p: "右上角会显示：曲名、难度、`Blue balled: N`（这首歌死了几次）、以及当前是不是 Co-op / Opponent 模式。" },

          { h: '触发条件' },
          {
            ul: [
              "必须已经过了倒计时（`startedCountdown`），且 `canPause` 为真。",
              "脚本可以监听 `onGamePause`（PauseGameEvent）来禁止暂停或改动选项。",
              "`excludeList` 可以让某些场景（比如过场）不弹暂停菜单。"
            ]
          },
          { callout: { kind: 'info', title: '关于 Gitaroo', text: "概率来自 `Flags.GITAROO_CHANCE`，默认 `0.1`（10%）。代码注释里写的是 1/1000，但实际生效的是 10% —— 这种注释与实现不一致的情况在引擎里不算罕见，以代码为准。" } }
        ],
        deep: [
          { h: '暂停脚本能改什么' },
          { p: "暂停界面本身也是可脚本化的（`PauseSubState.script`，默认指向 `data/scripts/` 下的暂停脚本）。脚本里能拿到 `PauseCreationEvent`，它的字段允许你：" },
          {
            ul: [
              "替换 `music`（暂停时放的音乐）。",
              "改写 `options` 数组 —— 也就是**整个菜单项列表**，可以加自己的项。",
              "`cancel()` 掉默认 UI，完全自己画。"
            ]
          },
          { p: "确认选项时会派发 `onSelectOption`（NameEvent），你可以在里面拦下自定义项。切换选中项时派发 `onChangeItem`。" },
          { p: "顺带说一句：退出到谱面编辑器这条路径在「编辑器里试玩」时特别有用 —— 改完谱直接暂停跳回去，不用退出重进。" }
        ]
      },

      /* ------------------------------------------------ 11 */
      {
        id: 'settings',
        num: '11',
        title: '设置界面：每一项都讲透',
        en: 'OPTIONS / SETTINGS',
        tags: ['Options', '设置', '全部选项'],
        simple: [
          { p: "设置分五类：**控制（改键）**、**游玩**、**外观**、**语言**、**杂项**。开了开发者模式还会多一个 **Debug**。" },
          { p: "最需要动的两个：`Song Offset`（音画偏移，打不准就调它）和帧率（默认 120，不是 30）。" }
        ],
        core: [
          { h: '① 控制 / Controls' },
          { p: "给 P1 和 P2 分别改键，分成几组：**音符键（4 个）**、**界面键（9 个）**、**音量键（3 个）**、**引擎键（2 个）**，开发者模式再多 **开发者键（4 个）**。" },
          {
            table: {
              head: ['分组', '包含'],
              rows: [
                ['Notes', '左 / 下 / 上 / 右 四个音符键'],
                ['UI', '左 / 下 / 上 / 右 / 确认 / 返回 / 重置 / 暂停 / 切换模式'],
                ['Volume', '音量+ / 音量- / 静音'],
                ['Engine', '切换 Mod / FPS 计数器'],
                ['Developer（仅开发者模式）', '开发者菜单 / 控制台 / 重载状态 / 检查器']
              ]
            }
          },
          { p: "按下确认键进入改键状态，再按任意键绑定；一个功能可以绑多个键。手柄按键（十字键、摇杆、A/B/START/Y）也在同一套系统里。" },

          { h: '② 游玩 / Gameplay' },
          {
            table: {
              head: ['中文名', '英文/ID', '作用与效果'],
              rows: [
                ['下滚', 'Downscroll', '谱面从上往下落（默认从下往上）。很多人打惯了 Psych 会开这个。'],
                ['幽灵点击', 'Ghost Tapping', '空按不算 Miss。关了之后，没音符时乱按会掉血掉连击。'],
                ['居中轨道', 'Centered Fields', '把四条轨道挪到屏幕中间，而不是左右分开（部分 mod 依赖这个）。'],
                ['暴露内容', 'Naughtyness', '允许「不雅」内容（血腥/擦边演出）。关掉后相关素材会被跳过。'],
                ['节拍缩放', 'Camera Zoom on Beat', '每拍镜头轻微推拉。关了画面更稳，但少了节奏感。'],
                ['失焦暂停', 'Auto Pause', '切出窗口自动暂停。多显示器/边聊边玩建议开。'],
                ['歌曲偏移', 'Song Offset', '音画同步校准，单位毫秒，范围 -999~999。判定偏早就调负，偏晚调正。'],
                ['音乐音量', 'Music Volume', '主音乐音量（0~1）。'],
                ['音效音量', 'SFX Volume', '按键音、菜单音等音效音量。']
              ]
            }
          },
          { p: "**高级（Advanced）** 里还有两项：" },
          {
            kv: [
              ['Streamed Music', '音乐流式加载（边读边放），省内存；极少数机器上会有轻微延迟。'],
              ['Streamed Vocals', '人声同样流式加载。开着更省内存。']
            ]
          },

          { h: '③ 外观 / Appearance' },
          {
            table: {
              head: ['中文名', 'ID', '作用与效果'],
              rows: [
                ['帧率上限', 'Framerate', '30 ~ 240。拉到最大会显示「Unlimited」。默认 120。帧率越高越吃显卡。'],
                ['FPS 计数器', 'FPS Counter', '开启后屏幕上显示帧率与内存；按 F3 可切换详细程度。'],
                ['菜单闪烁', 'Flashing Menu', '主菜单背景的粉色遮罩闪烁。光敏性癫痫患者建议关闭。'],
                ['彩色血条', 'Colored Health Bar', '血条颜色跟随当前人物图标的主色，而不是固定红绿。'],
                ['第六周像素完美', 'Week 6 Pixel Perfect', '像素周用整数缩放，像素不糊、不撕裂。'],
                ['Discord 状态', 'Discord RPC', '在 Discord 里显示「正在玩 Codename Engine / 当前歌曲」。'],
                ['画质', 'Quality', '低 / 高 / 自定义。低 = 关抗锯齿 + 低内存 + 关游戏内着色器。'],
                ['抗锯齿', 'Antialiasing', '抗锯齿开关；像素风建议关。'],
                ['低内存模式', 'Low Memory Mode', '只加载舞台 XML 里 `low-memory` 分组的元素，显著省内存。'],
                ['游戏内着色器', 'Gameplay Shaders', '允许打歌时启用着色器特效（色差、暗角等）。关掉能明显提性能。'],
                ['仅 GPU 位图', 'GPU Only Bitmaps', '位图只留显存、不留内存副本。省内存，但部分机器会花屏（mac/web 默认关闭）。']
              ]
            }
          },
          { p: "开了 FPS 计数器后，会多出一个 **FPS 高级** 子菜单，可以分别开关五类信息：Conductor（拍点/BPM）、Flixel（对象数/相机数）、System（CPU/GPU/内存）、Assets（资源库树）、Stats（绘制调用）。" },

          { h: '④ 语言 / Language' },
          { p: "列出 `assets/languages/` 下所有可用语言，选中立即生效。语言包只翻译界面文字，不影响 mod 自带文本。" },

          { h: '⑤ 杂项 / Miscellaneous' },
          {
            table: {
              head: ['中文名', 'ID', '作用与效果'],
              rows: [
                ['开发者模式', 'Developer Mode', '**总开关**。开了才有：编辑器、控制台、检查器、Debug 设置、开发者改键。'],
                ['模组配置警告', 'Allow Config Warning', 'mod 的 `modpack.ini` 缺失或 API 过旧时是否弹提示。'],
                ['测试版更新', 'Beta Updates', '自动更新时是否接受 beta 通道。'],
                ['检查更新', 'Check for Updates', '手动查一次更新，有新版会直接进更新界面。'],
                ['重置存档', 'Reset Save Data', '清空分数与设置存档。**不可撤销**，慎点。']
              ]
            }
          },

          { h: '⑥ Debug（仅开发者模式可见）' },
          {
            table: {
              head: ['选项', '作用'],
              rows: [
                ['Show Console', '打开 Windows 原生控制台窗口（看日志）'],
                ['Use Native Console', '用原生控制台替代内置 ImGui 控制台'],
                ['Resizable Editors', '允许编辑器窗口缩放'],
                ['Bypass Editor Resize', '跳过编辑器的最小尺寸限制'],
                ['Editor SFX', '编辑器里的按钮/操作音效'],
                ['Charter Pretty Print', '保存谱面 JSON 时格式化缩进'],
                ['Character Pretty Print', '保存人物 XML 时格式化缩进'],
                ['Stage Pretty Print', '保存舞台 XML 时格式化缩进'],
                ['Swap Event Sides', '编辑器里把事件栏放到另一侧'],
                ['Intensive Blur', '编辑器弹窗用高质量模糊（关掉更快）'],
                ['Charter Auto Saves', '谱面编辑器自动保存总开关'],
                ['Charter Auto Save Time', '自动保存间隔（60~600 秒）'],
                ['Charter Auto Save Warning Time', '自动保存倒计时提示时长（0~15 秒）'],
                ['Charter Auto Saves Separate Folder', '自动保存写到 `autosaves/` 而不是覆盖原文件'],
                ['Song Offset Affect Editors', '编辑器里是否也应用歌曲偏移'],
                ['Legacy Mod Menu Names', 'Mod 菜单只显示文件夹名'],
                ['Legacy Memory Counter', '内存计数器用旧样式（GC 峰值）'],
                ['ImGui Multi Viewport', '允许 ImGui 窗口拖出主窗口']
              ]
            }
          },
          { callout: { kind: 'tip', title: '调参顺序建议', text: "卡顿 → 先关「游戏内着色器」，再开「低内存模式」，最后才降帧率。判定不准 → 只调 `Song Offset`，别去动帧率。" } }
        ],
        deep: [
          { h: '设置是怎么存的' },
          { p: "设置存在 `Options` 这个类里，编译时由宏 `OptionsMacro` 自动生成存档读写代码，运行时绑到 `FlxSave`。存档路径由 `project.xml` 的 `SAVE_OPTIONS_PATH` / `SAVE_OPTIONS_NAME` 决定（默认 `CodenameEngine/options`），在系统的应用数据目录下，不在游戏目录里。" },
          { p: "所以：**删游戏目录不会重置设置**。要重置，要么用「重置存档」，要么手动去 `%APPDATA%` 之类的地方删。" },
          { h: '改设置的三种方式' },
          {
            ul: [
              "图形界面：设置菜单（推荐）。",
              "脚本：直接改 `Options.xxx = true`，然后 `Options.save()`。注意有些选项需要 `Options.applySettings()` 才生效。",
              "配置文件：`flags.ini` / `modpack.ini` 的 `[Flags]` 段 —— 但那是**引擎级 Flag**，和玩家设置是两套东西，别混。"
            ]
          },
          { h: '几个容易误解的选项' },
          {
            ul: [
              "`Quality = Custom` 不是「更好的画质」，而是「不再被预设覆盖，三个子开关自己说了算」。",
              "`GPU Only Bitmaps` **不是**越开越快：它省内存，但某些驱动上会让图片变黑。",
              "`Streamed Music` 关掉会更稳但更吃内存 —— 低配机器反而应该**开**着。",
              "`Ghost Tapping` 关掉之后，很多人会突然发现自己「其实一直在乱按」。"
            ]
          }
        ]
      },

      /* ------------------------------------------------ 12 */
      {
        id: 'dev-mode',
        num: '12',
        title: '开发者模式：和普通模式差在哪',
        en: 'DEVELOPER MODE',
        tags: ['devMode', '编辑器', '控制台', '差异清单'],
        simple: [
          { p: "开发者模式就是「给做 mod 的人准备的那套工具」的**总开关**，在 **设置 → 杂项 → Developer Mode**。打开之后，主菜单按 `7` 进编辑器，`F2` 开控制台，`F4` 看对象检查器，`F5` 重载当前界面。" },
          { p: "不开这个开关，这四个键**完全没反应**（不是藏起来，是代码层面直接短路）。" }
        ],
        core: [
          { h: '一句话总结' },
          { p: "开发者模式 = 解锁 **4 个调试按键 + 1 个设置分类 + 1 组改键项 + 编辑器入口 + 控制台 + 检查器**。打歌体验本身完全不变。" },

          { h: '差异清单（逐条）' },
          {
            table: {
              head: ['#', '差异', '非开发者模式', '开发者模式'],
              rows: [
                ['1', '`7` 键', '只有音效 + 连按三次的提示文字', '打开编辑器选择器（EditorPicker）'],
                ['2', '`F2` 控制台', '完全无响应', '打开/关闭 ImGui 控制台'],
                ['3', '`F4` 检查器', '完全无响应', '对象树 + 属性编辑 + 3D Gizmo'],
                ['4', '`F5` 重载', '完全无响应', '重载当前 State（`Shift+F5` 重载全局脚本）'],
                ['5', '设置界面', '5 个分类', '多一个 **Debug** 分类'],
                ['6', '改键界面', '4 个分组', '多一个 **Developer** 分组（4 个键）'],
                ['7', '打歌中按 `7`', '无反应', '跳回谱面编辑器继续改谱'],
                ['8', '启动时', '不检查 mod 配置', '检查 `modpack.ini` / API 版本，必要时弹警告'],
                ['9', '控制台命令', '—', '20+ 条内置命令（见下一节）']
              ]
            }
          },
          { callout: { kind: 'dev', title: '注意', text: "**F3（帧率）不是开发者功能**。只要你开了「FPS 计数器」，F3 就能用，不需要开发者模式。" } },

          { h: '什么时候该开' },
          {
            ul: [
              "做谱面、做人物、做舞台 —— 必开。",
              "写脚本调试 —— 必开，不然看日志得去翻文件。",
              "只是玩 mod —— 不用开。开着反而会多出警告弹窗。",
              "录视频/截图 —— 建议关掉，免得 F3 的字幕入镜。"
            ]
          },

          { h: '编辑器入口长什么样' },
          { p: "按 `7` 之后是一屏竖直的大色条，从上到下大致是：**Chart Editor（谱面）**、**Character Editor（人物）**、**Stage Editor（舞台）**、**Alphabet Editor（字体）**、**Wiki（官网）**，debug 构建还会多一个 **UI Debug**。滚轮或上下键选，确认进入。" }
        ],
        deep: [
          { h: '为什么非开发者模式按 7 没反应' },
          { p: "这四个按键在 `Controls` 里标了 `@:devModeOnly`，编译时宏会把它们的 getter 改写成 `return Options.devMode && 按键检测`。也就是说**根本没进检测逻辑**，不是「检测到但不处理」。所以改键界面里也看不到它们。" },
          { h: 'F5 与 Shift+F5 的区别' },
          {
            ul: [
              "`F5`：`FlxG.resetState()` —— 当前状态整个重建，脚本重新加载。改完脚本按这个。",
              "`Shift+F5`：只重载**全局脚本**（`data/globals/` 与 mod 的 `global.hx`），不动当前状态。改全局钩子时用。"
            ]
          },
          { p: "顺带一提：F5 在**编辑器里**曾经会破坏编辑器状态，这一版已经修了；但在编辑器里重载仍然要小心未保存的改动。" }
        ]
      },

      /* ------------------------------------------------ 13 */
      {
        id: 'console-and-fps',
        num: '13',
        title: '控制台、检查器与帧率面板',
        en: 'CONSOLE / INSPECTOR / FPS',
        tags: ['ConsoleUI', 'F2', 'F4', 'F3', '调试'],
        simple: [
          { p: "开了开发者模式之后：`F2` 是控制台，能直接敲命令甚至敲代码；`F4` 是检查器，能看到屏幕上有哪些对象、还能改它们的属性；`F3` 是帧率面板，卡的时候看它。" }
        ],
        core: [
          { h: '控制台（F2）' },
          { p: "底部弹出一个可输入的面板。你输入的东西会先当**命令**找，找不到就**当 HScript 代码执行**并把结果打出来。所以它既是命令行，也是一个即时求值的 REPL。" },
          {
            ul: [
              "`Tab` 补全、`↑` `↓` 翻历史。",
              "输出可以按类型过滤（Info / Warning / Error / Trace / Verbose）和按内容搜索。",
              "可以一键复制日志、清屏、改配色。",
              "输入的对象可以是命令、类名、函数名、脚本变量 —— 补全列表会跟着变。"
            ]
          },

          { h: '内置命令（20 条）' },
          {
            table: {
              head: ['命令', '参数', '作用'],
              rows: [
                ['`help`', '[对象]', '列出所有命令，或列出某个对象的字段'],
                ['`clear`', '—', '清空控制台输出'],
                ['`pause`', '—', '手动切换暂停'],
                ['`loadSong`', '[歌] [难度] [变体] [对手] [双人]', '直接进某首歌'],
                ['`endSong`', '—', '立刻结束当前歌曲'],
                ['`loadWeek`', '[周名] [难度]', '直接进某个周'],
                ['`switchMod`', '[名字]', '切换 mod'],
                ['`reloadMod`', '—', '重载当前 mod'],
                ['`reloadState`', '—', '重载当前界面'],
                ['`goToPlayState`', '—', '跳到打歌界面'],
                ['`goToMainMenu`', '—', '回主菜单'],
                ['`goToStoryMode`', '—', '去故事模式'],
                ['`goToFreeplay`', '—', '去自由游玩'],
                ['`goToOptions`', '—', '去设置'],
                ['`goToCredits`', '—', '去制作名单'],
                ['`goToTitle`', '[reset]', '回标题界面'],
                ['`goToModState`', '[名字]', '跳到某个软编码 State'],
                ['`goToCharter`', '[歌] [难度] [变体]', '打开谱面编辑器'],
                ['`goToCharacterEditor`', '[人物名]', '打开人物编辑器'],
                ['`goToStageEditor`', '[舞台名]', '打开舞台编辑器']
              ]
            }
          },
          { callout: { kind: 'tip', title: '最常用的两条', text: "`loadSong bopeebo hard` —— 改完谱一键试听；`goToCharter` —— 打歌时发现问题立刻回去改。" } },

          { h: '检查器（F4）' },
          { p: "左侧是**对象树**：当前 State → 子对象 → 子对象的子对象。点一个对象，右侧列出它的**所有属性**，可以直接改数值、切枚举、拖滑条，改动立刻反映到画面上。" },
          {
            ul: [
              "支持 FlxSprite / FlxGroup / 角色 / 舞台元素，也支持 3D 对象（foxlite 的 `FoxObject`）。",
              "3D 对象会画出包围盒和 Gizmo，方便你对位置。",
              "改坏了？`F5` 重载状态即可复原（除非你保存了）。"
            ]
          },

          { h: '帧率面板（F3）' },
          {
            table: {
              head: ['区块', '内容'],
              rows: [
                ['FPS', '实时帧率 + 最近 15 帧的最低值（`/1%`）'],
                ['MEM', '内存占用（GC 用量 / 进程工作集）'],
                ['Conductor', '歌曲位置、拍、步、小节、BPM、拍号'],
                ['Flixel', '当前 State 名、对象数、相机数、位图数、声音数'],
                ['System', '系统、CPU、GPU、显存、内存、GC 状态'],
                ['Assets', '所有已加载的资源库（含来源 mod 与前缀）'],
                ['Stats', '绘制调用数（totalDC / stageDC / stage3DDC）']
              ]
            }
          },
          { p: "按 `F3` 在「隐藏 → 简易 → 详细」之间循环。详细模式下文字可以被选中复制 —— 报 bug 时很有用。" }
        ],
        deep: [
          { h: '控制台的求值环境' },
          { p: "它内置了一个 HScript 解释器，并且预置了脚本层能用的所有全局名字（`FlxG`、`PlayState`、`Options`、`Conductor`、`Paths`、`Flags`、`CoolUtil`…），外加当前所有脚本的变量表和 `Script.staticVariables`。" },
          { p: "所以你可以直接在控制台里试代码：" },
          { code: { lang: 'haxe', title: '在控制台里直接执行', src: 'PlayState.instance.health = 2\nPlayState.instance.songScore += 50000\ntrace(PlayState.instance.curSong)\nConductor.bpm = 200' } },
          { p: "切换状态时控制台变量会被重置，这是刻意的 —— 避免拿到已经销毁的对象。" },
          { h: '检查器的边界' },
          { p: "检查器只能改**已存在的对象**的属性，不能凭空造对象（那是脚本的事）。另外它显示的是运行时对象，所以脚本里 `new` 出来但没 `add` 的东西是找不到的。" }
        ]
      },

      /* ------------------------------------------------ 14 */
      {
        id: 'editors',
        num: '14',
        title: '编辑界面：三套编辑器能做什么',
        en: 'THE EDITORS',
        tags: ['Charter', 'Character', 'Stage', 'Alphabet', '特效'],
        simple: [
          { p: "开发者模式下按 `7` 进编辑器。三个主力：**谱面**（做歌）、**人物**（做角色）、**舞台**（做背景）。还有一个 **Alphabet** 编辑器用来做那种一个字一个字蹦的字体。" },
          { p: "这三个编辑器的完成度是这一版最大的卖点 —— 谱面编辑器尤其完整，基本可以脱离外部工具做完整首歌。" }
        ],
        core: [
          { h: '通用界面' },
          { p: "所有编辑器共用一套 UI 组件：顶栏菜单、可折叠窗口、下拉框、滑条、数值框、色轮、文件浏览器、右键菜单、通知条。弹窗出现时背景会自动加模糊（`Intensive Blur` 可关）。" },
          { p: "**撤销/重做**是统一的：`Ctrl+Z` / `Ctrl+Y`，默认最多 120 步。有未保存改动时窗口标题会带 `*`，关闭时会拦你。" },

          { h: '① 谱面编辑器 Charter' },
          { p: "这是最复杂的一个，顶栏有 8 个菜单：**File / Edit / Chart / View / Song / Note / Snap / Playback**。" },
          {
            table: {
              head: ['能做', '说明'],
              rows: [
                ['放音符', '左键点击网格；`Shift` 点击不吸附'],
                ['长按音符（Sustain）', '拖拽拉长；`E` 加长、`Q` 缩短'],
                ['框选 / 多选', '拖拽超过 20px 进入框选，`Shift`/`Ctrl` 加减选'],
                ['复制拖动', '`Alt` + 拖动'],
                ['涂擦删除', '右键拖动'],
                ['Note Types', '`0`~`9` 切换音效类型，类型本身可编辑'],
                ['事件', '同一步可以叠多个事件，参数按类型自动生成控件'],
                ['书签', '打标记，一键跳转'],
                ['难度创建', '在编辑器里直接新建难度'],
                ['变体创建', '基于当前歌派生一个变体'],
                ['播放变速', '0.25x ~ 2x，同时改音高'],
                ['自动保存', '默认每 5 分钟，可配置'],
                ['试玩', '`Enter` 从头、`Shift+Enter` 从当前位置']
              ]
            }
          },
          { p: "常用快捷键：" },
          {
            table: {
              head: ['操作', '按键'],
              rows: [
                ['保存全部', '`Ctrl+S`'],
                ['撤销 / 重做', '`Ctrl+Z` / `Ctrl+Y`'],
                ['播放 / 暂停', '`Space`'],
                ['前后一小节', '`A` / `D`'],
                ['前后一步', '`W` / `S`'],
                ['吸附加 / 减', '`X` / `Z`'],
                ['缩放', '`Ctrl` + 滚轮'],
                ['从头到尾', '`Home` / `End`'],
                ['加相机事件（对手）', '`O`'],
                ['加相机事件（玩家）', '`P`'],
                ['试玩', '`Enter` / `Shift+Enter`']
              ]
            }
          },

          { h: '② 人物编辑器 Character Editor' },
          {
            ul: [
              "**动画列表**：每个动画一张卡片，可拖动排序；卡片上有名字、动画前缀、偏移、帧率、循环、标签、帧序列。",
              "**偏移调整**：方向键 1px、`Shift`+方向键 5px、`Ctrl+R` 清零；也可以直接拖角色。",
              "**Ghost 叠影**：把别的动画半透明叠上来，方便对位（做 sing 动画神器）。",
              "**Gizmo**：显示判定框和相机中心十字。",
              "**属性面板**：全局偏移、缩放、翻转、抗锯齿、相机偏移、图标、图标主色、sing 持续时间。",
              "**创建向导**：给名字 + 拖进图片，自动按动画名猜 `singLEFT/RIGHT/UP/DOWN` / `idle`，生成 XML。"
            ]
          },

          { h: '③ 舞台编辑器 Stage Editor' },
          {
            ul: [
              "**四类元素**：精灵（sprite）、色块（solid/box）、角色（dad/gf/bf/char）、未知节点（保留原始 XML 用）。",
              "**变换手柄**：8 个缩放手柄、中心移动、旋转圆环、四边斜切。",
              "**属性**：坐标、滚动因子、缩放、角度、缩放因子、斜切、透明度、混合模式、动画类型、内存分组。",
              "**直接改 XML**：`Shift` + 点击元素可以直接编辑它的原始 XML。",
              "**层级**：右侧列表的顺序就是绘制顺序，也就是写回 XML 的节点顺序。"
            ]
          },

          { h: '④ Alphabet 编辑器' },
          { p: "编辑 `data/alphabet/*.xml`：为每个字符指定由哪些「组件」拼成（组件 = 一段动画 + 偏移 + 缩放 + 旋转 + 翻转）。适合做那种一个字由多个贴图拼出来的花体标题。" },

          { h: '这些编辑器能做出的「特效」' },
          {
            table: {
              head: ['效果', '在哪做', '怎么配'],
              rows: [
                ['视差滚动背景', '舞台', '给不同 sprite 不同的 `scroll` 值'],
                ['跟随节拍弹跳的元素', '舞台', '`type=\"beat\"` + `beatInterval`'],
                ['多图层叠加/透明', '舞台', '`alpha` / `blend`'],
                ['倾斜/旋转的物件', '舞台', '`angle` / `skewx` / `skewy`'],
                ['镜头推拉节奏', '谱面事件', 'Camera Zoom / Camera Bop'],
                ['瞬间白闪/色闪', '谱面事件', 'Camera Flash'],
                ['镜头横扫', '谱面事件', 'Camera Movement'],
                ['变速段', '谱面事件', 'BPM Change / Continuous BPM Change'],
                ['谱面流速变化', '谱面事件', 'Scroll Speed Change'],
                ['角色换姿势', '谱面事件', 'Play Animation / Alt Animation Toggle']
              ]
            }
          },

          { gallery: [
            { src: 'assets/img/charter-events-1.png', cap: '谱面编辑器的事件系统设计稿（仓库 art/design ideas 目录）' },
            { src: 'assets/img/charter-events-2.png', cap: '事件条与参数面板的早期设计稿' }
          ] }
        ],
        deep: [
          { h: '谱面编辑器里那些「别的引擎没有」的' },
          {
            ul: [
              "**同一步叠多个事件**：原版一个时间点只能挂一个事件，这里可以堆叠，做「同时闪 + 推镜 + 变速」不用挤时间点。",
              "**多声道 vocals**：每个 strumline 可以有自己的 vocals 后缀，做对唱/合唱不用拆歌。",
              "**strumline 自定义**：角色列表、类型（对手/玩家/额外）、舞台位置、缩放、间距、HUD 坐标、可见性、按键数量（1~1000）、独立或继承流速 —— 等于内置了「多轨」支持。",
              "**播放变速不改谱**：变速只是播放速度，时间轴上的音符位置不变，所以可以慢速精修。",
              "**自动保存到独立目录**：`autosaves/hard_10-23_18-40.json` 这种命名，不会覆盖你手动的存档。"
            ]
          },
          { h: '编辑器写文件写到哪' },
          { p: "编辑器直接写 `assets/` 或当前 mod 下对应目录。如果 mod 是 **zip 包**，写不进去 —— 启动时会弹「Compressed Library Detected!」提示。想用编辑器，mod 必须是**文件夹**形式。" },
          { h: '几个坑' },
          {
            ul: [
              "人物编辑器里改 `defaultAimFPS` 会**同步改掉所有帧率等于旧默认值的动画**，这是设计如此，不是 bug。",
              "舞台编辑器保存时按列表顺序写节点，所以**调整列表顺序 = 调整图层顺序**，别乱拖。",
              "Alphabet 编辑器的撤销/重做在这一版还没做完（菜单项是灰的），改之前先备份 XML。",
              "所有编辑器都假设你开着开发者模式；关掉之后已打开的编辑器不会自动关，但下次进不来。"
            ]
          },

          { h: '⑧ 谱面编辑器：全部菜单快捷键（源码逐条抽出）' },
          { p: "下面三张表是从 `Charter.hx` 的 `topMenu` 定义里逐条抽出来的，**不是回忆**。带 `—` 的是只能点菜单、没有快捷键的项。" },
          { h4: 'File / Edit / Chart' },
          {
            table: {
              head: ['菜单', '项', '快捷键'],
              rows: [
                ['File', 'Save', '`Ctrl+S`'],
                ['File', 'Save As...', '`Ctrl+Shift+S`'],
                ['File', 'Save Global Events', '`Ctrl+B+S`'],
                ['File', 'Save Global Events As...', '—'],
                ['File', 'Save Chart without Local Events', '`Ctrl+Alt+S`'],
                ['File', 'Save Chart without Local Events As...', '—'],
                ['File', 'Save Meta', '`Ctrl+M+S`'],
                ['File', 'Save Meta As...', '—'],
                ['File', 'Export For FNF Legacy...', '—'],
                ['File', 'Export For Psych Engine...', '—'],
                ['File', 'Exit', '—'],
                ['Edit', 'Undo', '`Ctrl+Z`'],
                ['Edit', 'Redo', '`Ctrl+Y` 或 `Ctrl+Shift+Z`'],
                ['Edit', 'Copy', '`Ctrl+C`'],
                ['Edit', 'Paste', '`Ctrl+V`'],
                ['Edit', 'Cut', '`Ctrl+X`'],
                ['Edit', 'Delete', '`Del`'],
                ['Edit', 'Delete Stacked Notes', '`Shift+Del`'],
                ['Chart', 'Playtest', '`Enter`'],
                ['Chart', 'Playtest here', '`Shift+Enter`'],
                ['Chart', 'Playtest as opponent', '`Ctrl+Enter`'],
                ['Chart', 'Playtest as opponent here', '`Ctrl+Shift+Enter`'],
                ['Chart', 'Enable scripts during playtesting', '—'],
                ['Chart', 'Edit chart data', '—'],
                ['Chart', 'Edit metadata information', '—']
              ]
            }
          },
          { h4: 'View / Playback' },
          {
            table: {
              head: ['菜单', '项', '快捷键'],
              rows: [
                ['View', 'Zoom in', '`Ctrl+小键盘 +`'],
                ['View', 'Zoom out', '`Ctrl+小键盘 -`'],
                ['View', 'Reset Zoom', '`Ctrl+小键盘 0`'],
                ['View', 'Show Sections Separator', '—（开关）'],
                ['View', 'Show Beats Separator', '—（开关）'],
                ['View', 'Show Camera Highlights', '—（开关）'],
                ['View', 'Rainbow Waveforms', '—（开关）'],
                ['View', 'Low Detail Waveforms', '—（开关）'],
                ['View', 'Scroll Left', '`Shift+←`'],
                ['View', 'Scroll Right', '`Shift+→`'],
                ['View', 'Reset Scroll', '`Shift+↓`'],
                ['Playback', 'Play/Pause', '`Space`'],
                ['Playback', 'Align time to grid', '—'],
                ['Playback', 'Reset Speed', '—'],
                ['Playback', 'Go back a section', '`A`'],
                ['Playback', 'Go forward a section', '`D`'],
                ['Playback', 'Go to start of section', '`Shift+S`'],
                ['Playback', 'Go back a step', '`W`'],
                ['Playback', 'Go forward a step', '`S`'],
                ['Playback', 'Metronome', '—（开关）']
              ]
            }
          },
          { h4: 'Song / Note / Snap（动态菜单）与鼠标操作' },
          { p: "这三个菜单的内容是动态生成的（歌曲列表、音符类型列表、吸附档位），所以没有写死在 `topMenu` 里。以下是这些环节里**写在输入处理中**的按键与鼠标操作：" },
          {
            table: {
              head: ['操作', '按键 / 鼠标'],
              rows: [
                ['跳到开头 / 结尾', '`Home` / `End`'],
                ['加对手相机事件', '`O`（`Shift` = 不量化，`Alt` = 非全局）'],
                ['加玩家相机事件', '`P`（同上）'],
                ['拉长 / 缩短长按', '`E` / `Q`'],
                ['切换音符类型', '`0`~`9` 与小键盘数字'],
                ['全选 / 选小节 / 选整条轨道', '`Ctrl+A` / `Ctrl+Shift+A` / `Ctrl+Shift+L`'],
                ['吸附档位 + / -', '`X` / `Z`'],
                ['播放速度 +25% / -25%', '`.` / `,`'],
                ['放置音符', '左键（`Shift` = 不吸附）'],
                ['框选', '拖拽 > 20px（`Shift`/`Ctrl` 加减选）'],
                ['复制拖动', '`Alt` + 拖动'],
                ['涂擦删除', '右键拖动'],
                ['右键点空白', '弹出 Edit 菜单'],
                ['上下滚动时间轴 / 缩放 / 侧滚', '滚轮 / `Ctrl`+滚轮 / `Shift`+滚轮'],
                ['锁定 / 解锁轨道拖动', '`K`']
              ]
            }
          },
          { callout: { kind: 'info', title: '说明', text: "动态菜单里的键位来自键盘处理代码，不同版本可能微调。**菜单里能点到的项永远是最准的** —— 记不住就点菜单，旁边会标快捷键。" } },

          { h: '⑨ 人物编辑器：全部菜单快捷键' },
          {
            table: {
              head: ['菜单', '项', '快捷键'],
              rows: [
                ['File', 'Save', '`Ctrl+S`'],
                ['File', 'Save As...', '`Ctrl+Shift+S`'],
                ['File', 'Exit', '—'],
                ['Edit', 'Copy Offset', '`Ctrl+C`'],
                ['Edit', 'Paste Offset', '`Ctrl+V`'],
                ['Edit', 'Undo', '`Ctrl+Z`'],
                ['Edit', 'Redo', '`Ctrl+Y` / `Ctrl+Shift+Z`'],
                ['Edit', 'Edit information', '—'],
                ['Edit', 'Edit sprite', '—'],
                ['Offset', 'Move Left / Up / Down / Right', '`←` `↑` `↓` `→`（1px）'],
                ['Offset', 'Move Extra Left / Up / Down / Right', '`Shift+方向键`（5px）'],
                ['Offset', 'Drag Offsets With Mouse?', '—（开关）'],
                ['Offset', 'Clear Offsets', '`Ctrl+R`'],
                ['View', 'Zoom in / out / Reset', '`Ctrl+小键盘 +/-/0`'],
                ['View', 'Character Hitbox?', '—（开关）'],
                ['View', 'Character Camera?', '—（开关）'],
                ['View', 'XY Axis?', '—（开关）'],
                ['Animation', 'Play Animation', '`Space`'],
                ['Animation', 'Stop Animation', '—'],
                ['Animation', 'Change Animation ↑ / ↓', '`W` / `S`']
              ]
            }
          },

          { h: '⑩ 舞台编辑器：全部菜单快捷键' },
          {
            table: {
              head: ['菜单', '项', '快捷键'],
              rows: [
                ['File', 'Save', '`Ctrl+S`'],
                ['File', 'Save As...', '`Ctrl+Shift+S`'],
                ['File', 'Exit', '—'],
                ['Edit', 'Undo', '`Ctrl+Z`'],
                ['Edit', 'Redo', '`Ctrl+Shift+Z`'],
                ['Select', 'Select All', '`Ctrl+A`'],
                ['Select', 'Deselect', '`Ctrl+D`'],
                ['Select', 'Inverse Selection', '`Ctrl+Shift+I`'],
                ['View', 'Zoom in / out / Reset', '`Ctrl+小键盘 +/-/0`'],
                ['View', 'Focus Dad / GF / BF', '（用工具栏按钮）'],
                ['Editor', '新建 / 编辑 / 删除元素', '（工具栏按钮 / 点击元素）'],
                ['—', '直接编辑某个元素的原始 XML', '`Shift` + 点击元素']
              ]
            }
          },

          { h: '⑪ Alphabet 编辑器：能改哪些东西' },
          { p: "它编辑的是 `data/alphabet/<字体名>.xml` —— 也就是「**一个字符由哪些贴图组件拼出来**」。菜单只有四组：" },
          {
            table: {
              head: ['菜单', '项', '作用'],
              rows: [
                ['File', 'Save / Save As / Exit', '存盘 / 另存 / 退出'],
                ['Edit', 'Undo / Redo', '撤销 / 重做（**这一版还是灰的**）'],
                ['Edit', 'Delete Current Glyph', '删掉当前字符'],
                ['Edit', 'Edit Main Data', '改全局参数：fps、advance、lineGap、forceCase、colorMode、三种 backup prefix'],
                ['View', 'Zoom in / out / Reset', '预览缩放'],
                ['Tape', 'Move Tape Left / Right', '中间那条「字带」左右切字符']
              ]
            }
          },
          {
            ul: [
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
