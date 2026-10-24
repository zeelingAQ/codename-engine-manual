/* ============================================================
   第六部分 · 配与修
   ============================================================ */
(function () {
  if (!window.CNE) return;

  window.CNE.addPart({
  "id": "p6",
  "name": "第六部分 · 配与修",
  "short": "PART 06",
  "color": "var(--red)",
  "sections": [
    {
      "id": "custom-options",
      "num": "39",
      "title": "mod 自定义设置项：往设置菜单塞自己的开关",
      "en": "CUSTOM OPTIONS",
      "tags": [
        "Options",
        "XML",
        "LIB_",
        "设置"
      ],
      "simple": [
        {
          "p": "你可以在**设置菜单里加自己的选项** —— 玩家改完会存进存档，下次进游戏还在。"
        },
        {
          "p": "做法：在 mod 里放一个 XML，文件名固定 `data/config/options/LIB_<你的mod名>.xml`，一个节点就是一个选项。"
        }
      ],
      "core": [
        {
          "h": "① 文件放哪、叫什么"
        },
        {
          "kv": [
            [
              "实际路径",
              "`mods/<你的mod>/data/config/options.xml`"
            ],
            [
              "引擎内部寻址",
              "`data/config/options/LIB_<mod名>`（`LIB_` 是虚路径前缀，会自动映射到上面的文件）"
            ],
            [
              "加载时机",
              "打开设置菜单时（`OptionsMenu.create()` 扫描所有已加载 mod）"
            ],
            [
              "加载后的位置",
              "追加到设置**主菜单那一屏**的最下面"
            ]
          ]
        },
        {
          "callout": {
            "kind": "warn",
            "title": "文件名别写错",
            "text": "写 `options.xml` 放在 `data/config/` 下；`LIB_` 是引擎内部用的，你不需要在磁盘上建 `options/LIB_xxx` 这种路径。"
          }
        },
        {
          "h": "② 支持的 7 种控件"
        },
        {
          "table": {
            "head": [
              "节点",
              "属性",
              "效果"
            ],
            "rows": [
              [
                "`separator`",
                "`height`（可选，默认 67）",
                "一条分隔空行"
              ],
              [
                "`checkbox`",
                "`name` `desc` `id`",
                "开/关"
              ],
              [
                "`number`",
                "`name` `desc` `id` `min` `max` `change`\\|`step`",
                "数字（带上下箭头）"
              ],
              [
                "`choice`",
                "`name` `desc` `id` + 子节点",
                "轮换选择（左右切）"
              ],
              [
                "`radio`",
                "`name` `desc` `id` `value` `forId`",
                "单选（同 `forId` 互斥）"
              ],
              [
                "`slider`",
                "`name` `desc` `id` `min` `max` `change`\\|`step` `segments` `barWidth`",
                "滑条"
              ],
              [
                "`menu`",
                "`name` `desc` `prefix` + 子节点",
                "二级子菜单（子项 id 会自动加前缀）"
              ]
            ]
          }
        },
        {
          "p": "`name` / `desc` 官方是填**翻译 ID**（如 `optionsTree.appearance-name`）。你自己加的选项直接写中文/英文原文也行 —— 找不到翻译时会原样显示。"
        },
        {
          "h": "③ 一份能直接用的 XML"
        },
        {
          "code": {
            "lang": "xml",
            "title": "mods/my-mod/data/config/options.xml",
            "src": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<options>\n\t<separator height=\"40\" />\n\n\t<checkbox\n\t\tname=\"我的 Mod：开启炫光\"\n\t\tdesc=\"关掉可以提升性能\"\n\t\tid=\"mymod_glow\" />\n\n\t<number\n\t\tname=\"我的 Mod：血量上限\"\n\t\tdesc=\"默认 2\"\n\t\tid=\"mymod_maxhealth\"\n\t\tmin=\"1\" max=\"10\" change=\"0.5\" />\n\n\t<slider\n\t\tname=\"我的 Mod：镜头摇晃强度\"\n\t\tdesc=\"0 = 不晃\"\n\t\tid=\"mymod_shake\"\n\t\tmin=\"0\" max=\"1\" change=\"0.05\"\n\t\tsegments=\"10\" barWidth=\"400\" />\n\n\t<choice name=\"我的 Mod：滤镜强度\" desc=\"低 / 中 / 高\" id=\"mymod_filter\">\n\t\t<option name=\"低\" value=\"0\" />\n\t\t<option name=\"中\" value=\"1\" />\n\t\t<option name=\"高\" value=\"2\" />\n\t</choice>\n\n\t<menu name=\"我的 Mod：更多设置 >\" desc=\"点开看子项\" prefix=\"mymod_sub_\">\n\t\t<checkbox name=\"子选项 A\" id=\"a\" />\n\t\t<checkbox name=\"子选项 B\" id=\"b\" />\n\t</menu>\n</options>"
          }
        },
        {
          "kv": [
            [
              "注意 1",
              "`checkbox` / `number` / `choice` / `radio` / `slider` **必须有 `id`**，缺了会在日志里警告并跳过"
            ],
            [
              "注意 2",
              "`choice` 的子节点名随便（示例用 `<option>`），只要带 `name`（显示）和 `value`（存的值）"
            ],
            [
              "注意 3",
              "`menu` 里的子项 id 会被 `prefix` 前缀化：`prefix=\"mymod_sub_\"` + `id=\"a\"` → 实际存成 `mymod_sub_a`"
            ]
          ]
        },
        {
          "h": "④ 值存在哪、怎么读"
        },
        {
          "p": "所有自定义选项的值都存在 `FlxG.save.data` 里，**key 就是你写的 `id`**（`menu` 里是 `prefix + id`）。"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "在脚本里读",
            "src": "function postCreate() {\n\t// 布尔\n\tvar glow:Bool = FlxG.save.data.mymod_glow ?? false;\n\n\t// 数字（可能是 Int 也可能是 Float，取决于输入框）\n\tvar hp:Float = FlxG.save.data.mymod_maxhealth ?? 2.0;\n\n\t// 滑条（Float）\n\tvar shake:Float = FlxG.save.data.mymod_shake ?? 0.5;\n\n\t// choice：存的是 value，注意可能是字符串\n\tvar filter:String = Std.string(FlxG.save.data.mymod_filter ?? \"0\");\n\n\t// 子菜单项\n\tvar subA:Bool = FlxG.save.data.mymod_sub_a ?? false;\n\n\ttrace(glow + \" / \" + hp + \" / \" + shake + \" / \" + filter + \" / \" + subA);\n}"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "一定要给默认值",
            "text": "玩家没进过设置时这些 key 不存在，读出来是 `null`。永远写 `?? 默认值`。"
          }
        },
        {
          "h": "⑤ 什么时候生效"
        },
        {
          "ol": [
            "玩家在设置里改 → 值立刻写进 `FlxG.save.data`（但**还没落盘**）。",
            "退出设置菜单时 `Options.save()` + `applySettings()`，同时 `FlxG.save` 会在合适时机 flush。",
            "**你的脚本需要自己判断**：改了设置后要不要立刻应用（比如重建 shader），不如在 `update` 里每帧读一次，或监听设置退出。"
          ]
        }
      ],
      "deep": [
        {
          "h": "⑥ 为什么是 `LIB_` 虚路径"
        },
        {
          "p": "`data/config/options/` 是个**目录**，里面按 mod 名分文件（`LIB_<mod>`）。这样每个 mod 都有自己的 options.xml，互不覆盖。引擎在 `OptionsMenu.create()` 里遍历 `ModsFolder.getLoadedMods()`，逐个试 `Paths.xml('config/options/LIB_' + mod)`。"
        },
        {
          "p": "同理还有 `data/config/controls/LIB_<mod>`（下一节）和 `data/states/<状态>/LIB_<mod>`（状态脚本）。**记住这条规律，一半的「多 mod 共存」问题就懂了。**"
        },
        {
          "h": "⑦ 常见坑"
        },
        {
          "table": {
            "head": [
              "现象",
              "原因"
            ],
            "rows": [
              [
                "设置里看不到我的选项",
                "文件名/路径不对（要 `data/config/options.xml`）"
              ],
              [
                "选项在，但改了没用",
                "脚本没读 `FlxG.save.data`，或读了但没给默认值"
              ],
              [
                "改了重启就没了",
                "值没被 flush（正常流程会 flush；如果你手动改 `FlxG.save.data` 要自己 flush）"
              ],
              [
                "`menu` 里的子项读不到",
                "忘了加 `prefix`，实际 key 是 `prefix + id`"
              ],
              [
                "选项重复出现",
                "同一个 mod 被加载了两次（mods 里放了两份）"
              ]
            ]
          }
        },
        {
          "h": "⑧ 比「设置项」更轻的做法"
        },
        {
          "p": "如果只是想给玩家一个开关，不想动设置菜单，可以：**读 `flags.ini`**（见第 42 节，但那是引擎级、要重启），或者干脆**在自己的 mod 里做一个 UI**（`ModState` + 按钮），把值写进 `FlxG.save.data`。"
        }
      ]
    },
    {
      "id": "custom-controls",
      "num": "40",
      "title": "mod 自定义按键：给设置菜单加一类键位",
      "en": "CUSTOM CONTROLS",
      "tags": [
        "Controls",
        "键位",
        "XML"
      ],
      "simple": [
        {
          "p": "想让玩家给你的 mod 功能单独设个键（比如「切换 HUD」）？在 mod 里放一个 XML，就能在**设置 → 控制**里多出一整个分类。"
        }
      ],
      "core": [
        {
          "h": "① 文件位置"
        },
        {
          "kv": [
            [
              "实际路径",
              "`mods/<你的mod>/data/config/controls.xml`"
            ],
            [
              "内部寻址",
              "`data/config/controls/LIB_<mod名>`"
            ],
            [
              "加载时机",
              "引擎启动时 `ControlsUtil.loadCustomControls()`"
            ],
            [
              "出现位置",
              "设置 → 控制 → 你的分类"
            ]
          ]
        },
        {
          "h": "② XML 结构"
        },
        {
          "code": {
            "lang": "xml",
            "title": "mods/my-mod/data/config/controls.xml",
            "src": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<controls>\n\t<category name=\"我的 Mod 按键\">\n\t\t<control menuName=\"切换 HUD\"  saveName=\"MYMOD_TOGGLE_HUD\" />\n\t\t<control menuName=\"重载特效\"  saveName=\"MYMOD_RELOAD_FX\" />\n\t\t<!-- 可选：给这一行加个图标（图集名 + 动画名） -->\n\t\t<control menuName=\"召唤助手\"  saveName=\"MYMOD_SUMMON\"\n\t\t         menuIcon=\"icons/mymod\" menuAnim=\"summon\" />\n\t</category>\n</controls>"
          }
        },
        {
          "table": {
            "head": [
              "属性",
              "必需",
              "说明"
            ],
            "rows": [
              [
                "`category@name`",
                "是",
                "分类显示名（会出现在设置→控制里）"
              ],
              [
                "`control@menuName`",
                "是",
                "这一行的显示名"
              ],
              [
                "`control@saveName`",
                "是",
                "**存档用的唯一键**，建议全大写 + 前缀"
              ],
              [
                "`control@menuIcon`",
                "否",
                "图标图集（相对 images/）"
              ],
              [
                "`control@menuAnim`",
                "否",
                "图标动画名"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "saveName 一旦发布别改",
            "text": "玩家改好的键位是按 `saveName` 存的。你改名 = 玩家设置全丢。"
          }
        },
        {
          "h": "③ 在脚本里读这个键"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "用 ControlsUtil 读（推荐）",
            "src": "import funkin.backend.utils.ControlsUtil;\n\nfunction update(elapsed:Float) {\n\t// 三个状态：按住 / 刚按下 / 刚松开\n\tif (ControlsUtil.getJustPressed(PlayerSettings.solo.controls, \"MYMOD_TOGGLE_HUD\")) {\n\t\tcamHUD.visible = !camHUD.visible;\n\t}\n\n\tif (ControlsUtil.getPressed(PlayerSettings.solo.controls, \"MYMOD_RELOAD_FX\")) {\n\t\t// 按住期间每帧执行\n\t}\n}"
          }
        },
        {
          "kv": [
            [
              "`getPressed(controls, name)`",
              "是否按住"
            ],
            [
              "`getJustPressed(controls, name)`",
              "这一帧刚按下"
            ],
            [
              "`getJustReleased(controls, name)`",
              "这一帧刚松开"
            ],
            [
              "`controls` 用哪个",
              "`PlayerSettings.solo.controls` / `player1` / `player2`（分单人/双人）"
            ]
          ]
        },
        {
          "h": "④ 引擎做了什么"
        },
        {
          "ol": [
            "扫描所有已加载 mod 的 `data/config/controls/LIB_*`。",
            "对每个 `<control>` 调 `ControlsUtil.initCustomControl(controls, saveName)`，把键位注册进三套 Controls（solo / P1 / P2）。",
            "设置界面里生成对应的改键行；玩家按的键存进 `playerSettings` 的存档。",
            "切 mod 时会 `resetCustomControls()` 解绑，避免残留。"
          ]
        }
      ],
      "deep": [
        {
          "h": "⑤ 为什么不直接在脚本里读 `FlxG.keys`"
        },
        {
          "p": "因为**玩家要能改键**。直接写死 `FlxG.keys.justPressed.F` 的问题：手柄用不了、玩家改不了、和别的 mod 撞键。走 `Controls` 体系则自动获得改键界面、手柄支持、存档。"
        },
        {
          "h": "⑥ 冲突与优先级"
        },
        {
          "ul": [
            "同一个 `saveName` 被两个 mod 用 → 后加载的覆盖前者。**加 mod 名前缀**能避免。",
            "你的键和原版键撞了不会报错，但打歌时会同时触发两件事。",
            "`Reset Save Data` 会把自定义键位一起清掉。"
          ]
        },
        {
          "h": "⑦ 和游戏内键位表的关系"
        },
        {
          "p": "设置 → 控制里的分组是：Notes(4) / UI(9) / Volume(3) / Engine(2) / Developer(4，仅开发者模式)，然后才是各 mod 的分类。你的分类排在这些之后的末尾。"
        },
        {
          "h": "底层是怎么存键位的"
        },
        {
          "p": "自定义按键最终落在 `PlayerSettings` 的三套 `Controls` 上：`solo` / `player1` / `player2`。`ControlsUtil.loadCustomControls()` 会把每个 `<control>` 的 `saveName` 注册进这三套，并绑定到 `FlxActionDigital`。"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "ControlsUtil 里实际做的事（简化）",
            "src": "for (name in customNames) {\n\tControlsUtil.initCustomControl(PlayerSettings.solo.controls, name);\n\tControlsUtil.initCustomControl(PlayerSettings.player1.controls, name);\n\tControlsUtil.initCustomControl(PlayerSettings.player2.controls, name);\n}\n\n// initCustomControl 内部：\n// 建一个 FlxActionDigital，注册进 controls，并记录到 storedCustomControls\n// 玩家改键时 → addKeysToCustomControl(controls, name, keys)"
          }
        },
        {
          "table": {
            "head": [
              "函数",
              "作用"
            ],
            "rows": [
              [
                "`initCustomControl(controls, name)`",
                "把一个自定义键注册进某套 Controls"
              ],
              [
                "`addKeysToCustomControl(controls, name, keys)`",
                "给这个键绑上具体按键"
              ],
              [
                "`removeKeysFromCustomControl(controls, name, keys)`",
                "解绑"
              ],
              [
                "`resetCustomControls()`",
                "清空所有自定义键（切 mod 时调）"
              ],
              [
                "`getPressed/getJustPressed/getJustReleased(controls, name)`",
                "读状态"
              ]
            ]
          }
        },
        {
          "h": "三套 Controls 的差别（很容易踩）"
        },
        {
          "table": {
            "head": [
              "套",
              "什么时候用"
            ],
            "rows": [
              [
                "`PlayerSettings.solo`",
                "单人模式（默认）"
              ],
              [
                "`PlayerSettings.player1`",
                "双人模式的 P1"
              ],
              [
                "`PlayerSettings.player2`",
                "双人模式的 P2（也可能是对手模式）"
              ]
            ]
          }
        },
        {
          "p": "写 mod 时最稳的读法是「三套任一按下都算」——除非你明确要区分玩家。"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "function isDown(name:String):Bool {\n\treturn ControlsUtil.getJustPressed(PlayerSettings.solo.controls, name)\n\t    || ControlsUtil.getJustPressed(PlayerSettings.player1.controls, name)\n\t    || ControlsUtil.getJustPressed(PlayerSettings.player2.controls, name);\n}"
          }
        },
        {
          "h": "改键冲突怎么办"
        },
        {
          "ul": [
            "同一个 `saveName` 被两个 mod 用 → **后加载的覆盖前者**（`getName` 重复会被后注册的顶掉）。",
            "和原版键撞了不会报错，但打歌时会同时触发。",
            "`Reset Save Data` 会连自定义键位一起清空 —— 玩家会来问你「为什么我的键变了」。"
          ]
        },
        {
          "code": {
            "lang": "xml",
            "title": "给按键加图标（可选的 menuIcon/menuAnim）",
            "src": "<control menuName=\"切换 HUD\" saveName=\"MYMOD_TOGGLE_HUD\"\n         menuIcon=\"icons/mymod\" menuAnim=\"toggle\" />\n\n<!-- menuIcon 是图集名（相对 images/），menuAnim 是图集里的动画名 -->"
          }
        }
      ]
    },
    {
      "id": "state-redirects",
      "num": "41",
      "title": "StateRedirects：把原版界面换成你的",
      "en": "STATE REDIRECTS",
      "tags": [
        "modpack.ini",
        "StateRedirects",
        "ModState"
      ],
      "simple": [
        {
          "p": "**不用改源码**，就能把原版的某个界面（比如自由游玩）整个换成你自己写的脚本界面。"
        },
        {
          "p": "做法：在 mod 的 `modpack.ini` 里写一行 `FreeplayState=\"我的界面名\"`。"
        }
      ],
      "core": [
        {
          "h": "① 怎么写"
        },
        {
          "code": {
            "lang": "ini",
            "title": "mods/my-mod/data/config/modpack.ini",
            "src": "[StateRedirects]\n# 左边 = 原版状态类名，右边 = 你要替换成的东西\nFreeplayState=\"MyFreeplay\"\n# MainMenuState=\"MyMainMenu\"\n# StoryMenuState=\"funkin.menus.FreeplayState\"   ← 也可以指向一个真实存在的类\n\n[StateRedirects.force]\n# 和上面一样，但会覆盖「其他 addon 已经设过」的重定向"
          }
        },
        {
          "kv": [
            [
              "`[StateRedirects]`",
              "只在**还没有人设过**这个键时才生效（先到先得）"
            ],
            [
              "`[StateRedirects.force]`",
              "无条件覆盖，**优先级最高**"
            ],
            [
              "左值",
              "原版状态的类名（不带包名），比如 `FreeplayState`"
            ],
            [
              "右值",
              "**类名**（存在就用这个类）或**脚本名**（不存在就按脚本状态处理）"
            ]
          ]
        },
        {
          "h": "② 右边写脚本名时会发生什么"
        },
        {
          "p": "如果引擎找不到叫这个名字的类，就会创建 `new ModState(名字)`。而 `ModState` 会去加载 `data/states/<名字>.hx` —— 也就是说，**右边写什么，就等于加载哪个状态脚本**。"
        },
        {
          "code": {
            "lang": "ini",
            "title": "文件对应关系",
            "src": "modpack.ini:  FreeplayState=\"MyFreeplay\"\n                    ↓\n加载脚本:    mods/my-mod/data/states/MyFreeplay.hx"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "mods/my-mod/data/states/MyFreeplay.hx（最小状态脚本）",
            "src": "function create() {\n\t// 这里的 this 是一个 MusicBeatState\n\tvar bg = new FlxSprite().makeGraphic(FlxG.width, FlxG.height, 0xFF101820);\n\tadd(bg);\n\n\tvar txt = new FlxText(0, 0, 0, \"这是我的自由游玩界面\", 32);\n\ttxt.screenCenter();\n\tadd(txt);\n}\n\nfunction update(elapsed:Float) {\n\tif (FlxG.keys.justPressed.ESCAPE)\n\t\tFlxG.switchState(new MainMenuState());\n}"
          }
        },
        {
          "h": "③ 能重定向哪些界面"
        },
        {
          "p": "**任何继承 `MusicBeatState` 的状态**都可以，比如："
        },
        {
          "ul": [
            "`TitleState`（标题） / `MainMenuState`（主菜单）",
            "`FreeplayState`（自由游玩） / `StoryMenuState`（故事模式）",
            "`OptionsMenu`（设置） / `CreditsMain`（制作名单）",
            "甚至把 `StoryMenuState` 直接指向 `funkin.menus.FreeplayState`（等于砍掉故事模式）"
          ]
        },
        {
          "h": "④ 什么时候用、什么时候别用"
        },
        {
          "table": {
            "head": [
              "需求",
              "建议"
            ],
            "rows": [
              [
                "只是往原界面加东西",
                "**别重定向**，用 `data/states/<状态名>.hx` 挂脚本"
              ],
              [
                "要整体换布局/换交互",
                "重定向"
              ],
              [
                "只是换贴图/文字",
                "改资源或翻译，别重定向"
              ],
              [
                "要让玩家还能回原版",
                "重定向后自己提供返回入口"
              ]
            ]
          }
        }
      ],
      "deep": [
        {
          "h": "⑤ 底层机制（为什么能拦住）"
        },
        {
          "p": "引擎在**每次切状态**时都会过一遍 `GlobalScript`：拿目标状态的类名去查 `Flags.MOD_REDIRECT_STATES`，命中就改道。"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "GlobalScript 里的判断（简化）",
            "src": "var stateName = Type.getClassName(stateClass);\nif (Flags.MOD_REDIRECT_STATES.exists(stateName)) {\n\tvar target = Flags.MOD_REDIRECT_STATES.get(stateName);\n\tvar cls = Type.resolveClass(target);\n\tif (cls != null) FlxG.game._requestedState = Type.createInstance(cls, []);\n\telse              FlxG.game._requestedState = new ModState(target);\n}"
          }
        },
        {
          "p": "所以它**不需要改源码**，也不用 hook 任何函数 —— 只在「切状态」这一层做拦截。"
        },
        {
          "h": "⑥ 三个坑"
        },
        {
          "ul": [
            "**别指向自己**：`FreeplayState=\"FreeplayState\"` 或脚本里又切回同名状态 → 无限重定向 / 递归。",
            "**只在启动时读取**：改完 `modpack.ini` 要**重启游戏**。",
            "**类名要写对**：包名可以带（`funkin.menus.FreeplayState`），但简名必须与类名一致。"
          ]
        },
        {
          "h": "⑦ 和「软编码 state 脚本」的区别"
        },
        {
          "table": {
            "head": [
              "方式",
              "做什么",
              "侵入性"
            ],
            "rows": [
              [
                "`data/states/XxxState.hx`",
                "给原状态**挂脚本**，在原界面基础上改",
                "低（推荐先试这个）"
              ],
              [
                "`StateRedirects`",
                "**整个换掉**状态",
                "高（原逻辑全不走）"
              ],
              [
                "`ModState` 直接跳",
                "新建一个自己的界面",
                "中（不动原界面）"
              ]
            ]
          }
        }
      ]
    },
    {
      "id": "flags-ini",
      "num": "42",
      "title": "flags.ini 与 Flags 全表",
      "en": "FLAGS & flags.ini",
      "tags": [
        "Flags",
        "INI",
        "配置",
        "全表"
      ],
      "simple": [
        {
          "p": "`Flags` 是**引擎级开关**：禁用编辑器、关掉警告页、改默认难度、改图标缩放……都在这。**共 195 个**。"
        },
        {
          "p": "改法：**新建**一个 `data/config/flags.ini`（引擎里本来没有这个文件，不存在就全用默认值），写 `键=值`，**重启游戏**生效。"
        }
      ],
      "core": [
        {
          "h": "① 两个入口"
        },
        {
          "table": {
            "head": [
              "文件",
              "作用范围",
              "分区前缀"
            ],
            "rows": [
              [
                "`data/config/flags.ini`（**默认不存在**，要覆盖才新建）",
                "整个引擎",
                "见下表"
              ],
              [
                "`mods/<mod>/data/config/modpack.ini` 的 `[Flags]`",
                "只有该 mod 生效",
                "**不加前缀**"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "分区",
              "前缀",
              "典型用途"
            ],
            "rows": [
              [
                "`[Flags]`",
                "无",
                "直接写 Flag 名，如 `ALLOW_CENTERED_FIELDS=false`"
              ],
              [
                "`[Common]`",
                "`MOD_`",
                "mod 元数据：`NAME` `DESCRIPTION` `AUTHOR` `API_VERSION`"
              ],
              [
                "`[Discord]`",
                "`MOD_DISCORD_`",
                "Discord RPC：`CLIENT_ID` `LOGO_KEY`"
              ],
              [
                "`[StateRedirects]`",
                "—",
                "状态重定向（第 41 节）"
              ],
              [
                "`[StateRedirects.force]`",
                "—",
                "强制重定向"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "ini",
            "title": "data/config/flags.ini",
            "src": "[Flags]\n# 关掉警告页（默认就是 true，很多 mod 会显式写一遍）\nDISABLE_WARNING_SCREEN=true\n\n# 关掉编辑器\nDISABLE_EDITORS=false\n\n# 默认难度\nDEFAULT_DIFFICULTY=\"normal\"\n\n# 图标弹跳幅度\nBOP_ICON_SCALE=1.2\n\n[Common]\nNAME=\"My Mod\""
          }
        },
        {
          "h": "② 值怎么写"
        },
        {
          "table": {
            "head": [
              "类型",
              "写法"
            ],
            "rows": [
              [
                "`Bool`",
                "`true` / `false`（小写）"
              ],
              [
                "`Int`",
                "`4`"
              ],
              [
                "`Float`",
                "`1.25`"
              ],
              [
                "`String`",
                "`\"内容\"`（带引号）或裸写"
              ],
              [
                "`Array<T>`",
                "逗号分隔，例如 `[\"zip\",\"cnemod\"]` 或 `zip,cnemod`"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "生效时机",
            "text": "Flags 在**启动时**读取一次。改完必须重启游戏；运行中改 `Flags.xxx` 只影响后续代码读取，不会重新初始化已建好的东西。"
          }
        },
        {
          "h": "③ 最常用的 20 个"
        },
        {
          "table": {
            "head": [
              "Flag",
              "默认",
              "作用"
            ],
            "rows": [
              [
                "`DISABLE_WARNING_SCREEN`",
                "`true`",
                "跳过启动警告页"
              ],
              [
                "`DISABLE_EDITORS`",
                "`false`",
                "禁用所有编辑器（发行版常用）"
              ],
              [
                "`DISABLE_LANGUAGES`",
                "`false`",
                "禁用语言选择"
              ],
              [
                "`DEFAULT_DIFFICULTY`",
                "`\"normal\"`",
                "默认难度"
              ],
              [
                "`DEFAULT_STAGE`",
                "`\"stage\"`",
                "默认舞台"
              ],
              [
                "`DEFAULT_CHARACTER`",
                "`\"bf\"`",
                "默认角色"
              ],
              [
                "`GAME_WIDTH` / `GAME_HEIGHT`",
                "`1280` / `720`",
                "内部渲染分辨率"
              ],
              [
                "`BOP_ICON_SCALE`",
                "`1.2`",
                "血条图标弹跳幅度"
              ],
              [
                "`ICON_DEFAULT_SCALE`",
                "`0.9`",
                "图标基础缩放"
              ],
              [
                "`ICON_LERP`",
                "`0.15`",
                "图标回弹插值"
              ],
              [
                "`HEALTHBAR_*` 系列",
                "—",
                "血条颜色/位置/分段"
              ],
              [
                "`CHANGE_WINDOW_TITLE_PLAYSTATE`",
                "`true`",
                "打歌时把歌名写进标题"
              ],
              [
                "`GITAROO_CHANCE`",
                "`0.1`",
                "Gitaroo 暂停概率"
              ],
              [
                "`SONGS_LIST_MOD_MODE`",
                "—",
                "mod 歌曲列表合并方式"
              ],
              [
                "`WEEKS_LIST_MOD_MODE`",
                "—",
                "mod 周列表合并方式"
              ],
              [
                "`DEFAULT_PAUSE_ITEMS`",
                "6 项",
                "暂停菜单选项"
              ],
              [
                "`DEFAULT_GLSL_VERSION`",
                "自动",
                "着色器 GLSL 版本"
              ],
              [
                "`SHADERS_CACHE_RESET_ON_SWITCH_STATE`",
                "`false`",
                "切状态重编 shader（调试）"
              ],
              [
                "`ALLOWED_ZIP_EXTENSIONS`",
                "`[\"zip\"]`",
                "允许的 mod 压缩包后缀"
              ],
              [
                "`CURRENT_API_VERSION`",
                "`3`",
                "当前 Mod API 版本（只读性质）"
              ]
            ]
          }
        },
        {
          "h": "④ 全部 195 个（按字母序）"
        },
        {
          "p": "下表由源码 `Flags.hx` 自动抽取：**名称 / 类型 / 默认值**。默认值里的长表达式做了截断，仅供参考。"
        },
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
      "deep": [
        {
          "h": "⑤ 为什么是 `@:lazy`"
        },
        {
          "p": "Flags 里大量字段标了 `@:lazy`：**第一次被读取时才从 ini 里解析**。这样既避免启动时解析 195 个值，又能保证「用到的才付代价」。副作用是：**你没读过的 Flag，改了也不会出现在 `overridenFlags` 里**。"
        },
        {
          "h": "⑥ `overridenFlags` 是干什么的"
        },
        {
          "p": "引擎会记录「哪些 Flag 被 ini 显式改过」。像 `WINDOW_TITLE_USE_MOD_NAME` 这种联动项，就靠它判断「用户是不是自己设了标题」，没设才用 mod 名。"
        },
        {
          "h": "⑦ 排查「我改了没生效」"
        },
        {
          "ol": [
            "确认改的是**基础 `data/config/flags.ini`**（自己新建的那个）还是 **mod 的 `[Flags]`** —— mod 的只在该 mod 生效。",
            "确认值类型对：`true` 不是 `True`，字符串要引号。",
            "确认改完**重启**了。",
            "确认该 Flag 没被别处硬编码覆盖（有些 Flag 只是「初始值」，之后会被 Options 或代码改）。"
          ]
        },
        {
          "h": "⑧ Flags 与 Options 的分工"
        },
        {
          "table": {
            "head": [
              "",
              "Flags",
              "Options"
            ],
            "rows": [
              [
                "谁改",
                "mod 作者 / 发行方",
                "玩家"
              ],
              [
                "改哪",
                "ini 文件",
                "设置界面"
              ],
              [
                "何时生效",
                "启动时",
                "即时"
              ],
              [
                "典型",
                "禁用编辑器、默认难度",
                "下滚、音量、偏移"
              ]
            ]
          }
        }
      ]
    },
    {
      "id": "command-line",
      "num": "43",
      "title": "命令行参数：从快捷方式直接进游戏",
      "en": "COMMAND LINE",
      "tags": [
        "命令行",
        "启动参数",
        "调试"
      ],
      "simple": [
        {
          "p": "给 exe 加参数就能**跳过菜单直接进歌、指定 mod、开详细日志**。做测试时非常省时间。"
        },
        {
          "p": "用法：`CodenameEngine.exe -song bopeebo hard`"
        }
      ],
      "core": [
        {
          "h": "① 全部参数（源码 `CommandLineHandler`）"
        },
        {
          "table": {
            "head": [
              "参数",
              "参数值",
              "作用"
            ],
            "rows": [
              [
                "`-h` / `-help` / `help`",
                "—",
                "打印帮助并退出"
              ],
              [
                "`-mod` / `-m` / `-currentmod`",
                "`<mod名>`",
                "启动时加载指定 mod"
              ],
              [
                "`-modfolder`",
                "`<路径>`",
                "改 `mods/` 目录位置"
              ],
              [
                "`-addonsfolder`",
                "`<路径>`",
                "改 `addons/` 目录位置"
              ],
              [
                "`-song`",
                "`<歌> [难度] [变体]`",
                "**直接进打歌**"
              ],
              [
                "`-chart`",
                "`<歌> [难度] [变体]`",
                "**直接进谱面编辑器**"
              ],
              [
                "`-nocolor`",
                "—",
                "关掉终端彩色输出"
              ],
              [
                "`-nogpubitmap`",
                "—",
                "强制关闭 GPU-only 位图"
              ],
              [
                "`-nocwdfix`",
                "—",
                "关闭自动工作目录修正"
              ],
              [
                "`-livereload`",
                "—",
                "标记为热重载会话（自由游玩里按 `8` 可转换谱面）"
              ],
              [
                "`-v` / `-verbose` / `--verbose`",
                "—",
                "输出详细日志（VERBOSE 级）"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "注意",
            "text": "`-mod` / `-modfolder` / `-addonsfolder` 只在**编译时开了 `MOD_SUPPORT`** 的构建里存在（桌面版都有）。"
          }
        },
        {
          "h": "② 怎么用"
        },
        {
          "code": {
            "lang": "ini",
            "title": "快捷方式 / 批处理",
            "src": ":: 直接进某首歌\nCodenameEngine.exe -song bopeebo hard\n\n:: 带变体\nCodenameEngine.exe -song pico erect erect\n\n:: 进编辑器改谱\nCodenameEngine.exe -chart bopeebo hard\n\n:: 指定 mod + 详细日志\nCodenameEngine.exe -mod \"my-mod\" -v\n\n:: 测试别的 mods 目录\nCodenameEngine.exe -modfolder \"D:\\test-mods\""
          }
        },
        {
          "p": "在 Windows 上：右键 exe → 发送到 → 桌面快捷方式 → 属性 → 目标，在路径后面加空格加参数。"
        },
        {
          "h": "③ 参数的解析规则（容易踩的坑）"
        },
        {
          "ul": [
            "`-song` 后面的**难度和变体是可选的**，判断方式是「下一个参数是不是以 `-` 开头」。",
            "所以**歌名不能以 `-` 开头**，否则会被当成下一个参数。",
            "路径带空格要加引号（`-modfolder \"D:\\my mods\"`）。",
            "未知参数会打印 `Unknown command \"xxx\"`，但**不会退出**。"
          ]
        }
      ],
      "deep": [
        {
          "h": "④ `-song` 与 `-chart` 的差别"
        },
        {
          "p": "两者都设置 `Main.goToSong`，区别是 `-chart` 会同时把 `Main.goToCharter = true`。启动流程在 `MainState` 里判断：有 `goToSong` 就 `PlayState.loadSong(...)`，如果还带 `goToCharter` 就改成进 `Charter`。"
        },
        {
          "h": "⑤ `-nocwdfix` 什么时候需要"
        },
        {
          "p": "引擎默认会把工作目录修正到 exe 所在目录（这样从任何位置启动都能找到 assets）。如果你用**符号链接/自定义启动器**，这个修正可能反而指错，就用 `-nocwdfix` 关掉。"
        },
        {
          "h": "⑥ 配合调试的推荐组合"
        },
        {
          "kv": [
            [
              "改脚本时",
              "`-v -song <当前歌> <难度>` —— 一遍遍手动进歌太慢"
            ],
            [
              "查加载问题",
              "`-v` 能看到每个资源库、每个脚本的加载日志"
            ],
            [
              "测多 mod 共存",
              "`-modfolder` 指向一个只放了两三个 mod 的测试目录"
            ],
            [
              "给玩家排错",
              "让他在快捷方式后加 `-v`，把终端输出发你"
            ]
          ]
        },
        {
          "h": "在 Windows 上做快捷方式（图文步骤）"
        },
        {
          "ol": [
            "右键 `CodenameEngine.exe` → 发送到 → 桌面快捷方式。",
            "右键快捷方式 → 属性 → 「目标」框末尾加一个空格，然后写参数。",
            "例：`\"C:\\Games\\CNE\\CodenameEngine.exe\" -song bopeebo hard`",
            "想固定测试某 mod：`... -mod \"my-mod\" -v`"
          ]
        },
        {
          "callout": {
            "kind": "warn",
            "title": "引号别删",
            "text": "路径里有空格时，exe 路径必须保留外层引号，参数写在**引号外面**。写成 `\"...exe -song bopeebo\"` 会让整个字符串当成路径。"
          }
        },
        {
          "h": "参数之间的顺序有关系吗"
        },
        {
          "p": "**有**。`-song` 会「贪吃」后面不以 `-` 开头的词作为难度和变体："
        },
        {
          "code": {
            "lang": "ini",
            "title": "正确 / 错误对照",
            "src": "# ✓ 歌= bopeebo，难度=hard\n-song bopeebo hard\n\n# ✓ 歌= bopeebo，难度=hard，变体=erect\n-song bopeebo hard erect\n\n# ✓ 只有歌名，难度用默认\n-song bopeebo -v\n\n# ✗ 想指定 -v 但把它吃成难度了（因为 -v 以 - 开头，会被正确跳过）\n-song bopeebo -v        ← 这个其实是对的\n\n# ✗ 歌名带连字符会被当成参数\n-song my-song           ← my-song 会被解析成 -song 的值，但后续可能错位"
          }
        },
        {
          "h": "Linux / macOS 启动"
        },
        {
          "code": {
            "lang": "bash",
            "title": "终端 / .desktop",
            "src": "# 终端\n./CodenameEngine -song bopeebo hard\n\n# 想固定工作目录\ncd /opt/cne && ./CodenameEngine -modfolder /opt/cne/mods"
          }
        },
        {
          "h": "四个最常见的「参数不生效」"
        },
        {
          "table": {
            "head": [
              "现象",
              "原因"
            ],
            "rows": [
              [
                "加了 `-mod` 但还是加载原版",
                "mod 名不等于文件夹名（要写文件夹名，不是 `NAME`）"
              ],
              [
                "`-modfolder` 报错退出",
                "路径不存在（引擎会 `Sys.exit(1)`）"
              ],
              [
                "`-song` 进不去歌",
                "歌名/难度/变体三者之一拼错，日志里有 `Chart ... was not found`"
              ],
              [
                "`-v` 没看到更多日志",
                "启动器把 stdout 吞了；改用「Show Console」或 `-v` + 原生控制台"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "ini",
            "title": "排查时用的最全组合",
            "src": "CodenameEngine.exe -v -song \"当前在改的歌\" hard -mod \"当前在改的mod\""
          }
        },
        {
          "h": "把这些参数变成「一键」"
        },
        {
          "p": "做 mod 时你会反复进同一首歌。建议建三个快捷方式：**测试当前歌** / **进谱面编辑器** / **干净启动（不加载 mod）**，比每次点菜单快得多。"
        }
      ]
    },
    {
      "id": "logs-and-crash",
      "num": "44",
      "title": "日志、崩溃与排查流程",
      "en": "LOGS & CRASHES",
      "tags": [
        "日志",
        "崩溃",
        "排查",
        "Logs"
      ],
      "simple": [
        {
          "p": "出问题时**第一件事是看日志**，不是改代码。"
        },
        {
          "p": "日志有三个地方能看到：游戏内控制台（`F2`）、启动时的终端窗口、以及崩溃时的全屏报错界面。"
        }
      ],
      "core": [
        {
          "h": "① 三个看日志的地方"
        },
        {
          "table": {
            "head": [
              "入口",
              "怎么开",
              "看得到什么"
            ],
            "rows": [
              [
                "游戏内控制台",
                "`F2`（需开发者模式）",
                "最近 100 条日志，可按级别/关键字过滤"
              ],
              [
                "启动终端",
                "从 cmd 启动，或设置里开「Show Console」",
                "完整 stdout，`-v` 后最详细"
              ],
              [
                "崩溃界面",
                "崩溃时自动出现",
                "异常信息 + 调用栈 + 两个按钮"
              ]
            ]
          }
        },
        {
          "p": "如果是从 GitHub Actions 下的发布版，双击 exe 通常看不到终端 —— 去**设置 → 开发者模式 → Show Console**（Windows 原生控制台），或者按 `F2` 看游戏内控制台。"
        },
        {
          "h": "② 日志的分级"
        },
        {
          "table": {
            "head": [
              "级别",
              "前缀/颜色",
              "含义"
            ],
            "rows": [
              [
                "`TRACE`",
                "脚本 `trace()` 的输出",
                "普通调试信息"
              ],
              [
                "`INFO`",
                "蓝色",
                "一般信息"
              ],
              [
                "`WARNING`",
                "黄色",
                "能继续跑，但可能有问题"
              ],
              [
                "`ERROR`",
                "红色",
                "出错了，功能可能失效"
              ],
              [
                "`VERBOSE`",
                "灰色",
                "只有 `-v` 才显示（加载细节等）"
              ]
            ]
          }
        },
        {
          "p": "脚本里的 `trace()` 会带上**文件:行号**，这是定位问题最有效的信息。"
        },
        {
          "h": "③ 崩溃时会发生什么（`CrashHandler`）"
        },
        {
          "ol": [
            "捕获异常，生成一份报告（异常信息 + 堆栈）。",
            "**隔离（quarantine）**：把当前正在执行的脚本 `active = false`、暂停音乐、静音整棵状态树。",
            "弹出**全屏崩溃界面**，上面是报告文本，下面两个按钮：**QUIT GAME**（退出）/ **RESET MOD**（重载当前 mod 再试）。",
            "如果连崩溃界面都画不出来，直接退出游戏。"
          ]
        },
        {
          "callout": {
            "kind": "tip",
            "title": "这功能很好用",
            "text": "崩溃时**出错的那个脚本会被禁用**，所以点 RESET MOD 往往能让你进游戏、继续排查，而不是每次都被同一个脚本卡死。"
          }
        },
        {
          "h": "④ 排查流程（按这个顺序）"
        },
        {
          "ol": [
            "**看最后一条 ERROR**：日志里红色那条通常就是根因，前面的只是它的后果。",
            "**看文件名与行号**：`my-mod:script.hx:42` 直接跳过去看那一行。",
            "**判断类型**：是解析错误（语法）、运行时错误（null/类型）、还是资源缺失（找不到图片/音频）。",
            "**最小复现**：把脚本后半段注释掉，看是否还崩；二分找到具体语句。",
            "**对照本文第 46 节**（报错速查表）看有没有现成答案。"
          ]
        }
      ],
      "deep": [
        {
          "h": "⑤ 常见日志原文 → 含义"
        },
        {
          "table": {
            "head": [
              "日志里出现",
              "含义"
            ],
            "rows": [
              [
                "`Unknown identifier : xxx`",
                "用了个不存在的变量/函数名（拼写错误最常见）"
              ],
              [
                "`Cannot access field xxx of null`",
                "对 `null` 取字段 —— 对象还没建好，或真的没找到"
              ],
              [
                "`Script at xxx does not exist`",
                "`importScript` 的路径写错"
              ],
              [
                "`Couldn't find ndll at xxx`",
                "ndll 路径/命名不对（见第 20 节）"
              ],
              [
                "`Chart for song xxx at \"xxx\" was not found`",
                "找谱面失败：歌名/难度/变体拼错"
              ],
              [
                "`data/charts/ is deprecated`",
                "把脚本放到了废弃目录（应放 `songs/`）"
              ],
              [
                "`An option node requires a name attribute`",
                "自定义设置项少了 `name`"
              ],
              [
                "`A slider option requires an \"id\"`",
                "自定义设置项少了 `id`（会被跳过）"
              ],
              [
                "`Error while parsing controls.xml`",
                "自定义按键 XML 格式错"
              ],
              [
                "`Compressed Library Detected`",
                "mod 是 zip，编辑器无法写文件"
              ],
              [
                "`Shader compilation failed`",
                "shader 语法错（看具体行号）"
              ]
            ]
          }
        },
        {
          "h": "⑥ 没有日志、但就是不对"
        },
        {
          "ul": [
            "**资源没生效**：99% 是路径/大小写错了（`mods/x/data/...` 不是 `assets/data/...`）。",
            "**脚本没跑**：函数名拼错、或写在 `class {}` 里（见第 18 节）。",
            "**画面全黑**：XML 解析失败（少 `/`、`&` 没转义、BOM）。",
            "**改了没变化**：缓存（`Ctrl+F5` 是网页的事；游戏里按 `F5` 重载状态）。"
          ]
        },
        {
          "h": "⑦ 给玩家收集信息"
        },
        {
          "p": "让玩家这样做，你能省一半沟通成本：**用 `-v` 启动 → 复现一次 → 把终端/崩溃界面的文本截图发你**。崩溃界面里的堆栈比「它崩了」有用一万倍。"
        }
      ]
    },
    {
      "id": "performance",
      "num": "45",
      "title": "性能优化：让你的 mod 不掉帧",
      "en": "PERFORMANCE",
      "tags": [
        "性能",
        "内存",
        "绘制调用",
        "优化"
      ],
      "simple": [
        {
          "p": "FNF 引擎的瓶颈通常只有三个：**画得太多（绘制调用）**、**内存太满**、**每帧干了重活**。"
        },
        {
          "p": "先测量再优化：`F3` 看帧率/内存/绘制调用，别凭感觉。"
        }
      ],
      "core": [
        {
          "h": "① 先学会测量"
        },
        {
          "table": {
            "head": [
              "指标",
              "在哪看",
              "健康值"
            ],
            "rows": [
              [
                "FPS",
                "`F3` 第一行",
                "稳定 60+（目标是你的帧率上限）"
              ],
              [
                "MEM",
                "`F3` 第二行",
                "几百 MB 内；持续上涨 = 泄漏"
              ],
              [
                "对象数",
                "`F3` Flixel 区块",
                "稳定；打歌中不该一直涨"
              ],
              [
                "绘制调用 `totalDC`",
                "`F3` Stats 区块",
                "越低越好，几百以内算健康"
              ],
              [
                "当前状态",
                "`F3` Flixel 区块",
                "确认没在跑多余的状态"
              ]
            ]
          }
        },
        {
          "h": "② 绘制调用：最大的性能杀手"
        },
        {
          "ul": [
            "**合并图集**：人物用一个图集、舞台用一个图集，比散图快得多。",
            "**别放一堆独立小图**：每个 Sprite = 至少一次绘制调用。",
            "**静态背景合成一张**：原本 5 层的背景，能合就合。",
            "**`visible = false` 的对象不再绘制**：离开画面的东西记得关掉。",
            "**`pixelPerfectRender`** 只给像素风开（它有自己的开销）。"
          ]
        },
        {
          "h": "③ 内存：图集与贴图"
        },
        {
          "table": {
            "head": [
              "做法",
              "效果"
            ],
            "rows": [
              [
                "贴图尺寸控制在 2048×2048 以内",
                "避免超大纹理常驻显存"
              ],
              [
                "`Options.lowMemoryMode`",
                "只加载舞台 XML 里 `low-memory` 分组的元素"
              ],
              [
                "`Options.gpuOnlyBitmaps`",
                "位图只留显存（省内存，个别机器花屏）"
              ],
              [
                "`Options.streamedMusic/Vocals`",
                "音频流式加载（低配机器应该**开**）"
              ],
              [
                "及时 `destroy()` 自建对象",
                "否则切歌几次后内存一路涨"
              ]
            ]
          }
        },
        {
          "h": "④ 每帧开销：脚本与对象创建"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "常见浪费与改法",
            "src": "// ✗ 每帧 new 对象（GC 压力）\nfunction update(elapsed:Float) {\n\tvar p = new FlxPoint(mouseX, mouseY);\n\ttrace(new Date().toString());\n}\n\n// ✓ 复用 / 按需\nvar _p = new FlxPoint();\nfunction update(elapsed:Float) {\n\t_p.set(mouseX, mouseY);\n}\n\n// ✗ 每帧遍历上千对象做判断\n// ✓ 只在变化时处理，或用 FlxTimer / 按拍触发"
          }
        },
        {
          "ul": [
            "**`update` 里别做重计算**：能按拍就按拍（`beatHit`），能定时就 `FlxTimer`。",
            "**别在循环里创建 lambda**：`array.map(function(v) ...)` 每帧跑一次 = 每帧一堆闭包。",
            "**纹理缓存**：同一张图反复 `Paths.image()` 是会走缓存，但反复 `loadGraphic` 不一定。",
            "**shader 数量**：相机级 shader 是全屏逐像素，2 个以上就要警惕。"
          ]
        },
        {
          "h": "⑤ 打歌时的专项优化"
        },
        {
          "table": {
            "head": [
              "手段",
              "说明"
            ],
            "rows": [
              [
                "`Options.gameplayShaders = false`",
                "关掉所有游戏内 shader（最立竿见影）"
              ],
              [
                "降低长按细分（modchart）",
                "`Options.modchartingHoldSubdivisions` 调小"
              ],
              [
                "减少同屏角色",
                "每个角色都是独立 Sprite + 动画"
              ],
              [
                "避免超长 sustain",
                "几千毫秒的长按会生成大量子对象"
              ],
              [
                "`FlxG.drawFramerate` 低于 `updateFramerate`",
                "逻辑照跑，绘制减半"
              ]
            ]
          }
        }
      ],
      "deep": [
        {
          "h": "⑥ 一个真实的优化顺序"
        },
        {
          "ol": [
            "**先测**：录一段 F3，看 FPS / MEM / DC 哪个是瓶颈。",
            "FPS 低但 DC 不高 → 大概率是 **CPU 端每帧逻辑**（脚本、遍历、补间太多）。",
            "FPS 低且 DC 很高 → **绘制调用**问题（散图、未合并、全屏 shader）。",
            "MEM 一直涨 → **泄漏**（自建对象没销毁、事件没解绑、脚本被反复 import）。",
            "打歌开始卡、越打越卡 → **长按对象**或**特效累积**。"
          ]
        },
        {
          "h": "⑦ 泄漏自查清单"
        },
        {
          "ul": [
            "`new` 出来的东西有没有在 `destroy()` 里销毁？",
            "相机的 shader 有没有 `removeShader`？",
            "`FlxTween` 有没有 `cancelTweensOf`（切歌时残留的补间会继续跑）？",
            "自定义信号/监听有没有解绑？",
            "`importScript` 有没有重复加载同一个脚本？"
          ]
        },
        {
          "h": "⑧ 别过度优化"
        },
        {
          "p": "先让东西能跑、能看，再优化。**没有测量的优化都是猜**。很多时候帧数低只是因为「你开了 4 个全屏 shader」，删掉两个就好了。"
        },
        {
          "h": "先建立「预算」概念"
        },
        {
          "p": "60 FPS = 每帧 16.6 ms；120 FPS = 8.3 ms。你的 mod 每帧能做多少事，取决于这个预算怎么花。"
        },
        {
          "table": {
            "head": [
              "帧率",
              "每帧预算",
              "适合"
            ],
            "rows": [
              [
                "60",
                "16.6 ms",
                "绝大多数 mod"
              ],
              [
                "120",
                "8.3 ms",
                "追求丝滑，开销要砍半"
              ],
              [
                "240",
                "4.2 ms",
                "只适合几乎无特效的场景"
              ]
            ]
          }
        },
        {
          "h": "用一段脚本自己测（比肉眼看可靠）"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "每 60 帧打印一次内存与对象数",
            "src": "var __frames:Int = 0;\nvar __lastMem:Float = 0;\n\nfunction update(elapsed:Float) {\n\t__frames++;\n\tif (__frames % 60 != 0) return;\n\n\tvar mem = MemoryUtil.getUsedMemory() / (1024 * 1024);   // MB\n\tvar delta = mem - __lastMem;\n\t__lastMem = mem;\n\n\ttrace(\"内存 \" + Std.int(mem) + \" MB  Δ \" + Std.int(delta)\n\t\t+ \"  对象 \" + PlayState.instance.members.length);\n}"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "看 Δ 而不是看绝对值",
            "text": "绝对值大不一定有问题；**每 60 帧都在涨**才是泄漏。跑 3 分钟不涨就是健康的。"
          }
        },
        {
          "h": "绘制调用（DC）到底怎么降"
        },
        {
          "ol": [
            "F3 看 `totalDC`。打歌时几百算正常，上千就要查。",
            "**合并同图集**：同图集的 Sprite 可以批量绘制，散图不行。",
            "**减少同屏 Sprite 数量**：每个都是候选 DC。",
            "**别用 `flipX` 频繁切换**：会打断合批（flixel 的限制）。",
            "**静态背景合并成一张**：5 层背景 → 1 张。"
          ]
        },
        {
          "h": "什么时候该怀疑「不是绘制的问题」"
        },
        {
          "table": {
            "head": [
              "现象",
              "大概率是"
            ],
            "rows": [
              [
                "DC 不高但 FPS 低",
                "脚本每帧在跑重活（遍历、字符串拼接、`new`）"
              ],
              [
                "暂停时也卡",
                "有个 `FlxTimer`/`FlxTween` 还在跑，或 shader 常驻"
              ],
              [
                "一进歌就掉帧",
                "加载期一次性建了太多对象（`create` 里的循环）"
              ],
              [
                "越打越卡",
                "长按/粒子对象没销毁（`destroy` 漏了）"
              ],
              [
                "切歌后更卡",
                "上一个状态的资源没释放，`stateScripts` 没清"
              ]
            ]
          }
        },
        {
          "h": "三个「一行见效」的开关"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "低配玩家救命三连",
            "src": "Options.gameplayShaders = false;      // 关掉游戏内 shader\nOptions.streamedMusic = true;          // 音乐流式加载\nOptions.streamedVocals = true;         // 人声流式加载\nOptions.applySettings();"
          }
        },
        {
          "h": "别做的「优化」"
        },
        {
          "ul": [
            "**别把所有东西塞进 `static`**：切歌不释放，内存只涨不降。",
            "**别用 `FlxG.state.members.remove()` 手动删**：容易漏 destroy，用 `kill()` + `destroy()`。",
            "**别为了省内存关掉 `antialiasing`**：视觉损失远大于收益。",
            "**别在 `update` 里 `trace`**：控制台缓冲会吃 CPU（发布版记得删）。"
          ]
        }
      ]
    },
    {
      "id": "error-lookup",
      "num": "46",
      "title": "报错速查：日志说什么 = 你哪里错了",
      "en": "ERROR LOOKUP",
      "tags": [
        "报错",
        "排查",
        "速查"
      ],
      "simple": [
        {
          "p": "把日志里那句英文，拿到这张表里对一下，基本能知道是哪一类问题。"
        }
      ],
      "core": [
        {
          "h": "① 脚本类"
        },
        {
          "table": {
            "head": [
              "日志",
              "原因",
              "解法"
            ],
            "rows": [
              [
                "`Unknown identifier : xxx`",
                "变量/函数名不存在",
                "检查拼写；确认它在同一个脚本里定义；跨脚本要 `public`"
              ],
              [
                "`Cannot access field xxx of null`",
                "对象是 null",
                "`create()` 里访问了还没生成的对象 → 改到 `postCreate`"
              ],
              [
                "`Unexpected token` / `Invalid character`",
                "语法错（括号/引号/分号）",
                "看行号往上找未闭合的结构"
              ],
              [
                "`Expected ;`",
                "少分号（HScript 同样要求）",
                "上一行补 `;`"
              ],
              [
                "`Unknown class : xxx`",
                "类没编译进来 / 名字错",
                "确认需不需要 `import`；确认构建没裁剪"
              ],
              [
                "`Script at xxx does not exist`",
                "`importScript` 路径错",
                "路径相对 `assets/`，不带扩展名"
              ],
              [
                "`Module not found : xxx`",
                "`import` 的模块不存在",
                "检查 `assets/source/` 下有没有这个文件"
              ],
              [
                "`Invalid number of arguments`",
                "函数参数个数不对",
                "看回调签名（第 30 节）"
              ]
            ]
          }
        },
        {
          "h": "② 资源类"
        },
        {
          "table": {
            "head": [
              "日志",
              "原因",
              "解法"
            ],
            "rows": [
              [
                "`Could not find asset xxx`",
                "资源不存在",
                "检查路径、大小写、是否在正确的 mod 里"
              ],
              [
                "黑屏但没有日志",
                "XML 解析失败",
                "检查自闭合 `/`、`&` 转义、UTF-8 无 BOM"
              ],
              [
                "图片显示成方块/白图",
                "图集 XML 与 PNG 不匹配",
                "两张要同名同目录"
              ],
              [
                "`Chart for song xxx ... was not found`",
                "谱面路径不对",
                "`songs/<歌>/charts/<难度>.json`，难度名要一致"
              ],
              [
                "音频不播",
                "文件名/格式不对",
                "`song/Inst.ogg` 固定名；或看 `SOUND_EXTS`"
              ],
              [
                "`Couldn't find ndll at xxx`",
                "ndll 缺失/命名错",
                "`ndlls/<名>-windows.ndll`，见第 20 节"
              ]
            ]
          }
        },
        {
          "h": "③ 配置类"
        },
        {
          "table": {
            "head": [
              "日志",
              "原因",
              "解法"
            ],
            "rows": [
              [
                "`An option node requires a name attribute`",
                "自定义设置项缺 `name`",
                "补 `name`（第 39 节）"
              ],
              [
                "`A xxx option requires an \"id\"`",
                "自定义设置项缺 `id`",
                "补 `id`，否则该项被跳过"
              ],
              [
                "`Error while parsing controls.xml`",
                "自定义按键 XML 格式错",
                "检查根节点/`category`/`control` 层级"
              ],
              [
                "`data/charts/ is deprecated`",
                "脚本放错目录",
                "移到 `songs/<歌>/scripts/`"
              ],
              [
                "`Compressed Library Detected`",
                "mod 是 zip，编辑器写不了",
                "解压成文件夹再编辑"
              ],
              [
                "`Unknown command \"xxx\"`",
                "命令行参数拼错",
                "对照第 43 节"
              ],
              [
                "`Missing name for shader script`",
                "`ScriptableShader` 没给名字",
                "给 `new ScriptableShader(shader, \"名字\")` 传名字"
              ]
            ]
          }
        },
        {
          "h": "④ 崩溃与卡死"
        },
        {
          "table": {
            "head": [
              "现象",
              "最可能的原因"
            ],
            "rows": [
              [
                "一进歌就崩",
                "舞台/人物 XML 错，或脚本 `create` 里访问空对象"
              ],
              [
                "切 mod 后崩",
                "`static var` 被清空后继续用，或残留上个 mod 的对象"
              ],
              [
                "打一会儿崩",
                "长按对象爆炸 / 内存耗尽 / 补间泄漏"
              ],
              [
                "点 RESET MOD 能进游戏",
                "说明是某个脚本的问题（崩溃时它已被禁用）"
              ],
              [
                "编辑器里崩",
                "该 mod 是 zip，或文件被占用"
              ],
              [
                "无声但没崩",
                "音频路径错 / 人声与伴奏时长不一致"
              ]
            ]
          }
        }
      ],
      "deep": [
        {
          "h": "⑤ 定位技巧：让日志说话"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "在关键位置埋点",
            "src": "function postCreate() {\n\ttrace(\"[mymod] postCreate 开始\");\n\n\ttrace(\"[mymod] bf = \" + boyfriend);\n\ttrace(\"[mymod] stage = \" + stage);\n\n\t// 如果上面这行没打印，说明脚本根本没加载\n\ttrace(\"[mymod] postCreate 结束\");\n}"
          }
        },
        {
          "p": "日志里**没出现**你埋的点，才是最有价值的信息 —— 说明流程根本没走到那里。"
        },
        {
          "h": "⑥ 二分法定位"
        },
        {
          "ol": [
            "把脚本后半段整体注释掉。",
            "还崩 → 问题在前半段；不崩 → 问题在后半段。",
            "重复，直到剩下一两行。",
            "如果是 XML 问题，就一个节点一个节点地删。"
          ]
        },
        {
          "h": "⑦ 报 bug 时该带什么"
        },
        {
          "ul": [
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
      "id": "build-defines",
      "num": "47",
      "title": "编译开关：为什么别人的构建有这个功能，你的没有",
      "en": "BUILD DEFINES",
      "tags": [
        "project.xml",
        "define",
        "构建",
        "STRIPPED_COMPILE"
      ],
      "simple": [
        {
          "p": "引擎的很多功能是**编译时决定**的，不是设置里能开的。比如「视频过场」「3D」「编辑器」，如果发布者编译时关掉了，你装多少 mod 都没用。"
        },
        {
          "p": "下面这张表就是全部开关。看不懂没关系，记住一句：**换一个构建**比改代码快。"
        }
      ],
      "core": [
        {
          "h": "① 全部编译开关（`project.xml` 的 `<define>`）"
        },
        {
          "table": {
            "head": [
              "开关",
              "默认",
              "作用 / 关掉会怎样"
            ],
            "rows": [
              [
                "`SHOW_BUILD_ON_FPS`",
                "开",
                "`F3` 面板上显示构建号"
              ],
              [
                "`DARK_MODE_WINDOW`",
                "开",
                "Windows 标题栏深色"
              ],
              [
                "`UPDATE_CHECKING`",
                "开（桌面）",
                "启动时检查新版本；关掉就没「有新版本」提示"
              ],
              [
                "`DISCORD_RPC`",
                "开（桌面）",
                "Discord 状态；关掉 `data/discord.hx` 不跑"
              ],
              [
                "`VIDEO_CUTSCENES`",
                "开",
                "**视频过场**；关掉 `VideoCutscene` 不可用"
              ],
              [
                "`MODCHARTING_FEATURES`",
                "开",
                "**modchart**；`STRIPPED_COMPILE` 时关掉"
              ],
              [
                "`THREE_D_SUPPORT`",
                "开",
                "**3D 模型加载**；`STRIPPED_COMPILE` 时关掉"
              ],
              [
                "`NAPE_ENABLED`",
                "开",
                "2D 物理（NAPE）；`STRIPPED_COMPILE` 时关掉"
              ],
              [
                "`CUSTOM_CLASSES`",
                "开",
                "脚本里能 `import` 自定义类；关掉就等于脚本能力砍半"
              ],
              [
                "`COMPILE_ALL_CLASSES`",
                "开",
                "把所有类都编进去（脚本能反射到）；关掉体积小但反射不到"
              ],
              [
                "`GITHUB_API`",
                "开（非 web/hl）",
                "GitHub API 相关（更新、贡献者列表）"
              ],
              [
                "`USE_ADAPTED_ASSETS`",
                "开（非 web）",
                "使用适配后的资源（web 上关）"
              ],
              [
                "`PRELOAD_ALL`",
                "开",
                "启动时预加载全部资源（加载慢、进游戏快）"
              ],
              [
                "`NO_PRELOAD_ALL`",
                "（自动）",
                "`PRELOAD_ALL` 关掉时自动定义，改为按需加载"
              ],
              [
                "`FLX_NO_GENERIC`",
                "开",
                "关掉 Flixel 的泛型检查（编译兼容）"
              ],
              [
                "`disable-version-check`",
                "开",
                "关掉 haxelib 版本检查"
              ],
              [
                "`STRIPPED_COMPILE`",
                "**关**",
                "「精简编译」总开关（见下）"
              ],
              [
                "`MOD_SUPPORT`",
                "开",
                "mod 系统；关掉就没有 `mods/` 目录这回事"
              ]
            ]
          }
        },
        {
          "h": "② `STRIPPED_COMPILE`：一刀砍掉四样东西"
        },
        {
          "p": "发行版如果开了这个（`-D STRIPPED_COMPILE`），下面这些会**同时消失**："
        },
        {
          "ul": [
            "`MODCHARTING_FEATURES` —— 箭头特效（第 36 节）",
            "`THREE_D_SUPPORT` —— 3D 模型（第 21 节）",
            "`NAPE_ENABLED` —— 物理",
            "`CUSTOM_CLASSES` / `COMPILE_ALL_CLASSES` —— 脚本的自定义类能力"
          ]
        },
        {
          "p": "所以最常见的困惑「为什么我 `import modchart.Manager` 报错」，答案往往不是代码写错，而是**这个构建被 strip 了**。"
        },
        {
          "h": "③ 怎么知道自己手上这个构建有什么"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "一行一个开关，缺哪个就少哪个",
            "src": "function postCreate() {\n\t#if MODCHARTING_FEATURES\n\ttrace(\"modchart: 有\");\n\t#else\n\ttrace(\"modchart: 没有\");\n\t#end\n\n\t#if VIDEO_CUTSCENES\n\ttrace(\"视频过场: 有\");\n\t#else\n\ttrace(\"视频过场: 没有\");\n\t#end\n\n\t#if THREE_D_SUPPORT\n\ttrace(\"3D: 有\");\n\t#else\n\ttrace(\"3D: 没有\");\n\t#end\n\n\t#if CUSTOM_CLASSES\n\ttrace(\"自定义类: 有\");\n\t#else\n\ttrace(\"自定义类: 没有\");\n\t#end\n}"
          }
        },
        {
          "h": "④ 这些开关能不能在运行时改"
        },
        {
          "p": "**不能。** `#if` 是编译期就切掉的，运行时不存在的代码就是不存在。`Flags`（第 42 节）是另一回事 —— 那是**运行时**读的 ini，能改。两者别混。"
        },
        {
          "table": {
            "head": [
              "",
              "编译开关 define",
              "运行时 Flag"
            ],
            "rows": [
              [
                "在哪",
                "`project.xml`",
                "`flags.ini` / `modpack.ini`"
              ],
              [
                "何时生效",
                "编译时",
                "每次启动"
              ],
              [
                "能改吗",
                "要重新编译",
                "玩家/作者改文件即可"
              ],
              [
                "典型",
                "`VIDEO_CUTSCENES`",
                "`DISABLE_EDITORS`"
              ]
            ]
          }
        }
      ],
      "deep": [
        {
          "h": "⑤ 自定义编译（你确实需要的话）"
        },
        {
          "code": {
            "lang": "ini",
            "title": "project.xml 里加/删 define",
            "src": "<!-- 加 -->\n<define name=\"MY_MOD_FLAG\" />\n\n<!-- 有条件地加 -->\n<define name=\"MODCHARTING_FEATURES\" unless=\"STRIPPED_COMPILE\" />\n\n<!-- 命令行覆盖（临时编译一次） -->\n<!-- haxe build.hxml -D STRIPPED_COMPILE -->"
          }
        },
        {
          "p": "编译流程在 `building/` 里（`cne-windows.bat` 之类），但完整编译环境（Haxe + haxelib 依赖 + VS）不在本文范围内。"
        },
        {
          "h": "⑥ mod 怎么跟编译开关打交道"
        },
        {
          "ul": [
            "**能条件编译就条件编译**：`#if MODCHARTING_FEATURES` 包住你的 modchart 代码。",
            "**别假设**：不要假设对方构建有 3D/视频/modchart。",
            "**给玩家提示**：缺功能时用 `trace` 或 UI 明确说「这个构建不支持 X」，比静默失败好。",
            "**modpack.ini 里写清要求**：`[Common]` 的 `API_VERSION` 之外，可以在描述里注明需要什么构建。"
          ]
        },
        {
          "h": "⑦ 为什么会有人做 strip 版"
        },
        {
          "p": "体积小、启动快、不给玩家乱改（没有编辑器）。代价是 mod 生态能用的一半功能没了。**做 mod 时优先按「完整构建」写，再用 `#if` 做降级**。"
        }
      ]
    },
    {
      "id": "multi-mod",
      "num": "48",
      "title": "多 mod 共存：谁覆盖谁与 LIB_ 机制",
      "en": "MULTI-MOD",
      "tags": [
        "LIB_",
        "覆盖",
        "加载顺序",
        "zip"
      ],
      "simple": [
        {
          "p": "同时装了几个 mod 时，**同名文件后加载的赢**；但**脚本不是覆盖，是叠加**（都会跑）。"
        },
        {
          "p": "想「一个文件里放多个 mod 各自的东西」，靠的就是 `LIB_` 这个前缀。"
        }
      ],
      "core": [
        {
          "h": "① 两种关系：覆盖 vs 叠加"
        },
        {
          "table": {
            "head": [
              "资源类型",
              "多个 mod 都有时",
              "例子"
            ],
            "rows": [
              [
                "图片 / 音频 / XML / JSON",
                "**后加载的覆盖**（只有一个生效）",
                "两个 mod 都改 `bf.xml`，只有后加载的那个管用"
              ],
              [
                "状态脚本",
                "**全部叠加执行**",
                "两个 mod 都给 `PlayState` 写脚本，两个都会跑"
              ],
              [
                "全局脚本",
                "**全部叠加执行**",
                "`data/global.hx`"
              ],
              [
                "设置项 / 按键分类",
                "**按文件分开，都显示**",
                "每个 mod 一份 `LIB_<mod>`"
              ],
              [
                "状态重定向",
                "先到先得，`force` 才覆盖",
                "见第 41 节"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "最容易翻车的一点",
            "text": "两个 mod 都改 `data/characters/bf.xml`，你以为会合并，其实**只有一个生效**。要「各改各的」，只能用脚本在 `postCreate` 里补，或者干脆别改同一个文件。"
          }
        },
        {
          "h": "② `LIB_` 是什么"
        },
        {
          "p": "引擎内部有个「虚拟路径」技巧：`data/states/PlayState/LIB_mymod` 会被**重定向**到 `mymod` 这个 mod 自己的 `data/states/PlayState.hx`。这样同一个目录下，每个 mod 各有一份，互不覆盖。"
        },
        {
          "code": {
            "lang": "ini",
            "title": "磁盘上的真实文件 vs 引擎看到的路径",
            "src": "磁盘:\n  mods/A/data/states/PlayState.hx\n  mods/B/data/states/PlayState.hx\n\n引擎看到的:\n  data/states/PlayState/LIB_A   → mods/A/...PlayState.hx\n  data/states/PlayState/LIB_B   → mods/B/...PlayState.hx"
          }
        },
        {
          "p": "所以你在磁盘上**不用**建 `PlayState/` 这个文件夹，只要把文件放成 `data/states/PlayState.hx`，引擎会自动按 mod 名去取。"
        },
        {
          "h": "③ 哪 5 个地方支持 `LIB_`"
        },
        {
          "table": {
            "head": [
              "地方",
              "引擎里的路径",
              "你磁盘上放哪"
            ],
            "rows": [
              [
                "状态脚本",
                "`data/states/<状态名>/LIB_<mod>`",
                "`data/states/<状态名>.hx`"
              ],
              [
                "全局脚本",
                "`data/global/LIB_<mod>`",
                "`data/global.hx`"
              ],
              [
                "设置项",
                "`config/options/LIB_<mod>`",
                "`data/config/options.xml`"
              ],
              [
                "按键分类",
                "`config/controls/LIB_<mod>`",
                "`data/config/controls.xml`"
              ],
              [
                "制作名单",
                "`config/credits/LIB_<mod>`",
                "`data/config/credits.xml`"
              ]
            ]
          }
        },
        {
          "p": "第 5 项是个彩蛋：**制作名单也能按 mod 分开写**，你的 mod 可以有自己的 Credits 页内容。"
        },
        {
          "h": "④ 加载顺序"
        },
        {
          "ol": [
            "基础游戏资源库（`assets/`）先注册。",
            "`mods/` 下所有 mod 按排序规则注册（默认按名字，可在 Mod 菜单里调）。",
            "`addons/` 在 mod 之后叠加。",
            "**当前选中的 mod 优先级最高**（它的 `[Flags]` 会真正 `parseFlags`，其他 mod 的 flags 只存进 `addonFlags` 备用）。"
          ]
        },
        {
          "callout": {
            "kind": "info",
            "title": "顺序怎么影响你",
            "text": "覆盖类资源：**后注册的赢**，也就是当前 mod > addons > 其他 mod > 原版。脚本类：全部执行，但**顺序 = 加载顺序**，靠后的先看到？不 —— 先加载的先执行，所以后加载的脚本「最后说话」。"
          }
        },
        {
          "h": "⑤ 歌曲/周的合并策略"
        },
        {
          "p": "多个 mod 都有歌时，列表怎么拼？由两个 Flag 控制："
        },
        {
          "table": {
            "head": [
              "值",
              "效果"
            ],
            "rows": [
              [
                "`override`（默认）",
                "**只用当前 mod 的歌单**，原版和其他 mod 的都不显示"
              ],
              [
                "`prepend`",
                "mod 的歌排在原版**前面**"
              ],
              [
                "`append`",
                "mod 的歌排在原版**后面**"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "ini",
            "title": "modpack.ini",
            "src": "[Flags]\n# 让我的歌追加在原版歌单后面，而不是整个替换\nSONGS_LIST_MOD_MODE=\"append\"\nWEEKS_LIST_MOD_MODE=\"append\""
          }
        },
        {
          "h": "⑥ zip 与 `.cnemod`"
        },
        {
          "kv": [
            [
              "支持压缩包",
              "是。`mods/mymod.zip` 也能直接跑（`ZipFolderLibrary`）"
            ],
            [
              "允许的后缀",
              "由 `Flags.ALLOWED_ZIP_EXTENSIONS` 决定，**默认只有 `[\"zip\"]`**"
            ],
            [
              "`.cnemod`",
              "**默认不认**。想用 `.cnemod` 后缀，得把它加进 `ALLOWED_ZIP_EXTENSIONS`"
            ],
            [
              "代价",
              "zip 是**只读**的 —— 编辑器没法往里写，会弹 `Compressed Library Detected`"
            ],
            [
              "建议",
              "开发时用文件夹，发布时再压 zip"
            ]
          ]
        },
        {
          "h": "⑦ `modpack.ini` 的 `[Common]` 到底能写什么"
        },
        {
          "p": "引擎会把 `[Common]` 里的每个键加上 `MOD_` 前缀塞进 Flags，所以键名其实很自由；但这几个是**引擎真的会读**的："
        },
        {
          "table": {
            "head": [
              "键",
              "实际 Flag",
              "用途"
            ],
            "rows": [
              [
                "`NAME`",
                "`MOD_NAME`",
                "mod 显示名（Mod 菜单、标题）"
              ],
              [
                "`DESCRIPTION`",
                "`MOD_DESCRIPTION`",
                "一句话描述"
              ],
              [
                "`AUTHOR`",
                "`MOD_AUTHOR`",
                "作者"
              ],
              [
                "`VERSION`",
                "`MOD_VERSION`",
                "版本号"
              ],
              [
                "`API_VERSION`",
                "`MOD_API_VERSION`",
                "要的 Mod API 版本（当前 3）"
              ],
              [
                "`ICON`",
                "`MOD_ICON`",
                "Mod 菜单图标"
              ],
              [
                "`HOMEPAGE`",
                "`MOD_HOMEPAGE`",
                "主页链接"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "ini",
            "title": "mods/my-mod/data/config/modpack.ini",
            "src": "[Common]\nNAME=\"My Mod\"\nDESCRIPTION=\"一句话说清这是什么\"\nAUTHOR=\"you\"\nVERSION=\"1.0.0\"\nAPI_VERSION=3\nHOMEPAGE=\"https://github.com/you/my-mod\""
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "API_VERSION 写错会怎样",
            "text": "不是当前版本（`3`）时，引擎会在 Mod 菜单/启动时给警告 —— 不一定会崩，但表现可能异常。**别乱写大数字**。"
          }
        }
      ],
      "deep": [
        {
          "h": "⑧ 冲突排查清单"
        },
        {
          "table": {
            "head": [
              "现象",
              "查什么"
            ],
            "rows": [
              [
                "人物/舞台显示成别人的",
                "两个 mod 改了同一个 XML —— 覆盖了，只有一个生效"
              ],
              [
                "脚本执行了两次",
                "两个 mod 都给同一个状态写了脚本（这是叠加，正常）"
              ],
              [
                "设置里出现两份一样的选项",
                "两个 mod 的 `options.xml` 内容重复"
              ],
              [
                "切 mod 后崩",
                "`static` 变量残留上一个 mod 的数据"
              ],
              [
                "歌单里少了歌",
                "`SONGS_LIST_MOD_MODE` 是 `override`（默认），把别人挤掉了"
              ],
              [
                "zip mod 改不动",
                "压缩包只读，解压成文件夹"
              ],
              [
                "`.cnemod` 不认",
                "没加进 `ALLOWED_ZIP_EXTENSIONS`"
              ]
            ]
          }
        },
        {
          "h": "⑨ 写「和别人共存」的 mod 的几条规矩"
        },
        {
          "ul": [
            "**别改公共文件**（`bf.xml`、`stage.xml`），能挂脚本就挂脚本。",
            "**脚本里加前缀**：`mymod_xxx` 这种命名，避免和别人的函数/变量撞。",
            "**设置项 id 加前缀**（第 39 节），否则两个 mod 的 `volume` 会互相踩。",
            "**按键 saveName 加前缀**（第 40 节）。",
            "**`static` 变量记得在 `destroy` 里清**。",
            "**别默认 `override` 歌单**，除非你就是要做独立游戏。"
          ]
        }
      ]
    },
    {
      "id": "discord-rpc",
      "num": "49",
      "title": "Discord 状态：改「正在玩什么」",
      "en": "DISCORD RPC",
      "tags": [
        "Discord",
        "RPC",
        "discord.hx"
      ],
      "simple": [
        {
          "p": "Discord 上显示的「正在玩 Codename Engine / 正在玩某首歌」，是 `data/discord.hx` 这个脚本控制的。改它就能改显示内容。"
        }
      ],
      "core": [
        {
          "h": "① 文件在哪"
        },
        {
          "kv": [
            [
              "基础脚本",
              "`assets/data/discord.hx`"
            ],
            [
              "mod 覆盖",
              "`mods/<你的mod>/data/discord.hx`（整份替换）"
            ],
            [
              "前置条件",
              "编译时开了 `DISCORD_RPC`（桌面版默认开）"
            ],
            [
              "客户端 ID",
              "`data/config/discord.json`（`clientID` + 图标 key）"
            ]
          ]
        },
        {
          "h": "② 它能收到哪些回调"
        },
        {
          "table": {
            "head": [
              "回调",
              "什么时候触发"
            ],
            "rows": [
              [
                "`onDiscordPresenceUpdate(e)`",
                "每次要更新状态前 —— **改字段就在这里改**"
              ],
              [
                "`onPlayStateUpdate()`",
                "打歌中（可用来更新「正在玩」的进度）"
              ],
              [
                "`onMenuLoaded(name)`",
                "进菜单时，`name` 是 `\"Main Menu\"` / `\"Freeplay\"` / `\"Options Menu\"` …"
              ],
              [
                "`onEditorTreeLoaded(name)`",
                "打开编辑器选择界面"
              ],
              [
                "`onEditorLoaded(name, editingThing)`",
                "进到某个编辑器里面"
              ],
              [
                "`onGameOver()`",
                "死亡时"
              ]
            ]
          }
        },
        {
          "h": "③ `DiscordUtil` 的三个方法"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "import funkin.backend.utils.DiscordUtil;\n\n// 1) 直接设状态（大字 + 小字）\nDiscordUtil.changePresence(\"正在改谱\", \"第 3 周\");\n\n// 2) 设歌曲状态（会自动带计时器 = 正在播放的进度）\nDiscordUtil.changeSongPresence(details, state, inst, icon);\n\n// 3) 设状态并从某个时间点开始计时（传入 null = 从「现在」开始）\nDiscordUtil.changePresenceSince(\"在主菜单\", null);"
          }
        },
        {
          "h": "④ 改按钮"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "data/discord.hx（官方自带的那段）",
            "src": "function onDiscordPresenceUpdate(e) {\n\tvar data = e.presence;\n\n\tif (data.button1Label == null)\n\t\tdata.button1Label = \"加入 Discord\";\n\tif (data.button1Url == null)\n\t\tdata.button1Url = \"https://discord.gg/你的邀请链接\";\n}"
          }
        },
        {
          "p": "`e.presence` 上能改的还有 `details`、`state`、`largeImageKey`、`largeImageText`、`smallImageKey`、`smallImageText` 等 —— 都是标准 Discord RPC 字段。"
        }
      ],
      "deep": [
        {
          "h": "⑤ 自带的 `discord.hx` 做了什么"
        },
        {
          "ul": [
            "死亡时把状态改成「Game Over」+ 歌名难度",
            "打歌时用 `changeSongPresence` 把进度条跑起来",
            "进菜单时设成「In the Menus」",
            "进编辑器时设成「Choosing a Chart」这类",
            "给状态加一个「加入 Discord」按钮"
          ]
        },
        {
          "h": "⑥ 一个 mod 专属的写法"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "mods/my-mod/data/discord.hx",
            "src": "import funkin.backend.utils.DiscordUtil;\n\nfunction onMenuLoaded(name:String) {\n\tif (name == \"Freeplay\")\n\t\tDiscordUtil.changePresenceSince(\"在我的 mod 里挑歌\", null);\n\telse\n\t\tDiscordUtil.changePresenceSince(\"在菜单里\", null);\n}\n\nfunction onPlayStateUpdate() {\n\tDiscordUtil.changeSongPresence(\n\t\t\"My Mod\",\n\t\tPlayState.SONG.meta.displayName + \" [\" + PlayState.difficulty + \"]\",\n\t\tPlayState.instance.inst,\n\t\tPlayState.instance.getIconRPC()\n\t);\n}"
          }
        },
        {
          "h": "⑦ 注意事项"
        },
        {
          "ul": [
            "**别写死 song 名**：用 `PlayState.SONG.meta.displayName`，换歌自动跟着变。",
            "**`discord.json` 的 clientID 别乱改**：改了就连不上 Codename 的应用，你写的是自己的 App ID 才行。",
            "**关闭 Discord 时不会崩**，只是没有状态。",
            "**多语言**：官方那段用 `TranslationUtil.translate('rpc.xxx')`，你也能用，翻译在 `languages/*/RPC.xml`。"
          ]
        }
      ]
    },
    {
      "id": "appendix",
      "num": "50",
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
        },
        {
          "h": "术语补充（前面没提到的 14 个）"
        },
        {
          "table": {
            "head": [
              "术语",
              "含义"
            ],
            "rows": [
              [
                "**strum**",
                "一条轨道上的**一个箭头接收器**（4 键就是 4 个 strum）"
              ],
              [
                "**strumline**",
                "一整条轨道 = 若干 strum + 一条判定线"
              ],
              [
                "**playfield**",
                "一组轨道 + 它自己的相机（modchart 里可以有很多个）"
              ],
              [
                "**hold / sustain**",
                "长按条，`sLen` 是它的长度（毫秒）"
              ],
              [
                "**ghost tap**",
                "空按时不扣血（`Options.ghostTapping`）"
              ],
              [
                "**offset**",
                "音画偏移，正数 = 判定往后推"
              ],
              [
                "**variation**",
                "同一首歌的另一套谱面/音频（`erect` 那种）"
              ],
              [
                "**BPM change**",
                "谱面中途变速，由事件的 `BPM Change` 写入 `Conductor`"
              ],
              [
                "**step / beat / measure**",
                "step = 1/4 拍，beat = 1 拍，measure = 1 小节（4 拍）"
              ],
              [
                "**crochet**",
                "一拍多少毫秒；`stepCrochet` = 一步多少毫秒"
              ],
              [
                "**pack**",
                "把脚本/JSON/图钉合成一个文件的容器格式"
              ],
              [
                "**ndll**",
                "原生动态库（Haxe C++ 侧编译出的 `.ndll`）"
              ],
              [
                "**LIB_**",
                "虚路径前缀，用来「一个文件多个 mod 各存一份」"
              ],
              [
                "**API_VERSION**",
                "mod 声明的接口版本（当前 3），写错会有警告"
              ]
            ]
          }
        },
        {
          "h": "本站的键盘操作（再列一次，方便截图）"
        },
        {
          "table": {
            "head": [
              "按键",
              "作用"
            ],
            "rows": [
              [
                "`1` `2` `3`",
                "简单 / 普通 / 详细"
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
                "`M`",
                "背景音乐开关"
              ],
              [
                "`Esc`",
                "关闭弹层（警示页 / 搜索 / 面板）"
              ],
              [
                "`Enter`",
                "在警示页上 = 继续留在这里"
              ]
            ]
          }
        },
        {
          "h": "出问题时的求助顺序"
        },
        {
          "ol": [
            "**先看官方 Wiki**：<https://codename-engine.com/wiki/>（唯一权威）",
            "**再看源码**：`assets/data/` 里的 XML 是最好的范例（第 27 节有反查表）",
            "**搜 GitHub Issue**：很多「为什么这样设计」的答案在讨论里",
            "**最后再问人**：带上引擎版本 + 完整日志 + 复现步骤（第 44 节有模板）"
          ]
        },
        {
          "h": "版本与免责"
        },
        {
          "p": "本页整理于 **2026-10-23**，对应 **Windows Builds #1392 / v1.1.0 / Mod API v3**。引擎仍在快速迭代 —— 接口会改名、目录会挪位、某些写法过一两个版本就失效。**遇到冲突，以你手上版本的源码与实际表现为准。**"
        },
        {
          "p": "背景音乐：**Juhani Junkala《Chiptune Adventures – Stage 1》**，CC0（公有领域）授权，可自由使用；来源 [OpenGameArt](https://opengameart.org/content/4-chiptunes-adventure)。"
        }
      ]
    }
  ]
});
})();
