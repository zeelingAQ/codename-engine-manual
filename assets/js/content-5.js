/* ============================================================
   第五部分 · 参考手册
   ============================================================ */
(function () {
  if (!window.CNE) return;

  window.CNE.addPart({
  "id": "p5",
  "name": "第五部分 · 参考手册",
  "short": "PART 05",
  "color": "var(--blue)",
  "sections": [
    {
      "id": "api-overview",
      "num": "27",
      "title": "API 总览：接口在哪、怎么查",
      "en": "API OVERVIEW",
      "tags": [
        "API",
        "查找方法",
        "命名规律"
      ],
      "simple": [
        {
          "p": "「API」在这里就是：**你在脚本里能直接写哪些名字、能调哪些方法、能改哪些字段。**"
        },
        {
          "p": "三个查法，按顺序用：**① 本文的速查表 → ② `F4` 检查器看真实字段 → ③ 官方 API 文档。**"
        }
      ],
      "core": [
        {
          "h": "① API 分成哪几层"
        },
        {
          "table": {
            "head": [
              "层",
              "是什么",
              "在哪看"
            ],
            "rows": [
              [
                "**引擎 API**",
                "`PlayState`、`Character`、`Paths`、`Conductor`… 引擎自己写的类",
                "本文第 28–30 节 + 官方 API 文档"
              ],
              [
                "**脚本注入变量**",
                "引擎预先塞进脚本的全局名字（`FlxG`、`game`、`engine`…）",
                "第 28 节第一张表"
              ],
              [
                "**回调**",
                "引擎会在特定时机调用的函数名（`postCreate`、`onNoteHit`…）",
                "第 30 节"
              ],
              [
                "**事件对象**",
                "回调参数里那个 `event` 的字段",
                "第 31 节"
              ],
              [
                "**底层库**",
                "Flixel / OpenFL / Lime（`FlxSprite`、`FlxTween`…）",
                "第 32 节 + 官方 Flixel 文档"
              ]
            ]
          }
        },
        {
          "h": "② 三种查法"
        },
        {
          "ol": [
            "**本文速查**：先看第 28–32 节，八成问题能解决。",
            "**`F4` 检查器**：选中对象 → 右侧列出**当前版本真实存在**的全部字段。比任何文档都准。",
            "**`F2` 控制台**：输入 `help PlayState.instance` 列出对象字段；输入 `help` 列出所有命令。"
          ]
        },
        {
          "code": {
            "lang": "haxe",
            "title": "控制台里怎么查（F2）",
            "src": "// 列出某个对象的字段\nhelp PlayState.instance\n\n// 直接试算一个值\ntrace(PlayState.instance.songScore)\n\n// 查类里有什么（静态）\nhelp Character"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "最实用的一句",
            "text": "不确定字段名时，**不要猜**。按 F4 选中 `PlayState`，字段名一目了然，还能直接改来试。"
          }
        },
        {
          "h": "③ 命名规律（记住能猜对一半）"
        },
        {
          "ul": [
            "`xxxTxt` / `xxxText`：屏幕上那行文字（`scoreTxt`、`missesTxt`、`accuracyTxt`）。",
            "`iconP1` / `iconP2`：血条两边的头像（P1 = 玩家，P2 = 对手）。",
            "`camGame` / `camHUD`：两个相机，场景一个、UI 一个。",
            "`defaultXxx`：初始/默认值（`defaultCamZoom`）。",
            "`curXxx`：当前（`curSong`、`curStage`、`curCameraTarget`、`curRating`）。",
            "`canXxx`：能不能做某事（`canPause`、`canDie`）。",
            "`isXxx`：是不是（`isStoryMode`、`isPlayer`）。",
            "`xxxBG`：背景层（`healthBarBG`）。"
          ]
        },
        {
          "h": "④ 这份速查的约定"
        },
        {
          "kv": [
            [
              "「读/写」",
              "标了「只读」的字段别硬改，改了也会被引擎覆盖回去"
            ],
            [
              "「静态」",
              "标了静态的要写成 `PlayState.xxx`，不是 `game.xxx`"
            ],
            [
              "单位",
              "时间一律**毫秒**（`strumTime`、`songPosition`），除非写了「秒」"
            ],
            [
              "坐标",
              "Flixel 坐标系，左上角原点，y 向下"
            ],
            [
              "颜色",
              "`0xAARRGGBB` 整数，或 `FlxColor.fromString(\"#ff0000\")`"
            ]
          ]
        },
        {
          "callout": {
            "kind": "warn",
            "title": "时效性",
            "text": "API 表基于 **#1392 / v1.1.0** 实读源码整理。引擎更新后字段可能变，冲突时以 `F4` 检查器为准。"
          }
        }
      ],
      "deep": [
        {
          "h": "⑤ 官方 API 文档怎么用"
        },
        {
          "p": "官网有自动生成的 API 文档（`codename-engine.com/api-docs/`），按包名/类名索引，能看到每个类的字段、方法、参数、返回类型。它的价值在**完整**，缺点在**没告诉你「这个字段用来干嘛」** —— 所以最好的组合是：本文看用途，官方文档看签名。"
        },
        {
          "h": "⑥ 遇到「这个字段不存在」怎么办"
        },
        {
          "ol": [
            "确认版本：你手上的引擎是不是 #1392 之后改过名。",
            "`F4` 检查器搜一遍，看是不是改了大小写或挪了层级。",
            "去源码里搜（`source/funkin/...` 里 `public var` 一搜就有）——注意这一步只是**读**，不是让你改源码。"
          ]
        },
        {
          "h": "按「我想干什么」反查源码"
        },
        {
          "p": "读源码最怕「不知道从哪下手」。下面这张表是**问题 → 文件**的直查表，配合编辑器全文搜索用。"
        },
        {
          "table": {
            "head": [
              "我想知道…",
              "去哪个文件"
            ],
            "rows": [
              [
                "打歌时发生了什么",
                "`funkin/game/PlayState.hx`"
              ],
              [
                "角色怎么唱歌/跳舞",
                "`funkin/game/Character.hx`"
              ],
              [
                "舞台怎么摆元素",
                "`funkin/game/Stage.hx`"
              ],
              [
                "音符/轨道的数据结构",
                "`funkin/game/Note.hx`、`Strum.hx`、`StrumLine.hx`"
              ],
              [
                "谱面 JSON 怎么解析",
                "`funkin/backend/chart/Chart.hx`、`ChartData.hx`"
              ],
              [
                "事件怎么定义/触发",
                "`funkin/backend/chart/EventsData.hx`"
              ],
              [
                "资源路径怎么找",
                "`funkin/backend/assets/Paths.hx`"
              ],
              [
                "mod 怎么加载/覆盖",
                "`funkin/backend/assets/ModsFolder.hx`"
              ],
              [
                "脚本系统/沙箱",
                "`funkin/backend/scripting/Script.hx`、`hscript/Config.hx`"
              ],
              [
                "配置读取（flags.ini）",
                "`funkin/backend/system/Flags.hx`"
              ],
              [
                "设置项字段",
                "`funkin/options/Options.hx`"
              ],
              [
                "节拍/时间换算",
                "`funkin/backend/system/Conductor.hx`"
              ],
              [
                "所有回调名",
                "全库搜 `scripts.event(` / `script.call(`"
              ],
              [
                "所有事件对象",
                "`funkin/backend/scripting/events/` 整个目录"
              ]
            ]
          }
        },
        {
          "h": "三个高效的搜索姿势"
        },
        {
          "ol": [
            "**找回调**：搜 `scripts.event(`、`script.call(`、`callOnScripts(` —— 能调用脚本的地方都会留痕。",
            "**找字段**：搜 `public var 名字` —— 脚本能读的字段基本都是 public。",
            "**找路径**：搜 `Paths.image(`、`Paths.xml(` —— 看某个资源是怎么被定位的。"
          ]
        },
        {
          "code": {
            "lang": "ini",
            "title": "在 VS Code 里搜（正则）",
            "src": "# 所有会回调脚本的地方\nscripts\\.(event|call)\\(\n\n# 所有 public 字段声明\n^\\s*public\\s+(static\\s+)?var\\s+\n\n# 所有资源路径调用\nPaths\\.(image|xml|json|sound|music|script)\\("
          }
        },
        {
          "h": "源码包的目录骨架（只记 5 个）"
        },
        {
          "code": {
            "lang": "ini",
            "src": "source/\n├─ funkin/game/        打歌本体（PlayState/Character/Stage/Note）\n├─ funkin/menus/       所有菜单界面\n├─ funkin/backend/     引擎底层（资源/谱面/脚本/系统）\n├─ funkin/editors/     四套编辑器\n└─ hscript/            HScript 解释器补丁（沙箱白名单在这）"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "官方 Wiki 仍然要看",
            "text": "本文是「按源码重新整理的中文补充」，不是替代。遇到本文没写的 API，去官方 Wiki 的 `Modding The Engine` 分区；两边对不上时**以你手上版本的源码为准**。"
          }
        }
      ]
    },
    {
      "id": "api-globals",
      "num": "28",
      "title": "全局对象与工具类 API",
      "en": "GLOBALS & UTILITIES",
      "tags": [
        "Paths",
        "Conductor",
        "CoolUtil",
        "Flags",
        "Options",
        "engine"
      ],
      "simple": [
        {
          "p": "引擎往每个脚本里预先塞了一批名字，**直接写就能用**，不用 `import`、不用 `new`。这一节把它们列全。"
        },
        {
          "p": "最常用的五个：`FlxG`（全局）、`game`（当前打歌状态）、`Paths`（找资源）、`Conductor`（拍点时间）、`CoolUtil`（小工具）。"
        }
      ],
      "core": [
        {
          "h": "① 脚本里预置的全局名字（全表）"
        },
        {
          "table": {
            "head": [
              "分类",
              "名字"
            ],
            "rows": [
              [
                "语言工具",
                "`Std` `Math` `Reflect` `StringTools` `Json` `Xml` `Type` `Date` `Lambda` `Sys`"
              ],
              [
                "引擎上下文",
                "`state`（当前 FlxState） `window`（系统窗口） `engine`（版本信息） `__script__`（脚本自身）"
              ],
              [
                "OpenFL / Lime",
                "`Assets` `Application` `Main` `BlendMode`"
              ],
              [
                "Flixel 核心",
                "`FlxG` `FlxSprite` `FlxBasic` `FlxCamera` `FlxEase` `FlxTween` `FlxSound` `FlxAssets` `FlxMath` `FlxGroup` `FlxTypedGroup` `FlxSpriteGroup` `FlxText` `FlxTypeText` `FlxTimer` `FlxPoint` `FlxAxes` `FlxColor`"
              ],
              [
                "游戏对象",
                "`PlayState` `GameOverSubstate` `HealthIcon` `HudCamera` `Note` `Strum` `StrumLine` `Character` `Boyfriend`(兼容名) —— **`Stage` 不在注入表里**，要用得 `import funkin.game.Stage;`"
              ],
              [
                "菜单/状态",
                "`PauseSubstate` `FreeplayState` `MainMenuState` `StoryMenuState` `TitleState` `ModState` `ModSubState` `Options`"
              ],
              [
                "引擎工具",
                "`Paths` `Conductor` `Flags` `CoolUtil` `IniUtil` `XMLUtil` `ZipUtil` `MarkdownUtil` `EngineUtil` `ThreadUtil` `MemoryUtil` `BitmapUtil`"
              ],
              [
                "渲染/表现",
                "`FunkinShader` `CustomShader`(旧) `FunkinText` `FunkinSprite` `FlxAnimate` `Alphabet`"
              ],
              [
                "翻译",
                "`TranslationUtil` `translate`（多语言开启时）"
              ],
              [
                "3D（foxlite）",
                "`FoxScene` `FoxCamera` `FoxFPSCamera` `FoxRenderer` `FoxLoaderUtil` `FoxModel` `FoxQuadMesh` `FoxCubeMesh` `FoxMaterial` `FoxShader` `FoxTexture` `FoxDirectionalLight` `FoxPanoramaSky` `FoxFunkinSprite` `FoxFlxSprite` 等"
              ],
              [
                "脚本对象",
                "`__script__`(当前脚本实例) —— `Script` / `ScriptPack` / `EventManager` **不是注入变量**，需 `import funkin.backend.scripting.XXX;`"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "不在表里的类",
            "text": "要 `import`。比如 `WindowUtils`、`NdllUtil`、`flixel.addons.*` 的具体类。"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "engine：版本信息（只读）",
            "src": "trace(engine.name);    // \"Codename Engine\"\ntrace(engine.commit);  // 提交号（对应 #1392）\ntrace(engine.hash);    // 提交 hash\ntrace(engine.build);   // 固定为 2675（历史遗留）"
          }
        },
        {
          "h": "② Paths：找资源"
        },
        {
          "table": {
            "head": [
              "方法",
              "返回",
              "说明"
            ],
            "rows": [
              [
                "`Paths.image(key)`",
                "图片路径",
                "自动找 `.png/.jpg`，含图集目录识别"
              ],
              [
                "`Paths.sound(key)`",
                "音效路径",
                "自动试 `.ogg/.mp3/.flac/.opus/.wav`"
              ],
              [
                "`Paths.music(key)`",
                "音乐路径",
                "同上"
              ],
              [
                "`Paths.voices(song, diff, suffix)`",
                "人声路径",
                "找不到带难度后缀会回退到基础名"
              ],
              [
                "`Paths.inst(song, diff, suffix)`",
                "伴奏路径",
                "同上"
              ],
              [
                "`Paths.chart(song, diff, variant)`",
                "谱面 JSON 路径",
                "`songs/<歌>/charts/[变体/]<难度>.json`"
              ],
              [
                "`Paths.xml(key)`",
                "`data/<key>.xml`",
                "舞台/人物/周都用它"
              ],
              [
                "`Paths.json(key)`",
                "`data/<key>.json`",
                ""
              ],
              [
                "`Paths.txt(key)`",
                "`data/<key>.txt`",
                ""
              ],
              [
                "`Paths.fragShader(key)`",
                "`shaders/<key>.frag`",
                ""
              ],
              [
                "`Paths.script(key)`",
                "脚本路径",
                "自动补 `.hx/.hscript/.hsc/.hxs`"
              ],
              [
                "`Paths.character(name)`",
                "`data/characters/<name>.xml`",
                ""
              ],
              [
                "`Paths.font(key)`",
                "`fonts/<key>`",
                ""
              ],
              [
                "`Paths.video(key)`",
                "`videos/<key>`",
                ""
              ],
              [
                "`Paths.ndll(key)`",
                "`ndlls/<key>.ndll`",
                ""
              ],
              [
                "`Paths.obj/dae/md2/md5/awd(key)`",
                "`models/<key>.<ext>`",
                "3D 模型"
              ],
              [
                "`Paths.getFrames(key)`",
                "帧集合",
                "自动识别 Sparrow/Packer/Aseprite/Animate"
              ],
              [
                "`Paths.getSparrowAtlas(key)`",
                "图集帧",
                "最常用"
              ],
              [
                "`Paths.getPackerAtlas(key)`",
                "图集帧",
                "Packer 格式"
              ],
              [
                "`Paths.getAsepriteAtlas(key)`",
                "图集帧",
                "Aseprite 格式"
              ],
              [
                "`Paths.getMultiFrames([...])`",
                "帧集合",
                "多图合并"
              ],
              [
                "`Paths.getFolderContent(dir, addPath)`",
                "文件名数组",
                "遍历目录"
              ],
              [
                "`Paths.getFolderDirectories(dir)`",
                "子目录数组",
                ""
              ],
              [
                "`Paths.file(path)`",
                "原样路径",
                "不做约定拼接"
              ],
              [
                "`Paths.getPath(file, lib, exts)`",
                "完整路径",
                "底层方法"
              ],
              [
                "`Paths.getAssetsRoot()`",
                "mod 根目录",
                "调试用"
              ]
            ]
          }
        },
        {
          "h": "③ Conductor：时间与拍点"
        },
        {
          "table": {
            "head": [
              "静态字段",
              "说明"
            ],
            "rows": [
              [
                "`bpm`",
                "当前 BPM"
              ],
              [
                "`startingBPM`",
                "歌曲初始 BPM"
              ],
              [
                "`crochet`",
                "一拍的毫秒数"
              ],
              [
                "`stepCrochet`",
                "一步的毫秒数"
              ],
              [
                "`stepsPerBeat` / `beatsPerMeasure`",
                "每拍几步 / 每小节几拍"
              ],
              [
                "`denominator`",
                "拍号分母"
              ],
              [
                "`songPosition`",
                "当前歌曲位置（毫秒）"
              ],
              [
                "`songOffset`",
                "偏移（毫秒）"
              ],
              [
                "`curStep` / `curBeat` / `curMeasure`",
                "当前步 / 拍 / 小节（整数）"
              ],
              [
                "`curStepFloat` / `curBeatFloat` / `curMeasureFloat`",
                "同上但带小数"
              ],
              [
                "`lastStepChange` / `lastBeatChange` / `lastMeasureChange`",
                "上一次变化的时间点"
              ],
              [
                "`bpmChangeMap`",
                "BPM 变化表"
              ],
              [
                "`onStepHit` / `onBeatHit` / `onMeasureHit`",
                "信号（可 add 监听）"
              ],
              [
                "`onBPMChange` / `onTimeSignatureChange`",
                "信号"
              ],
              [
                "`invalidEvents`",
                "解析失败的事件"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "方法",
              "作用"
            ],
            "rows": [
              [
                "`changeBPM(newBpm)`",
                "改 BPM（会重排时间）"
              ],
              [
                "`setupSong(songData)`",
                "按谱面数据初始化"
              ],
              [
                "`getTimeInSteps(ms)` / `getTimeInBeats(ms)`",
                "毫秒 → 步/拍"
              ],
              [
                "`getStepsInTime(ms)` / `getBeatsInTime(ms)`",
                "同上的另一种叫法"
              ],
              [
                "`getTimeInChangeIndex(i)` / `getStepsInChangeIndex(i)`",
                "按 BPM 段索引换算"
              ],
              [
                "`getStepsWithBPMInTime(ms, bpm)`",
                "用指定 BPM 换算"
              ],
              [
                "`reset()`",
                "重置（切歌时引擎自动调）"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "时间换算示例",
            "src": "var beatMs = Conductor.crochet;          // 一拍多少毫秒\nvar stepMs = Conductor.stepCrochet;      // 一步多少毫秒\nvar nowBeat = Conductor.curBeatFloat;    // 浮点拍\nvar at2s = Conductor.getTimeInSteps(2000); // 2000ms 是第几步"
          }
        },
        {
          "h": "④ CoolUtil：小而常用的工具"
        },
        {
          "table": {
            "head": [
              "函数",
              "作用"
            ],
            "rows": [
              [
                "`fpsLerp(a, b, ratio)`",
                "**帧率无关**的插值（做平滑就用它）"
              ],
              [
                "`lerpColor(a, b, t)`",
                "颜色插值"
              ],
              [
                "`getColorFromDynamic(v)`",
                "把 `#ff0000` / 数字 / 字符串统一转颜色"
              ],
              [
                "`bound(a, min, max)` / `boundInt`",
                "夹取范围"
              ],
              [
                "`minInt` / `maxInt` / `floorInt`",
                "整数比较"
              ],
              [
                "`numberArray(n, start)`",
                "生成 `[0,1,2...]` 或 `[start..]`"
              ],
              [
                "`parseNumberRange(\"1-5,8\")`",
                "解析帧序号范围"
              ],
              [
                "`parseJson(text)`",
                "安全解析 JSON（失败返回 null）"
              ],
              [
                "`getDefault(v, def)` / `getDefaultFloat`",
                "空值兜底"
              ],
              [
                "`flxeaseFromString(\"quadOut\")`",
                "字符串 → `FlxEase` 函数"
              ],
              [
                "`coolTextFile(path)`",
                "读文本并按行返回数组（忽略空行）"
              ],
              [
                "`sortAlphabetically(arr)`",
                "按字母排序"
              ],
              [
                "`deepFlatten(arr)`",
                "拍平嵌套数组"
              ],
              [
                "`pushOnce(arr, v)` / `contains`",
                "去重添加 / 包含判断"
              ],
              [
                "`playMusic(key, vol, loop)`",
                "播放 `music/` 下的曲子"
              ],
              [
                "`playMenuSFX(kind)`",
                "播菜单音效（`CONFIRM` / `CANCEL` / `SCROLL`）"
              ],
              [
                "`preloadCharacter(name)`",
                "预加载人物资源"
              ],
              [
                "`cameraCenter(cam)`",
                "相机居中"
              ],
              [
                "`setGraphicSizeFloat(spr, w, h)`",
                "浮点缩放"
              ],
              [
                "`timeToStr(ms)`",
                "毫秒 → `mm:ss`"
              ],
              [
                "`keyToString(key)`",
                "按键码 → 可读名"
              ],
              [
                "`openURL(url)`",
                "用系统浏览器打开"
              ],
              [
                "`getFilename(path)`",
                "取文件名（不含扩展名）"
              ],
              [
                "`addZeros(n, len)` / `addEndZeros`",
                "补零"
              ],
              [
                "`quantize(v, step)`",
                "量化到步长"
              ],
              [
                "`getFPSRatio()`",
                "当前帧率比例（做帧率补偿用）"
              ]
            ]
          }
        },
        {
          "h": "⑤ Flags 与 Options"
        },
        {
          "p": "`Flags` 是**编译期/配置**层面的引擎常量（只读为主），`Options` 是**玩家设置**（可读写、可保存）。"
        },
        {
          "table": {
            "head": [
              "Flags（常用）",
              "说明"
            ],
            "rows": [
              [
                "`Flags.VERSION` / `VERSION_MESSAGE`",
                "版本号 / 完整版本字符串"
              ],
              [
                "`Flags.COMMIT_NUMBER` / `COMMIT_HASH`",
                "提交号与 hash"
              ],
              [
                "`Flags.MOD_NAME` / `MOD_DESCRIPTION` / `MOD_API_VERSION`",
                "当前 mod 的元数据"
              ],
              [
                "`Flags.GAME_WIDTH` / `GAME_HEIGHT`",
                "内部渲染分辨率（默认 1280×720）"
              ],
              [
                "`Flags.DEFAULT_DIFFICULTY`",
                "默认难度名"
              ],
              [
                "`Flags.SOUND_EXTS` / `IMAGE_EXTS` / `VIDEO_EXTS`",
                "各资源的扩展名优先级"
              ],
              [
                "`Flags.DEFAULT_GLSL_VERSION`",
                "默认 GLSL 版本"
              ],
              [
                "`Flags.SHADERS_CACHE_RESET_ON_SWITCH_STATE`",
                "切状态时重编 shader（调试用）"
              ],
              [
                "`Flags.DISABLE_EDITORS` / `DISABLE_WARNING_SCREEN` / `DISABLE_LANGUAGES`",
                "总开关类"
              ],
              [
                "`Flags.GITAROO_CHANCE`",
                "Gitaroo 暂停概率（默认 0.1）"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "Options（常用）",
              "说明"
            ],
            "rows": [
              [
                "`Options.downscroll` / `ghostTapping`",
                "下滚 / 幽灵点击"
              ],
              [
                "`Options.volumeMusic` / `volumeSFX` / `volume`",
                "音量"
              ],
              [
                "`Options.songOffset`",
                "歌曲偏移"
              ],
              [
                "`Options.gameplayShaders`",
                "允许游戏内 shader"
              ],
              [
                "`Options.lowMemoryMode`",
                "低内存模式"
              ],
              [
                "`Options.quality`",
                "画质（0 低 / 1 高 / 2 自定义）"
              ],
              [
                "`Options.framerate`",
                "帧率上限"
              ],
              [
                "`Options.devMode`",
                "开发者模式"
              ],
              [
                "`Options.save()` / `Options.applySettings()`",
                "存盘 / 应用"
              ],
              [
                "`Options.freeplayLastSong` 等",
                "上次选择"
              ]
            ]
          }
        },
        {
          "p": "改完记得 `Options.save()`；有些项要 `Options.applySettings()` 才立刻生效（音量、帧率、键位）。"
        }
      ],
      "deep": [
        {
          "h": "⑥ 需要 import 的常用工具类"
        },
        {
          "table": {
            "head": [
              "类",
              "能干什么"
            ],
            "rows": [
              [
                "`WindowUtils`",
                "窗口分辨率、标题、图标、关闭拦截"
              ],
              [
                "`NdllUtil`",
                "加载 `.ndll` 原生函数"
              ],
              [
                "`ZipUtil`",
                "读写 zip（桌面平台）"
              ],
              [
                "`MemoryUtil`",
                "内存信息与强制 GC"
              ],
              [
                "`ThreadUtil`",
                "起线程（`ALLOW_MULTITHREADING` 时）"
              ],
              [
                "`BitmapUtil`",
                "BitmapData 相关处理"
              ],
              [
                "`EngineUtil`",
                "引擎级操作"
              ],
              [
                "`IniUtil`",
                "读写 INI"
              ],
              [
                "`XMLUtil`",
                "XML ↔ 对象"
              ],
              [
                "`MarkdownUtil`",
                "Markdown 渲染"
              ],
              [
                "`TranslationUtil` / `translate`",
                "翻译"
              ]
            ]
          }
        },
        {
          "h": "⑦ `state` 与 `game` 的区别"
        },
        {
          "kv": [
            [
              "`game`",
              "就是 `PlayState.instance`，只在打歌时有值"
            ],
            [
              "`state`",
              "当前 `FlxG.state`，任何界面都有值（可能是菜单）"
            ],
            [
              "建议",
              "打歌逻辑用 `game`，通用逻辑用 `state`，都要判空"
            ]
          ]
        },
        {
          "h": "注入变量的真相（按 `Script.hx` 逐条核对）"
        },
        {
          "p": "第 28 节上面那张表是「分类速查」，这里是**源码事实**：`Script.buildDefaultVariables()` 一共注入 **107 个名字**，分成 6 组。"
        },
        {
          "table": {
            "head": [
              "组",
              "数量",
              "内容"
            ],
            "rows": [
              [
                "Haxe 标准库",
                "10",
                "`Std` `Math` `Reflect` `StringTools` `Json` `Xml` `Type` `Date` `Lambda` `Sys`"
              ],
              [
                "OpenFL / Lime",
                "4",
                "`BlendMode` `Assets` `Application` `Main`"
              ],
              [
                "Flixel",
                "19",
                "`FlxG` `FlxSprite` `FlxBasic` `FlxCamera` `FlxEase` `FlxTween` `FlxSound` `FlxAssets` `FlxMath` `FlxGroup` `FlxTypedGroup` `FlxSpriteGroup` `FlxTypeText` `FlxText` `FlxTimer` `FlxPoint` `FlxAxes` `FlxColor` …"
              ],
              [
                "foxlite（3D）",
                "36",
                "全部 `Fox*` 类，**只在开了 `THREE_D_SUPPORT && foxlite` 的构建里注入**"
              ],
              [
                "引擎对象",
                "27",
                "`PlayState` `Character` `Note` `Strum` `StrumLine` `Options` `Paths` `Conductor` `Flags` `Alphabet` `ModState` …"
              ],
              [
                "引擎工具",
                "11",
                "`CoolUtil` `IniUtil` `XMLUtil` `ZipUtil` `MarkdownUtil` `EngineUtil` `ThreadUtil` `MemoryUtil` `BitmapUtil` `TranslationUtil` `translate`"
              ]
            ]
          }
        },
        {
          "p": "此外还有 **3 个按脚本动态注入**的（不在上面这张静态表里，但每个脚本都有）："
        },
        {
          "kv": [
            [
              "`state`",
              "创建脚本时的 `FlxG.state` —— 切状态会变，所以不能缓存"
            ],
            [
              "`window`",
              "`Application.current.window`（系统窗口）"
            ],
            [
              "`__script__`",
              "脚本自己的实例（拿 `script.name`、`script.fileName` 等）"
            ]
          ]
        },
        {
          "callout": {
            "kind": "warn",
            "title": "三个常见误解",
            "text": "① **`Stage` 没被注入**，要用得 `import funkin.game.Stage;`。② `Script` / `ScriptPack` / `EventManager` 也没注入，同样要 import。③ `sys.io.File` / `sys.FileSystem` 没注入 → 脚本不能直接写文件（见第 22 节 ⑪）。"
          }
        },
        {
          "h": "「能用」的两道门"
        },
        {
          "p": "一个类名能不能在脚本里直接用，取决于两道门，**缺一不可**："
        },
        {
          "ol": [
            "**注入表**（`buildDefaultVariables`）—— 变量表里有，就能不带包名直接用。",
            "**import 白名单**（`hscript.Config.ALLOWED_CUSTOM_CLASSES`）—— 只有 `flixel`、`funkin`、`foxlite`、`modchart.engine`、`modchart.backend.standalone` 下的类能被 `import` / 按名解析。"
          ]
        },
        {
          "code": {
            "lang": "haxe",
            "title": "同一个类的三种命运",
            "src": "// ① 注入了 → 直接写\nFlxG.camera.zoom = 1.2;\n\n// ② 没注入但 funkin 包下 → import 后可用\nimport funkin.game.Stage;\nvar s = new Stage(\"stage\");\n\n// ③ 不在白名单（sys.io / openfl.desktop / haxe.*）→ 用不了\n// import sys.io.File;   ✗ 解析不到"
          }
        },
        {
          "h": "补遗：`CoolUtil` 与 `Paths` 里没列到的"
        },
        {
          "h4": "`CoolUtil`（`CoolUtil` 是注入变量，直接调）"
        },
        {
          "table": {
            "head": [
              "函数",
              "作用"
            ],
            "rows": [
              [
                "`safeSaveFile(path, content)`",
                "**写文件**（内部 `sys.io.File.saveContent`，自动建目录，失败弹错误框）"
              ],
              [
                "`addMissingFolders(path)`",
                "逐级创建目录"
              ],
              [
                "`deleteFolder(path)`",
                "递归删除目录"
              ],
              [
                "`getAnimsListFromFrames(frames)`",
                "从帧集合里提取所有动画名前缀"
              ],
              [
                "`getAnimsListFromAtlas(atlas)` / `FromAnimate(spr)` / `FromSprite(spr)`",
                "同上，按图集类型分"
              ],
              [
                "`worldToScreenPosition(pos)` / `pointToScreenPosition(pos)`",
                "世界坐标 ↔ 屏幕坐标"
              ],
              [
                "`mouseOverlaps(spr)`",
                "鼠标是否在某精灵上"
              ],
              [
                "`getLuminance(color)`",
                "算颜色亮度（自动选黑/白文字）"
              ],
              [
                "`positiveModulo(n, m)` / `positiveModuloInt`",
                "恒正取模（负数也返回正）"
              ],
              [
                "`getSizeString(bytes)` / `getSizeString64`",
                "把字节数变成 `12.3 MB`"
              ],
              [
                "`setSpriteSize(spr, w, h)`",
                "按比例设置尺寸"
              ],
              [
                "`formatNumberRange(range)` / `parseNumberRange(str)`",
                "`1-5,8` ↔ 数组"
              ],
              [
                "`deepEqual(a, b)`",
                "深比较两个对象"
              ],
              [
                "`browsePath(path)`",
                "用系统文件管理器打开目录"
              ],
              [
                "`isNaN(v)` / `isNotNull(v)`",
                "安全判断"
              ],
              [
                "`getLastExceptionStack()`",
                "拿上次异常的堆栈（做错误上报）"
              ]
            ]
          }
        },
        {
          "h4": "`Paths` 里漏掉的两个"
        },
        {
          "table": {
            "head": [
              "函数",
              "作用"
            ],
            "rows": [
              [
                "`Paths.soundRandom(key)`",
                "从 `key1` / `key2` / `key3`… 里随机挑一个音效（**做随机打击音就靠它**）"
              ],
              [
                "`Paths.vertShader(key)`",
                "顶点着色器路径（`.vert`，对应 `fragShader`）"
              ],
              [
                "`Paths.framesExists(key)`",
                "判断图集是否存在（不抛错）"
              ],
              [
                "`Paths.assetsTree`",
                "整个资源树（查某个资源来自哪个 mod 时用）"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "两个实用例子",
            "src": "// 随机打击音：放 sfx/hit1.ogg、hit2.ogg、hit3.ogg\nFlxG.sound.play(Paths.soundRandom(\"hit\"));\n\n// 存一份自己的统计数据\nvar data = { clears: 3, lastSong: \"bopeey\" };\nCoolUtil.safeSaveFile(\"my-mod/stats.json\", Json.stringify(data));"
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "写完记得确认路径",
            "text": "`safeSaveFile` 的路径是**相对游戏根目录**的。写进 `mods/` 里会被下一次 mod 更新覆盖，建议写到 `%APPDATA%` 或游戏根下的独立目录。"
          }
        },
        {
          "h": "补遗：`Conductor` 的 BPM 变更表"
        },
        {
          "p": "长谱面里 BPM 会变，`Conductor` 维护一张「变更表」。下面这些是操作它的函数（前面表格没列）。"
        },
        {
          "table": {
            "head": [
              "成员",
              "作用"
            ],
            "rows": [
              [
                "`mapBPMChanges(chart)`",
                "按谱面重建 BPM 变更表（加载歌曲时自动调）"
              ],
              [
                "`mapCharterBPMChanges(chart)`",
                "编辑器专用版本"
              ],
              [
                "`curChangeIndex`",
                "当前处于第几个变更段"
              ],
              [
                "`curChange`",
                "当前变更对象（含 `bpm` / `stepTime` 等）"
              ],
              [
                "`getBeatsInChangeIndex(t, i)` / `getMeasuresInChangeIndex(t, i)`",
                "按「第 i 段」换算拍/小节"
              ],
              [
                "`getTimeWithIndexInBPM(t, i)` / `getStepsWithIndexInBPM(t, i)`",
                "按段换算毫秒/step"
              ],
              [
                "`getTimeInBPM(t)` / `getTimeWithBPMInSteps(t, i, bpm)`",
                "指定 BPM 下的换算"
              ],
              [
                "`getMeasuresInTime(t, from)`",
                "毫秒 → 小节数"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "什么时候需要这些",
            "text": "做「跨 BPM 段的时间预测」（比如提前预警一个快段）时才需要。日常用 `songPosition` / `curStep` 就够。"
          }
        }
      ]
    },
    {
      "id": "api-core-objects",
      "num": "29",
      "title": "核心对象 API：PlayState / 角色 / 舞台 / 音符",
      "en": "CORE OBJECTS",
      "tags": [
        "PlayState",
        "Character",
        "Stage",
        "Note",
        "StrumLine"
      ],
      "simple": [
        {
          "p": "打歌时你能碰到的对象就这几个：**`game`（整个关卡）、`boyfriend` / `dad` / `gf`（角色）、`stage`（舞台）、`camGame` / `camHUD`（相机）**。"
        },
        {
          "p": "音符和轨道平时不用手动管，做 modchart 或特殊判定才碰。"
        }
      ],
      "core": [
        {
          "h": "① PlayState：整个打歌状态"
        },
        {
          "h4": "角色与相机"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`boyfriend` / `bf`",
                "玩家角色（Character）"
              ],
              [
                "`dad`",
                "对手角色"
              ],
              [
                "`gf`",
                "GF"
              ],
              [
                "`stage`",
                "舞台对象"
              ],
              [
                "`camGame`",
                "场景相机（FlxCamera）"
              ],
              [
                "`camHUD`",
                "UI 相机（HudCamera）"
              ],
              [
                "`camFollow`",
                "镜头跟随点（FlxObject）"
              ],
              [
                "`curCameraTarget`",
                "当前跟谁（轨道索引）"
              ],
              [
                "`cameraFocusOffset`",
                "镜头额外偏移（FlxPoint）"
              ]
            ]
          }
        },
        {
          "h4": "分数 / 血量 / 判定"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`health`",
                "血量（默认上限 2）"
              ],
              [
                "`maxHealth`",
                "血量上限"
              ],
              [
                "`songScore`",
                "分数（**不叫 score**）"
              ],
              [
                "`combo` / `comboBreaks`",
                "连击数 / 是否断连"
              ],
              [
                "`misses`",
                "漏键数"
              ],
              [
                "`accuracy`",
                "准确率（0~1）"
              ],
              [
                "`accuracyPressedNotes`",
                "已按音符数"
              ],
              [
                "`hits`",
                "各评级命中次数（Map）"
              ],
              [
                "`curRating`",
                "当前评级对象"
              ],
              [
                "`validScore`",
                "这局是否计入分数"
              ],
              [
                "`minDigitDisplay`",
                "分数最少显示几位"
              ]
            ]
          }
        },
        {
          "h4": "界面元素"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`healthBar` / `healthBarBG`",
                "血条 / 血条底"
              ],
              [
                "`scoreTxt` / `missesTxt` / `accuracyTxt`",
                "三行文字"
              ],
              [
                "`iconP1` / `iconP2` / `iconArray`",
                "两个头像 / 全部头像"
              ],
              [
                "`comboGroup`",
                "连击数字组（可整体移动）"
              ],
              [
                "`detailsText` / `detailsPausedText`",
                "暂停界面右上角的曲目信息"
              ],
              [
                "`ratingManager`",
                "评级管理器"
              ]
            ]
          }
        },
        {
          "h4": "轨道与镜头"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`strumLines`",
                "所有轨道组（FlxTypedGroup）"
              ],
              [
                "`playerStrums` / `player`",
                "玩家轨道"
              ],
              [
                "`cpuStrums` / `cpu`",
                "对手轨道"
              ],
              [
                "`strumLine`",
                "（内部）当前轨道容器"
              ],
              [
                "`scrollSpeed`",
                "谱面流速"
              ],
              [
                "`defaultCamZoom`",
                "默认场景缩放"
              ],
              [
                "`defaultHudZoom`",
                "默认 UI 缩放"
              ],
              [
                "`camZooming`",
                "是否跟拍缩放"
              ],
              [
                "`camZoomingInterval`",
                "每几拍缩一次"
              ],
              [
                "`camZoomingStrength`",
                "缩放强度"
              ],
              [
                "`camZoomingEvery`",
                "按拍/步/小节（枚举）"
              ],
              [
                "`maxCamZoom`",
                "最大缩放上限"
              ],
              [
                "`camGameZoomLerp` / `camHUDZoomLerp`",
                "回弹插值速度"
              ],
              [
                "`camGameZoomMult` / `camHUDZoomMult`",
                "缩放倍率"
              ]
            ]
          }
        },
        {
          "h4": "状态与数据"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`SONG`（**静态**）",
                "当前谱面数据（`ChartData`）"
              ],
              [
                "`difficulty`（**静态**）",
                "当前难度名"
              ],
              [
                "`variation`（**静态**）",
                "当前变体名"
              ],
              [
                "`instance`（**静态**）",
                "当前 PlayState 实例"
              ],
              [
                "`isStoryMode`（**静态**）",
                "是否故事模式"
              ],
              [
                "`chartingMode` / `opponentMode` / `coopMode`",
                "编辑器模式 / 对手模式 / 双人模式"
              ],
              [
                "`curSong` / `curSongID` / `curStage`",
                "当前歌 / 歌 ID / 舞台名"
              ],
              [
                "`startedCountdown` / `paused` / `canPause`",
                "倒计时是否结束 / 是否暂停 / 能否暂停"
              ],
              [
                "`endingSong` / `inCutscene` / `playCutscenes`",
                "正在结束 / 在过场 / 是否播过场"
              ],
              [
                "`seenCutscene`（**静态**）",
                "过场是否已播过"
              ],
              [
                "`events` / `eventsTween`",
                "事件数组 / 事件补间表"
              ],
              [
                "`scripts`",
                "这首歌的脚本包（ScriptPack）"
              ],
              [
                "`noteTypesArray`",
                "本曲用到的音符类型"
              ],
              [
                "`hitWindow`",
                "判定窗口（毫秒，已弃用但仍存在）"
              ],
              [
                "`inst` / `vocals`",
                "伴奏 / 人声（FlxSound）"
              ],
              [
                "`gfSpeed`",
                "GF 跳舞频率"
              ]
            ]
          }
        },
        {
          "h4": "方法"
        },
        {
          "table": {
            "head": [
              "方法",
              "作用"
            ],
            "rows": [
              [
                "`playAnim` 相关走角色",
                "见下面的 Character"
              ],
              [
                "`pauseGame()`",
                "暂停（会走暂停菜单）"
              ],
              [
                "`endSong()`",
                "结束本曲（走结算）"
              ],
              [
                "`nextSong()`",
                "故事模式下一首"
              ],
              [
                "`gameOver(...)`",
                "触发死亡"
              ],
              [
                "`startCountdown()` / `countdown(n)`",
                "开始/推进倒计时"
              ],
              [
                "`startCutscene(prefix)`",
                "播过场"
              ],
              [
                "`goodNoteHit(line, note)`",
                "手动判一次命中"
              ],
              [
                "`noteMiss(line, note, dir, player)`",
                "手动判一次漏键"
              ],
              [
                "`updateRating()`",
                "刷新评级文字"
              ],
              [
                "`displayRating(name)` / `displayCombo()`",
                "弹评级 / 连击"
              ],
              [
                "`moveCamera()`",
                "按当前目标移镜头"
              ],
              [
                "`resyncVocals()`",
                "人声重新同步"
              ],
              [
                "`executeEvent(evt)`",
                "执行一条事件"
              ],
              [
                "`addScript(file)`",
                "运行中追加脚本"
              ],
              [
                "`registerSmoothTransition()`",
                "注册平滑过渡"
              ],
              [
                "`loadSong(name, diff, variant, opp, coop)`（**静态**）",
                "加载歌曲数据"
              ],
              [
                "`loadWeek(weekData, diff)`（**静态**）",
                "加载一周"
              ]
            ]
          }
        },
        {
          "h": "② Character：角色"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`curCharacter`",
                "角色名（XML 名）"
              ],
              [
                "`isPlayer`",
                "是否玩家侧"
              ],
              [
                "`sprite`",
                "贴图名"
              ],
              [
                "`icon` / `iconColor`",
                "血条图标名 / 图标主色"
              ],
              [
                "`gameOverCharacter`",
                "死亡时用的角色"
              ],
              [
                "`globalOffset` / `cameraOffset` / `extraOffset`",
                "三种偏移（FlxPoint）"
              ],
              [
                "`idleSuffix`",
                "待机动画后缀（做 alt 姿势用）"
              ],
              [
                "`singAnims` / `animOffsets`",
                "唱歌动画名表 / 动画偏移表"
              ],
              [
                "`danceOnBeat` / `beatInterval` / `beatOffset`",
                "是否跟拍 / 间隔 / 偏移"
              ],
              [
                "`holdTime`",
                "唱歌姿势保持时间"
              ],
              [
                "`stunned`",
                "是否僵直（不跳舞）"
              ],
              [
                "`ghostDraw`",
                "是否画叠影"
              ],
              [
                "`centeredCamera`",
                "镜头是否对准中心"
              ],
              [
                "`xml`",
                "角色的 XML（Access）"
              ],
              [
                "`scripts`",
                "角色脚本包"
              ],
              [
                "`animation`",
                "FlxAnimationController（帧动画）"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "方法",
              "作用"
            ],
            "rows": [
              [
                "`playAnim(name, ?force, ?context, ?reversed, ?frame)`",
                "播动画（最常用）"
              ],
              [
                "`playSingAnim(dir, suffix, ctx, force)`",
                "按方向播唱歌动画"
              ],
              [
                "`dance()` / `tryDance()`",
                "跳舞 / 条件跳舞"
              ],
              [
                "`hasAnim(name)`",
                "有没有这个动画"
              ],
              [
                "`getAnimName()` / `isAnimFinished()`",
                "当前动画名 / 是否播完"
              ],
              [
                "`addAnim(name, prefix, fps, loop, offsets)`",
                "运行时加动画"
              ],
              [
                "`getCameraPosition()`",
                "该角色的镜头位置"
              ],
              [
                "`getIcon()`",
                "血条图标名"
              ],
              [
                "`swapLeftRightAnimations()`",
                "左右动画互换"
              ],
              [
                "`fixChar(switchAnims)`",
                "修正朝向与偏移"
              ]
            ]
          }
        },
        {
          "h": "③ Stage：舞台"
        },
        {
          "table": {
            "head": [
              "字段 / 方法",
              "说明"
            ],
            "rows": [
              [
                "`stageSprites`",
                "`Map<String, FlxSprite>`，按 XML 的 `name` 取"
              ],
              [
                "`stageName` / `stageFile` / `stagePath`",
                "舞台名 / 文件名 / 路径"
              ],
              [
                "`stageXML`",
                "舞台 XML（Access）"
              ],
              [
                "`stageScript`",
                "舞台脚本"
              ],
              [
                "`characterPoses`",
                "角色位置表"
              ],
              [
                "`defaultZoom` / `startCam`",
                "默认缩放 / 开局镜头"
              ],
              [
                "`spritesParentFolder`",
                "贴图前缀"
              ],
              [
                "`extra`",
                "自定义属性（XML 根节点里的其他属性）"
              ],
              [
                "`beatHit(b)` / `stepHit(s)` / `measureHit(m)`",
                "拍点回调（引擎自动调）"
              ],
              [
                "`addCharPos(name, node)`",
                "运行时加一个角色锚点"
              ],
              [
                "`loadXml(xml)`",
                "重新解析 XML"
              ],
              [
                "`getList()`（**静态**）",
                "列出所有可用舞台"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "按名字拿舞台元素",
            "src": "var bg = stage.stageSprites.get(\"bg\");\nif (bg != null) bg.visible = false;\n\n// 也可以用 XML 里的自定义属性\nif (stage.extra.exists(\"mood\")) trace(stage.extra.get(\"mood\"));"
          }
        },
        {
          "h": "④ Note：一个音符"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`strumTime`",
                "判定时间（毫秒）"
              ],
              [
                "`noteData`",
                "方向（0 左 / 1 下 / 2 上 / 3 右）"
              ],
              [
                "`strumID` / `strumLine`",
                "所在轨道"
              ],
              [
                "`noteType` / `noteTypeID`",
                "音符类型名 / ID"
              ],
              [
                "`isSustainNote` / `sustainLength`",
                "是否长按 / 长度"
              ],
              [
                "`sustainParent` / `nextSustain`",
                "长按父子关系"
              ],
              [
                "`mustPress`",
                "是否玩家侧"
              ],
              [
                "`wasGoodHit` / `tooLate` / `canBeHit`",
                "命中状态"
              ],
              [
                "`animSuffix`",
                "动画后缀（做 alt 用）"
              ],
              [
                "`score` / `accuracy` / `healthGain`",
                "这个音符的加分/准确率/回血量"
              ],
              [
                "`scrollSpeed` / `noteAngle`",
                "独立流速 / 角度"
              ],
              [
                "`splash`",
                "溅射配置名"
              ],
              [
                "`earlyPressWindow` / `latePressWindow`",
                "提前/延后判定窗口"
              ],
              [
                "`prevNote` / `nextNote`",
                "同轨相邻音符"
              ]
            ]
          }
        },
        {
          "h": "⑤ Strum 与 StrumLine：轨道"
        },
        {
          "table": {
            "head": [
              "StrumLine 字段",
              "说明"
            ],
            "rows": [
              [
                "`characters`",
                "这条轨道上的角色数组"
              ],
              [
                "`notes`",
                "音符组（NoteGroup）"
              ],
              [
                "`members`",
                "四个 Strum（方向箭头）"
              ],
              [
                "`cpu` / `opponentSide`",
                "是否对手侧"
              ],
              [
                "`controls`",
                "按键配置"
              ],
              [
                "`vocals`",
                "人声轨"
              ],
              [
                "`altAnim` / `animSuffix`",
                "alt 动画开关 / 后缀"
              ],
              [
                "`strumScale`",
                "箭头缩放"
              ],
              [
                "`data`",
                "谱面里的轨道数据"
              ],
              [
                "`onHit` / `onMiss` / `onNoteUpdate` / `onNoteDelete`",
                "信号（可监听）"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "StrumLine 方法",
              "作用"
            ],
            "rows": [
              [
                "`generate()`",
                "按谱面生成箭头与音符"
              ],
              [
                "`createStrum()`",
                "造一个箭头"
              ],
              [
                "`addHealth(h)`",
                "给这条线加血"
              ],
              [
                "`deleteNote(note)`",
                "删音符"
              ],
              [
                "`updateNote(note)`",
                "刷新音符位置"
              ],
              [
                "`updateInput(id)`",
                "处理输入"
              ],
              [
                "`resetStrumPositions()`",
                "重置箭头位置"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "Strum 字段 / 方法",
              "说明"
            ],
            "rows": [
              [
                "`strumLine`",
                "所属轨道线"
              ],
              [
                "`lastHit`",
                "上次命中的时间"
              ],
              [
                "`scrollSpeed` / `noteAngle`",
                "流速 / 角度"
              ],
              [
                "`animSuffix`",
                "动画后缀"
              ],
              [
                "`playAnim(name, force)`",
                "播箭头动画"
              ],
              [
                "`getPressed` / `getJustPressed` / `getJustReleased`",
                "按键状态回调"
              ]
            ]
          }
        },
        {
          "h": "⑥ HealthIcon：血条头像"
        },
        {
          "table": {
            "head": [
              "字段 / 方法",
              "说明"
            ],
            "rows": [
              [
                "`curCharacter`",
                "当前图标名"
              ],
              [
                "`animated` / `xmlData`",
                "是否动画图标 / 图标 XML"
              ],
              [
                "`healthSteps`",
                "血量阈值 → 动画/帧 的映射"
              ],
              [
                "`setIcon(char, allowAnimated)`",
                "换图标"
              ],
              [
                "`setHealthSteps(steps)`",
                "自定义阈值"
              ],
              [
                "`defaultScale` / `extraOffsets`",
                "缩放 / 额外偏移"
              ],
              [
                "`sprTracker` / `sprTrackerOffset`",
                "跟随目标"
              ]
            ]
          }
        }
      ],
      "deep": [
        {
          "h": "⑦ 那些「改了会被覆盖」的字段"
        },
        {
          "ul": [
            "`accuracy` —— 由内部统计推导，直接赋值会在下次命中被重算。",
            "`health` —— 可以改，但 `maxHealth` 之外的值会被夹取。",
            "`camGame.zoom` —— 每帧会被 `camZooming` 逻辑 lerp。要稳定改就设 `defaultCamZoom`，或关掉 `camZooming`。",
            "`iconP1.scale` —— 每帧被 bop 逻辑重置，想改用 `defaultScale`。",
            "`scoreTxt.text` —— 下次命中会被重写，长期自定义要接管 `updateRating`。"
          ]
        },
        {
          "h": "⑧ 静态 vs 实例，别再写错"
        },
        {
          "kv": [
            [
              "`PlayState.SONG`",
              "静态：`PlayState.SONG.meta.name`"
            ],
            [
              "`game.SONG`",
              "也能取到（实例访问静态），但混用容易误导"
            ],
            [
              "`PlayState.instance.health`",
              "实例：血量只能这样取"
            ],
            [
              "`health`",
              "在 PlayState 脚本里可以直接写（父对象就是 game）"
            ]
          ]
        },
        {
          "h": "跳舞 / 唱歌 / 待机：时序到底怎么算的"
        },
        {
          "p": "这几件事经常被搞混：**什么时候跳舞**、**唱歌动画多久后回去跳舞**、**为什么我的角色一直不动**。源码里的规则其实很清晰。"
        },
        {
          "table": {
            "head": [
              "字段",
              "默认",
              "作用"
            ],
            "rows": [
              [
                "`holdTime`",
                "`4`",
                "唱完歌之后**隔多少个 step** 才恢复跳舞（**不是秒，也不是拍**）"
              ],
              [
                "`idleSuffix`",
                "`\"\"`",
                "待机/跳舞动画名的后缀，拼成 `idle<suffix>` / `danceLeft<suffix>`"
              ],
              [
                "`danceOnBeat`",
                "`true`",
                "关掉它，角色就永远不跳舞"
              ],
              [
                "`beatInterval`",
                "`1`",
                "每几拍跳一次（`2` = 每两拍）"
              ],
              [
                "`beatOffset`",
                "`0`",
                "相位偏移，和别人的动作错开"
              ],
              [
                "`isDanceLeftDanceRight`",
                "看动画",
                "有 `danceLeft`/`danceRight` 就左右交替，否则用 `idle`"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "beatHit 里的判断（简化自源码）",
            "src": "// 每拍检查一次能不能跳\nif (danceOnBeat && (curBeat + beatOffset) % (beatInterval * max(floor(4 / stepsPerBeat), 1)) == 0)\n\ttryDance();"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "tryDance() 的四种情况",
            "src": "switch (lastAnimContext) {\n\tcase SING | MISS:\n\t\t// 唱歌/漏键之后：要等够 holdTime 个 step 才回待机\n\t\tif (lastHit + (Conductor.stepCrochet * holdTime) < Conductor.songPosition)\n\t\t\tdance();\n\tcase DANCE:\n\t\tdance();\n\tcase LOCK:\n\t\tif (getAnimName() == null) dance();\n\tdefault:\n\t\tif (getAnimName() == null || isAnimFinished()) dance();\n}"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "「唱歌姿势停多久」= 调 holdTime",
            "text": "单位是 **step**：`stepCrochet * holdTime` 毫秒。默认 4，4/4 拍下约 1 拍。改之前先按 BPM 算一下。"
          }
        },
        {
          "p": "两个可拦事件：**`onDance`**（`DanceEvent`，cancel 就不跳）和 **`onTryDance`**（`CancellableEvent`，拦在判断之前）。"
        },
        {
          "h": "遗补：常被忽略但很好用的成员"
        },
        {
          "p": "下面这些在文档前面的表里没列，但做 mod 时经常需要 —— 全部从源码里补的。"
        },
        {
          "h4": "`Character`"
        },
        {
          "table": {
            "head": [
              "成员",
              "说明"
            ],
            "rows": [
              [
                "`getSingAnim(dir, suffix=\"\")`",
                "拿到「某个方向 + 后缀」对应的动画名，不用自己拼字符串"
              ],
              [
                "`playSingAnimUnsafe(dir, suffix, context, force, reversed, frame)`",
                "**跳过检查**直接播唱歌动画（`playSingAnim` 会判断当前状态）"
              ],
              [
                "`applyXML(xml)` / `buildXML(?order)`",
                "从 XML 应用 / 反向导出 XML（编辑器在用）"
              ],
              [
                "`getXMLFromCharName(nameOrChar)`",
                "**静态**：按名字拿到角色的 XML（会处理 fallback）"
              ],
              [
                "`getIconFromCharName(name, defaultIcon)`",
                "**静态**：按角色名推图标名"
              ],
              [
                "`playerOffsets`",
                "是否使用玩家偏移（P2 相关）"
              ],
              [
                "`characterProperties` / `characterAnimProperties`",
                "**静态白名单**：`<property>` 能给角色/动画设哪些属性"
              ],
              [
                "`FALLBACK_CHARACTER` / `FALLBACK_DEAD_CHARACTER`",
                "找不到角色时用谁兜底"
              ]
            ]
          }
        },
        {
          "h4": "`Stage`：5 个可挂的钩子 + 3 个实用工具"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "Stage 的钩子签名（都是 public var，直接赋值）",
            "src": "stage.onXMLLoaded    = function (xml, elems) return elems;         // 解析前改节点列表\nstage.onNodeLoaded    = function (node, sprite) return sprite;      // 每个节点造完精灵后\nstage.onNodeFinished  = function (node, sprite) {}                  // 每个节点处理完\nstage.onAddSprite     = function (sprite) {}                        // 精灵被 add 时\nstage.onXMLPostLoaded = function (xml, elems) return elems;         // 全部加载完"
          }
        },
        {
          "table": {
            "head": [
              "成员",
              "说明"
            ],
            "rows": [
              [
                "`DEFAULT_ATTRIBUTES`",
                "**静态**：`[\"name\",\"startCamPosX\",\"startCamPosY\",\"zoom\",\"folder\"]` —— 根节点这些属性不会被塞进 `extra`"
              ],
              [
                "`getDefaultPos(name)`",
                "**静态**：拿某个站位名的默认坐标（`dad`/`gf`/`bf`）"
              ],
              [
                "`isCharFlipped(posName, def)`",
                "这个站位是不是要翻转"
              ],
              [
                "`charSpacingX` / `charSpacingY`",
                "多个角色挤在同一站位时的间距（默认 20 / 0）"
              ],
              [
                "`applyCharStuff(char, posName, id)` / `prepareCharacter(char, id)`",
                "把角色按站位摆好（引擎内部流程，改站位逻辑时用）"
              ],
              [
                "`xmlImportedScripts`",
                "记录这个舞台通过 `<use-extension>` 引了哪些脚本"
              ]
            ]
          }
        },
        {
          "h4": "`PlayState`：分数与流程"
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
                "`campaignScore`",
                "`Int`",
                "整周累计分（故事模式）"
              ],
              [
                "`campaignMisses`",
                "`Int`",
                "整周累计 Miss"
              ],
              [
                "`campaignAccuracy`",
                "`Float`（只读）",
                "整周平均准确率"
              ],
              [
                "`campaignAccuracyTotal` / `campaignAccuracyCount`",
                "`Float`",
                "上面那个值的分子分母"
              ],
              [
                "`deathCounter`",
                "`Int`（静态）",
                "死了多少次（跨状态累计）"
              ],
              [
                "`canDadDie`",
                "`Bool`",
                "对手角色会不会有死亡动画（对手模式/双人时自动 false）"
              ],
              [
                "`muteVocalsOnMiss`",
                "`Bool`",
                "Miss 时静音人声"
              ],
              [
                "`doIconBop`",
                "`Bool`",
                "图标跟拍跳动"
              ],
              [
                "`introLength`",
                "`Int`",
                "开场倒数长度（拍）"
              ],
              [
                "`maxMisses`",
                "`Float`",
                "允许的 Miss 上限（可能是 `POSITIVE_INFINITY`）"
              ],
              [
                "`scrollSpeedTween`",
                "`FlxTween`",
                "当前的流速补间（改流速时先看它）"
              ],
              [
                "`defaultDisplayRating` / `defaultDisplayCombo`",
                "`Bool`",
                "默认是否显示判定 / 连击"
              ],
              [
                "`ratingNum`",
                "`Int`",
                "当前连击数（判定用）"
              ],
              [
                "`accFormat`",
                "`FlxTextFormat`",
                "准确率文字格式"
              ]
            ]
          }
        }
      ]
    },
    {
      "id": "api-callbacks",
      "num": "30",
      "title": "回调全表：引擎什么时候调你",
      "en": "ALL CALLBACKS",
      "tags": [
        "回调",
        "生命周期",
        "钩子"
      ],
      "simple": [
        {
          "p": "回调就是「**你写这个函数名，引擎到点就会调它**」。写错名字 = 永远不执行。"
        },
        {
          "p": "最常用的六个：`create`、`postCreate`、`update`、`beatHit`、`onNoteHit`、`destroy`。"
        }
      ],
      "core": [
        {
          "h": "① 通用生命周期（所有 PlayState 脚本）"
        },
        {
          "table": {
            "head": [
              "回调",
              "参数",
              "时机"
            ],
            "rows": [
              [
                "`create()`",
                "—",
                "对象还没建好"
              ],
              [
                "`postCreate()`",
                "—",
                "对象都建好了（**改初始状态用这个**）"
              ],
              [
                "`update(elapsed)`",
                "秒",
                "每帧"
              ],
              [
                "`postUpdate(elapsed)`",
                "秒",
                "每帧，排在 update 之后"
              ],
              [
                "`draw()` / `postDraw()`",
                "DrawEvent",
                "绘制前后"
              ],
              [
                "`stepHit(step)` / `beatHit(beat)` / `measureHit(measure)`",
                "整数",
                "按拍点"
              ],
              [
                "`destroy()`",
                "—",
                "销毁前（**不是 onDestroy**）"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "最容易错的一个",
            "text": "是 **`destroy`**，不是 `onDestroy`。写错的话清理逻辑永远不跑。"
          }
        },
        {
          "h": "② 歌曲流程"
        },
        {
          "table": {
            "head": [
              "回调",
              "参数",
              "时机"
            ],
            "rows": [
              [
                "`onStartCountdown(e)`",
                "CancellableEvent",
                "倒计时开始前（可 Cancel 掉）"
              ],
              [
                "`onPostStartCountdown()`",
                "—",
                "倒计时开始后"
              ],
              [
                "`onCountdown(e)` / `onPostCountdown(e)`",
                "CountdownEvent",
                "每一下倒计时"
              ],
              [
                "`onSongStart()` / `onStartSong()`",
                "—",
                "歌曲开始"
              ],
              [
                "`onSongEnd(e)`",
                "CancellableEvent",
                "结束前（可 Cancel 阻止结束）"
              ],
              [
                "`onGameOver(e)` / `onPostGameOver(e)`",
                "GameOverEvent",
                "死亡"
              ],
              [
                "`onGamePause(e)`",
                "PauseGameEvent",
                "暂停"
              ],
              [
                "`onFocus()` / `onFocusLost()`",
                "—",
                "窗口获得/失去焦点"
              ],
              [
                "`onVocalsResync()`",
                "—",
                "人声重新同步"
              ],
              [
                "`onStageDestroy(stage)`",
                "Stage",
                "舞台销毁"
              ]
            ]
          }
        },
        {
          "h": "③ 音符相关"
        },
        {
          "table": {
            "head": [
              "回调",
              "参数",
              "时机"
            ],
            "rows": [
              [
                "`onNoteHit(e)` / `onPostNoteHit(e)`",
                "NoteHitEvent",
                "任意音符命中（含对手）"
              ],
              [
                "`onPlayerHit(e)`",
                "NoteHitEvent",
                "玩家命中"
              ],
              [
                "`onDadHit(e)`",
                "NoteHitEvent",
                "对手命中"
              ],
              [
                "`onPlayerMiss(e)` / `onPostPlayerMiss(e)`",
                "NoteMissEvent",
                "玩家漏键"
              ],
              [
                "`onNoteCreation(e)` / `onPostNoteCreation(e)`",
                "NoteCreationEvent",
                "音符被创建"
              ],
              [
                "`onStrumCreation(e)` / `onPostStrumCreation(e)`",
                "StrumCreationEvent",
                "箭头被创建"
              ],
              [
                "`onInputUpdate(e)` / `onPostInputUpdate(e)`",
                "InputSystemEvent",
                "输入更新（每帧）"
              ],
              [
                "`onSplashShown(e)`",
                "SplashShowEvent",
                "溅射出现"
              ],
              [
                "`onRatingsShown(e)` / `onPostRatingsShown(e)`",
                "RatingsShowEvent",
                "评级弹出"
              ],
              [
                "`onRatingUpdate(e)`",
                "RatingUpdateEvent",
                "评级变化"
              ]
            ]
          }
        },
        {
          "h": "④ 镜头与演出"
        },
        {
          "table": {
            "head": [
              "回调",
              "参数",
              "时机"
            ],
            "rows": [
              [
                "`onCameraMove(e)`",
                "CamMoveEvent",
                "镜头要移动时"
              ],
              [
                "`onBopZoom(e)` / `onPostBopZoom(e)`",
                "BopZoomEvent",
                "跟拍缩放"
              ],
              [
                "`onEvent(e)` / `onPostEvent(e)`",
                "EventGameEvent",
                "执行一条谱面事件"
              ],
              [
                "`onRegisterSmoothTransition()`",
                "—",
                "注册平滑过渡"
              ],
              [
                "`onSubstateOpen(e)` / `onSubstateClose(e)`",
                "StateEvent",
                "子状态开/关"
              ],
              [
                "`onPreGenerateStrums(e)` / `onPostGenerateStrums(e)`",
                "AmountEvent",
                "生成轨道前/后"
              ]
            ]
          }
        },
        {
          "h": "⑤ 角色脚本（`data/characters/x.hx`）"
        },
        {
          "table": {
            "head": [
              "回调",
              "参数",
              "时机"
            ],
            "rows": [
              [
                "`onDance(e)` / `onTryDance()`",
                "DanceEvent",
                "跳舞"
              ],
              [
                "`onPlayAnim(e)`",
                "PlayAnimEvent",
                "播任意动画（可改名字/Cancel）"
              ],
              [
                "`onPlaySingAnim(e)`",
                "DirectionAnimEvent",
                "播唱歌动画"
              ],
              [
                "`onGetCamPos(e)`",
                "PointEvent",
                "计算镜头位置"
              ],
              [
                "`onCharacterXMLParsed(e)`",
                "CharacterXMLEvent",
                "XML 解析后"
              ],
              [
                "`onCharacterNodeParsed(e)`",
                "CharacterNodeEvent",
                "每个节点解析后"
              ],
              [
                "`create` / `postCreate` / `update` / `destroy`",
                "—",
                "同通用生命周期"
              ]
            ]
          }
        },
        {
          "h": "⑥ 舞台脚本（`data/stages/x.hx`）"
        },
        {
          "table": {
            "head": [
              "回调",
              "参数",
              "时机"
            ],
            "rows": [
              [
                "`onStageXMLParsed(e)`",
                "StageXMLEvent",
                "舞台 XML 解析后（可改节点数组）"
              ],
              [
                "`onStageNodeParsed(e)`",
                "StageNodeEvent",
                "每个节点建好后"
              ],
              [
                "`onPostStageCreation(e)`",
                "StageXMLEvent",
                "舞台全部建完"
              ],
              [
                "`create` / `update` / `beatHit` / `stepHit` / `measureHit` / `destroy`",
                "—",
                "常规"
              ]
            ]
          }
        },
        {
          "h": "⑦ 暂停 / 死亡 / 全局 / 状态"
        },
        {
          "table": {
            "head": [
              "对象",
              "回调"
            ],
            "rows": [
              [
                "暂停脚本",
                "`create(e)`（PauseCreationEvent：可改 `music`、`options`）、`postCreate`、`update`、`onChangeItem(e)`、`onSelectOption(e)`、`destroy`"
              ],
              [
                "死亡脚本",
                "`create(e)`、`postCreate`、`deathStart`、`postDeathStart`、`onEnd`、`onReturnToMenu`、`beatHit`、`stepHit`、`update`、`destroy`"
              ],
              [
                "全局脚本",
                "`preUpdate` `update` `postUpdate` `preDraw` `postDraw` `beatHit` `stepHit` `focusGained` `focusLost` `gameResized` `preStateCreate` `preStateSwitch` `postStateSwitch` `preGameStart` `onScriptCreated` `onScriptSetup` `onHealthIconAnimChange` `onDiscordPresenceUpdate`"
              ],
              [
                "状态脚本",
                "`create` / `postCreate` / `update` / `destroy`（按该 State 类名加载）"
              ],
              [
                "菜单脚本",
                "`onChangeItem`（MenuChangeEvent）、`onSelectItem`（NameEvent）"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "不存在的回调",
            "text": "没有 `onCreate`、`onDestroy`、`onEndSong`、`onPause`、`onCountdownTick`。对应物是 `create` / `destroy` / `onSongEnd` / `onGamePause` / `onCountdown`。"
          }
        }
      ],
      "deep": [
        {
          "h": "⑧ 回调执行顺序（一次打歌）"
        },
        {
          "ol": [
            "脚本加载 → 顶层语句执行",
            "`create()` → 引擎建对象",
            "`postCreate()`",
            "`onStartCountdown` → `onCountdown`×4 → `onPostCountdown`",
            "`onSongStart` / `onStartSong`",
            "每帧：`update` → `postUpdate`（还有 `onInputUpdate`）",
            "每拍：`stepHit` → `beatHit` → `measureHit`",
            "命中：`onNoteHit` → `onPlayerHit`/`onDadHit` → `onPostNoteHit`",
            "结束：`onSongEnd` → `destroy`"
          ]
        },
        {
          "h": "⑨ 多个脚本谁先谁后"
        },
        {
          "p": "同一首歌的脚本按 `ScriptPack` 里的注册顺序执行：先 `data/` 里的公共脚本，再 `songs/<歌>/scripts/`，再按难度子目录。顺序会影响「谁覆盖谁」，所以**同一件事别在两个脚本里各写一遍**。"
        },
        {
          "h": "补遗：另外 53 个回调（按出处分的）"
        },
        {
          "p": "上面那张表是常用回调。下面这些是从源码里逐条挖出来的 —— **每一个都能在脚本里定义，引擎会在对应时机调用**。"
        },
        {
          "h4": "状态 / 子状态"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`onOpenSubState(sub)`",
                "打开子状态之前（可改）"
              ],
              [
                "`onCloseSubState(sub)`",
                "关闭子状态之前"
              ],
              [
                "`onClosePost()`",
                "子状态关完之后"
              ],
              [
                "`onStateSwitch(next)`",
                "切换状态时"
              ],
              [
                "`onResize(w, h)`",
                "窗口尺寸变化"
              ],
              [
                "`onSave()`",
                "存档要写入时"
              ],
              [
                "`onClose()`",
                "状态被关闭（`CancellableEvent`）"
              ],
              [
                "`onError(code, msg)`",
                "出错时"
              ]
            ]
          }
        },
        {
          "h4": "菜单"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`onChangeDifficulty(old, cur, change)`",
                "故事/自由模式切难度"
              ],
              [
                "`onChangeWeek(old, cur, change)`",
                "切周"
              ],
              [
                "`onChangeSelection(old, cur, change)`",
                "光标移动"
              ],
              [
                "`onChangeCoopMode(old, cur, change)`",
                "切双人模式"
              ],
              [
                "`onWeekSelect(week, weekNum)`",
                "选中某一周"
              ],
              [
                "`onGoBack()`",
                "按返回（可 cancel）"
              ],
              [
                "`onUpdateOptionsAlpha(alpha)`",
                "自由游玩选项栏淡入淡出"
              ]
            ]
          }
        },
        {
          "h4": "游戏流程 / 过场"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`preGameReset()`",
                "重置游戏之前"
              ],
              [
                "`postGameReset()`",
                "重置之后"
              ],
              [
                "`postGameStart()`",
                "游戏开始之后"
              ],
              [
                "`onRestartCutscene(e)`",
                "重播过场"
              ],
              [
                "`onResumeCutscene(e)`",
                "继续过场"
              ],
              [
                "`postScreenCenter()`",
                "对象居中之后（UI 类脚本常用）"
              ]
            ]
          }
        },
        {
          "h4": "对话系统"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`postStartText()`",
                "一句开始打字后"
              ],
              [
                "`postResetText()`",
                "文本重置后"
              ],
              [
                "`postNext()`",
                "翻到下一句"
              ],
              [
                "`postShow(e)` / `postHide(e)`",
                "角色出场 / 退场之后"
              ],
              [
                "`postPlayBubbleAnim(e)`",
                "气泡动画播完"
              ],
              [
                "`postPopupChar(e)`",
                "角色弹动之后"
              ],
              [
                "`showTweenCompleted(tween)` / `hideTweenCompleted(tween)`",
                "出场 / 退场补间结束"
              ],
              [
                "`loadingError(msg)`",
                "对话资源加载失败"
              ]
            ]
          }
        },
        {
          "h4": "音条 / 设置类 UI"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`regenerateBars(e)`",
                "音条要重建"
              ],
              [
                "`postRegenerateBars()`",
                "重建之后"
              ],
              [
                "`regenerateBarsArray(e)` / `postRegenerateBarsArray()`",
                "同上，数组版"
              ],
              [
                "`saveSoundPreferences(e)` / `postSaveSoundPreferences()`",
                "保存音量设置前后"
              ],
              [
                "`reloadText(e)` / `postReloadText(e)`",
                "文本重载前后"
              ],
              [
                "`reloadDtf(e)` / `postReloadDtf()`",
                "动态文本格式重载前后"
              ]
            ]
          }
        },
        {
          "h4": "⭐ 资源提供者钩子（脚本给引擎**返回值**）"
        },
        {
          "p": "这一类不是「通知你」，而是「**引擎来问你要东西**」。定义它们就能接管资源加载 —— 比如让引擎从网络/加密包取图。"
        },
        {
          "table": {
            "head": [
              "回调",
              "引擎传入",
              "你返回"
            ],
            "rows": [
              [
                "`getAssetPath(path)`",
                "资源路径",
                "新路径（返回 null 走默认）"
              ],
              [
                "`getImage(id)`",
                "资源 id",
                "`BitmapData`"
              ],
              [
                "`getFont(id)`",
                "资源 id",
                "字体对象"
              ],
              [
                "`getBytes(id)`",
                "资源 id",
                "`ByteArray`"
              ],
              [
                "`getAudioBuffer(id)`",
                "资源 id",
                "音频缓冲"
              ],
              [
                "`getEditedTime(asset)`",
                "资源",
                "修改时间（用于缓存判断）"
              ],
              [
                "`generateIcon(name)`",
                "图标名",
                "图标对象"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "例：把所有图片重定向到自己的目录",
            "src": "function getAssetPath(path:String) {\n\tif (path.indexOf(\"characters/\") >= 0)\n\t\treturn \"my-mod/\" + path;   // 返回新路径\n\treturn null;                    // 其余走默认\n}"
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "别在这里做重活",
            "text": "这些钩子会被**每一次资源请求**调用。在里面做文件 IO 或遍历，加载时间会爆炸。要查表也先建好 Map。"
          }
        },
        {
          "h4": "Discord RPC（`data/discord.hx`）"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`onReady(user)`",
                "连上 Discord"
              ],
              [
                "`onDisconnected(code, msg)` / `onError(code, msg)`",
                "断开 / 出错"
              ],
              [
                "`onJoinGame(secret)` / `onSpectateGame(secret)` / `onJoinRequest(req)`",
                "加入 / 观战 / 收到邀请"
              ],
              [
                "`onAnyResponse(data)`",
                "任意回应"
              ]
            ]
          }
        },
        {
          "h4": "其他"
        },
        {
          "table": {
            "head": [
              "回调",
              "时机"
            ],
            "rows": [
              [
                "`tryUpdateHitbox(sprite)`",
                "要更新某个精灵的碰撞箱时"
              ],
              [
                "`mouseModeChanged(sprite)`",
                "鼠标模式变化"
              ],
              [
                "`processGLData(e)` / `processGLDataPost(e)`",
                "着色器 GL 数据处理前后"
              ],
              [
                "`updateGL()`",
                "每帧 GL 更新"
              ]
            ]
          }
        }
      ]
    },
    {
      "id": "api-events",
      "num": "31",
      "title": "事件对象字段表：event 里有什么",
      "en": "EVENT OBJECTS",
      "tags": [
        "Event",
        "NoteHitEvent",
        "CancellableEvent"
      ],
      "simple": [
        {
          "p": "回调里的 `event` 参数不是空的 —— 它带着一堆可读可改的字段。**改它就是改引擎的行为**。"
        },
        {
          "p": "最常见的用法：`event.cancel()` 阻止默认行为；`event.score = 500` 改加分。"
        }
      ],
      "core": [
        {
          "h": "① 所有事件共有的"
        },
        {
          "table": {
            "head": [
              "字段 / 方法",
              "说明"
            ],
            "rows": [
              [
                "`cancelled`",
                "是否已取消"
              ],
              [
                "`cancel(afterScripts)`",
                "取消（`true` = 后续脚本仍会收到）"
              ],
              [
                "`preventDefault(afterScripts)`",
                "同上（别名）"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "取消的两种写法",
            "src": "function onNoteHit(event) {\n\tevent.cancel();        // 完全取消，后面的脚本也收不到\n}\n\nfunction onSongEnd(event) {\n\tevent.cancel(true);    // 取消，但后续脚本仍能收到\n}"
          }
        },
        {
          "h": "② NoteHitEvent（最常用，字段最多）"
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
                "`note`",
                "Note",
                "被命中的音符"
              ],
              [
                "`character` / `characters`",
                "Character / Array",
                "谁唱的"
              ],
              [
                "`player`",
                "Int",
                "哪条轨道"
              ],
              [
                "`direction`",
                "Int",
                "方向 0~3"
              ],
              [
                "`noteType`",
                "String",
                "音符类型"
              ],
              [
                "`score`",
                "Int",
                "本次加分（**可改**）"
              ],
              [
                "`accuracy`",
                "Float",
                "本次准确率"
              ],
              [
                "`healthGain`",
                "Float",
                "回血量"
              ],
              [
                "`misses`",
                "Int",
                "漏键计数"
              ],
              [
                "`countAsCombo` / `countScore`",
                "Bool",
                "是否计连击 / 计分"
              ],
              [
                "`showRating` / `displayRating` / `displayCombo`",
                "Bool",
                "是否显示评级 / 数字 / 连击"
              ],
              [
                "`rating`",
                "String",
                "评级名"
              ],
              [
                "`ratingPrefix` / `ratingSuffix`",
                "String",
                "评级前后缀"
              ],
              [
                "`animSuffix`",
                "String",
                "动画后缀（做 alt 姿势）"
              ],
              [
                "`forceAnim`",
                "Bool",
                "强制播动画"
              ],
              [
                "`showSplash`",
                "Bool",
                "是否显示溅射"
              ],
              [
                "`healthIcon`",
                "HealthIcon",
                "要弹的头像"
              ],
              [
                "`numScale` / `ratingScale`",
                "Float",
                "数字/评级缩放"
              ],
              [
                "`charsComboAnim`",
                "Bool",
                "角色是否播连击动画"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "实战：命中加分 + 改动画 + 不显示评级",
            "src": "function onNoteHit(event) {\n\tif (!event.note.mustPress) return;\n\n\tevent.score += 100;              // 多给 100 分\n\tevent.animSuffix = \"-alt\";       // 换成 alt 姿势\n\tevent.showRating = false;        // 不弹 SICK/GOOD\n\tevent.healthGain = 0.05;         // 少回点血\n}"
          }
        },
        {
          "h": "③ NoteMissEvent"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`note`",
                "漏掉的音符"
              ],
              [
                "`playerID` / `direction` / `noteType`",
                "轨道 / 方向 / 类型"
              ],
              [
                "`score` / `accuracy`",
                "扣分 / 准确率影响"
              ],
              [
                "`misses`",
                "漏键计数"
              ],
              [
                "`healthGain`",
                "掉血量（负数）"
              ],
              [
                "`muteVocals`",
                "是否静音人声"
              ],
              [
                "`missSound` / `missVolume`",
                "漏键音效 / 音量"
              ],
              [
                "`ghostMiss`",
                "是否算「幽灵漏键」（不计入）"
              ],
              [
                "`gfSad` / `gfSadAnim` / `forceGfAnim`",
                "GF 难过表情"
              ],
              [
                "`forceAnim` / `animSuffix`",
                "角色受击动画"
              ],
              [
                "`character` / `characters`",
                "角色"
              ]
            ]
          }
        },
        {
          "h": "④ 动画类事件"
        },
        {
          "table": {
            "head": [
              "事件",
              "主要字段",
              "用途"
            ],
            "rows": [
              [
                "`PlayAnimEvent`",
                "`animName` `force` `context` `reverse` `startingFrame`",
                "拦截/改写 `playAnim`"
              ],
              [
                "`DirectionAnimEvent`",
                "`animName` `direction` `suffix` `context` `reversed` `frame` `force`",
                "拦截唱歌动画"
              ],
              [
                "`DanceEvent`",
                "`danced`",
                "跳舞结果"
              ],
              [
                "`PointEvent`",
                "`x` `y`",
                "坐标（镜头位置等）"
              ],
              [
                "`AmountEvent`",
                "`amount`",
                "数量（生成轨道数等）"
              ],
              [
                "`NameEvent`",
                "`name`",
                "名字（菜单项、选项）"
              ],
              [
                "`StateEvent`",
                "`substate`",
                "子状态"
              ],
              [
                "`DrawEvent`",
                "（绘制上下文）",
                "绘制钩子"
              ]
            ]
          }
        },
        {
          "h": "⑤ 流程类事件"
        },
        {
          "table": {
            "head": [
              "事件",
              "主要字段"
            ],
            "rows": [
              [
                "`CountdownEvent`",
                "`swagCounter` `volume` `soundPath` `spritePath` `scale` `sprite` `sound` `spriteTween`"
              ],
              [
                "`CamMoveEvent`",
                "`position` `strumLine` `focusedCharacters`"
              ],
              [
                "`BopZoomEvent`",
                "`useZoomMultiplier` `maxZoomMultiplier` `zoomStrength`"
              ],
              [
                "`GameOverEvent`",
                "`x` `y` `character` `deathCharID` `isPlayer` `gameOverSong` `lossSFX` `retrySFX`"
              ],
              [
                "`GameOverCreationEvent`",
                "同上 + `player` `bpm`"
              ],
              [
                "`PauseGameEvent`",
                "`excludeList` `allowGitaroo`"
              ],
              [
                "`PauseCreationEvent`",
                "`music` `options`"
              ],
              [
                "`EventGameEvent`",
                "`event`（ChartEvent：`name` `time` `params`）"
              ],
              [
                "`RatingsShowEvent`",
                "`rating` `displayRating` `displayNumbers` `displayCombo` `playTween` `position` 等一堆演出参数"
              ],
              [
                "`RatingUpdateEvent`",
                "`rating` `oldRating`"
              ],
              [
                "`HealthIconChangeEvent`",
                "`anim` `healthIcon`"
              ],
              [
                "`MenuChangeEvent`",
                "`oldValue` `value` `change` `playMenuSFX`"
              ],
              [
                "`FreeplaySongSelectEvent`",
                "`song` `difficulty` `variant` `opponentMode` `coopMode`"
              ],
              [
                "`FreeplayAlphaUpdateEvent`",
                "`idleAlpha` `selectedAlpha` 等"
              ],
              [
                "`WeekSelectEvent`",
                "`week` `difficulty` `weekID` `difficultyID`"
              ],
              [
                "`InputSystemEvent`",
                "`pressed` `justPressed` `justReleased` `strumLine` `strumLineID`"
              ],
              [
                "`NoteCreationEvent`",
                "`note` `strumID` `noteType` `noteTypeID` `mustHit` `noteSprite` `noteScale` `animSuffix`"
              ],
              [
                "`StrumCreationEvent`",
                "（箭头创建上下文）"
              ],
              [
                "`SplashShowEvent`",
                "（溅射上下文）"
              ],
              [
                "`CharacterXMLEvent`",
                "`character` `xml`"
              ],
              [
                "`CharacterNodeEvent`",
                "`character` `node` `name`"
              ],
              [
                "`StageXMLEvent`",
                "`stage` `xml` `elems`"
              ],
              [
                "`StageNodeEvent`",
                "`stage` `node` `sprite` `name`"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "事件对象是复用的",
            "text": "`EventManager` 池化了事件对象，**不要把它存进变量长期持有**（下一帧内容就变了）。要留数据，把字段值复制出来。"
          }
        }
      ],
      "deep": [
        {
          "h": "⑥ `cancel(afterScripts)` 到底取消什么"
        },
        {
          "table": {
            "head": [
              "写法",
              "效果"
            ],
            "rows": [
              [
                "`event.cancel()` / `cancel(false)`",
                "取消默认行为，**后续脚本也不再收到**"
              ],
              [
                "`event.cancel(true)`",
                "取消默认行为，但**后续脚本仍会收到**（用于「我只改一点，别的不拦」）"
              ],
              [
                "不 cancel",
                "照常走引擎默认逻辑"
              ]
            ]
          }
        },
        {
          "h": "⑦ 改 event 字段 vs 直接改对象"
        },
        {
          "p": "**优先改 event 字段**。因为引擎是在事件派发**之后**才用这些字段的，改字段等于「改这一步的参数」；直接改对象字段可能被引擎后面覆盖，而且不可撤销。"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "对比",
            "src": "// 好：改事件字段\nfunction onPlayAnim(event) {\n\tevent.animName = \"idle-alt\";\n}\n\n// 差：直接改角色字段，可能被覆盖\nfunction onPlayAnim(event) {\n\tboyfriend.animation.play(\"idle-alt\");\n}"
          }
        },
        {
          "h": "补遗：9 个之前没列的事件类"
        },
        {
          "p": "前面那张表覆盖了 43 个事件类，这里是源码里剩下的 9 个（共 53 个）。"
        },
        {
          "table": {
            "head": [
              "事件类",
              "字段",
              "用在哪"
            ],
            "rows": [
              [
                "`NoteUpdateEvent`",
                "`note` `elapsed` `strum`",
                "音符每帧更新（做自定义音符行为）"
              ],
              [
                "`SimpleNoteEvent`",
                "`note`",
                "只要一个音符的场合"
              ],
              [
                "`ResizeEvent`",
                "`width` `height` `oldWidth` `oldHeight`",
                "窗口尺寸变化"
              ],
              [
                "`TransitionCreationEvent`",
                "`transOut` `newState`",
                "创建过场过渡"
              ],
              [
                "`ShaderProcessEvent`",
                "`source` `storageType`",
                "着色器源码处理（编译前改代码）"
              ],
              [
                "`SoundTrayShowEvent`",
                "`up`",
                "音量条弹出"
              ],
              [
                "`SoundTrayTextEvent`",
                "`displayTxt` `y` `checkIfNull` `reloadDefaultTextFormat`",
                "音量条文字"
              ],
              [
                "`DiscordPresenceUpdateEvent`",
                "`presence`",
                "Discord 状态更新（可改按钮/文案）"
              ],
              [
                "`DynamicEvent`",
                "`value1`~`value5`",
                "通用占位事件（自带 5 个任意值）"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "`ShaderProcessEvent.source` 能改 GLSL 源码",
            "text": "在编译前拦下 shader 源码做字符串替换 —— 做「给所有着色器注入一个 uniform」这种需求时就靠它。"
          }
        }
      ]
    },
    {
      "id": "api-flixel",
      "num": "32",
      "title": "底层库常用 API：Flixel / OpenFL",
      "en": "FLIXEL & OPENFL",
      "tags": [
        "FlxG",
        "FlxSprite",
        "FlxTween",
        "FlxTimer",
        "FlxSound"
      ],
      "simple": [
        {
          "p": "写脚本绕不开 Flixel 的几个基础类。这一节只列**最常用的**，够写 90% 的演出。"
        },
        {
          "p": "记不住就记四个：`FlxG`（全局）、`FlxSprite`（图片）、`FlxTween`（补间）、`FlxTimer`（定时）。"
        }
      ],
      "core": [
        {
          "h": "① FlxG：全局入口"
        },
        {
          "table": {
            "head": [
              "成员",
              "作用"
            ],
            "rows": [
              [
                "`FlxG.width` / `FlxG.height`",
                "画面尺寸（默认 1280×720）"
              ],
              [
                "`FlxG.camera`",
                "主相机"
              ],
              [
                "`FlxG.cameras`",
                "相机管理器"
              ],
              [
                "`FlxG.state`",
                "当前状态"
              ],
              [
                "`FlxG.sound`",
                "声音管理器"
              ],
              [
                "`FlxG.sound.music`",
                "当前背景音乐"
              ],
              [
                "`FlxG.sound.play(path, vol, loop)`",
                "播音效"
              ],
              [
                "`FlxG.sound.playMusic(path, vol, loop)`",
                "播音乐"
              ],
              [
                "`FlxG.sound.defaultMusicGroup.volume`",
                "音乐音量"
              ],
              [
                "`FlxG.switchState(new Xxx())`",
                "切状态"
              ],
              [
                "`FlxG.resetState()`",
                "重载当前状态"
              ],
              [
                "`FlxG.bitmap.add(path)`",
                "加载位图"
              ],
              [
                "`FlxG.assets.exists(path)`",
                "资源是否存在"
              ],
              [
                "`FlxG.random.int(a,b)` / `float` / `bool(p)`",
                "随机"
              ],
              [
                "`FlxG.elapsed`",
                "上一帧耗时（秒）"
              ],
              [
                "`FlxG.fullscreen`",
                "全屏开关"
              ],
              [
                "`FlxG.autoPause`",
                "失焦自动暂停"
              ],
              [
                "`FlxG.enableAntialiasing`",
                "抗锯齿"
              ]
            ]
          }
        },
        {
          "h": "② FlxSprite：一切可见对象"
        },
        {
          "table": {
            "head": [
              "成员",
              "作用"
            ],
            "rows": [
              [
                "`new FlxSprite(x, y)`",
                "创建"
              ],
              [
                "`loadGraphic(path)`",
                "加载单图"
              ],
              [
                "`loadAnimatedGraphic(path, fps, loop)`",
                "加载动画图（引擎扩展）"
              ],
              [
                "`makeGraphic(w, h, color)`",
                "生成纯色块"
              ],
              [
                "`x` / `y`",
                "坐标"
              ],
              [
                "`scale.set(sx, sy)`",
                "缩放"
              ],
              [
                "`angle`",
                "旋转角度"
              ],
              [
                "`alpha`",
                "透明度"
              ],
              [
                "`visible`",
                "是否显示"
              ],
              [
                "`color`",
                "整体染色"
              ],
              [
                "`flipX` / `flipY`",
                "翻转"
              ],
              [
                "`offset`",
                "绘制偏移"
              ],
              [
                "`scrollFactor.set(x, y)`",
                "视差（0 = 不随镜头）"
              ],
              [
                "`antialiasing`",
                "抗锯齿"
              ],
              [
                "`shader`",
                "挂 shader（一个精灵一个）"
              ],
              [
                "`animation.play(name, force)`",
                "播动画"
              ],
              [
                "`animation.add(name, frames, fps, loop)`",
                "加动画"
              ],
              [
                "`animation.addByPrefix(name, prefix, fps, loop)`",
                "按前缀加"
              ],
              [
                "`animation.curAnim.name`",
                "当前动画名"
              ],
              [
                "`animation.finished`",
                "是否播完"
              ],
              [
                "`screenCenter()`",
                "居中"
              ],
              [
                "`updateHitbox()`",
                "按当前帧重算碰撞框"
              ],
              [
                "`destroy()`",
                "销毁"
              ],
              [
                "`isOnScreen(camera)`",
                "是否在画面内"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "造一个自己的精灵",
            "src": "var spr = new FlxSprite(0, 0).loadAnimatedGraphic(Paths.image(\"menus/mainmenu/freeplay\"));\nspr.screenCenter();\nspr.scrollFactor.set();     // 不随镜头移动\nspr.alpha = 0.8;\nadd(spr);                   // 加进当前状态"
          }
        },
        {
          "h": "③ FlxTween：补间动画"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "四种常用写法",
            "src": "// 1) 数值补间\nFlxTween.tween(camGame, {zoom: 1.2}, 0.6, {ease: FlxEase.quadOut});\n\n// 2) 颜色补间\nFlxTween.color(spr, 0.3, 0xFFFFFFFF, 0xFFFF0000);\n\n// 3) 抖动\nFlxTween.shake(spr, 0.02, 0.4);\n\n// 4) 带回调 + 循环\nFlxTween.tween(spr, {alpha: 0}, 1.0, {\n\tease: FlxEase.sineInOut,\n\ttype: FlxTweenType.PINGPONG,\n\tonComplete: function (t) trace(\"完了\")\n});\n\n// 取消\nFlxTween.cancelTweensOf(camGame);"
          }
        },
        {
          "table": {
            "head": [
              "常用缓动（FlxEase）",
              "感觉"
            ],
            "rows": [
              [
                "`linear`",
                "匀速"
              ],
              [
                "`quadIn` / `quadOut` / `quadInOut`",
                "二次，最百搭"
              ],
              [
                "`cubeIn` / `cubeOut`",
                "三次，更明显"
              ],
              [
                "`sineIn` / `sineOut` / `sineInOut`",
                "柔和"
              ],
              [
                "`expoOut`",
                "快速启动、慢慢停"
              ],
              [
                "`elasticOut`",
                "橡皮筋回弹"
              ],
              [
                "`backOut`",
                "稍微过头再回来"
              ],
              [
                "`bounceOut`",
                "弹跳落地"
              ]
            ]
          }
        },
        {
          "h": "④ FlxTimer：定时"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "// 一次性\nFlxTimer.wait(1.5, function (t) trace(\"1.5 秒后\"));\n\n// 循环 3 次\nnew FlxTimer().start(0.5, function (t) trace(\"第 \" + t.loopsLeft + \" 次\"), 3);\n\n// 每帧检查是否到点（不推荐，但能用）"
          }
        },
        {
          "h": "⑤ FlxSound：声音"
        },
        {
          "table": {
            "head": [
              "成员",
              "作用"
            ],
            "rows": [
              [
                "`FlxG.sound.load(path)`",
                "加载（不播）"
              ],
              [
                "`FlxG.sound.play(path, vol, loop)`",
                "直接播"
              ],
              [
                "`sound.play(forceRestart)`",
                "播放"
              ],
              [
                "`sound.pause()` / `resume()` / `stop()`",
                "暂停 / 继续 / 停止"
              ],
              [
                "`sound.time`",
                "当前播放位置（毫秒）"
              ],
              [
                "`sound.length`",
                "总长度"
              ],
              [
                "`sound.volume`",
                "音量"
              ],
              [
                "`sound.pitch`",
                "音高"
              ],
              [
                "`sound.playing`",
                "是否在播"
              ],
              [
                "`sound.onComplete`",
                "播完回调"
              ]
            ]
          }
        },
        {
          "h": "⑥ FlxCamera：相机"
        },
        {
          "table": {
            "head": [
              "成员",
              "作用"
            ],
            "rows": [
              [
                "`zoom`",
                "缩放（越小看得越远）"
              ],
              [
                "`alpha`",
                "整体透明度"
              ],
              [
                "`angle`",
                "旋转"
              ],
              [
                "`x` / `y`",
                "相机位置"
              ],
              [
                "`follow(target, lerp)`",
                "跟随对象"
              ],
              [
                "`shake(intensity, duration)`",
                "抖动"
              ],
              [
                "`flash(color, duration)`",
                "闪屏"
              ],
              [
                "`fade(color, duration, onComplete)`",
                "淡入淡出"
              ],
              [
                "`addShader(shader)` / `removeShader(s)`",
                "挂/摘 shader"
              ],
              [
                "`bgColor`",
                "背景色"
              ],
              [
                "`pixelPerfectRender`",
                "像素完美渲染（像素风必开）"
              ]
            ]
          }
        },
        {
          "h": "⑦ 颜色与数学"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "FlxColor / FlxMath 常用",
            "src": "FlxColor.WHITE;                          // 0xFFFFFFFF\nFlxColor.fromString(\"#31B0D1\");          // 从字符串\nFlxColor.fromRGB(49, 176, 209);          // 从 RGB\nFlxColor.interpolate(0xFF0000, 0x0000FF, 0.5);  // 混色\n\nvar c = 0xFF31B0D1;\nvar a = (c >> 24) & 0xFF;    // alpha\nvar r = (c >> 16) & 0xFF;    // red\n\nFlxMath.bound(v, 0, 1);      // 夹取\nFlxMath.isOdd(n);\nFlxMath.remapToRange(v, 0, 10, 0, 100);  // 区间映射"
          }
        }
      ],
      "deep": [
        {
          "h": "⑧ 「加进画面」到底加到哪"
        },
        {
          "ul": [
            "在 PlayState 脚本里：`add(spr)` = `PlayState.instance.add(spr)`，加在**场景层**（受 `camGame` 影响）。",
            "想加在 UI 层（不随镜头动）：加到 `camHUD` 的容器，或设 `scrollFactor.set()` 后加到场景。",
            "注意：`add()` 的顺序 = 绘制顺序，后加的盖在上面。"
          ]
        },
        {
          "h": "⑨ 帧率无关的写法"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "别写死每帧加多少",
            "src": "// 差：帧率一变速度就变\nspr.x += 5;\n\n// 好：按时间累加\nspr.x += 300 * elapsed;\n\n// 好：用引擎的 fpsLerp 做平滑\nspr.alpha = CoolUtil.fpsLerp(spr.alpha, 1, 0.1);"
          }
        },
        {
          "h": "⑩ 内存：别忘了销毁"
        },
        {
          "p": "自己 `new` 出来的东西，在 `destroy()` 里要 `destroy()` 掉；相机上的 shader 要 `removeShader`。不然切歌几次之后内存会一路涨 —— 这是 mod 里最常见的「越玩越卡」原因。"
        },
        {
          "h": "Flixel 里真正天天用的 6 个类"
        },
        {
          "table": {
            "head": [
              "类",
              "是什么",
              "最常用"
            ],
            "rows": [
              [
                "`FlxG`",
                "全局单例：相机、声音、输入、状态、保存",
                "`FlxG.camera` `FlxG.sound` `FlxG.switchState()` `FlxG.save`"
              ],
              [
                "`FlxSprite`",
                "一张图（或纯色块）",
                "`loadGraphic` `makeGraphic` `animation.add/play` `setGraphicSize`"
              ],
              [
                "`FlxTween`",
                "补间动画",
                "`FlxTween.tween(obj, {x:100}, 0.5, {ease: ...})`"
              ],
              [
                "`FlxTimer`",
                "定时器",
                "`new FlxTimer().start(2, cb)`"
              ],
              [
                "`FlxText`",
                "文字",
                "`setFormat` `screenCenter` `borderStyle`"
              ],
              [
                "`FlxCamera`",
                "相机",
                "`zoom` `follow` `flash` `fade` `shake`"
              ]
            ]
          }
        },
        {
          "h": "几个「配方」：直接抄"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "淡入 / 淡出",
            "src": "// 淡入（透明度 0 → 1）\nspr.alpha = 0;\nFlxTween.tween(spr, {alpha: 1}, 0.4, {ease: FlxEase.quadOut});\n\n// 淡出后销毁\nFlxTween.tween(spr, {alpha: 0}, 0.3, {\n\tonComplete: function (_) spr.destroy()\n});"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "补间链（先移再转）",
            "src": "FlxTween.tween(spr, {x: 400}, 0.5, {\n\tease: FlxEase.cubeOut,\n\tonComplete: function (_) {\n\t\tFlxTween.tween(spr, {angle: 90}, 0.3);\n\t}\n});"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "相机震动 / 闪光",
            "src": "camGame.shake(0.02, 0.3);              // 强度, 秒\ncamGame.flash(0xFFFFFFFF, 0.25);        // 颜色, 秒"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "延迟执行（不用写 update 计数）",
            "src": "new FlxTimer().start(1.5, function (t) {\n\ttrace(\"1.5 秒后执行\");\n}, 1);   // 第三个参数 = 循环次数"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "循环生成 / 清理",
            "src": "// 做 8 个粒子\nfor (i in 0...8) {\n\tvar p = new FlxSprite(spr.x, spr.y).makeGraphic(4, 4, 0xFFFFFFFF);\n\tadd(p);\n\tFlxTween.tween(p, {x: p.x + FlxG.random.int(-40, 40), alpha: 0}, 0.6, {\n\t\tonComplete: function (_) p.destroy()\n\t});\n}"
          }
        },
        {
          "h": "OpenFL / Lime 什么时候才需要碰"
        },
        {
          "table": {
            "head": [
              "需求",
              "用什么"
            ],
            "rows": [
              [
                "改窗口大小/标题",
                "`openfl.Lib.application.window` 或 `WindowUtils`"
              ],
              [
                "存读二进制",
                "`openfl.utils.ByteArray`"
              ],
              [
                "原生剪贴板",
                "`openfl.desktop.Clipboard`"
              ],
              [
                "应用程序事件（退出等）",
                "`openfl.Lib.application.onExit`"
              ],
              [
                "文件对话框",
                "`lime.ui.FileDialog`"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "别在每帧里 new FlxPoint / FlxColor",
            "text": "这些是会被 GC 的对象。每帧创建几百个会让帧率抖动。用「复用一个字段」的写法（第 45 节有例子）。"
          }
        }
      ]
    },
    {
      "id": "scripts-system",
      "num": "33",
      "title": "脚本系统全解：加载、顺序、生命周期",
      "en": "THE SCRIPT SYSTEM",
      "tags": [
        "Scripts",
        "加载顺序",
        "ScriptPack",
        "ModState"
      ],
      "simple": [
        {
          "p": "「脚本」就是放进特定文件夹的 `.hx` 文件，**引擎自己在合适的时机会去读它、执行它、调它的函数**。你只要放对位置、写对函数名。"
        },
        {
          "p": "支持的后缀：**`.hx` `.hscript` `.hsc` `.hxs`**，以及打包格式 **`.pack`**。写 `.lua` 引擎会直接报「不支持 Lua」。"
        },
        {
          "p": "最关键的一点：**不同文件夹的脚本，能拿到的对象不一样**。歌脚本能直接用 `boyfriend`，状态脚本不能。"
        }
      ],
      "core": [
        {
          "h": "① 脚本放在哪（全表，按源码）"
        },
        {
          "table": {
            "head": [
              "位置",
              "作用域",
              "谁来加载"
            ],
            "rows": [
              [
                "`songs/<歌>/scripts/*.hx`",
                "**只对这首歌生效**",
                "`PlayState`"
              ],
              [
                "`songs/<歌>/scripts/<难度>/*.hx`",
                "只对这首歌的这个难度",
                "`PlayState`"
              ],
              [
                "`songs/*.hx`（根目录）",
                "**对每一首歌都生效**",
                "`PlayState`"
              ],
              [
                "`songs/<歌>/<任意>.hx`",
                "歌曲根目录下的脚本（过场脚本常放这）",
                "按需 `addScript`"
              ],
              [
                "`data/scripts/*.hx`",
                "通用脚本，需被引用或通过 XML 挂载",
                "手动 / `use-extension`"
              ],
              [
                "`data/stages/<舞台>.hx`",
                "该舞台（`PlayState` 级）",
                "`Stage.hx`"
              ],
              [
                "`data/characters/<人物>.hx`",
                "该人物（`Character` 级，`this` = 角色）",
                "`Character.hx`"
              ],
              [
                "`data/notes/<音符类型>.hx`",
                "该音符类型（`PlayState` 级）",
                "`PlayState`"
              ],
              [
                "`data/events/<事件名>.hx`",
                "该事件（歌曲用到时才加载）",
                "`PlayState`"
              ],
              [
                "`data/states/<状态名>.hx`",
                "**软编码状态脚本**（每个 mod 一份）",
                "`MusicBeatState.loadScript()`"
              ],
              [
                "`data/globals/**/*.hx`",
                "**全局脚本**，递归扫描",
                "`GlobalScript.onModSwitch()`"
              ],
              [
                "`data/global.hx`（mod 根）",
                "该 mod 的全局脚本，额外拿到 `MOD_LIBRARY`",
                "`GlobalScript.onModSwitch()`"
              ],
              [
                "`data/discord.hx`",
                "Discord 状态",
                "`DiscordUtil`"
              ],
              [
                "`assets/source/<x>.hx`",
                "当模块被 `import` 时加载",
                "`HScript` 的 import 回退"
              ],
              [
                "`data/charts/*.hx`",
                "**已废弃**，会在日志里警告",
                "`PlayState`（兼容用）"
              ]
            ]
          }
        },
        {
          "h": "② PlayState 到底按什么顺序加载"
        },
        {
          "p": "源码里是一个数组按序遍历，顺序就是执行顺序："
        },
        {
          "code": {
            "lang": "ini",
            "title": "source/funkin/game/PlayState.hx（简化）",
            "src": "var normal = \"songs/\" + SONG.meta.name + \"/scripts\";\nvar scriptsFolders = [\n    normal,                          // 1. 歌脚本\n    normal + \"/\" + difficulty + \"/\", // 2. 难度脚本\n    \"data/charts/\",                  // 3. 已废弃（会警告）\n    \"songs/\"                         // 4. 全局歌脚本\n];\n\nfor (folder in scriptsFolders)\n    for (file in Paths.getFolderContent(folder, true, ...))\n        addScript(file);\n\n// 5. 事件脚本：只加载「这首歌真的用到了」的事件\nfor (file in Paths.getFolderContent(\"data/events/\", true, ...))\n    if (eventsList.contains(name) && songEvents.contains(name))\n        addScript(file);\n\n// 6. 音符类型脚本（按 SONG.noteTypes）\n// 7. 最后 scripts.load() 统一执行"
          }
        },
        {
          "kv": [
            [
              "关键点 1",
              "`addScript()` **只登记不执行**，真正执行在后面的 `scripts.load()`"
            ],
            [
              "关键点 2",
              "事件脚本**按需加载**：歌里没用到的事件，它的 `.hx` 不会进来"
            ],
            [
              "关键点 3",
              "`data/charts/` 仍能用，但每次都会打弃用警告"
            ],
            [
              "关键点 4",
              "顺序决定「谁覆盖谁」：后面的脚本后执行，能盖掉前面的设定"
            ]
          ]
        },
        {
          "callout": {
            "kind": "tip",
            "title": "为什么我的脚本被别人的覆盖了",
            "text": "因为执行顺序在后。想稳定生效，就放到更后面的位置（比如难度脚本），或者用 `postCreate` 而不是顶层语句改东西。"
          }
        },
        {
          "h": "③ 状态脚本为什么是「每个 mod 一份」"
        },
        {
          "p": "状态脚本的路径长得有点怪：`data/states/<状态名>/LIB_<mod名>`。`LIB_` 是引擎的**虚路径**约定，会被映射到「某个 mod 里的 `data/states/<状态名>.hx`」。"
        },
        {
          "code": {
            "lang": "ini",
            "title": "实际文件位置",
            "src": "mods/my-mod/data/states/FreeplayState.hx\n        ↓ 引擎内部寻址\nassets/data/states/FreeplayState/LIB_my-mod"
          }
        },
        {
          "p": "这样多个 mod 可以各自给自己的 `FreeplayState.hx`，互不覆盖。基础游戏的 `assets/` 本身也算一个库（名字就叫 `assets`）。"
        },
        {
          "p": "另外：状态脚本默认**只在第一次创建该状态时加载**，之后复用（除非开了实验性的脚本重载）。按 `F5` 会重建状态，脚本会重新加载。"
        },
        {
          "h": "④ 全局脚本"
        },
        {
          "p": "`data/globals/` 会被**递归**扫描，所有脚本文件都加载；同时每个 mod 的 `data/global.hx` 也会加载（通过 `LIB_` 虚路径），并且额外注入一个变量："
        },
        {
          "table": {
            "head": [
              "变量",
              "说明"
            ],
            "rows": [
              [
                "`MOD_LIBRARY`",
                "当前 mod 的资源库对象（只在 mod 的 global.hx 里有）"
              ],
              [
                "（所有脚本通用）",
                "全局脚本的回调：`preUpdate` `update` `postUpdate` `preDraw` `postDraw` `beatHit` `stepHit` `focusGained` `focusLost` `gameResized` `preStateCreate` `preStateSwitch` `postStateSwitch` `preGameStart` `onScriptCreated` `onScriptSetup` `onHealthIconAnimChange` `onDiscordPresenceUpdate`"
              ]
            ]
          }
        },
        {
          "p": "全局脚本的生命周期跟着**切 mod / 重载**走：`onModSwitch` 时会销毁旧的全部脚本、重新扫描。`Shift+F5` 就是手动触发这一过程。"
        },
        {
          "h": "⑤ 脚本的生命周期"
        },
        {
          "ol": [
            "**创建**：`Script.create(path)` → 读文件 → new 解释器 → 执行**顶层语句**（变量声明、直接调用）。",
            "**登记**：加进 `ScriptPack`，此时才设置 parent（父对象）、共享 `public` 变量表、注入 `importScript`。",
            "**加载**：`pack.load()` → 每个脚本 `load()` → 触发脚本里的 `create()`（如果写了）。",
            "**运行**：引擎在固定时机 `call(\"update\")`、`call(\"beatHit\")` 等，**只调存在的函数**。",
            "**销毁**：`destroy()` → 调脚本里的 `destroy()` → 释放解释器、把 parser 还回池子。"
          ]
        },
        {
          "callout": {
            "kind": "warn",
            "title": "顺序坑",
            "text": "顶层语句在**parent 还没设**的时候就执行了。所以在顶层写 `boyfriend.x` 会拿到 null；要访问游戏对象，必须写在 `create` / `postCreate` 里。"
          }
        },
        {
          "h": "⑥ 一个脚本包（ScriptPack）是什么"
        },
        {
          "p": "同一首歌的所有脚本会被塞进同一个 `ScriptPack`。它负责三件事：**统一调用**、**共享变量**、**统一销毁**。"
        },
        {
          "ul": [
            "`pack.call(\"beatHit\", [beat])` → 依次调用包内**所有 active 脚本**的这个函数。",
            "`pack.event(\"onNoteHit\", evt)` → 派发事件；某个脚本 `cancel()` 后，**默认就不再往后传**（除非用 `cancel(true)`）。",
            "`pack.setPublicMap(map)` → 让包内所有脚本共享一张 `public` 变量表。",
            "`pack.get(name)` → 从第一个有这个变量的脚本里取值。"
          ]
        },
        {
          "h": "⑦ 脚本报错怎么读"
        },
        {
          "code": {
            "lang": "ini",
            "title": "日志格式",
            "src": "myScript.hx:23: Unknown identifier : boyfrined\n^^^^^^^^^^^^  ^^\n   文件名+行号    具体错误"
          }
        },
        {
          "ul": [
            "**文件名会自动带上 mod 前缀**（例如 `my-mod:myScript.hx`），方便区分是哪个 mod 的脚本。",
            "行号是**脚本内行号**，不是游戏源码行号。",
            "如果错误指向一个不存在的行（比如第 0 行），通常是解析阶段就挂了（括号不配对、少分号）。"
          ]
        }
      ],
      "deep": [
        {
          "h": "⑧ 解释器是怎么配的（决定了你能写什么）"
        },
        {
          "p": "`HScript.initParser()` 里写死了几个开关，这直接决定了语法边界："
        },
        {
          "table": {
            "head": [
              "配置",
              "开启后意味着"
            ],
            "rows": [
              [
                "`allowJSON = true`",
                "可以直接写 JSON 字面量当对象"
              ],
              [
                "`allowMetadata = true`",
                "可以用 `@:meta` 元数据"
              ],
              [
                "`allowTypes = true`",
                "可以写类型标注 `var x:Int`"
              ],
              [
                "`allowStaticVariables = true`",
                "`static var` 可用（全局共享，切 mod 清空）"
              ],
              [
                "`allowPublicVariables = true`",
                "`public var` 可用（同包共享）"
              ],
              [
                "`preprocessorValues`",
                "所有编译 define + `CODENAME_ENGINE` / `CODENAME_VER` / `CODENAME_BUILD` / `CODENAME_COMMIT`"
              ]
            ]
          }
        },
        {
          "p": "所以 `#if CODENAME_ENGINE`、`#if debug` 这类条件编译在脚本里是**真的能用的**。"
        },
        {
          "h": "⑨ import 的查找顺序"
        },
        {
          "ol": [
            "先查 `importRedirects`（旧包名兼容表，比如老的 `funkin.backend.scripting.events.NoteHitEvent` 会被重定向到新路径）。",
            "再按类名 `Type.resolveClass` 找已编译的类。",
            "都失败就当作**模块文件**：先找 `assets/source/<路径>.hx`，再找 `assets/<路径>.hx`（都试 `.hx/.hscript/.hsc/.hxs`）。",
            "找到后直接执行那个文件，并且**记进已导入表**（同一个模块不会重复执行）。"
          ]
        },
        {
          "p": "这条链路意味着：你可以自己写 `assets/source/MyLib.hx`，然后在任意脚本里 `import MyLib;` —— 相当于给自己做一个脚本库。"
        },
        {
          "h": "⑩ 热重载到底保留了什么"
        },
        {
          "p": "`Script.reload()` 的行为很具体：**保留非函数的变量值**，重新解析并执行整个脚本。"
        },
        {
          "table": {
            "head": [
              "会保留",
              "会重置"
            ],
            "rows": [
              [
                "普通变量（`var timer = 1.2`）",
                "函数（`function update` 会重新定义）"
              ],
              [
                "你手动 `set` 进去的值",
                "闭包捕获的状态"
              ],
              [
                "parent（父对象）",
                "顶层语句里声明的对象（会重新创建）"
              ]
            ]
          }
        },
        {
          "p": "所以热重载适合「改逻辑」，不适合「保留运行时进度」。真要保进度，自己往 `FlxG.save` 或 `static var` 里存。"
        },
        {
          "h": "⑪ ModState：用脚本写一个完整界面"
        },
        {
          "p": "不想改源码又想做一个新界面？用 `ModState`。它继承 `MusicBeatState`，构造时传一个状态名，就会加载 `data/states/<状态名>.hx`。"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "用法",
            "src": "// 从别的地方跳过去\nFlxG.switchState(new ModState(\"MyScreen\", {score: 1234}));\n\n// data/states/MyScreen.hx 里\nfunction create() {\n\ttrace(\"进来的数据: \" + data.score);\n\tvar txt = new FlxText(0, 0, 0, \"HELLO\", 32);\n\ttxt.screenCenter();\n\tadd(txt);\n}"
          }
        },
        {
          "p": "`ModState.lastName` / `lastData` 是静态的，重进同一个状态时会记住上次的数据 —— 反过来也意味着**别把一次性数据放这儿**。"
        }
      ]
    },
    {
      "id": "scripts-advanced",
      "num": "34",
      "title": "脚本进阶：作用域、互相调用、热重载",
      "en": "SCRIPTS IN DEPTH",
      "tags": [
        "作用域",
        "public",
        "static",
        "Script API",
        "热重载"
      ],
      "simple": [
        {
          "p": "脚本之间怎么传数据？三种变量，记住这张表就行："
        },
        {
          "table": {
            "head": [
              "写法",
              "谁看得见",
              "什么时候没"
            ],
            "rows": [
              [
                "`var x`",
                "只有自己这个脚本",
                "脚本销毁时"
              ],
              [
                "`public var x`",
                "**同一首歌的所有脚本**",
                "切歌时"
              ],
              [
                "`static var x`",
                "**所有脚本（全局）**",
                "切 mod 时清空"
              ]
            ]
          }
        }
      ],
      "core": [
        {
          "h": "① 三种作用域的实际效果"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "a.hx",
            "src": "var secret = 1;          // 只有 a.hx 能用\npublic var shared = 2;   // 同一 ScriptPack 里都能用\nstatic var global = 3;   // 所有脚本都能用（含其它歌）"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "b.hx（同一首歌）",
            "src": "function postCreate() {\n\ttrace(secret);   // null —— 拿不到\n\ttrace(shared);   // 2    —— 能拿到\n\ttrace(global);   // 3    —— 能拿到\n\tshared = 99;     // 改的就是 a.hx 里那个\n}"
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "别拿 static 存持久数据",
            "text": "切 mod 时 `Script.staticVariables.clear()` 会把它们全清掉。要跨 mod 存活，用 `FlxG.save`。"
          }
        },
        {
          "h": "② 从一个脚本调用另一个脚本"
        },
        {
          "p": "同包内的脚本可以按**文件名**或**路径**取到，然后直接 `call`："
        },
        {
          "code": {
            "lang": "haxe",
            "title": "week6-pause.hx 里的真实写法",
            "src": "// 取同包里的脚本（按 fileName）\nvar pixelScript:Script = game.scripts.getByName(\"pixel.hx\");\n\n// 调用它里面的函数，参数用数组传\npixelScript?.call(\"pixelCam\", [pauseCam]);"
          }
        },
        {
          "table": {
            "head": [
              "ScriptPack 的方法",
              "作用"
            ],
            "rows": [
              [
                "`getByName(\"x.hx\")`",
                "按文件名取脚本"
              ],
              [
                "`getByPath(path)`",
                "按完整路径取"
              ],
              [
                "`contains(path)`",
                "是否已包含"
              ],
              [
                "`add(script)` / `insert(pos, script)`",
                "加脚本（会设置 parent 与 public 表）"
              ],
              [
                "`remove(script)`",
                "移除（不会重置 parent）"
              ],
              [
                "`importScript(path)`",
                "**当场创建并加载**一个脚本（脚本内可直接调）"
              ],
              [
                "`call(name, args)`",
                "对包内所有脚本调同名函数"
              ],
              [
                "`event(name, evt)`",
                "派发事件（可被 cancel 中断）"
              ],
              [
                "`get(name)` / `set(name, v)`",
                "跨脚本读/写变量"
              ]
            ]
          }
        },
        {
          "h": "③ `importScript`：运行时加载新脚本"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "在脚本里挂一个外部脚本",
            "src": "function postCreate() {\n\t// 路径相对 assets/，会自动补扩展名\n\tvar extra = importScript(\"data/scripts/myExtra\");\n\n\t// 拿到脚本对象后可以直接调它的函数 / 读写变量\n\textra?.call(\"setup\", [stage]);\n\textra?.set(\"mode\", \"hard\");\n}"
          }
        },
        {
          "p": "`importScript` 是 `ScriptPack` 注入给每个脚本的默认变量，**不用 import 就能用**。它加载的脚本会自动共享同一个 public 表。"
        },
        {
          "h": "④ Script 对象本身的方法"
        },
        {
          "table": {
            "head": [
              "成员",
              "作用"
            ],
            "rows": [
              [
                "`call(func, ?args)`",
                "调脚本里的函数"
              ],
              [
                "`callOne(func, arg)`",
                "单参数版（少一次数组分配）"
              ],
              [
                "`get(name)` / `set(name, v)`",
                "读写脚本变量"
              ],
              [
                "`setParent(obj)`",
                "设置 `this` 指向（决定能直接写哪些名字）"
              ],
              [
                "`reload()`",
                "重载（保留非函数变量）"
              ],
              [
                "`destroy()`",
                "销毁"
              ],
              [
                "`active`",
                "是否启用（false 时 `pack.call` 会跳过它）"
              ],
              [
                "`fileName` / `path` / `extension`",
                "脚本信息"
              ],
              [
                "`error(text)`",
                "以脚本身份打一条错误日志"
              ],
              [
                "`trace(v)`",
                "带文件名与行号的 trace（脚本里的 `trace` 就是这个）"
              ]
            ]
          }
        },
        {
          "h": "⑤ 关掉自己 / 临时停用"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "// 方式一：脚本自己退出（之后不再被调用）\ndisableScript();\n\n// 方式二：改 active 标志（可由别的脚本控制）\n__script__.active = false;"
          }
        },
        {
          "p": "`disableScript()` 是引擎预置的函数，等价于 `active = false`。它**不会销毁**脚本，变量还在，只是不再收到回调。"
        },
        {
          "h": "⑥ 条件编译：让一份脚本适配多个版本"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "#if CODENAME_ENGINE\n\ttrace(\"跑在 Codename 上\");\n#end\n\n#if debug\n\ttrace(\"调试构建\");\n#end\n\n#if MODCHARTING_FEATURES\n\t// 只有编译时开了 modchart 才有\n#end"
          }
        },
        {
          "p": "可用的 define 就是引擎编译时的全部 define，外加 `CODENAME_ENGINE`、`CODENAME_VER`、`CODENAME_BUILD`、`CODENAME_COMMIT`。"
        },
        {
          "h": "⑦ 性能：脚本不是免费的"
        },
        {
          "ul": [
            "**每个回调都会遍历包内所有脚本**。一帧里 `update` 会被调 N 次（N = 脚本数）。",
            "把重计算挪出 `update`：用 `FlxTimer`、按拍触发、或加 `if (dirty)` 开关。",
            "不要每帧 `new` 对象（尤其是 `FlxSprite`、`FlxTween`、lambda）。",
            "脚本里 `trace` 也是开销，发布前删掉或包在 `#if debug` 里。",
            "同一个效果别在两个脚本里各写一遍 —— 会叠加执行。"
          ]
        }
      ],
      "deep": [
        {
          "h": "⑧ 事件派发时脚本之间的协作"
        },
        {
          "p": "`ScriptPack.event()` 的规则很关键："
        },
        {
          "code": {
            "lang": "haxe",
            "title": "ScriptPack.event 的核心逻辑（简化）",
            "src": "for (script in scripts) {\n    if (!script.active) continue;\n    script.call(func, [event]);\n\n    // 被取消且不要求继续 → 后面所有脚本都不再收到\n    if (event.cancelled && !event.__continueCalls) break;\n}"
          }
        },
        {
          "p": "所以：**`cancel()` 会截断后续脚本**，`cancel(true)` 只截断引擎默认逻辑、不截断后续脚本。做「多人协作」的 mod 时，这个区别很要命。"
        },
        {
          "h": "⑨ 自己写一个脚本库"
        },
        {
          "p": "把可复用的函数抽到 `assets/source/` 下，就能被任意脚本 `import`："
        },
        {
          "code": {
            "lang": "haxe",
            "title": "assets/source/MyTools.hx",
            "src": "class MyTools {\n\tpublic static function shakeCam(cam:FlxCamera, power:Float = 0.01) {\n\t\tcam.shake(power, 0.3);\n\t}\n\n\tpublic static function flashWhite(cam:FlxCamera) {\n\t\tcam.flash(0xFFFFFFFF, 0.3);\n\t}\n}"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "任意脚本里",
            "src": "import MyTools;\n\nfunction onNoteHit(event) {\n\tif (event.rating == \"sick\") MyTools.shakeCam(camGame, 0.02);\n}"
          }
        },
        {
          "p": "注意：这是**脚本模块**，不是编译进引擎的类；改了之后按 `F5` 就会重新执行（同一进程内已导入过的模块不会重复执行，需要重建状态）。"
        },
        {
          "h": "⑩ 调试脚本的四个习惯"
        },
        {
          "ol": [
            "**先 `trace` 再改逻辑**：确认脚本真的被加载了（在顶层写一句 `trace(\"loaded\")`）。",
            "**看日志前缀**：`mod名:文件名:行号`，能立刻定位是哪个 mod 的哪一行。",
            "**用 `F2` 控制台试算**：`trace(game.scripts.getByName(\"x.hx\"))` 看脚本在不在包里。",
            "**二分定位**：把脚本后半段注释掉，看错误是否消失 —— 解释器的报错行号有时会偏。"
          ]
        },
        {
          "h": "⑪ 什么时候不该用脚本"
        },
        {
          "table": {
            "head": [
              "需求",
              "更合适的做法"
            ],
            "rows": [
              [
                "只是换个人物/舞台",
                "写 XML，别写脚本"
              ],
              [
                "只是加个事件",
                "事件 JSON + `.hx`，别塞进歌脚本"
              ],
              [
                "要改整个菜单布局",
                "软编码 state 脚本（`data/states/*.hx`）"
              ],
              [
                "要加新界面",
                "`ModState`"
              ],
              [
                "要全局生效的小改动",
                "`data/globals/` 或 mod 的 `global.hx`"
              ],
              [
                "要改引擎核心行为",
                "才考虑改源码（更新会很痛）"
              ]
            ]
          }
        }
      ]
    },
    {
      "id": "chart-data",
      "num": "35",
      "title": "谱面数据结构：JSON 里到底存了什么",
      "en": "CHART DATA",
      "tags": [
        "ChartData",
        "JSON",
        "meta.json",
        "ChartEvent"
      ],
      "simple": [
        {
          "p": "一首歌的 `.json` 就是一张表：**几组轨道 + 每条轨道上一串音符 + 一串事件**。加上 `meta`（这首歌的元信息）。"
        },
        {
          "p": "**别手写谱面**，用编辑器。但要知道字段名，因为脚本里会读它们（`SONG.meta.name`、`event.params[0]`）。"
        }
      ],
      "core": [
        {
          "h": "① 顶层结构 `ChartData`"
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
                "`strumLines`",
                "`Array<ChartStrumLine>`",
                "所有轨道（含每轨的音符）"
              ],
              [
                "`events`",
                "`Array<ChartEvent>`",
                "事件轨道"
              ],
              [
                "`meta`",
                "`ChartMetaData`",
                "歌曲元信息（BPM、难度、图标…）"
              ],
              [
                "`codenameChart`",
                "`Bool`",
                "是不是 Codename 格式（区分旧格式）"
              ],
              [
                "`stage`",
                "`String`",
                "舞台名"
              ],
              [
                "`scrollSpeed`",
                "`Float`",
                "谱面流速"
              ],
              [
                "`noteTypes`",
                "`Array<String>`",
                "本曲用到的音符类型（决定加载哪些 `data/notes/*.hx`）"
              ],
              [
                "`bookmarks`",
                "`Array<ChartBookmark>`",
                "书签（编辑器用）"
              ],
              [
                "`chartVersion`",
                "`String?`",
                "谱面格式版本"
              ],
              [
                "`fromMods`",
                "`Bool?`",
                "是否来自 mod（引擎写入）"
              ]
            ]
          }
        },
        {
          "h": "② `ChartMetaData`：和 `meta.json` 是一套东西"
        },
        {
          "table": {
            "head": [
              "字段",
              "说明"
            ],
            "rows": [
              [
                "`name`",
                "歌名（= 文件夹名）"
              ],
              [
                "`variant`",
                "变体名（如 `erect`）"
              ],
              [
                "`displayName`",
                "显示名"
              ],
              [
                "`bpm` / `beatsPerMeasure` / `stepsPerBeat`",
                "速度与拍号"
              ],
              [
                "`difficulties`",
                "难度数组"
              ],
              [
                "`variants`",
                "变体数组"
              ],
              [
                "`customValues`",
                "自定义键值（脚本读 `SONG.meta.customValues.x`）"
              ],
              [
                "`icon` / `color`",
                "血条图标 / 自由游玩背景色"
              ],
              [
                "`coopAllowed` / `opponentModeAllowed`",
                "是否允许双人 / 对手模式"
              ],
              [
                "`metas`",
                "变体的元数据表"
              ],
              [
                "`instSuffix` / `vocalsSuffix`",
                "音频后缀（做变体音轨用）"
              ],
              [
                "`needsVoices`",
                "是否需要人声"
              ]
            ]
          }
        },
        {
          "p": "`meta.json` 是给人读的文件；引擎加载时会把它并进谱面的 `meta` 字段。所以脚本里只需要 `PlayState.SONG.meta.xxx`。"
        },
        {
          "h": "③ `ChartStrumLine`：一条轨道"
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
                "`characters`",
                "`Array<String>`",
                "这条轨道上站哪些角色"
              ],
              [
                "`type`",
                "`ChartStrumLineType`",
                "`0` 对手 / `1` 玩家 / `2` 额外（详见下表）"
              ],
              [
                "`notes`",
                "`Array<ChartNote>`",
                "这条轨道的音符"
              ],
              [
                "`position`",
                "`String`",
                "舞台位置名（对应舞台 XML 里的角色锚点）"
              ],
              [
                "`visible`",
                "`Bool?`",
                "是否显示"
              ],
              [
                "`strumPos`",
                "`Array<Float>?`",
                "轨道坐标 `[x, y]`"
              ],
              [
                "`strumScale` / `strumSpacing`",
                "`Float?`",
                "箭头缩放 / 间距"
              ],
              [
                "`scrollSpeed`",
                "`Float?`",
                "这条轨道独立流速"
              ],
              [
                "`vocalsSuffix`",
                "`String?`",
                "这条轨道的人声后缀（多人声）"
              ],
              [
                "`keyCount`",
                "`Int?`",
                "按键数（默认 4，可 1~1000）"
              ],
              [
                "`strumLinePos`",
                "`Float?`",
                "旧字段（向后兼容）"
              ]
            ]
          }
        },
        {
          "p": "`ChartStrumLineType` 的三个值："
        },
        {
          "kv": [
            [
              "`OPPONENT = 0`",
              "对手侧（对手模式开启时交给玩家）"
            ],
            [
              "`PLAYER = 1`",
              "玩家侧（对手模式开启时交给 CPU）"
            ],
            [
              "`ADDITIONAL = 2`",
              "额外轨，**永远由 CPU 演奏**（对手模式下也是）"
            ]
          ]
        },
        {
          "h": "④ `ChartNote`：一个音符只有四个字段"
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
                "`time`",
                "`Float`",
                "判定时间（**毫秒**）"
              ],
              [
                "`id`",
                "`Int`",
                "方向：0 左 / 1 下 / 2 上 / 3 右（可更大，做多键）"
              ],
              [
                "`type`",
                "`Int`",
                "音符类型索引（对应 `noteTypes` 数组下标）"
              ],
              [
                "`sLen`",
                "`Float`",
                "长按长度（毫秒，0 = 普通音符）"
              ]
            ]
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "为什么叫 sLen",
            "text": "历史遗留命名（sustain length）。写脚本时别写成 `sustainLength` —— 那是运行时的 `Note` 对象字段，不是 JSON 字段。"
          }
        },
        {
          "h": "⑤ `ChartEvent` 与 `ChartBookmark`"
        },
        {
          "table": {
            "head": [
              "类型",
              "字段"
            ],
            "rows": [
              [
                "`ChartEvent`",
                "`name` `time` `params:Array<Dynamic>` `global:Bool?`"
              ],
              [
                "`ChartBookmark`",
                "`time` `name` `color`"
              ]
            ]
          }
        },
        {
          "p": "`params` 是**任意类型数组**，顺序严格对应事件定义（见第 24 节）。`global` 表示这条事件是否来自全局事件文件。"
        },
        {
          "h": "⑥ 一份最小可用的谱面 JSON"
        },
        {
          "code": {
            "lang": "json",
            "title": "songs/mysong/charts/normal.json（结构示意）",
            "src": "{\n  \"codenameChart\": true,\n  \"stage\": \"stage\",\n  \"scrollSpeed\": 1.0,\n  \"noteTypes\": [\"\", \"Alt Anim Note\"],\n  \"meta\": {\n    \"name\": \"mysong\",\n    \"displayName\": \"My Song\",\n    \"bpm\": 150,\n    \"stepsPerBeat\": 4,\n    \"beatsPerMeasure\": 4,\n    \"difficulties\": [\"normal\"],\n    \"icon\": \"dad\",\n    \"color\": \"#9271FD\",\n    \"needsVoices\": true,\n    \"opponentModeAllowed\": true,\n    \"coopAllowed\": true\n  },\n  \"strumLines\": [\n    {\n      \"characters\": [\"dad\"],\n      \"type\": 0,\n      \"position\": \"dad\",\n      \"notes\": [\n        { \"time\": 1000, \"id\": 0, \"type\": 0, \"sLen\": 0 },\n        { \"time\": 1500, \"id\": 2, \"type\": 0, \"sLen\": 500 }\n      ]\n    },\n    {\n      \"characters\": [\"bf\"],\n      \"type\": 1,\n      \"position\": \"boyfriend\",\n      \"notes\": [\n        { \"time\": 2000, \"id\": 1, \"type\": 0, \"sLen\": 0 }\n      ]\n    }\n  ],\n  \"events\": [\n    { \"name\": \"Camera Zoom\", \"time\": 2000, \"params\": [true, 1.1, \"camGame\", 4, \"linear\", \"InOut\", \"direct\", false] }\n  ],\n  \"bookmarks\": [\n    { \"time\": 0, \"name\": \"Start\", \"color\": \"#ffffff\" }\n  ]\n}"
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "注意",
            "text": "上面是**结构示意**，字段齐全但内容不是真实歌曲。真要写谱请用编辑器导出，手写极易漏字段。"
          }
        },
        {
          "h": "⑦ 脚本里怎么读这些数据"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "// 当前歌曲元信息\ntrace(PlayState.SONG.meta.name);\ntrace(PlayState.SONG.meta.bpm);\ntrace(PlayState.SONG.stage);\n\n// 自定义属性\nvar diff = PlayState.SONG.meta.customValues?.difficultyTag;\n\n// 遍历所有轨道\nfor (line in PlayState.SONG.strumLines) {\n\ttrace(line.type + \" / \" + line.notes.length + \" notes\");\n}\n\n// 当前难度（静态字段）\ntrace(PlayState.difficulty);\ntrace(PlayState.variation);"
          }
        }
      ],
      "deep": [
        {
          "h": "⑧ 三个「同名不同物」要分清"
        },
        {
          "table": {
            "head": [
              "名字",
              "出现在",
              "含义"
            ],
            "rows": [
              [
                "`sLen`",
                "谱面 JSON",
                "长按长度（毫秒）"
              ],
              [
                "`sustainLength`",
                "运行时 `Note` 对象",
                "长按长度（毫秒）"
              ],
              [
                "`strumTime`",
                "运行时 `Note` 对象",
                "判定时间（= JSON 的 `time`）"
              ],
              [
                "`noteData`",
                "运行时 `Note` 对象",
                "方向（= JSON 的 `id`）"
              ],
              [
                "`type`",
                "JSON",
                "类型**索引**"
              ],
              [
                "`noteType`",
                "运行时 `Note` 对象",
                "类型**名字**（`noteTypes[type]`）"
              ]
            ]
          }
        },
        {
          "h": "⑨ 写谱/改谱时的安全做法"
        },
        {
          "ul": [
            "**批量改时间**：读 JSON → 遍历 `strumLines[].notes[].time` → 写回。改完用编辑器打开确认。",
            "**加音符**：一定要同时填 `time` `id` `type` `sLen` 四个字段，缺一个会被解析成 0。",
            "**改难度**：改的是文件名 + `meta.difficulties`，两处要一致。",
            "**换音频**：`song/Inst.ogg` 的时间轴必须和谱面一致，改音乐不重打谱 = 全错位。"
          ]
        },
        {
          "h": "⑩ 解析器不止一种"
        },
        {
          "p": "引擎里能看到多个解析器：`FNFLegacyParser`（原版格式）、`PsychParser`（Psych 格式）、`VSliceParser`（V-Slice 格式）、`Chart`（Codename 自己的）。所以：**旧 mod 的谱面能被读进来，但读进来之后会转成 Codename 结构**。"
        },
        {
          "p": "这也解释了为什么 Codename 谱面里会有 `codenameChart: true` 这个标记 —— 用来区分「原生格式」和「转过来的」。"
        }
      ]
    },
    {
      "id": "modchart",
      "num": "36",
      "title": "Modchart：箭头特效的后端",
      "en": "MODCHARTING",
      "tags": [
        "modchart",
        "Manager",
        "NotITG"
      ],
      "simple": [
        {
          "p": "Modchart 就是「**让箭头乱飞**」的那套东西：改轨迹、旋转、透明度、颜色，做 NotITG 那种效果。"
        },
        {
          "p": "Codename 接的是第三方库 **FunkinModchart**，不是引擎自己写的。用之前先确认你的构建里带了这个功能。"
        }
      ],
      "core": [
        {
          "h": "① 它是怎么接进来的"
        },
        {
          "kv": [
            [
              "库",
              "`funkin-modchart`（作者 Theo，GitHub 账号现为 `dotaxel`；MIT 许可）"
            ],
            [
              "编译开关",
              "`MODCHARTING_FEATURES`（`project.xml` 里默认开，除非 `STRIPPED_COMPILE`）"
            ],
            [
              "引擎标识",
              "编译时传 `FM_ENGINE=CODENAME`、`FM_ENGINE_VERSION=1.0`"
            ],
            [
              "适配器",
              "库通过「Adapter」对接不同引擎，Codename 的适配器由库自带 —— **你不用自己写**"
            ],
            [
              "脚本可用性",
              "hscript 允许 `modchart.engine` 与 `modchart.backend.standalone` 下的类参与自定义类"
            ]
          ]
        },
        {
          "p": "想知道当前构建有没有：脚本里写 `#if MODCHARTING_FEATURES` 就行。"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "#if MODCHARTING_FEATURES\n\ttrace(\"这个构建带 modchart\");\n#else\n\ttrace(\"这个构建被裁掉了 modchart（STRIPPED_COMPILE）\");\n#end"
          }
        },
        {
          "h": "② 最小用法"
        },
        {
          "p": "库的用法很简单：**建一个 Manager，加进状态**。但它必须在箭头/接收器已经生成之后才能建。"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "songs/mysong/scripts/modchart.hx",
            "src": "import modchart.Manager;\n\nvar fm:Manager = null;\n\nfunction postCreate() {\n\t// postCreate 时箭头已经生成完毕\n\tfm = new Manager();\n\tadd(fm);\n}\n\nfunction destroy() {\n\tif (fm != null) {\n\t\tremove(fm, true);\n\t\tfm = null;\n\t}\n}"
          }
        },
        {
          "callout": {
            "kind": "warn",
            "title": "别在 create 里建",
            "text": "官方说明：**箭头和接收器初始化之后**才能创建 Manager。放在 `postCreate` 最稳。"
          }
        },
        {
          "h": "③ 它能做什么（库的能力清单）"
        },
        {
          "ul": [
            "**箭头轨迹**：位置、旋转（三轴）、缩放、透明度、颜色随时间变化。",
            "**轨迹可视化**：把箭头的运动路径画出来（Arrow Paths）。",
            "**动态事件系统**：用「事件」在时间轴上给修饰值打关键帧，而不是写死在 update 里。",
            "**自定义缓动**：自己定义曲线。",
            "**每个 playfield 独立 3D 相机**：镜头可以跟着某条轨道单独动。",
            "**多个 playfield**：一份谱面里做多套箭头（分屏、镜像都行）。"
          ]
        },
        {
          "p": "具体函数名和参数请查库的 `DOC.md`（GitHub：`TheoDevs/FunkinModchart`）—— 这部分属于第三方库，引擎不负责它的文档。"
        },
        {
          "h": "④ 和引擎自带事件配合"
        },
        {
          "p": "最常见的组合：**谱面事件负责「什么时候」**，**modchart 负责「怎么动」**。用 `HScript Call` 事件在你想要的时间点调自己的函数："
        },
        {
          "code": {
            "lang": "haxe",
            "title": "把「时间点」交给谱面事件",
            "src": "// 谱面里放一条事件：HScript Call -> spinArrows, \"1.5\"\nfunction spinArrows(amount:String) {\n\tvar v = Std.parseFloat(amount);\n\tif (fm == null || v == null) return;\n\n\t// 这里调用库的具体函数（函数名以库文档为准）\n\t// 例如给某条轨道加旋转修饰\n\ttrace(\"spin by \" + v);\n}"
          }
        },
        {
          "p": "这样做的好处：谱师不用改代码就能调效果强度，改节奏也只是在编辑器里挪事件。"
        },
        {
          "h": "⑤ 长按音符的细分"
        },
        {
          "p": "做长按特效时，长按会被切成若干段。段数由设置项控制："
        },
        {
          "kv": [
            [
              "`Options.modchartingHoldSubdivisions`",
              "长按细分段数，默认 4"
            ],
            [
              "影响",
              "段数越高越平滑，但对象数也越多（性能）"
            ],
            [
              "谁在用",
              "modchart 相关渲染与判定"
            ]
          ]
        },
        {
          "h": "⑥ 排错清单"
        },
        {
          "table": {
            "head": [
              "现象",
              "原因"
            ],
            "rows": [
              [
                "`import modchart.Manager` 报找不到",
                "构建没开 `MODCHARTING_FEATURES`"
              ],
              [
                "Manager 建了但没效果",
                "建太早（箭头还没生成），或没 `add(fm)`"
              ],
              [
                "箭头位置错乱",
                "同时在用引擎事件改箭头 + modchart 改同一属性，互相覆盖"
              ],
              [
                "切歌后报错",
                "Manager 没在 `destroy` 里移除"
              ],
              [
                "卡顿",
                "长按细分太高 / 修饰器叠加太多"
              ]
            ]
          }
        },
        {
          "h": "⑦ 真实函数表（`modchart.Manager`）"
        },
        {
          "p": "上面说「具体函数看库文档」—— 现在直接给你。库的接口分三块：**修饰器**、**事件**、**Playfield**。"
        },
        {
          "h4": "修饰器：调一个值"
        },
        {
          "table": {
            "head": [
              "方法",
              "作用"
            ],
            "rows": [
              [
                "`m.addModifier(mod, field = -1)`",
                "启用某个修饰器（之后才能调它的百分比）"
              ],
              [
                "`m.setPercent(mod, value, field = -1)`",
                "**直接设**修饰器数值（0~1 之间，可超）"
              ],
              [
                "`m.getPercent(mod, field = -1)`",
                "读当前值"
              ],
              [
                "`m.registerModifier(name, mod)`",
                "注册你自己的修饰器"
              ]
            ]
          }
        },
        {
          "h4": "事件：按拍调值"
        },
        {
          "table": {
            "head": [
              "方法",
              "作用"
            ],
            "rows": [
              [
                "`m.set(mod, beat, value, player = -1, field = -1)`",
                "到第 `beat` 拍时把 `mod` 设为 `value`"
              ],
              [
                "`m.ease(mod, beat, length, ease, value, player = -1, field = -1)`",
                "从当前值缓动到 `value`，持续 `length` 拍"
              ],
              [
                "`m.callback(beat, func, field = -1)`",
                "到拍时执行函数"
              ],
              [
                "`m.repeater(beat, length, func, field = -1)`",
                "一段时间内反复执行"
              ],
              [
                "`m.addEvent(event, field = -1)`",
                "加自定义事件对象"
              ]
            ]
          }
        },
        {
          "h4": "Playfield"
        },
        {
          "table": {
            "head": [
              "方法",
              "作用"
            ],
            "rows": [
              [
                "`m.addPlayfield()`",
                "新增一个 playfield（**加了之后再调修饰器，要对新 field 重设**）"
              ],
              [
                "`m.playfields`",
                "所有 playfield 的数组"
              ],
              [
                "`Manager.instance`",
                "静态单例，不想传引用时用它"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "一个能跑的例子",
            "src": "import modchart.Manager;\n\nvar m:Manager = null;\n\nfunction postCreate() {\n\tm = new Manager();\n\tadd(m);\n\n\t// 启用\"旋转\"和\"缩放\"两个修饰器\n\tm.addModifier(\"Rotate\");\n\tm.addModifier(\"Scale\");\n\n\t// 第 4 拍开始，用 1 拍时间缓动到 45 度\n\tm.ease(\"Rotate\", 4, 1, FlxEase.quadOut, 0.25);\n\n\t// 第 8 拍缩到 0.8\n\tm.set(\"Scale\", 8, 0.8);\n\n\t// 第 16 拍执行自定义逻辑\n\tm.callback(16, function () trace(\"第 16 拍到了\"));\n}"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "数值是 0~1 的比例",
            "text": "`setPercent` / `ease` 传的是**百分比**，不是像素或角度。具体怎么映射成角度/位移由修饰器自己决定，所以「0.25 的 Rotate」在不同 playfield 上看着可能不一样。"
          }
        },
        {
          "h": "⑧ 32 个内置修饰器"
        },
        {
          "p": "`mod` 参数就是下面这些名字（大小写要一致）："
        },
        {
          "table": {
            "head": [
              "分类",
              "修饰器"
            ],
            "rows": [
              [
                "位移 / 旋转",
                "`Rotate` `CenterRotate` `LocalRotate` `FieldRotate` `Skew` `Transform` `Zoom` `Scale`"
              ],
              [
                "位置变形",
                "`Confusion` `Drunk` `Tipsy` `Bumpy` `Tornado` `ZigZag` `Square` `Invert` `Reverse`"
              ],
              [
                "Schmovin 系",
                "`SchmovinDrunk` `SchmovinTipsy` `SchmovinTornado`"
              ],
              [
                "外观",
                "`Stealth` `ArrowShape` `Radionic` `Drugged` `Boost` `Bounce` `SawTooth` `Beat`"
              ],
              [
                "结构",
                "`PathModifier` `ReceptorScroll` `OpponentSwap` `Infinite`"
              ]
            ]
          }
        },
        {
          "p": "名字基本沿用了 NotITG / Schmovin 的那套，会玩 NotITG 的话几乎零成本。"
        },
        {
          "h": "⑨ 先说清楚：这个库已经停止维护"
        },
        {
          "p": "库的 README 顶上写着 **UNMAINTAINED**，作者（axel）明确说在排期废弃，后继是 **FlxModchart**。同时列了一串已知问题："
        },
        {
          "ul": [
            "相机解析不一致（different camera resolving）",
            "渲染器里 `FlxSprite` / `FlxFrame` 属性实现不全或为 null",
            "顶点着色问题（可能和 flixel 批处理有关）",
            "**持续掉帧 / 掉帧尖峰**",
            "渲染定制性差；**不能渲染「没有箭头的 FlxSprite」**（NotITG 的 actor 那种）",
            "长按只支持「分段式」渲染（0.2.7 那套）",
            "作者自己说架构不好、没有测试"
          ]
        },
        {
          "callout": {
            "kind": "warn",
            "title": "所以要不要用",
            "text": "做**能跑的特效**没问题；想**长期维护、追求稳定渲染**的话要有心理准备。作者建议关注后续的 **FlxModchart**。另外仓库已经从 `TheoDevelops` 转到 `dotaxel` 名下，旧链接会跳转。"
          }
        }
      ],
      "deep": [
        {
          "h": "⑦ 为什么它要「适配器」"
        },
        {
          "p": "FunkinModchart 是跨引擎的（Psych、FPS Plus、Codename 都能用）。它不直接认识 `StrumLine` 或 `Note`，而是通过一个 **Adapter** 接口去问：「你这条轨道有几个箭头？箭头在哪？现在什么状态？」Codename 的适配器实现了这套接口，所以你在脚本里只需要 `new Manager()`。"
        },
        {
          "p": "适配器的类名要和 `FM_ENGINE` 的值对上（PascalCase），这就是为什么 `project.xml` 里写 `FM_ENGINE=CODENAME`。"
        },
        {
          "h": "⑧ 和「纯脚本演出」的取舍"
        },
        {
          "table": {
            "head": [
              "做法",
              "适合",
              "代价"
            ],
            "rows": [
              [
                "FlxTween 手写",
                "少量、一次性的演出",
                "写起来啰嗦，时间点难对"
              ],
              [
                "谱面事件",
                "时间点明确的镜头/动画",
                "能力有限（只能做内置那 14 种）"
              ],
              [
                "modchart",
                "箭头本身的花式运动、分屏、3D 相机",
                "要学第三方库；性能开销"
              ],
              [
                "单纯改 `Strum`/`Note` 字段",
                "简单位移/透明",
                "容易和引擎每帧逻辑打架"
              ]
            ]
          }
        },
        {
          "p": "建议：**先用引擎事件，撑不住了再上 modchart**。很多「看起来像 modchart」的效果，其实几个 `FlxTween` 就够了。"
        },
        {
          "h": "⑩ 自己写一个修饰器"
        },
        {
          "p": "`registerModifier(name, mod)` 可以注册自定义修饰器 —— 适合做库自带那 32 个之外的效果。"
        },
        {
          "code": {
            "lang": "haxe",
            "title": "思路（继承 Modifier，实现输出）",
            "src": "import modchart.engine.modifiers.Modifier;\n\n// 自定义修饰器需要继承 Modifier 并实现它的输出方法\n// 具体签名以 modchart/engine/modifiers/Modifier.hx 为准\n\nm.registerModifier(\"MyEffect\", new MyEffect());\n\n// 之后就能像内置的一样用\nm.addModifier(\"MyEffect\");\nm.set(\"MyEffect\", 4, 0.5);"
          }
        },
        {
          "h": "⑪ 和「纯 FlxTween 演出」怎么选"
        },
        {
          "p": "回头看第 22 节的取舍表：**如果只是想让箭头晃一下，`FlxTween` 三行就够**。modchart 真正的价值在：多 playfield、3D 相机、箭头轨迹可视化、以及「按拍编排一大串修饰器」的工作流。"
        },
        {
          "p": "一个判断标准：**你的效果能不能写成「第 N 拍把 X 设成 Y」？** 能，而且有一堆这样的点 → 用 modchart；只是两三个一次性动画 → 别引入。"
        }
      ]
    },
    {
      "id": "dialogue",
      "num": "37",
      "title": "对话与过场系统 API",
      "en": "CUTSCENES & DIALOGUE",
      "tags": [
        "DialogueBox",
        "DialogueCutscene",
        "过场",
        "XML"
      ],
      "simple": [
        {
          "p": "过场分三种：**放视频**、**放对话**（那个弹字的气泡框）、**跑脚本**。引擎都给你写好了类，你只要准备文件。"
        },
        {
          "p": "对话用 XML 写，一个人物一个文件、一套对话框一个文件、一段对话一个文件。"
        }
      ],
      "core": [
        {
          "h": "① 三种过场"
        },
        {
          "table": {
            "head": [
              "类",
              "用什么",
              "适合"
            ],
            "rows": [
              [
                "`VideoCutscene`",
                "`.mp4` 等视频（hxvlc）",
                "现成的动画过场"
              ],
              [
                "`DialogueCutscene`",
                "XML 对话文件",
                "剧情对话（最常用）"
              ],
              [
                "`ScriptedCutscene`",
                "`.hx` 脚本",
                "任意自定义演出"
              ],
              [
                "`Cutscene`（基类）",
                "—",
                "以上三个都继承它"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "Cutscene 基类字段 / 方法",
              "说明"
            ],
            "rows": [
              [
                "`pausable`",
                "过场中能不能暂停"
              ],
              [
                "`skippable`",
                "能不能跳过"
              ],
              [
                "`pauseItems`",
                "过场里暂停菜单的选项"
              ],
              [
                "`paused`",
                "当前是否暂停"
              ],
              [
                "`pauseCheck()` / `pauseCutscene()`",
                "暂停判定 / 执行暂停"
              ],
              [
                "`onSkipCutscene(event)`",
                "跳过时回调"
              ],
              [
                "`close()`",
                "结束过场"
              ]
            ]
          }
        },
        {
          "h": "② 对话文件（一段对话一个 XML）"
        },
        {
          "code": {
            "lang": "xml",
            "title": "songs/mysong/dialogue.xml（结构示意）",
            "src": "<dialogue box=\"default\">\n\t<char name=\"dad\" position=\"left\" />\n\t<char name=\"bf\" position=\"right\" />\n\n\t<line char=\"dad\" bubble=\"normal\" speed=\"0.05\">\n\t\tHello there.\n\t</line>\n\n\t<line char=\"bf\" bubble=\"angry\">\n\t\t<format color=\"#FF0000\">What do you want?</format>\n\t</line>\n</dialogue>"
          }
        },
        {
          "table": {
            "head": [
              "节点 / 属性",
              "作用"
            ],
            "rows": [
              [
                "`<dialogue box=\"...\">`",
                "指定用哪套对话框（`data/dialogue/boxes/<名字>.xml`）"
              ],
              [
                "`<char name position>`",
                "声明出场角色；`name` 对应 `data/dialogue/characters/`，`position` 对应框里的位置名"
              ],
              [
                "`<line char bubble ...>`",
                "一句对话；节点内文本就是内容，可用 `<format>` 做局部样式"
              ],
              [
                "`speed`",
                "打字机速度（秒/字，默认 0.05）"
              ],
              [
                "`callback`",
                "这句播完调用的脚本函数"
              ],
              [
                "`changeDefAnim`",
                "改变该角色的默认动画"
              ],
              [
                "`musicVolume` / `changeMusic`",
                "这句时的音乐音量 / 换曲"
              ],
              [
                "`playSound` / `nextSound` / `textSound`",
                "这句的音效（播放 / 翻页 / 打字）"
              ]
            ]
          }
        },
        {
          "h": "③ 对话框 XML（`data/dialogue/boxes/*.xml`）"
        },
        {
          "code": {
            "lang": "xml",
            "title": "boxes/default.xml（节选）",
            "src": "<dialoguebox y=\"75\">\n\t<text font=\"vcr.ttf\" x=\"107\" y=\"206\" width=\"1053\" color=\"#000000\" size=\"40\"/>\n\n\t<charpos name=\"left\"   x=\"-500\" y=\"184\" flipBubble=\"true\" />\n\t<charpos name=\"middle\" x=\"0\"    y=\"184\" />\n\t<charpos name=\"right\"  x=\"500\"  y=\"184\" />\n\n\t<anim name=\"normal\"      anim=\"speech bubble normal\"      fps=\"24\" loop=\"true\" x=\"-30\"/>\n\t<anim name=\"normal-open\" anim=\"Speech Bubble Normal Open\" fps=\"24\" />\n</dialoguebox>"
          }
        },
        {
          "ul": [
            "`<text>`：字体、位置、宽度、颜色、字号；还支持 `borderStyle` / `borderSize` / `borderColor` / `shadowOffsetX/Y` / `antialiasing`。",
            "`<charpos>`：角色站位（`name` 就是对话里 `position` 用的名字），`flipBubble` 控制气泡朝左还是朝右。",
            "`<anim>`：气泡动画。命名约定 `xxx` 是常驻、`xxx-open` 是出现时播。",
            "根节点还能写 `sprite`（贴图名，默认同名）、`textSound`、`nextSound`。"
          ]
        },
        {
          "h": "④ 对话角色 XML（`data/dialogue/characters/*.xml`）"
        },
        {
          "code": {
            "lang": "xml",
            "src": "<character x=\"50\" y=\"-60\">\n\t<anim name=\"normal\" anim=\"normal\" fps=\"24\" />\n\t<!-- 想加表情就继续加 anim，name 对应台词里的 bubble/changeDefAnim -->\n</character>"
          }
        },
        {
          "h": "⑤ 运行时 API"
        },
        {
          "table": {
            "head": [
              "DialogueCutscene",
              "说明"
            ],
            "rows": [
              [
                "`dialoguePath` / `dialogueData`",
                "文件路径 / 解析后的 XML"
              ],
              [
                "`charMap`",
                "角色名 → `DialogueCharacter`"
              ],
              [
                "`dialogueLines`",
                "所有台词（`DialogueLine` 数组）"
              ],
              [
                "`curLine` / `lastLine`",
                "当前 / 上一句"
              ],
              [
                "`dialogueBox`",
                "对话框对象"
              ],
              [
                "`dialogueCamera`",
                "对话专用相机"
              ],
              [
                "`curMusic`",
                "当前对话音乐"
              ],
              [
                "`dialogueScript`",
                "可选脚本（同名 `.hx`）"
              ],
              [
                "`canProceed`",
                "能不能翻到下一句"
              ],
              [
                "`next(playFirst)`",
                "下一句"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "DialogueBox",
              "说明"
            ],
            "rows": [
              [
                "`dialogueBoxData`",
                "框的 XML"
              ],
              [
                "`positions`",
                "位置名 → 坐标"
              ],
              [
                "`text`",
                "`FlxTypeText`（打字机效果）"
              ],
              [
                "`dialogueEnded`",
                "是否已结束"
              ],
              [
                "`startText(text)` / `resetText(text)`",
                "开始/重置文本"
              ],
              [
                "`popupChar(char, force)`",
                "让角色弹一下"
              ],
              [
                "`playBubbleAnim(name, suffix)`",
                "播气泡动画"
              ],
              [
                "`nextSFX` / `defaultTextTypeSFX`",
                "音效"
              ]
            ]
          }
        },
        {
          "table": {
            "head": [
              "DialogueCharacter",
              "说明"
            ],
            "rows": [
              [
                "`charData`",
                "角色 XML"
              ],
              [
                "`positionName`",
                "站位名"
              ],
              [
                "`defaultAnim`",
                "默认动画"
              ],
              [
                "`show(x, y, ?anim, force)` / `hide(?anim, force)`",
                "出场 / 退场"
              ],
              [
                "`curTween` / `finishAnimCallback`",
                "补间 / 动画结束回调"
              ]
            ]
          }
        },
        {
          "h": "⑥ 怎么触发过场"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "// 在 PlayState 里（脚本也行）\nPlayState.instance.startCutscene(\"dialogue\");\n\n// 相关字段\n// cutscene      —— 开场过场前缀\ntrace(game.cutscene);\ntrace(game.endCutscene);\ntrace(game.playCutscenes);   // 是否允许播"
          }
        },
        {
          "p": "`startCutscene(prefix)` 会按前缀去找对应的过场文件；具体后缀规则随版本略有差异，最稳的做法是看当前版本的 `PlayState.startCutscene` 里拼的路径。"
        },
        {
          "h": "⑦ 一个能跑的完整对话（含回调与换表情）"
        },
        {
          "p": "光有属性表没用，这里给一份**从文件到播完**的完整例子：两个角色、两句台词、中途换表情、播完调脚本。"
        },
        {
          "code": {
            "lang": "xml",
            "title": "songs/mysong/dialogue.xml",
            "src": "<dialogue box=\"default\">\n\t<char name=\"dad\" position=\"left\" />\n\t<char name=\"bf\"  position=\"right\" />\n\n\t<line char=\"dad\" bubble=\"angry\" changeDefAnim=\"angry\" speed=\"0.04\">\n\t\t你终于来了。\n\t</line>\n\n\t<line char=\"bf\" bubble=\"normal\" callback=\"onLineDone\" speed=\"0.05\">\n\t\t来就来，谁怕谁。\n\t</line>\n</dialogue>"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "songs/mysong/dialogue.hx（对话脚本，可选）",
            "src": "// 同名 .hx 会被当作「对话脚本」加载\n\nfunction onLineDone() {\n\t// 这句播完后触发（名字来自 XML 的 callback=\"onLineDone\"）\n\ttrace(\"第二句播完了\");\n\n\t// 想在这里做点演出：闪一下屏\n\tif (PlayState.instance != null)\n\t\tPlayState.instance.camGame.flash(0xFFFFFFFF, 0.25);\n}"
          }
        },
        {
          "callout": {
            "kind": "tip",
            "title": "callback 的用法",
            "text": "`callback` 填的是**函数名**，引擎会在那句台词播完后调用它。它在你自己的对话脚本里实现，用来「播完这句就做某事」。"
          }
        },
        {
          "h": "⑧ 对话里能做的其他事"
        },
        {
          "table": {
            "head": [
              "想做的事",
              "怎么配"
            ],
            "rows": [
              [
                "换背景音乐",
                "`changeMusic=\"song/xxx\"` + `musicVolume=\"0.6\"`"
              ],
              [
                "播一个音效",
                "`playSound=\"sound名\"`"
              ],
              [
                "换翻页音",
                "`nextSound=\"sound名\"`"
              ],
              [
                "换打字音",
                "`textSound=\"sound名\"`"
              ],
              [
                "改打字速度",
                "`speed=\"0.02\"`（秒/字，越小越快）"
              ],
              [
                "换气泡样式",
                "`bubble=\"angry\"`（要在框 XML 里有同名 `<anim>`）"
              ],
              [
                "说完换默认表情",
                "`changeDefAnim=\"normal\"`"
              ],
              [
                "局部变色",
                "句子里用 `<format color=\"#FF0000\">红字</format>`"
              ]
            ]
          }
        }
      ],
      "deep": [
        {
          "h": "⑦ 对话相关事件（可拦截）"
        },
        {
          "table": {
            "head": [
              "事件",
              "主要字段",
              "能改什么"
            ],
            "rows": [
              [
                "`DialogueStructureEvent`",
                "`dialogueData`",
                "整个对话数据"
              ],
              [
                "`DialogueBoxStructureEvent`",
                "`name` `textTypeSFX` `dialogueBoxData`",
                "框的配置"
              ],
              [
                "`DialogueCharStructureEvent`",
                "`name` `position` `charData`",
                "角色的配置"
              ],
              [
                "`DialogueNextLineEvent`",
                "`playFirst`",
                "翻页"
              ],
              [
                "`DialogueBoxSetTextEvent`",
                "`text` `format` `speed` `customTypeSFX`",
                "这句的文字与速度"
              ],
              [
                "`DialogueBoxPlayBubbleEvent`",
                "`bubble` `suffix` `text` `format` `speed` `allowDefault`",
                "气泡动画"
              ],
              [
                "`DialogueBoxCharPopupEvent`",
                "`char` `force`",
                "角色弹动"
              ],
              [
                "`DialogueCharShowEvent` / `DialogueCharHideEvent`",
                "`x` `y` `animation` …",
                "出场/退场"
              ]
            ]
          }
        },
        {
          "p": "这些事件的字段在**第 31 节**有完整列表；这里只是告诉你「对话过程中哪些环节能插手」。"
        },
        {
          "h": "⑧ 三种过场怎么选"
        },
        {
          "table": {
            "head": [
              "需求",
              "选"
            ],
            "rows": [
              [
                "已经有做好的动画视频",
                "`VideoCutscene`（注意体积）"
              ],
              [
                "角色站着说话",
                "`DialogueCutscene`"
              ],
              [
                "要镜头、要角色动作、要复杂演出",
                "`ScriptedCutscene`"
              ],
              [
                "只是想让角色说两句 + 播个音效",
                "`DialogueCutscene` + `playSound` 属性"
              ]
            ]
          }
        },
        {
          "h": "⑨ 常见坑"
        },
        {
          "ul": [
            "对话里的 `position` 必须在框 XML 的 `<charpos>` 里存在，否则角色会站在 (0,0)。",
            "`bubble` 名必须在框 XML 的 `<anim>` 里存在，否则气泡不换。",
            "对话文件是 XML，**文本里的 `&` 要写成 `&amp;`**，否则解析失败。",
            "过场期间玩家输入被接管；想让某段可跳过，设 `skippable = true`。",
            "视频过场依赖 hxvlc，`VIDEO_CUTSCENES` 被裁掉的构建里不可用。"
          ]
        },
        {
          "h": "⑩ 视频过场：依赖与字幕"
        },
        {
          "p": "除了对话，还能直接播视频（`VideoCutscene`）。它依赖 **hxvlc**，只在编译时开了 `VIDEO_CUTSCENES` 的构建里存在（桌面版默认开）。"
        },
        {
          "table": {
            "head": [
              "成员",
              "说明"
            ],
            "rows": [
              [
                "`new VideoCutscene(path, callback)`",
                "播一个视频，播完调 `callback`"
              ],
              [
                "`subtitles:Array<CutsceneSubtitle>`",
                "字幕数组"
              ],
              [
                "`parseSubtitles()`",
                "解析字幕（通常配合同名文件）"
              ],
              [
                "`setSubtitle(sub)`",
                "切换当前字幕"
              ]
            ]
          }
        },
        {
          "ul": [
            "**格式**：引擎的 `VIDEO_EXTS` 是 `mp4 / webm / mkv / mov`，实际能不能播取决于 hxvlc 与系统解码器。",
            "**优先 mp4（H.264）** —— 兼容性最好；webm 在很多机器上没解码器。",
            "**别把视频塞进 git**：几十 MB 的文件会让仓库爆炸，用外链或发布页附件。",
            "**过场期间输入被接管**：想让玩家跳过，设 `skippable = true`。"
          ]
        },
        {
          "h": "⑪ 对话的一次完整执行顺序"
        },
        {
          "ol": [
            "读对话 XML → 解析出 `charMap`（角色）与 `dialogueLines`（台词数组）。",
            "按 `<dialogue box=\"...\">` 加载对话框 XML，建 `DialogueBox`。",
            "逐个 `show()` 角色（带上 `position` 对应坐标）。",
            "第一句：`startText()` 逐字打出；玩家按确认 → `next(playFirst=false)`。",
            "每句播完检查 `callback`，有就调用对话脚本里的同名函数。",
            "全部说完 → 调构造时传入的回调 → 过场 `close()`。"
          ]
        },
        {
          "h": "⑫ 常见需求 → 到底配哪里"
        },
        {
          "table": {
            "head": [
              "你想要",
              "改哪"
            ],
            "rows": [
              [
                "换气泡外观",
                "`data/dialogue/boxes/<名字>.xml` 的 `<anim>`"
              ],
              [
                "换角色站位",
                "框 XML 的 `<charpos>`"
              ],
              [
                "换字体/字号/颜色",
                "框 XML 的 `<text>`"
              ],
              [
                "加角色表情",
                "`data/dialogue/characters/<名字>.xml` 里加 `<anim>`"
              ],
              [
                "改台词内容",
                "对话 XML 的 `<line>`"
              ],
              [
                "让某句变慢/变快",
                "那句的 `speed`"
              ],
              [
                "播完做事情",
                "那句的 `callback` + 对话脚本"
              ],
              [
                "整个对话换样式",
                "换一个 `<dialogue box=\"另一个框\">`"
              ]
            ]
          }
        },
        {
          "h": "⑬ 视频字幕：用 `.srt`，和视频同名"
        },
        {
          "p": "`VideoCutscene` 的字幕**不是写在 XML 里**，而是读一个和视频同名的 `.srt` 文件（标准字幕格式，手写也行、剪辑软件导出也行）。"
        },
        {
          "code": {
            "lang": "ini",
            "title": "assets/videos/intro.srt（对应 videos/intro.mp4）",
            "src": "1\n00:00:01,000 --> 00:00:04,500\n欢迎来到我的 mod。\n\n2\n00:00:05,000 --> 00:00:08,000\n下面这段是剧情，\n可以按 ESC 跳过。"
          }
        },
        {
          "table": {
            "head": [
              "规则",
              "说明"
            ],
            "rows": [
              [
                "文件名",
                "`<视频名>.srt`，和视频**同目录同名**（`Paths.withoutExtension()` 后拼 `.srt`）"
              ],
              [
                "编号行",
                "纯数字，只用来分段；解析器会跳过不是数字的行"
              ],
              [
                "时间行",
                "`起始 --> 结束`，格式 `时:分:秒,毫秒`"
              ],
              [
                "文本行",
                "中间可以多行，直到遇到空行"
              ],
              [
                "编码",
                "UTF-8（中文别用 GBK，会乱码）"
              ]
            ]
          }
        },
        {
          "p": "解析是 `parseSubtitles()` 里手写的，很宽松：编号不是数字、时间行没有 `-->`、时间戳解析失败，都会被**静默跳过**而不是报错。所以「字幕没出现」通常是**同名/同目录/编码**三个原因。"
        },
        {
          "callout": {
            "kind": "tip",
            "title": "不想用 srt",
            "text": "也可以完全不写字幕文件，在自己脚本里直接操作 `VideoCutscene.setSubtitle()` 手动控制。"
          }
        }
      ]
    },
    {
      "id": "save-data",
      "num": "38",
      "title": "存档与分数 API",
      "en": "SAVE DATA",
      "tags": [
        "FunkinSave",
        "highscores",
        "FlxSave"
      ],
      "simple": [
        {
          "p": "存档分两套：**设置**（音量、偏移…）存在 `Options`，**进度**（分数、最高分）存在 `FunkinSave`。"
        },
        {
          "p": "自己的 mod 数据往 `FlxG.save.data` 里塞，别去动人家那两套。"
        }
      ],
      "core": [
        {
          "h": "① 三套存储，别混"
        },
        {
          "table": {
            "head": [
              "存储",
              "放什么",
              "怎么读"
            ],
            "rows": [
              [
                "`Options`",
                "玩家设置",
                "`Options.downscroll`"
              ],
              [
                "`FunkinSave`",
                "最高分、周分数",
                "`FunkinSave.getSongHighscore(...)`"
              ],
              [
                "`FlxG.save`",
                "**你自己的 mod 数据**",
                "`FlxG.save.data.xxx`"
              ]
            ]
          }
        },
        {
          "kv": [
            [
              "存档路径",
              "由 `project.xml` 的 `SAVE_PATH` / `SAVE_NAME` 决定（默认 `CodenameEngine/save-default`）"
            ],
            [
              "位置",
              "系统的应用数据目录，**不在游戏目录里**"
            ],
            [
              "所以",
              "删游戏文件夹不会清存档；要清用「重置存档」或手动删"
            ]
          ]
        },
        {
          "h": "② 最高分 API"
        },
        {
          "table": {
            "head": [
              "方法",
              "说明"
            ],
            "rows": [
              [
                "`FunkinSave.getSongHighscore(name, diff, ?variation, ?changes)`",
                "取某首歌的最高分（返回 `SongScore`）"
              ],
              [
                "`FunkinSave.setSongHighscore(name, diff, ?variation, highscore, ?changes, ?force)`",
                "写最高分（自动 flush）"
              ],
              [
                "`FunkinSave.getWeekHighscore(name, diff)`",
                "周总分"
              ],
              [
                "`FunkinSave.setWeekHighscore(name, diff, highscore, ?force)`",
                "写周总分"
              ],
              [
                "`FunkinSave.highscores`",
                "全部记录（`Map<HighscoreEntry, SongScore>`）"
              ],
              [
                "`FunkinSave.flush()`",
                "落盘"
              ]
            ]
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "SongScore 结构",
            "src": "typedef SongScore = {\n\tvar score:Int;\n\tvar accuracy:Float;\n\tvar misses:Int;\n\tvar hits:Map<String, Int>;\n\tvar date:String;\n}"
          }
        },
        {
          "code": {
            "lang": "haxe",
            "title": "读写示例",
            "src": "// 读\nvar hs = FunkinSave.getSongHighscore(\"bopeebo\", \"hard\");\nif (hs != null) trace(hs.score + \" / \" + hs.accuracy);\n\n// 写（只有更高才会覆盖，force=true 强制写）\nFunkinSave.setSongHighscore(\"bopeebo\", \"hard\", null, {\n\tscore: 100000,\n\taccuracy: 0.98,\n\tmisses: 2,\n\thits: [\"sick\" => 80, \"good\" => 10],\n\tdate: \"2026-10-23\"\n});"
          }
        },
        {
          "callout": {
            "kind": "info",
            "title": "键是大小写无关的",
            "text": "内部会把歌名和难度 `toLowerCase()` 再当 key，所以 `\"Bopeebo\"` 和 `\"bopeebo\"` 是同一条记录。"
          }
        },
        {
          "h": "③ 自己的 mod 数据"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "// 写\nFlxG.save.data.myClearCount = 3;\nFlxG.save.data.myFlags = [\"a\", \"b\"];\nFlxG.save.flush();      // 必须 flush 才落盘\n\n// 读（第一次是 null，要给默认值）\nvar n:Int = FlxG.save.data.myClearCount ?? 0;"
          }
        },
        {
          "p": "`FlxG.save` 是 Flixel 的存档对象，和 `Options` / `FunkinSave` 各自独立，互不影响。"
        }
      ],
      "deep": [
        {
          "h": "④ 为什么最高分要按「模式」分开存"
        },
        {
          "p": "同一个 `getSongHighscore` 还接受一个 `changes` 参数（`Array<HighscoreChange>`，比如双人模式、对手模式）。这样同一首歌在不同模式下有各自的最高分，不会互相污染。"
        },
        {
          "code": {
            "lang": "haxe",
            "src": "// 单人\nFunkinSave.getSongHighscore(\"bopeebo\", \"hard\");\n\n// 双人模式（changes 由引擎内部传入，脚本一般不用手动管）\n// 想自己加维度就传自定义 changes"
          }
        },
        {
          "h": "⑤ 存档坏了的处理"
        },
        {
          "ul": [
            "读出来是 `null`：可能是第一次玩，也可能是解析失败 —— 用 `??` 给默认值。",
            "分数异常变大：`force` 写入了脏数据，用「重置存档」清。",
            "换版本后读不到旧分：存档结构变了，属于正常现象。"
          ]
        },
        {
          "h": "⑥ 什么时候 flush"
        },
        {
          "kv": [
            [
              "`setSongHighscore` / `setWeekHighscore`",
              "内部已经 flush，不用再调"
            ],
            [
              "手动改 `FlxG.save.data`",
              "**必须**自己 `FlxG.save.flush()`"
            ],
            [
              "改 `Options`",
              "调 `Options.save()`"
            ],
            [
              "退出时",
              "引擎会自动存一次设置（`Lib.application.onExit`）"
            ]
          ]
        }
      ]
    }
  ]
});
})();
