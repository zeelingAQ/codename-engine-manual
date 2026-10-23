/* ============================================================
   第六部分：配置与排错
   ============================================================ */
(function () {
  if (!window.CNE) return;

  window.CNE.addPart({
    id: 'p6',
    name: '第六部分 · 配与修',
    short: 'PART 06',
    color: 'var(--red)',
    sections: [

      /* ------------------------------------------------ 39 */
      {
        id: 'custom-options',
        num: '39',
        title: 'mod 自定义设置项：往设置菜单塞自己的开关',
        en: 'CUSTOM OPTIONS',
        tags: ['Options', 'XML', 'LIB_', '设置'],
        simple: [
          { p: "你可以在**设置菜单里加自己的选项** —— 玩家改完会存进存档，下次进游戏还在。" },
          { p: "做法：在 mod 里放一个 XML，文件名固定 `data/config/options/LIB_<你的mod名>.xml`，一个节点就是一个选项。" }
        ],
        core: [
          { h: '① 文件放哪、叫什么' },
          {
            kv: [
              ['实际路径', '`mods/<你的mod>/data/config/options.xml`'],
              ['引擎内部寻址', '`data/config/options/LIB_<mod名>`（`LIB_` 是虚路径前缀，会自动映射到上面的文件）'],
              ['加载时机', '打开设置菜单时（`OptionsMenu.create()` 扫描所有已加载 mod）'],
              ['加载后的位置', '追加到设置**主菜单那一屏**的最下面']
            ]
          },
          { callout: { kind: 'warn', title: '文件名别写错', text: "写 `options.xml` 放在 `data/config/` 下；`LIB_` 是引擎内部用的，你不需要在磁盘上建 `options/LIB_xxx` 这种路径。" } },

          { h: '② 支持的 7 种控件' },
          {
            table: {
              head: ['节点', '属性', '效果'],
              rows: [
                ['`separator`', '`height`（可选，默认 67）', '一条分隔空行'],
                ['`checkbox`', '`name` `desc` `id`', '开/关'],
                ['`number`', '`name` `desc` `id` `min` `max` `change`\\|`step`', '数字（带上下箭头）'],
                ['`choice`', '`name` `desc` `id` + 子节点', '轮换选择（左右切）'],
                ['`radio`', '`name` `desc` `id` `value` `forId`', '单选（同 `forId` 互斥）'],
                ['`slider`', '`name` `desc` `id` `min` `max` `change`\\|`step` `segments` `barWidth`', '滑条'],
                ['`menu`', '`name` `desc` `prefix` + 子节点', '二级子菜单（子项 id 会自动加前缀）']
              ]
            }
          },
          { p: "`name` / `desc` 官方是填**翻译 ID**（如 `optionsTree.appearance-name`）。你自己加的选项直接写中文/英文原文也行 —— 找不到翻译时会原样显示。" },

          { h: '③ 一份能直接用的 XML' },
          { code: { lang: 'xml', title: 'mods/my-mod/data/config/options.xml', src: '<?xml version="1.0" encoding="utf-8"?>\n<options>\n\t<separator height="40" />\n\n\t<checkbox\n\t\tname="我的 Mod：开启炫光"\n\t\tdesc="关掉可以提升性能"\n\t\tid="mymod_glow" />\n\n\t<number\n\t\tname="我的 Mod：血量上限"\n\t\tdesc="默认 2"\n\t\tid="mymod_maxhealth"\n\t\tmin="1" max="10" change="0.5" />\n\n\t<slider\n\t\tname="我的 Mod：镜头摇晃强度"\n\t\tdesc="0 = 不晃"\n\t\tid="mymod_shake"\n\t\tmin="0" max="1" change="0.05"\n\t\tsegments="10" barWidth="400" />\n\n\t<choice name="我的 Mod：滤镜强度" desc="低 / 中 / 高" id="mymod_filter">\n\t\t<option name="低" value="0" />\n\t\t<option name="中" value="1" />\n\t\t<option name="高" value="2" />\n\t</choice>\n\n\t<menu name="我的 Mod：更多设置 >" desc="点开看子项" prefix="mymod_sub_">\n\t\t<checkbox name="子选项 A" id="a" />\n\t\t<checkbox name="子选项 B" id="b" />\n\t</menu>\n</options>' } },
          {
            kv: [
              ['注意 1', '`checkbox` / `number` / `choice` / `radio` / `slider` **必须有 `id`**，缺了会在日志里警告并跳过'],
              ['注意 2', '`choice` 的子节点名随便（示例用 `<option>`），只要带 `name`（显示）和 `value`（存的值）'],
              ['注意 3', '`menu` 里的子项 id 会被 `prefix` 前缀化：`prefix="mymod_sub_"` + `id="a"` → 实际存成 `mymod_sub_a`']
            ]
          },

          { h: '④ 值存在哪、怎么读' },
          { p: "所有自定义选项的值都存在 `FlxG.save.data` 里，**key 就是你写的 `id`**（`menu` 里是 `prefix + id`）。" },
          { code: { lang: 'haxe', title: '在脚本里读', src: 'function postCreate() {\n\t// 布尔\n\tvar glow:Bool = FlxG.save.data.mymod_glow ?? false;\n\n\t// 数字（可能是 Int 也可能是 Float，取决于输入框）\n\tvar hp:Float = FlxG.save.data.mymod_maxhealth ?? 2.0;\n\n\t// 滑条（Float）\n\tvar shake:Float = FlxG.save.data.mymod_shake ?? 0.5;\n\n\t// choice：存的是 value，注意可能是字符串\n\tvar filter:String = Std.string(FlxG.save.data.mymod_filter ?? "0");\n\n\t// 子菜单项\n\tvar subA:Bool = FlxG.save.data.mymod_sub_a ?? false;\n\n\ttrace(glow + " / " + hp + " / " + shake + " / " + filter + " / " + subA);\n}' } },
          { callout: { kind: 'tip', title: '一定要给默认值', text: "玩家没进过设置时这些 key 不存在，读出来是 `null`。永远写 `?? 默认值`。" } },

          { h: '⑤ 什么时候生效' },
          {
            ol: [
              "玩家在设置里改 → 值立刻写进 `FlxG.save.data`（但**还没落盘**）。",
              "退出设置菜单时 `Options.save()` + `applySettings()`，同时 `FlxG.save` 会在合适时机 flush。",
              "**你的脚本需要自己判断**：改了设置后要不要立刻应用（比如重建 shader），不如在 `update` 里每帧读一次，或监听设置退出。"
            ]
          }
        ],
        deep: [
          { h: '⑥ 为什么是 `LIB_` 虚路径' },
          { p: "`data/config/options/` 是个**目录**，里面按 mod 名分文件（`LIB_<mod>`）。这样每个 mod 都有自己的 options.xml，互不覆盖。引擎在 `OptionsMenu.create()` 里遍历 `ModsFolder.getLoadedMods()`，逐个试 `Paths.xml('config/options/LIB_' + mod)`。" },
          { p: "同理还有 `data/config/controls/LIB_<mod>`（下一节）和 `data/states/<状态>/LIB_<mod>`（状态脚本）。**记住这条规律，一半的「多 mod 共存」问题就懂了。**" },

          { h: '⑦ 常见坑' },
          {
            table: {
              head: ['现象', '原因'],
              rows: [
                ['设置里看不到我的选项', '文件名/路径不对（要 `data/config/options.xml`）'],
                ['选项在，但改了没用', '脚本没读 `FlxG.save.data`，或读了但没给默认值'],
                ['改了重启就没了', '值没被 flush（正常流程会 flush；如果你手动改 `FlxG.save.data` 要自己 flush）'],
                ['`menu` 里的子项读不到', '忘了加 `prefix`，实际 key 是 `prefix + id`'],
                ['选项重复出现', '同一个 mod 被加载了两次（mods 里放了两份）']
              ]
            }
          },
          { h: '⑧ 比「设置项」更轻的做法' },
          { p: "如果只是想给玩家一个开关，不想动设置菜单，可以：**读 `flags.ini`**（见第 42 节，但那是引擎级、要重启），或者干脆**在自己的 mod 里做一个 UI**（`ModState` + 按钮），把值写进 `FlxG.save.data`。" }
        ]
      },

      /* ------------------------------------------------ 40 */
      {
        id: 'custom-controls',
        num: '40',
        title: 'mod 自定义按键：给设置菜单加一类键位',
        en: 'CUSTOM CONTROLS',
        tags: ['Controls', '键位', 'XML'],
        simple: [
          { p: "想让玩家给你的 mod 功能单独设个键（比如「切换 HUD」）？在 mod 里放一个 XML，就能在**设置 → 控制**里多出一整个分类。" }
        ],
        core: [
          { h: '① 文件位置' },
          {
            kv: [
              ['实际路径', '`mods/<你的mod>/data/config/controls.xml`'],
              ['内部寻址', '`data/config/controls/LIB_<mod名>`'],
              ['加载时机', '引擎启动时 `ControlsUtil.loadCustomControls()`'],
              ['出现位置', '设置 → 控制 → 你的分类']
            ]
          },

          { h: '② XML 结构' },
          { code: { lang: 'xml', title: 'mods/my-mod/data/config/controls.xml', src: '<?xml version="1.0" encoding="utf-8"?>\n<controls>\n\t<category name="我的 Mod 按键">\n\t\t<control menuName="切换 HUD"  saveName="MYMOD_TOGGLE_HUD" />\n\t\t<control menuName="重载特效"  saveName="MYMOD_RELOAD_FX" />\n\t\t<!-- 可选：给这一行加个图标（图集名 + 动画名） -->\n\t\t<control menuName="召唤助手"  saveName="MYMOD_SUMMON"\n\t\t         menuIcon="icons/mymod" menuAnim="summon" />\n\t</category>\n</controls>' } },
          {
            table: {
              head: ['属性', '必需', '说明'],
              rows: [
                ['`category@name`', '是', '分类显示名（会出现在设置→控制里）'],
                ['`control@menuName`', '是', '这一行的显示名'],
                ['`control@saveName`', '是', '**存档用的唯一键**，建议全大写 + 前缀'],
                ['`control@menuIcon`', '否', '图标图集（相对 images/）'],
                ['`control@menuAnim`', '否', '图标动画名']
              ]
            }
          },
          { callout: { kind: 'warn', title: 'saveName 一旦发布别改', text: "玩家改好的键位是按 `saveName` 存的。你改名 = 玩家设置全丢。" } },

          { h: '③ 在脚本里读这个键' },
          { code: { lang: 'haxe', title: '用 ControlsUtil 读（推荐）', src: 'import funkin.backend.utils.ControlsUtil;\n\nfunction update(elapsed:Float) {\n\t// 三个状态：按住 / 刚按下 / 刚松开\n\tif (ControlsUtil.getJustPressed(PlayerSettings.solo.controls, "MYMOD_TOGGLE_HUD")) {\n\t\tcamHUD.visible = !camHUD.visible;\n\t}\n\n\tif (ControlsUtil.getPressed(PlayerSettings.solo.controls, "MYMOD_RELOAD_FX")) {\n\t\t// 按住期间每帧执行\n\t}\n}' } },
          {
            kv: [
              ['`getPressed(controls, name)`', '是否按住'],
              ['`getJustPressed(controls, name)`', '这一帧刚按下'],
              ['`getJustReleased(controls, name)`', '这一帧刚松开'],
              ['`controls` 用哪个', '`PlayerSettings.solo.controls` / `player1` / `player2`（分单人/双人）']
            ]
          },

          { h: '④ 引擎做了什么' },
          {
            ol: [
              "扫描所有已加载 mod 的 `data/config/controls/LIB_*`。",
              "对每个 `<control>` 调 `ControlsUtil.initCustomControl(controls, saveName)`，把键位注册进三套 Controls（solo / P1 / P2）。",
              "设置界面里生成对应的改键行；玩家按的键存进 `playerSettings` 的存档。",
              "切 mod 时会 `resetCustomControls()` 解绑，避免残留。"
            ]
          }
        ],
        deep: [
          { h: '⑤ 为什么不直接在脚本里读 `FlxG.keys`' },
          { p: "因为**玩家要能改键**。直接写死 `FlxG.keys.justPressed.F` 的问题：手柄用不了、玩家改不了、和别的 mod 撞键。走 `Controls` 体系则自动获得改键界面、手柄支持、存档。" },

          { h: '⑥ 冲突与优先级' },
          {
            ul: [
              "同一个 `saveName` 被两个 mod 用 → 后加载的覆盖前者。**加 mod 名前缀**能避免。",
              "你的键和原版键撞了不会报错，但打歌时会同时触发两件事。",
              "`Reset Save Data` 会把自定义键位一起清掉。"
            ]
          },
          { h: '⑦ 和游戏内键位表的关系' },
          { p: "设置 → 控制里的分组是：Notes(4) / UI(9) / Volume(3) / Engine(2) / Developer(4，仅开发者模式)，然后才是各 mod 的分类。你的分类排在这些之后的末尾。" }
        ]
      },

      /* ------------------------------------------------ 41 */
      {
        id: 'state-redirects',
        num: '41',
        title: 'StateRedirects：把原版界面换成你的',
        en: 'STATE REDIRECTS',
        tags: ['modpack.ini', 'StateRedirects', 'ModState'],
        simple: [
          { p: "**不用改源码**，就能把原版的某个界面（比如自由游玩）整个换成你自己写的脚本界面。" },
          { p: "做法：在 mod 的 `modpack.ini` 里写一行 `FreeplayState=\"我的界面名\"`。" }
        ],
        core: [
          { h: '① 怎么写' },
          { code: { lang: 'ini', title: 'mods/my-mod/data/config/modpack.ini', src: '[StateRedirects]\n# 左边 = 原版状态类名，右边 = 你要替换成的东西\nFreeplayState="MyFreeplay"\n# MainMenuState="MyMainMenu"\n# StoryMenuState="funkin.menus.FreeplayState"   ← 也可以指向一个真实存在的类\n\n[StateRedirects.force]\n# 和上面一样，但会覆盖「其他 addon 已经设过」的重定向' } },
          {
            kv: [
              ['`[StateRedirects]`', '只在**还没有人设过**这个键时才生效（先到先得）'],
              ['`[StateRedirects.force]`', '无条件覆盖，**优先级最高**'],
              ['左值', '原版状态的类名（不带包名），比如 `FreeplayState`'],
              ['右值', '**类名**（存在就用这个类）或**脚本名**（不存在就按脚本状态处理）']
            ]
          },

          { h: '② 右边写脚本名时会发生什么' },
          { p: "如果引擎找不到叫这个名字的类，就会创建 `new ModState(名字)`。而 `ModState` 会去加载 `data/states/<名字>.hx` —— 也就是说，**右边写什么，就等于加载哪个状态脚本**。" },
          { code: { lang: 'ini', title: '文件对应关系', src: 'modpack.ini:  FreeplayState="MyFreeplay"\n                    ↓\n加载脚本:    mods/my-mod/data/states/MyFreeplay.hx' } },
          { code: { lang: 'haxe', title: 'mods/my-mod/data/states/MyFreeplay.hx（最小状态脚本）', src: 'function create() {\n\t// 这里的 this 是一个 MusicBeatState\n\tvar bg = new FlxSprite().makeGraphic(FlxG.width, FlxG.height, 0xFF101820);\n\tadd(bg);\n\n\tvar txt = new FlxText(0, 0, 0, "这是我的自由游玩界面", 32);\n\ttxt.screenCenter();\n\tadd(txt);\n}\n\nfunction update(elapsed:Float) {\n\tif (FlxG.keys.justPressed.ESCAPE)\n\t\tFlxG.switchState(new MainMenuState());\n}' } },

          { h: '③ 能重定向哪些界面' },
          { p: "**任何继承 `MusicBeatState` 的状态**都可以，比如：" },
          {
            ul: [
              "`TitleState`（标题） / `MainMenuState`（主菜单）",
              "`FreeplayState`（自由游玩） / `StoryMenuState`（故事模式）",
              "`OptionsMenu`（设置） / `CreditsMain`（制作名单）",
              "甚至把 `StoryMenuState` 直接指向 `funkin.menus.FreeplayState`（等于砍掉故事模式）"
            ]
          },

          { h: '④ 什么时候用、什么时候别用' },
          {
            table: {
              head: ['需求', '建议'],
              rows: [
                ['只是往原界面加东西', '**别重定向**，用 `data/states/<状态名>.hx` 挂脚本'],
                ['要整体换布局/换交互', '重定向'],
                ['只是换贴图/文字', '改资源或翻译，别重定向'],
                ['要让玩家还能回原版', '重定向后自己提供返回入口']
              ]
            }
          }
        ],
        deep: [
          { h: '⑤ 底层机制（为什么能拦住）' },
          { p: "引擎在**每次切状态**时都会过一遍 `GlobalScript`：拿目标状态的类名去查 `Flags.MOD_REDIRECT_STATES`，命中就改道。" },
          { code: { lang: 'haxe', title: 'GlobalScript 里的判断（简化）', src: 'var stateName = Type.getClassName(stateClass);\nif (Flags.MOD_REDIRECT_STATES.exists(stateName)) {\n\tvar target = Flags.MOD_REDIRECT_STATES.get(stateName);\n\tvar cls = Type.resolveClass(target);\n\tif (cls != null) FlxG.game._requestedState = Type.createInstance(cls, []);\n\telse              FlxG.game._requestedState = new ModState(target);\n}' } },
          { p: "所以它**不需要改源码**，也不用 hook 任何函数 —— 只在「切状态」这一层做拦截。" },

          { h: '⑥ 三个坑' },
          {
            ul: [
              "**别指向自己**：`FreeplayState=\"FreeplayState\"` 或脚本里又切回同名状态 → 无限重定向 / 递归。",
              "**只在启动时读取**：改完 `modpack.ini` 要**重启游戏**。",
              "**类名要写对**：包名可以带（`funkin.menus.FreeplayState`），但简名必须与类名一致。"
            ]
          },
          { h: '⑦ 和「软编码 state 脚本」的区别' },
          {
            table: {
              head: ['方式', '做什么', '侵入性'],
              rows: [
                ['`data/states/XxxState.hx`', '给原状态**挂脚本**，在原界面基础上改', '低（推荐先试这个）'],
                ['`StateRedirects`', '**整个换掉**状态', '高（原逻辑全不走）'],
                ['`ModState` 直接跳', '新建一个自己的界面', '中（不动原界面）']
              ]
            }
          }
        ]
      },

      /* ------------------------------------------------ 42 */
      {
        id: 'flags-ini',
        num: '42',
        title: 'flags.ini 与 Flags 全表',
        en: 'FLAGS & flags.ini',
        tags: ['Flags', 'INI', '配置', '全表'],
        simple: [
          { p: "`Flags` 是**引擎级开关**：禁用编辑器、关掉警告页、改默认难度、改图标缩放……都在这。**共 195 个**。" },
          { p: "改法：在 `data/config/flags.ini` 里写 `键=值`，**重启游戏**生效。" }
        ],
        core: [
          { h: '① 两个入口' },
          {
            table: {
              head: ['文件', '作用范围', '分区前缀'],
              rows: [
                ['`assets/data/config/flags.ini`（基础）', '整个引擎', '见下表'],
                ['`mods/<mod>/data/config/modpack.ini` 的 `[Flags]`', '只有该 mod 生效', '**不加前缀**']
              ]
            }
          },
          {
            table: {
              head: ['分区', '前缀', '典型用途'],
              rows: [
                ['`[Flags]`', '无', '直接写 Flag 名，如 `ALLOW_CENTERED_FIELDS=false`'],
                ['`[Common]`', '`MOD_`', 'mod 元数据：`NAME` `DESCRIPTION` `AUTHOR` `API_VERSION`'],
                ['`[Discord]`', '`MOD_DISCORD_`', 'Discord RPC：`CLIENT_ID` `LOGO_KEY`'],
                ['`[StateRedirects]`', '—', '状态重定向（第 41 节）'],
                ['`[StateRedirects.force]`', '—', '强制重定向']
              ]
            }
          },
          { code: { lang: 'ini', title: 'data/config/flags.ini', src: '[Flags]\n# 关掉警告页（默认就是 true，很多 mod 会显式写一遍）\nDISABLE_WARNING_SCREEN=true\n\n# 关掉编辑器\nDISABLE_EDITORS=false\n\n# 默认难度\nDEFAULT_DIFFICULTY="normal"\n\n# 图标弹跳幅度\nBOP_ICON_SCALE=1.2\n\n[Common]\nNAME="My Mod"' } },

          { h: '② 值怎么写' },
          {
            table: {
              head: ['类型', '写法'],
              rows: [
                ['`Bool`', '`true` / `false`（小写）'],
                ['`Int`', '`4`'],
                ['`Float`', '`1.25`'],
                ['`String`', '`"内容"`（带引号）或裸写'],
                ['`Array<T>`', '逗号分隔，例如 `["zip","cnemod"]` 或 `zip,cnemod`']
              ]
            }
          },
          { callout: { kind: 'warn', title: '生效时机', text: "Flags 在**启动时**读取一次。改完必须重启游戏；运行中改 `Flags.xxx` 只影响后续代码读取，不会重新初始化已建好的东西。" } },

          { h: '③ 最常用的 20 个' },
          {
            table: {
              head: ['Flag', '默认', '作用'],
              rows: [
                ['`DISABLE_WARNING_SCREEN`', '`true`', '跳过启动警告页'],
                ['`DISABLE_EDITORS`', '`false`', '禁用所有编辑器（发行版常用）'],
                ['`DISABLE_LANGUAGES`', '`false`', '禁用语言选择'],
                ['`DEFAULT_DIFFICULTY`', '`"normal"`', '默认难度'],
                ['`DEFAULT_STAGE`', '`"stage"`', '默认舞台'],
                ['`DEFAULT_CHARACTER`', '`"bf"`', '默认角色'],
                ['`GAME_WIDTH` / `GAME_HEIGHT`', '`1280` / `720`', '内部渲染分辨率'],
                ['`BOP_ICON_SCALE`', '`1.2`', '血条图标弹跳幅度'],
                ['`ICON_DEFAULT_SCALE`', '`0.9`', '图标基础缩放'],
                ['`ICON_LERP`', '`0.15`', '图标回弹插值'],
                ['`HEALTHBAR_*` 系列', '—', '血条颜色/位置/分段'],
                ['`CHANGE_WINDOW_TITLE_PLAYSTATE`', '`true`', '打歌时把歌名写进标题'],
                ['`GITAROO_CHANCE`', '`0.1`', 'Gitaroo 暂停概率'],
                ['`SONGS_LIST_MOD_MODE`', '—', 'mod 歌曲列表合并方式'],
                ['`WEEKS_LIST_MOD_MODE`', '—', 'mod 周列表合并方式'],
                ['`DEFAULT_PAUSE_ITEMS`', '6 项', '暂停菜单选项'],
                ['`DEFAULT_GLSL_VERSION`', '自动', '着色器 GLSL 版本'],
                ['`SHADERS_CACHE_RESET_ON_SWITCH_STATE`', '`false`', '切状态重编 shader（调试）'],
                ['`ALLOWED_ZIP_EXTENSIONS`', '`["zip"]`', '允许的 mod 压缩包后缀'],
                ['`CURRENT_API_VERSION`', '`3`', '当前 Mod API 版本（只读性质）']
              ]
            }
          },

          { h: '④ 全部 195 个（按字母序）' },
          { p: "下表由源码 `Flags.hx` 自动抽取：**名称 / 类型 / 默认值**。默认值里的长表达式做了截断，仅供参考。" },
          {
  "table": {
    "head": [
      "Flag",
      "类型",
      "默认值"
    ],
    "rows": [
      [
        "ALLOW_CENTERED_FIELDS",
        "Bool",
        "true"
      ],
      [
        "ALLOWED_ZIP_EXTENSIONS",
        "Array<String>",
        "[\"zip\"]"
      ],
      [
        "BLACKLISTED_LANGUAGES",
        "Array<String>",
        "[]"
      ],
      [
        "BOP_ICON_SCALE",
        "Float",
        "1.2"
      ],
      [
        "CHANGE_WINDOW_TITLE_PLAYSTATE",
        "Bool",
        "true"
      ],
      [
        "COMMIT_HASH",
        "String",
        "GitCommitMacro.commitHash"
      ],
      [
        "COMMIT_MESSAGE",
        "String",
        "'Commit $COMMIT_NUMBER ($COMMIT_H…"
      ],
      [
        "COMMIT_NUMBER",
        "Int",
        "GitCommitMacro.commitNumber"
      ],
      [
        "CURRENT_API_VERSION",
        "Int",
        "3"
      ],
      [
        "customFlags",
        "Map<String, String>",
        "[]"
      ],
      [
        "DEFAULT_ALT_ANIM_SUFFIX",
        "String",
        "\"-alt\""
      ],
      [
        "DEFAULT_BEATS_PER_MEASURE",
        "Int",
        "4"
      ],
      [
        "DEFAULT_BPM",
        "Float",
        "100.0"
      ],
      [
        "DEFAULT_CAM_ZOOM",
        "Float",
        "1.05"
      ],
      [
        "DEFAULT_CAM_ZOOM_INTERVAL",
        "Int",
        "1"
      ],
      [
        "DEFAULT_CAM_ZOOM_LERP",
        "Float",
        "0.05"
      ],
      [
        "DEFAULT_CAM_ZOOM_MULT",
        "Float",
        "0.015"
      ],
      [
        "DEFAULT_CAM_ZOOM_OFFSET",
        "Float",
        "0"
      ],
      [
        "DEFAULT_CAM_ZOOM_STRENGTH",
        "Int",
        "1"
      ],
      [
        "DEFAULT_CAMERA_FOLLOW_SPEED",
        "Float",
        "0.04"
      ],
      [
        "DEFAULT_CHARACTER",
        "String",
        "\"bf\""
      ],
      [
        "DEFAULT_CHARACTER_GHOSTDISABLE_SOUND",
        "String",
        "\"editors/character/ghostDisable\""
      ],
      [
        "DEFAULT_CHARACTER_GHOSTENABLE_SOUND",
        "String",
        "\"editors/character/ghostEnable\""
      ],
      [
        "DEFAULT_CHARTER_HITSOUND_SOUND",
        "String",
        "\"editors/charter/hitsound\""
      ],
      [
        "DEFAULT_CHARTER_METRONOME_SOUND",
        "String",
        "\"editors/charter/metronome\""
      ],
      [
        "DEFAULT_CHARTER_NOTEDELETE_SOUND",
        "String",
        "\"editors/charter/noteDelete\""
      ],
      [
        "DEFAULT_CHARTER_NOTEPLACE_SOUND",
        "String",
        "\"editors/charter/notePlace\""
      ],
      [
        "DEFAULT_CHARTER_SCROLL_SOUND",
        "String",
        "\"editors/charter/scroll\""
      ],
      [
        "DEFAULT_CHARTER_SNAPPINGCHANGE_SOUND",
        "String",
        "\"editors/charter/snappingChange\""
      ],
      [
        "DEFAULT_CHARTER_STRUMLOCK_SOUND",
        "String",
        "\"editors/charter/strumLock\""
      ],
      [
        "DEFAULT_CHARTER_STRUMUNLOCK_SOUND",
        "String",
        "\"editors/charter/strumUnlock\""
      ],
      [
        "DEFAULT_CHARTER_SUSTAINADD_SOUND",
        "String",
        "\"editors/charter/sustainAdd\""
      ],
      [
        "DEFAULT_CHARTER_SUSTAINDELETE_SOUND",
        "String",
        "\"editors/charter/sustainDelete\""
      ],
      [
        "DEFAULT_COLOR",
        "FlxColor",
        "0xFF9271FD"
      ],
      [
        "DEFAULT_COMBO_GROUP_MAX_SIZE",
        "Int",
        "25"
      ],
      [
        "DEFAULT_COOP_ALLOWED",
        "Bool",
        "false"
      ],
      [
        "DEFAULT_COOP_MODE",
        "Bool",
        "false"
      ],
      [
        "DEFAULT_CUTSCENE_PAUSE_ITEMS",
        "Array<String>",
        "['Resume Cutscene', 'Skip Cutscen…"
      ],
      [
        "DEFAULT_DIFFICULTY",
        "String",
        "\"normal\""
      ],
      [
        "DEFAULT_DISCORD_CLIENT_ID",
        "String",
        "\"1383853614589673472\""
      ],
      [
        "DEFAULT_DISCORD_LOGO_KEY",
        "String",
        "\"icon\""
      ],
      [
        "DEFAULT_DISCORD_LOGO_TEXT",
        "String",
        "\"Codename Engine\""
      ],
      [
        "DEFAULT_EDITOR_AUTOSAVE_SOUND",
        "String",
        "\"editors/autosave\""
      ],
      [
        "DEFAULT_EDITOR_BUTTONCLICK_SOUND",
        "String",
        "\"editors/buttonClick\""
      ],
      [
        "DEFAULT_EDITOR_CHECKBOXCHECKED_SOUND",
        "String",
        "\"editors/checkboxChecked\""
      ],
      [
        "DEFAULT_EDITOR_CHECKBOXUNCHECKED_SOUND",
        "String",
        "\"editors/checkboxUnchecked\""
      ],
      [
        "DEFAULT_EDITOR_CLICK_SOUND",
        "String",
        "\"editors/click\""
      ],
      [
        "DEFAULT_EDITOR_COPY_SOUND",
        "String",
        "\"editors/copy\""
      ],
      [
        "DEFAULT_EDITOR_CUT_SOUND",
        "String",
        "\"editors/cut\""
      ],
      [
        "DEFAULT_EDITOR_DELETE_SOUND",
        "String",
        "\"editors/delete\""
      ],
      [
        "DEFAULT_EDITOR_DROPDOWNAPPEAR_SOUND",
        "String",
        "\"editors/dropdownAppear\""
      ],
      [
        "DEFAULT_EDITOR_OFFSETDRAG_SOUND",
        "String",
        "\"editors/offsetDrag\""
      ],
      [
        "DEFAULT_EDITOR_PASTE_SOUND",
        "String",
        "\"editors/paste\""
      ],
      [
        "DEFAULT_EDITOR_REDO_SOUND",
        "String",
        "\"editors/redo\""
      ],
      [
        "DEFAULT_EDITOR_SAVE_SOUND",
        "String",
        "\"editors/save\""
      ],
      [
        "DEFAULT_EDITOR_TEXTREMOVE_SOUND",
        "String",
        "\"editors/textRemove\""
      ],
      [
        "DEFAULT_EDITOR_TEXTTYPE_SOUND",
        "String",
        "\"editors/textType\""
      ],
      [
        "DEFAULT_EDITOR_UNDO_SOUND",
        "String",
        "\"editors/undo\""
      ],
      [
        "DEFAULT_EDITOR_WARNING_SOUND",
        "String",
        "\"editors/warningMenu\""
      ],
      [
        "DEFAULT_EDITOR_WINDOWAPPEAR_SOUND",
        "String",
        "\"editors/windowAppear\""
      ],
      [
        "DEFAULT_EDITOR_WINDOWCLOSE_SOUND",
        "String",
        "\"editors/windowClose\""
      ],
      [
        "DEFAULT_FONT",
        "String",
        "\"vcr.ttf\""
      ],
      [
        "DEFAULT_FONT_SIZE",
        "Int",
        "16"
      ],
      [
        "DEFAULT_GAMEOVER_CHARACTER",
        "String",
        "\"bf-dead\""
      ],
      [
        "DEFAULT_GAMEOVER_MUSIC",
        "String",
        "\"gameOver\""
      ],
      [
        "DEFAULT_GAMEOVER_SCRIPT",
        "String",
        "\"\""
      ],
      [
        "DEFAULT_GAMEOVEREND_SOUND",
        "String",
        "\"gameOverEnd\""
      ],
      [
        "DEFAULT_GAMEOVERSFX_SOUND",
        "String",
        "\"gameOverSFX\""
      ],
      [
        "DEFAULT_GIRLFRIEND",
        "String",
        "\"gf\""
      ],
      [
        "DEFAULT_GITAROO",
        "Bool",
        "true"
      ],
      [
        "DEFAULT_GLSL_VERSION",
        "String",
        "null"
      ],
      [
        "DEFAULT_HEALTH",
        "Null<Float>",
        "null"
      ],
      [
        "DEFAULT_HEALTH_ICON",
        "String",
        "\"face\""
      ],
      [
        "DEFAULT_HUD_ZOOM",
        "Float",
        "1.0"
      ],
      [
        "DEFAULT_HUD_ZOOM_LERP",
        "Float",
        "0.05"
      ],
      [
        "DEFAULT_HUD_ZOOM_MULT",
        "Float",
        "0.03"
      ],
      [
        "DEFAULT_ICONBOP",
        "Bool",
        "true"
      ],
      [
        "DEFAULT_INTRO_LENGTH",
        "Int",
        "5"
      ],
      [
        "DEFAULT_INTRO_SOUNDS",
        "Array<String>",
        "[\"intro3\", \"intro2\", \"intro1\", \"i…"
      ],
      [
        "DEFAULT_INTRO_SPRITES",
        "Array<String>",
        "[null, 'game/ready', 'game/set', …"
      ],
      [
        "DEFAULT_LANGUAGE",
        "String",
        "\"en\""
      ],
      [
        "DEFAULT_LANGUAGE_NAME",
        "String",
        "\"English\""
      ],
      [
        "DEFAULT_LOOP_TIME",
        "Float",
        "0.0"
      ],
      [
        "DEFAULT_MAX_HEALTH",
        "Float",
        "2.0"
      ],
      [
        "DEFAULT_MENU_CANCEL_SOUND",
        "String",
        "\"menu/cancel\""
      ],
      [
        "DEFAULT_MENU_CONFIRM_SOUND",
        "String",
        "\"menu/confirm\""
      ],
      [
        "DEFAULT_MENU_MUSIC",
        "String",
        "\"freakyMenu\""
      ],
      [
        "DEFAULT_MENU_SCROLL_SOUND",
        "String",
        "\"menu/scroll\""
      ],
      [
        "DEFAULT_MENU_VOLUME_SOUND",
        "String",
        "\"menu/volume\""
      ],
      [
        "DEFAULT_MISS_SOUNDS",
        "Array<String>",
        "[\"missnote1\", \"missnote2\", \"missn…"
      ],
      [
        "DEFAULT_MODCHART_HOLD_SUBDIVISIONS",
        "Int",
        "4"
      ],
      [
        "DEFAULT_MUTE_VOCALS_ON_MISS",
        "Bool",
        "true"
      ],
      [
        "DEFAULT_NOTE_MS_LIMIT",
        "Float",
        "1500"
      ],
      [
        "DEFAULT_NOTE_SCALE",
        "Float",
        "0.7"
      ],
      [
        "DEFAULT_OPPONENT",
        "String",
        "\"dad\""
      ],
      [
        "DEFAULT_OPPONENT_MODE",
        "Bool",
        "false"
      ],
      [
        "DEFAULT_OPPONENT_MODE_ALLOWED",
        "Bool",
        "false"
      ],
      [
        "DEFAULT_PAUSE_ITEMS",
        "Array<String>",
        "['Resume', 'Restart Song', 'Chang…"
      ],
      [
        "DEFAULT_PAUSE_MENU_MUSIC",
        "String",
        "\"breakfast\""
      ],
      [
        "DEFAULT_PAUSE_SCRIPT",
        "String",
        "\"\""
      ],
      [
        "DEFAULT_SCROLL_SPEED",
        "Float",
        "2.0"
      ],
      [
        "DEFAULT_SOUND_TIME_SCALED_PITCH",
        "Null<Bool>",
        "null"
      ],
      [
        "DEFAULT_SOUNDTRAY_SCRIPT",
        "String",
        "\"data/soundTray\""
      ],
      [
        "DEFAULT_STAGE",
        "String",
        "\"stage\""
      ],
      [
        "DEFAULT_STEPS_PER_BEAT",
        "Int",
        "4"
      ],
      [
        "DEFAULT_STRUM_AMOUNT",
        "Int",
        "4"
      ],
      [
        "DEFAULT_TRANSITION_SCRIPT",
        "String",
        "\"\""
      ],
      [
        "DEFAULT_WEEK_COLOR",
        "FlxColor",
        "0xFFF9CF51"
      ],
      [
        "DEFAULT_ZOOM",
        "Float",
        "1.0"
      ],
      [
        "DEFAULT_ZOOM_LERP",
        "Float",
        "0.05"
      ],
      [
        "DISABLE_AUTOUPDATER",
        "Bool",
        "false"
      ],
      [
        "DISABLE_EDITORS",
        "Bool",
        "false"
      ],
      [
        "DISABLE_LANGUAGES",
        "Bool",
        "false"
      ],
      [
        "DISABLE_TRANSITIONS",
        "Bool",
        "false"
      ],
      [
        "DISABLE_WARNING_SCREEN",
        "Bool",
        "true"
      ],
      [
        "EARLY_HIT_WINDOW_RANGE",
        "Float",
        "1.0"
      ],
      [
        "FUNKIN_SHADER_CODE_FRAGMENT_PREFIX",
        "String",
        "\"\""
      ],
      [
        "FUNKIN_SHADER_CODE_PREFIX",
        "String",
        "\"\""
      ],
      [
        "FUNKIN_SHADER_CODE_VERTEX_PREFIX",
        "String",
        "\"\""
      ],
      [
        "GAME_HEIGHT",
        "Int",
        "720"
      ],
      [
        "GAME_WIDTH",
        "Int",
        "1280"
      ],
      [
        "GITAROO_CHANCE",
        "Float",
        "0.1"
      ],
      [
        "ICON_DEFAULT_SCALE",
        "Float",
        "1"
      ],
      [
        "ICON_LERP",
        "Float",
        "0.33"
      ],
      [
        "ICON_OFFSET",
        "Float",
        "26"
      ],
      [
        "ICONS_AUTOPOSITION",
        "Bool",
        "true"
      ],
      [
        "IMAGE_EXT",
        "Null<String>",
        "null"
      ],
      [
        "IMAGE_EXTS",
        "Array<String>",
        "[\"png\", \"jpg\", \"jpeg\"]"
      ],
      [
        "JSON_PRETTY_PRINT",
        "String",
        "\"\\t\""
      ],
      [
        "LATE_HIT_WINDOW_RANGE",
        "Float",
        "1.0"
      ],
      [
        "MAIN_DEVS_COLOR",
        "FlxColor",
        "0xFF9C35D5"
      ],
      [
        "MAX_CAMERA_ZOOM_MULT",
        "Float",
        "10"
      ],
      [
        "MAX_SPLASHES",
        "Int",
        "8"
      ],
      [
        "MIN_CONTRIBUTIONS_COLOR",
        "FlxColor",
        "0xFFB4A7DA"
      ],
      [
        "MOD_API_VERSION",
        "Null<Int>",
        "null"
      ],
      [
        "MOD_AUTHOR",
        "String",
        "\"\""
      ],
      [
        "MOD_DEPENDENCIES",
        "Array<String>",
        "[]"
      ],
      [
        "MOD_DESCRIPTION",
        "String",
        "\"\""
      ],
      [
        "MOD_DISCORD_CLIENT_ID",
        "String",
        "\"\""
      ],
      [
        "MOD_DISCORD_LOGO_KEY",
        "String",
        "\"\""
      ],
      [
        "MOD_DISCORD_LOGO_TEXT",
        "String",
        "\"\""
      ],
      [
        "MOD_DOWNLOAD_LINK",
        "String",
        "\"\""
      ],
      [
        "MOD_ICON",
        "Null<String>",
        "null"
      ],
      [
        "MOD_ICON16",
        "Null<String>",
        "null"
      ],
      [
        "MOD_ICON24",
        "Null<String>",
        "null"
      ],
      [
        "MOD_ICON32",
        "Null<String>",
        "null"
      ],
      [
        "MOD_ICON64",
        "Null<String>",
        "null"
      ],
      [
        "MOD_ICONS",
        "Array<String>",
        "[\"icon16\", \"icon24\", \"icon32\", \"i…"
      ],
      [
        "MOD_NAME",
        "String",
        "\"\""
      ],
      [
        "MOD_REDIRECT_STATES",
        "Map<String, String>",
        "[]"
      ],
      [
        "overridenFlags",
        "Map<String, Bool>",
        "[]"
      ],
      [
        "PATHS_CACHE_LIFETIME",
        "Null<Int>",
        "null"
      ],
      [
        "PATHS_CACHE_RESET_ON_SWITCH_STATE",
        "Bool",
        "true"
      ],
      [
        "PATHS_CASE_SENSITIVE_FIX",
        "Null<Bool>",
        "null"
      ],
      [
        "PIXEL_ART_SCALE",
        "Float",
        "6.0"
      ],
      [
        "REPO_NAME",
        "String",
        "\"CodenameEngine\""
      ],
      [
        "REPO_OWNER",
        "String",
        "\"CodenameCrew\""
      ],
      [
        "REPO_URL",
        "String",
        "'https://github.com/$REPO_OWNER/$…"
      ],
      [
        "SAVE_NAME",
        "String",
        "haxe.macro.Compiler.getDefine(\"SA…"
      ],
      [
        "SAVE_PATH",
        "String",
        "haxe.macro.Compiler.getDefine(\"SA…"
      ],
      [
        "SHADERS_CACHE_RESET_ON_SWITCH_STATE",
        "Bool",
        "false"
      ],
      [
        "SHITS_BREAK_COMBO",
        "Bool",
        "true"
      ],
      [
        "SONGS_LIST_MOD_MODE",
        "Allow<\"prepend\", \"override\", \"append\">",
        "\"override\""
      ],
      [
        "SOUND_EXT",
        "Null<String>",
        "null"
      ],
      [
        "SOUND_EXTS",
        "Array<String>",
        "[#if web \"mp3\", \"ogg\", #else \"ogg…"
      ],
      [
        "STUNNED_TIME",
        "Float",
        "5 / 60"
      ],
      [
        "SUPPORTED_CHART_FORMATS",
        "Array<String>",
        "[\"BaseGame\"]"
      ],
      [
        "SUPPORTED_CHART_RUNTIME_FORMATS",
        "Array<String>",
        "[\"Legacy\", \"Psych Engine\"]"
      ],
      [
        "SUSTAINS_AS_ONE_NOTE",
        "Null<Bool>",
        "null"
      ],
      [
        "TITLE",
        "String",
        "Application.current.meta.get('nam…"
      ],
      [
        "UNDO_PREFIX",
        "String",
        "\"* \""
      ],
      [
        "URL_EDITOR_FALLBACK",
        "String",
        "\"https://www.youtube.com/watch?v=…"
      ],
      [
        "URL_FNF_ITCH",
        "String",
        "\"https://ninja-muffin24.itch.io/f…"
      ],
      [
        "URL_WIKI",
        "String",
        "\"https://codename-engine.com/\""
      ],
      [
        "USE_CAM_ZOOM_MULT",
        "Bool",
        "true"
      ],
      [
        "USE_FLXTRAIL_FRAMES",
        "Null<Bool>",
        "null"
      ],
      [
        "USE_LEGACY_CENTER_CAM",
        "Null<Bool>",
        "null"
      ],
      [
        "USE_LEGACY_FLXANIMATE_STAGE_MATRIX",
        "Null<Bool>",
        "null"
      ],
      [
        "USE_LEGACY_TIMING",
        "Null<Bool>",
        "null"
      ],
      [
        "USE_SOUND_VOLUME_CURVE",
        "Null<Bool>",
        "null"
      ],
      [
        "USER_AGENT",
        "String",
        "'request'"
      ],
      [
        "VERSION",
        "String",
        "Application.current.meta.get('ver…"
      ],
      [
        "VERSION_MESSAGE",
        "String",
        "'Codename Engine v$VERSION'"
      ],
      [
        "VIDEO_EXT",
        "Null<String>",
        "null"
      ],
      [
        "VIDEO_EXTS",
        "Array<String>",
        "[\"mp4\", \"webm\", \"mkv\", \"mov\"]"
      ],
      [
        "VOCAL_OFFSET_VIOLATION_THRESHOLD",
        "Float",
        "25"
      ],
      [
        "VSLICE_DEFAULT_ALBUM_ID",
        "String",
        "'volume1'"
      ],
      [
        "VSLICE_DEFAULT_NOTE_STYLE",
        "String",
        "'funkin'"
      ],
      [
        "VSLICE_DEFAULT_PREVIEW_END",
        "Int",
        "15000"
      ],
      [
        "VSLICE_DEFAULT_PREVIEW_START",
        "Int",
        "0"
      ],
      [
        "VSLICE_SONG_CHART_DATA_VERSION",
        "String",
        "\"2.0.0\""
      ],
      [
        "VSLICE_SONG_METADATA_VERSION",
        "String",
        "\"2.2.2\""
      ],
      [
        "WEEKS_LIST_MOD_MODE",
        "Allow<\"prepend\", \"override\", \"append\">",
        "\"override\""
      ],
      [
        "WHITELISTED_LANGUAGES",
        "Array<String>",
        "[]"
      ],
      [
        "WINDOW_TITLE_USE_MOD_NAME",
        "Null<Bool>",
        "null"
      ]
    ]
  }
}
        ],
        deep: [
          { h: '⑤ 为什么是 `@:lazy`' },
          { p: "Flags 里大量字段标了 `@:lazy`：**第一次被读取时才从 ini 里解析**。这样既避免启动时解析 195 个值，又能保证「用到的才付代价」。副作用是：**你没读过的 Flag，改了也不会出现在 `overridenFlags` 里**。" },
          { h: '⑥ `overridenFlags` 是干什么的' },
          { p: "引擎会记录「哪些 Flag 被 ini 显式改过」。像 `WINDOW_TITLE_USE_MOD_NAME` 这种联动项，就靠它判断「用户是不是自己设了标题」，没设才用 mod 名。" },
          { h: '⑦ 排查「我改了没生效」' },
          {
            ol: [
              "确认改的是**基础 `assets/data/config/flags.ini`** 还是 **mod 的 `[Flags]`** —— mod 的只在该 mod 生效。",
              "确认值类型对：`true` 不是 `True`，字符串要引号。",
              "确认改完**重启**了。",
              "确认该 Flag 没被别处硬编码覆盖（有些 Flag 只是「初始值」，之后会被 Options 或代码改）。"
            ]
          },
          { h: '⑧ Flags 与 Options 的分工' },
          {
            table: {
              head: ['', 'Flags', 'Options'],
              rows: [
                ['谁改', 'mod 作者 / 发行方', '玩家'],
                ['改哪', 'ini 文件', '设置界面'],
                ['何时生效', '启动时', '即时'],
                ['典型', '禁用编辑器、默认难度', '下滚、音量、偏移']
              ]
            }
          }
        ]
      },

      /* ------------------------------------------------ 43 */
      {
        id: 'command-line',
        num: '43',
        title: '命令行参数：从快捷方式直接进游戏',
        en: 'COMMAND LINE',
        tags: ['命令行', '启动参数', '调试'],
        simple: [
          { p: "给 exe 加参数就能**跳过菜单直接进歌、指定 mod、开详细日志**。做测试时非常省时间。" },
          { p: "用法：`CodenameEngine.exe -song bopeebo hard`" }
        ],
        core: [
          { h: '① 全部参数（源码 `CommandLineHandler`）' },
          {
            table: {
              head: ['参数', '参数值', '作用'],
              rows: [
                ['`-h` / `-help` / `help`', '—', '打印帮助并退出'],
                ['`-mod` / `-m` / `-currentmod`', '`<mod名>`', '启动时加载指定 mod'],
                ['`-modfolder`', '`<路径>`', '改 `mods/` 目录位置'],
                ['`-addonsfolder`', '`<路径>`', '改 `addons/` 目录位置'],
                ['`-song`', '`<歌> [难度] [变体]`', '**直接进打歌**'],
                ['`-chart`', '`<歌> [难度] [变体]`', '**直接进谱面编辑器**'],
                ['`-nocolor`', '—', '关掉终端彩色输出'],
                ['`-nogpubitmap`', '—', '强制关闭 GPU-only 位图'],
                ['`-nocwdfix`', '—', '关闭自动工作目录修正'],
                ['`-livereload`', '—', '标记为热重载会话（自由游玩里按 `8` 可转换谱面）'],
                ['`-v` / `-verbose` / `--verbose`', '—', '输出详细日志（VERBOSE 级）']
              ]
            }
          },
          { callout: { kind: 'info', title: '注意', text: "`-mod` / `-modfolder` / `-addonsfolder` 只在**编译时开了 `MOD_SUPPORT`** 的构建里存在（桌面版都有）。" } },

          { h: '② 怎么用' },
          { code: { lang: 'ini', title: '快捷方式 / 批处理', src: ':: 直接进某首歌\nCodenameEngine.exe -song bopeebo hard\n\n:: 带变体\nCodenameEngine.exe -song pico erect erect\n\n:: 进编辑器改谱\nCodenameEngine.exe -chart bopeebo hard\n\n:: 指定 mod + 详细日志\nCodenameEngine.exe -mod "my-mod" -v\n\n:: 测试别的 mods 目录\nCodenameEngine.exe -modfolder "D:\\test-mods"' } },
          { p: "在 Windows 上：右键 exe → 发送到 → 桌面快捷方式 → 属性 → 目标，在路径后面加空格加参数。" },

          { h: '③ 参数的解析规则（容易踩的坑）' },
          {
            ul: [
              "`-song` 后面的**难度和变体是可选的**，判断方式是「下一个参数是不是以 `-` 开头」。",
              "所以**歌名不能以 `-` 开头**，否则会被当成下一个参数。",
              "路径带空格要加引号（`-modfolder \"D:\\my mods\"`）。",
              "未知参数会打印 `Unknown command \"xxx\"`，但**不会退出**。"
            ]
          }
        ],
        deep: [
          { h: '④ `-song` 与 `-chart` 的差别' },
          { p: "两者都设置 `Main.goToSong`，区别是 `-chart` 会同时把 `Main.goToCharter = true`。启动流程在 `MainState` 里判断：有 `goToSong` 就 `PlayState.loadSong(...)`，如果还带 `goToCharter` 就改成进 `Charter`。" },
          { h: '⑤ `-nocwdfix` 什么时候需要' },
          { p: "引擎默认会把工作目录修正到 exe 所在目录（这样从任何位置启动都能找到 assets）。如果你用**符号链接/自定义启动器**，这个修正可能反而指错，就用 `-nocwdfix` 关掉。" },
          { h: '⑥ 配合调试的推荐组合' },
          {
            kv: [
              ['改脚本时', '`-v -song <当前歌> <难度>` —— 一遍遍手动进歌太慢'],
              ['查加载问题', '`-v` 能看到每个资源库、每个脚本的加载日志'],
              ['测多 mod 共存', '`-modfolder` 指向一个只放了两三个 mod 的测试目录'],
              ['给玩家排错', '让他在快捷方式后加 `-v`，把终端输出发你']
            ]
          }
        ]
      },

      /* ------------------------------------------------ 44 */
      {
        id: 'logs-and-crash',
        num: '44',
        title: '日志、崩溃与排查流程',
        en: 'LOGS & CRASHES',
        tags: ['日志', '崩溃', '排查', 'Logs'],
        simple: [
          { p: "出问题时**第一件事是看日志**，不是改代码。" },
          { p: "日志有三个地方能看到：游戏内控制台（`F2`）、启动时的终端窗口、以及崩溃时的全屏报错界面。" }
        ],
        core: [
          { h: '① 三个看日志的地方' },
          {
            table: {
              head: ['入口', '怎么开', '看得到什么'],
              rows: [
                ['游戏内控制台', '`F2`（需开发者模式）', '最近 100 条日志，可按级别/关键字过滤'],
                ['启动终端', '从 cmd 启动，或设置里开「Show Console」', '完整 stdout，`-v` 后最详细'],
                ['崩溃界面', '崩溃时自动出现', '异常信息 + 调用栈 + 两个按钮']
              ]
            }
          },
          { p: "如果是从 GitHub Actions 下的发布版，双击 exe 通常看不到终端 —— 去**设置 → 开发者模式 → Show Console**（Windows 原生控制台），或者按 `F2` 看游戏内控制台。" },

          { h: '② 日志的分级' },
          {
            table: {
              head: ['级别', '前缀/颜色', '含义'],
              rows: [
                ['`TRACE`', '脚本 `trace()` 的输出', '普通调试信息'],
                ['`INFO`', '蓝色', '一般信息'],
                ['`WARNING`', '黄色', '能继续跑，但可能有问题'],
                ['`ERROR`', '红色', '出错了，功能可能失效'],
                ['`VERBOSE`', '灰色', '只有 `-v` 才显示（加载细节等）']
              ]
            }
          },
          { p: "脚本里的 `trace()` 会带上**文件:行号**，这是定位问题最有效的信息。" },

          { h: '③ 崩溃时会发生什么（`CrashHandler`）' },
          {
            ol: [
              "捕获异常，生成一份报告（异常信息 + 堆栈）。",
              "**隔离（quarantine）**：把当前正在执行的脚本 `active = false`、暂停音乐、静音整棵状态树。",
              "弹出**全屏崩溃界面**，上面是报告文本，下面两个按钮：**QUIT GAME**（退出）/ **RESET MOD**（重载当前 mod 再试）。",
              "如果连崩溃界面都画不出来，直接退出游戏。"
            ]
          },
          { callout: { kind: 'tip', title: '这功能很好用', text: "崩溃时**出错的那个脚本会被禁用**，所以点 RESET MOD 往往能让你进游戏、继续排查，而不是每次都被同一个脚本卡死。" } },

          { h: '④ 排查流程（按这个顺序）' },
          {
            ol: [
              "**看最后一条 ERROR**：日志里红色那条通常就是根因，前面的只是它的后果。",
              "**看文件名与行号**：`my-mod:script.hx:42` 直接跳过去看那一行。",
              "**判断类型**：是解析错误（语法）、运行时错误（null/类型）、还是资源缺失（找不到图片/音频）。",
              "**最小复现**：把脚本后半段注释掉，看是否还崩；二分找到具体语句。",
              "**对照本文第 46 节**（报错速查表）看有没有现成答案。"
            ]
          }
        ],
        deep: [
          { h: '⑤ 常见日志原文 → 含义' },
          {
            table: {
              head: ['日志里出现', '含义'],
              rows: [
                ['`Unknown identifier : xxx`', '用了个不存在的变量/函数名（拼写错误最常见）'],
                ['`Cannot access field xxx of null`', '对 `null` 取字段 —— 对象还没建好，或真的没找到'],
                ['`Script at xxx does not exist`', '`importScript` 的路径写错'],
                ['`Couldn\'t find ndll at xxx`', 'ndll 路径/命名不对（见第 20 节）'],
                ['`Chart for song xxx at "xxx" was not found`', '找谱面失败：歌名/难度/变体拼错'],
                ['`data/charts/ is deprecated`', '把脚本放到了废弃目录（应放 `songs/`）'],
                ['`An option node requires a name attribute`', '自定义设置项少了 `name`'],
                ['`A slider option requires an "id"`', '自定义设置项少了 `id`（会被跳过）'],
                ['`Error while parsing controls.xml`', '自定义按键 XML 格式错'],
                ['`Compressed Library Detected`', 'mod 是 zip，编辑器无法写文件'],
                ['`Shader compilation failed`', 'shader 语法错（看具体行号）']
              ]
            }
          },
          { h: '⑥ 没有日志、但就是不对' },
          {
            ul: [
              "**资源没生效**：99% 是路径/大小写错了（`mods/x/data/...` 不是 `assets/data/...`）。",
              "**脚本没跑**：函数名拼错、或写在 `class {}` 里（见第 18 节）。",
              "**画面全黑**：XML 解析失败（少 `/`、`&` 没转义、BOM）。",
              "**改了没变化**：缓存（`Ctrl+F5` 是网页的事；游戏里按 `F5` 重载状态）。"
            ]
          },
          { h: '⑦ 给玩家收集信息' },
          { p: "让玩家这样做，你能省一半沟通成本：**用 `-v` 启动 → 复现一次 → 把终端/崩溃界面的文本截图发你**。崩溃界面里的堆栈比「它崩了」有用一万倍。" }
        ]
      },

      /* ------------------------------------------------ 45 */
      {
        id: 'performance',
        num: '45',
        title: '性能优化：让你的 mod 不掉帧',
        en: 'PERFORMANCE',
        tags: ['性能', '内存', '绘制调用', '优化'],
        simple: [
          { p: "FNF 引擎的瓶颈通常只有三个：**画得太多（绘制调用）**、**内存太满**、**每帧干了重活**。" },
          { p: "先测量再优化：`F3` 看帧率/内存/绘制调用，别凭感觉。" }
        ],
        core: [
          { h: '① 先学会测量' },
          {
            table: {
              head: ['指标', '在哪看', '健康值'],
              rows: [
                ['FPS', '`F3` 第一行', '稳定 60+（目标是你的帧率上限）'],
                ['MEM', '`F3` 第二行', '几百 MB 内；持续上涨 = 泄漏'],
                ['对象数', '`F3` Flixel 区块', '稳定；打歌中不该一直涨'],
                ['绘制调用 `totalDC`', '`F3` Stats 区块', '越低越好，几百以内算健康'],
                ['当前状态', '`F3` Flixel 区块', '确认没在跑多余的状态']
              ]
            }
          },

          { h: '② 绘制调用：最大的性能杀手' },
          {
            ul: [
              "**合并图集**：人物用一个图集、舞台用一个图集，比散图快得多。",
              "**别放一堆独立小图**：每个 Sprite = 至少一次绘制调用。",
              "**静态背景合成一张**：原本 5 层的背景，能合就合。",
              "**`visible = false` 的对象不再绘制**：离开画面的东西记得关掉。",
              "**`pixelPerfectRender`** 只给像素风开（它有自己的开销）。"
            ]
          },

          { h: '③ 内存：图集与贴图' },
          {
            table: {
              head: ['做法', '效果'],
              rows: [
                ['贴图尺寸控制在 2048×2048 以内', '避免超大纹理常驻显存'],
                ['`Options.lowMemoryMode`', '只加载舞台 XML 里 `low-memory` 分组的元素'],
                ['`Options.gpuOnlyBitmaps`', '位图只留显存（省内存，个别机器花屏）'],
                ['`Options.streamedMusic/Vocals`', '音频流式加载（低配机器应该**开**）'],
                ['及时 `destroy()` 自建对象', '否则切歌几次后内存一路涨']
              ]
            }
          },

          { h: '④ 每帧开销：脚本与对象创建' },
          { code: { lang: 'haxe', title: '常见浪费与改法', src: '// ✗ 每帧 new 对象（GC 压力）\nfunction update(elapsed:Float) {\n\tvar p = new FlxPoint(mouseX, mouseY);\n\ttrace(new Date().toString());\n}\n\n// ✓ 复用 / 按需\nvar _p = new FlxPoint();\nfunction update(elapsed:Float) {\n\t_p.set(mouseX, mouseY);\n}\n\n// ✗ 每帧遍历上千对象做判断\n// ✓ 只在变化时处理，或用 FlxTimer / 按拍触发' } },
          {
            ul: [
              "**`update` 里别做重计算**：能按拍就按拍（`beatHit`），能定时就 `FlxTimer`。",
              "**别在循环里创建 lambda**：`array.map(function(v) ...)` 每帧跑一次 = 每帧一堆闭包。",
              "**纹理缓存**：同一张图反复 `Paths.image()` 是会走缓存，但反复 `loadGraphic` 不一定。",
              "**shader 数量**：相机级 shader 是全屏逐像素，2 个以上就要警惕。"
            ]
          },

          { h: '⑤ 打歌时的专项优化' },
          {
            table: {
              head: ['手段', '说明'],
              rows: [
                ['`Options.gameplayShaders = false`', '关掉所有游戏内 shader（最立竿见影）'],
                ['降低长按细分（modchart）', '`Options.modchartingHoldSubdivisions` 调小'],
                ['减少同屏角色', '每个角色都是独立 Sprite + 动画'],
                ['避免超长 sustain', '几千毫秒的长按会生成大量子对象'],
                ['`FlxG.drawFramerate` 低于 `updateFramerate`', '逻辑照跑，绘制减半']
              ]
            }
          }
        ],
        deep: [
          { h: '⑥ 一个真实的优化顺序' },
          {
            ol: [
              "**先测**：录一段 F3，看 FPS / MEM / DC 哪个是瓶颈。",
              "FPS 低但 DC 不高 → 大概率是 **CPU 端每帧逻辑**（脚本、遍历、补间太多）。",
              "FPS 低且 DC 很高 → **绘制调用**问题（散图、未合并、全屏 shader）。",
              "MEM 一直涨 → **泄漏**（自建对象没销毁、事件没解绑、脚本被反复 import）。",
              "打歌开始卡、越打越卡 → **长按对象**或**特效累积**。"
            ]
          },
          { h: '⑦ 泄漏自查清单' },
          {
            ul: [
              "`new` 出来的东西有没有在 `destroy()` 里销毁？",
              "相机的 shader 有没有 `removeShader`？",
              "`FlxTween` 有没有 `cancelTweensOf`（切歌时残留的补间会继续跑）？",
              "自定义信号/监听有没有解绑？",
              "`importScript` 有没有重复加载同一个脚本？"
            ]
          },
          { h: '⑧ 别过度优化' },
          { p: "先让东西能跑、能看，再优化。**没有测量的优化都是猜**。很多时候帧数低只是因为「你开了 4 个全屏 shader」，删掉两个就好了。" }
        ]
      },

      /* ------------------------------------------------ 46 */
      {
        id: 'error-lookup',
        num: '46',
        title: '报错速查：日志说什么 = 你哪里错了',
        en: 'ERROR LOOKUP',
        tags: ['报错', '排查', '速查'],
        simple: [
          { p: "把日志里那句英文，拿到这张表里对一下，基本能知道是哪一类问题。" }
        ],
        core: [
          { h: '① 脚本类' },
          {
            table: {
              head: ['日志', '原因', '解法'],
              rows: [
                ['`Unknown identifier : xxx`', '变量/函数名不存在', '检查拼写；确认它在同一个脚本里定义；跨脚本要 `public`'],
                ['`Cannot access field xxx of null`', '对象是 null', '`create()` 里访问了还没生成的对象 → 改到 `postCreate`'],
                ['`Unexpected token` / `Invalid character`', '语法错（括号/引号/分号）', '看行号往上找未闭合的结构'],
                ['`Expected ;`', '少分号（HScript 同样要求）', '上一行补 `;`'],
                ['`Unknown class : xxx`', '类没编译进来 / 名字错', '确认需不需要 `import`；确认构建没裁剪'],
                ['`Script at xxx does not exist`', '`importScript` 路径错', '路径相对 `assets/`，不带扩展名'],
                ['`Module not found : xxx`', '`import` 的模块不存在', '检查 `assets/source/` 下有没有这个文件'],
                ['`Invalid number of arguments`', '函数参数个数不对', '看回调签名（第 30 节）']
              ]
            }
          },

          { h: '② 资源类' },
          {
            table: {
              head: ['日志', '原因', '解法'],
              rows: [
                ['`Could not find asset xxx`', '资源不存在', '检查路径、大小写、是否在正确的 mod 里'],
                ['黑屏但没有日志', 'XML 解析失败', '检查自闭合 `/`、`&` 转义、UTF-8 无 BOM'],
                ['图片显示成方块/白图', '图集 XML 与 PNG 不匹配', '两张要同名同目录'],
                ['`Chart for song xxx ... was not found`', '谱面路径不对', '`songs/<歌>/charts/<难度>.json`，难度名要一致'],
                ['音频不播', '文件名/格式不对', '`song/Inst.ogg` 固定名；或看 `SOUND_EXTS`'],
                ['`Couldn\'t find ndll at xxx`', 'ndll 缺失/命名错', '`ndlls/<名>-windows.ndll`，见第 20 节']
              ]
            }
          },

          { h: '③ 配置类' },
          {
            table: {
              head: ['日志', '原因', '解法'],
              rows: [
                ['`An option node requires a name attribute`', '自定义设置项缺 `name`', '补 `name`（第 39 节）'],
                ['`A xxx option requires an "id"`', '自定义设置项缺 `id`', '补 `id`，否则该项被跳过'],
                ['`Error while parsing controls.xml`', '自定义按键 XML 格式错', '检查根节点/`category`/`control` 层级'],
                ['`data/charts/ is deprecated`', '脚本放错目录', '移到 `songs/<歌>/scripts/`'],
                ['`Compressed Library Detected`', 'mod 是 zip，编辑器写不了', '解压成文件夹再编辑'],
                ['`Unknown command "xxx"`', '命令行参数拼错', '对照第 43 节'],
                ['`Missing name for shader script`', '`ScriptableShader` 没给名字', '给 `new ScriptableShader(shader, "名字")` 传名字']
              ]
            }
          },

          { h: '④ 崩溃与卡死' },
          {
            table: {
              head: ['现象', '最可能的原因'],
              rows: [
                ['一进歌就崩', '舞台/人物 XML 错，或脚本 `create` 里访问空对象'],
                ['切 mod 后崩', '`static var` 被清空后继续用，或残留上个 mod 的对象'],
                ['打一会儿崩', '长按对象爆炸 / 内存耗尽 / 补间泄漏'],
                ['点 RESET MOD 能进游戏', '说明是某个脚本的问题（崩溃时它已被禁用）'],
                ['编辑器里崩', '该 mod 是 zip，或文件被占用'],
                ['无声但没崩', '音频路径错 / 人声与伴奏时长不一致']
              ]
            }
          }
        ],
        deep: [
          { h: '⑤ 定位技巧：让日志说话' },
          { code: { lang: 'haxe', title: '在关键位置埋点', src: 'function postCreate() {\n\ttrace("[mymod] postCreate 开始");\n\n\ttrace("[mymod] bf = " + boyfriend);\n\ttrace("[mymod] stage = " + stage);\n\n\t// 如果上面这行没打印，说明脚本根本没加载\n\ttrace("[mymod] postCreate 结束");\n}' } },
          { p: "日志里**没出现**你埋的点，才是最有价值的信息 —— 说明流程根本没走到那里。" },

          { h: '⑥ 二分法定位' },
          {
            ol: [
              "把脚本后半段整体注释掉。",
              "还崩 → 问题在前半段；不崩 → 问题在后半段。",
              "重复，直到剩下一两行。",
              "如果是 XML 问题，就一个节点一个节点地删。"
            ]
          },
          { h: '⑦ 报 bug 时该带什么' },
          {
            ul: [
              "引擎版本（比如 `#1392`）",
              "mod 名与版本、`API_VERSION`",
              "复现步骤（越短越好）",
              "**完整日志**（`-v` 启动）或崩溃界面的堆栈",
              "如果能定位到某个文件，直接说文件名"
            ]
          }
        ]
      },

      {
        "id": "appendix",
        "num": "47",
        "title": "附录：快捷键、术语与链接",
        "en": "APPENDIX",
        "tags": [
          "附录",
          "快捷键",
          "术语",
          "链接"
        ],
        "simple": [
          {
            "p": "最后一页：查快捷键、查术语、查链接。"
          }
        ],
        "core": [
          {
            "h": "游戏内快捷键"
          },
          {
            "table": {
              "head": [
                "按键",
                "作用",
                "备注"
              ],
              "rows": [
                [
                  "`Enter`",
                  "确认 / 暂停",
                  "P1 默认"
                ],
                [
                  "`Backspace`",
                  "返回",
                  "P1 默认"
                ],
                [
                  "`Esc`",
                  "返回 / 暂停",
                  "P2 默认"
                ],
                [
                  "`A S W D`",
                  "四个音符键",
                  "P1 默认"
                ],
                [
                  "`↑ ↓ ← →`",
                  "四个音符键",
                  "P2 默认"
                ],
                [
                  "`TAB`",
                  "切换 Mod / 切换模式",
                  "主菜单 = Mod 菜单"
                ],
                [
                  "`R`",
                  "重开",
                  ""
                ],
                [
                  "`F3`",
                  "帧率面板",
                  "需开启 FPS 计数器"
                ],
                [
                  "`7`",
                  "编辑器",
                  "**需开发者模式**"
                ],
                [
                  "`F2`",
                  "控制台",
                  "**需开发者模式**"
                ],
                [
                  "`F4`",
                  "检查器",
                  "**需开发者模式**"
                ],
                [
                  "`F5`",
                  "重载当前界面",
                  "**需开发者模式**"
                ],
                [
                  "`Shift+F5`",
                  "重载全局脚本",
                  "**需开发者模式**"
                ],
                [
                  "`+` / `-` / `0`",
                  "音量 / 静音",
                  ""
                ]
              ]
            }
          },
          {
            "h": "谱面编辑器快捷键（常用）"
          },
          {
            "table": {
              "head": [
                "按键",
                "作用"
              ],
              "rows": [
                [
                  "`Space`",
                  "播放 / 暂停"
                ],
                [
                  "`Enter`",
                  "从头试玩"
                ],
                [
                  "`Shift+Enter`",
                  "从当前位置试玩"
                ],
                [
                  "`Ctrl+S`",
                  "保存全部"
                ],
                [
                  "`Ctrl+Z` / `Ctrl+Y`",
                  "撤销 / 重做"
                ],
                [
                  "`X` / `Z`",
                  "吸附增加 / 减少"
                ],
                [
                  "`E` / `Q`",
                  "拉长 / 缩短长按音符"
                ],
                [
                  "`A` / `D`",
                  "前后一小节"
                ],
                [
                  "`W` / `S`",
                  "前后一步"
                ],
                [
                  "`O` / `P`",
                  "加对手 / 玩家相机事件"
                ],
                [
                  "`Ctrl` + 滚轮",
                  "缩放"
                ]
              ]
            }
          },
          {
            "h": "本页快捷键"
          },
          {
            "kv": [
              [
                "`1` `2` `3`",
                "切换简单 / 普通 / 详细"
              ],
              [
                "`Ctrl+K` 或 `/`",
                "搜索章节"
              ],
              [
                "`K` / `J`",
                "上一章 / 下一章"
              ],
              [
                "`G` 然后 `T`",
                "回到顶部"
              ],
              [
                "`?`",
                "快捷键面板"
              ],
              [
                "`Esc`",
                "关闭弹层"
              ]
            ]
          },
          {
            "h": "术语表"
          },
          {
            "table": {
              "head": [
                "术语",
                "意思"
              ],
              "rows": [
                [
                  "**软编码**",
                  "不用改源码、只靠外部配置文件就能改游戏内容"
                ],
                [
                  "**HScript**",
                  "引擎用的脚本语言，语法接近 Haxe，运行时解释执行"
                ],
                [
                  "**谱面 / Chart**",
                  "一首歌里所有音符的时间与方向数据"
                ],
                [
                  "**变体 / Variation**",
                  "同一首歌的另一套谱面或音频（如 erect 版）"
                ],
                [
                  "**strumline / 轨道**",
                  "一条判定轨道，通常 4 个方向"
                ],
                [
                  "**note type**",
                  "音符类型，决定这个音符的特殊行为"
                ],
                [
                  "**事件 / Event**",
                  "谱面上「在某个时间点做某事」的指令"
                ],
                [
                  "**pack**",
                  "把脚本、JSON、图片合并成一个文件的容器格式"
                ],
                [
                  "**ndll**",
                  "原生动态库，给引擎加 C++ 能力"
                ],
                [
                  "**shader**",
                  "跑在 GPU 上的逐像素程序"
                ],
                [
                  "**foxlite**",
                  "引擎用的 3D 渲染库"
                ],
                [
                  "**HUD**",
                  "屏幕上的界面层（分数、血条、音符）"
                ],
                [
                  "**bop / 跟拍**",
                  "随节拍做缩放或动画"
                ],
                [
                  "**判定窗口**",
                  "允许命中的时间范围"
                ]
              ]
            }
          },
          {
            "h": "官方链接"
          },
          {
            "ul": [
              "[官方 Wiki（首选）](https://codename-engine.com/wiki/)",
              "[官方网站](https://codename-engine.com/)",
              "[GitHub 仓库](https://github.com/CodenameCrew/CodenameEngine)",
              "[本版本下载（Actions #1392）](https://github.com/CodenameCrew/CodenameEngine/actions/runs/39722789627)",
              "[官方 API 文档](https://codename-engine.com/api-docs/)"
            ]
          },
          {
            "h": "最后"
          },
          {
            "p": "这份文档整理于 **2026-10-23**，对应 **Windows Builds #1392 / v1.1.0**。引擎会继续变，文档不一定跟得上 —— 遇到冲突，**以官方 Wiki 和你手上那个版本的实际行为为准**。"
          },
          {
            "p": "制作：**一人制作**。如果这份东西帮你少走了几个小时的弯路，那就够了。"
          }
        ],
        "deep": [
          {
            "h": "想继续深入，按这个顺序看"
          },
          {
            "ol": [
              "官方 Wiki 的「Modding The Engine」全部分区（尤其 Scripting）。",
              "官方 API 文档，查具体类有哪些字段。",
              "引擎自带的 `assets/data/` 示例 —— 这是最好的教材，官方周的每一个 XML 都能直接读。",
              "GitHub 上的 Issue / PR，很多「为什么这样设计」的答案在那里。"
            ]
          },
          {
            "h": "本页的技术说明"
          },
          {
            "p": "纯静态：HTML + CSS + 原生 JS，零框架、零 CDN、零统计。内容存在四个 JS 数据文件里，按模式裁剪渲染；代码块用自写的分词器逐 token 转义着色；XML 解剖器按行配注解。整个目录可以直接放进 GitHub 仓库，用 GitHub Pages 托管。"
          }
        ]
      }
    ]
  });
})();
