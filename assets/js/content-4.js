/* ============================================================
   第四部分：进阶代码与外部脚本开发
   ============================================================ */
(function () {
  if (!window.CNE) return;

  window.CNE.addPart({
    id: 'p4',
    name: '第四部分 · 改它',
    short: 'PART 04',
    color: 'var(--yellow)',
    sections: [

      /* ------------------------------------------------ 18 */
      {
        id: 'haxe-basics',
        num: '18',
        title: 'Haxe 基础：把语法一次讲全',
        en: 'HAXE, END TO END',
        tags: ['HScript', '语法', '类型', '函数', '类', 'import'],
        simple: [
          { p: "Codename 的脚本用 **HScript**，语法几乎和 Haxe 一样。这一节不搞「够用就行」——**该有的语法全列出来**，你看一眼就知道能写什么、不能写什么。" },
          { p: "先记住三件事：**不用 class 包起来**（顶层直接写变量和函数）、**函数名就是引擎调你的接口**、**改完存盘按 F5 就生效**。" },
          { code: { lang: 'haxe', title: '最小脚本（完整形态）', src: '// 顶层变量：脚本加载时执行一次\nvar hits:Int = 0;\n\n// 引擎会调用同名的函数（这叫回调）\nfunction create():Void {\n\ttrace("脚本启动了");\n}\n\nfunction update(elapsed:Float):Void {\n\t// 每帧一次，elapsed 是距上一帧的秒数\n}\n\nfunction beatHit(curBeat:Int):Void {\n\t// 每一拍一次\n\thits++;\n}' } },
          {
            table: {
              head: ['你要写', '写成'],
              rows: [
                ['变量', '`var hp:Float = 2.0;`'],
                ['常量', '`final NAME:String = "bf";`'],
                ['函数', '`function foo(a:Int):Int { return a + 1; }`'],
                ['条件', '`if (hp < 1) { ... } else { ... }`'],
                ['循环', '`for (i in 0...4) { ... }`'],
                ['数组', '`var a:Array<Int> = [1, 2, 3];`'],
                ['键值表', '`var m:Map<String, Int> = ["a" => 1];`'],
                ['类', '`var s = new FlxSprite();`'],
                ['用别的类', '`import funkin.backend.utils.WindowUtils;`']
              ]
            }
          },
          { callout: { kind: 'tip', title: '不会写就查', text: "下面每一块都是完整清单，不用记，写到哪查到哪。" } }
        ],
        core: [
          { h: '① 脚本的形态' },
          { p: "Codename 的 `.hx` 脚本**不是**普通的 Haxe 文件：它没有 `package`、没有 `class`、没有 `main`，就是一堆顶层语句 + 函数。引擎把整段代码丢进解释器执行，然后把其中的函数名登记成回调。" },
          { code: { lang: 'haxe', src: '// 1) 顶层语句：脚本被创建时执行一次（按书写顺序）\nvar timer:Float = 0;\nvar shots:Array<String> = [];\n\n// 2) 顶层函数：引擎按名字调用\nfunction postCreate() { /* 对象都建好了 */ }\nfunction update(elapsed:Float) { /* 每帧 */ }\nfunction destroy() { /* 销毁前 */ }' } },
          {
            ul: [
              "**顶层可以有任意多条语句**：变量、函数、甚至直接调用（`trace(\"hi\")` 会在加载时跑）。",
              "**顶层不能有 `class` / `package` / `import` 之外的结构**（`import` 可以，且必须写在最前面）。",
              "**同一个作用域内变量名不能重复**，包括和引擎预置的全局名（`health`、`game`、`state` 等）撞名。",
              "**函数可以定义在任意位置**，引擎在脚本加载时就完成登记，不要求写在前面。"
            ]
          },
          { callout: { kind: 'warn', title: '最常见的新手错误', text: "把整段代码包进 `class Foo { }` 里。引擎不会执行 class 内部的东西，脚本会「静默什么都不做」。" } },

          { h: '② 变量与常量' },
          { code: { lang: 'haxe', src: 'var a = 1;                  // 推断为 Int\nvar b:Float = 1.0;          // 显式类型\nvar c:String = "text";\nvar d:Bool = true;\n\nfinal LIMIT:Int = 4;        // 常量：赋值后不能再改\n\n// 多变量声明\nvar x:Float = 0, y:Float = 0;\n\n// 未赋值就是 null（HScript 里不会报错，但用起来会崩）\nvar maybe:String;' } },
          {
            table: {
              head: ['写法', '含义'],
              rows: [
                ['`var name = value`', '可变量，类型自动推断'],
                ['`var name:Type = value`', '可变量，显式类型'],
                ['`final NAME = value`', '常量，不可重新赋值（推荐用于配置）'],
                ['`name = value`', '赋值（不用再写 var）'],
                ['`a += b` `a -= b` `a *= b` `a /= b`', '复合赋值'],
                ['`a++` `a--` `++a` `--a`', '自增自减']
              ]
            }
          },
          { h4: '命名习惯' },
          { p: "变量用小驼峰 `songScore`，常量全大写 `MAX_TIME`，类名大驼峰 `FunkinSprite`。**名字里别用中文、别用 `-`**，只允许字母数字下划线和 `$`。" },

          { h: '③ 基本类型' },
          {
            table: {
              head: ['类型', '例子', '说明'],
              rows: [
                ['`Int`', '`3` `-7`', '整数（32 位）'],
                ['`Float`', '`1.5` `0.25`', '小数；写 `1.0` 不要写 `1` 当小数用'],
                ['`Bool`', '`true` `false`', '布尔'],
                ['`String`', '`"abc"`', '字符串，双引号'],
                ['`Array<T>`', '`[1, 2, 3]`', '数组'],
                ['`Map<K, V>`', '`["a" => 1]`', '键值表'],
                ['`Null<T>`', '`null`', '可为空的包装'],
                ['`Dynamic`', '任意', '关闭类型检查'],
                ['`Any`', '任意', '比 Dynamic 更安全一点'],
                ['`Void`', '无返回值', '只能用作函数返回类型'],
                ['匿名结构', '`{ x: 0, y: 0 }`', '临时对象'],
                ['函数类型', '`Int -> Void`', '把函数当值传递']
              ]
            }
          },
          { code: { lang: 'haxe', title: '匿名结构很好用（当小配置用）', src: 'var cfg = {\n\tname: "stage",\n\tzoom: 0.9,\n\ttags: ["neon", "night"]\n};\n\ntrace(cfg.name);      // stage\ntrace(cfg.zoom);      // 0.9\ncfg.zoom = 1.0;       // 可以改\n\n// 也可以当函数参数的结构\nfunction shake(opt:{strength:Float, time:Float}) {\n\tcamGame.shake(opt.strength, opt.time);\n}' } },

          { h: '④ 运算符' },
          { code: { lang: 'haxe', src: '// 算术\nvar n = 7 + 3 - 2 * 4 / 2;   // 注意优先级\nvar r = 7 % 3;               // 取余 = 1\n\n// 比较\nif (a == b) { }              // 相等\nif (a != b) { }              // 不等\nif (a > b && a < c) { }      // 与\nif (a == 1 || b == 2) { }    // 或\nif (!done) { }               // 非\n\n// 位运算（做颜色/掩码时才用）\nvar c = 0xFF << 24;\nvar has = (flags & 4) != 0;\n\n// 三元\nvar label = hp > 1 ? "safe" : "danger";\n\n// null 合并：左边是 null 就用右边\nvar v = value ?? 0;\n\n// 空安全调用：对象是 null 就整个表达式返回 null\nvar t = script?.get("x");' } },
          { callout: { kind: 'warn', title: '坑', text: "`==` 在 Haxe 里是**值比较**（字符串比内容），不是 JS 那种引用比较；但两个不同类的对象比较会编译/运行报错。不确定类型就别乱比。" } },

          { h: '⑤ 字符串' },
          { code: { lang: 'haxe', src: 'var name = "bf";\n\n// 拼接\nvar s1 = "hello " + name;\n\n// 插值（单引号字符串才支持）\nvar s2 = \'hello $name\';\nvar s3 = \'hp=${Math.round(hp * 10) / 10}\';\n\n// 常用（StringTools 已预置）\nvar a = StringTools.trim("  x  ");\nvar b = StringTools.replace("a-b", "-", "_");\nvar c = "abc".toUpperCase();\nvar d = "abc".indexOf("b");       // 1，找不到是 -1\nvar e = "abc".substr(1, 2);       // "bc"\nvar f = "a,b,c".split(",");       // ["a","b","c"]\nvar g = ["a","b"].join("-");      // "a-b"\nvar h = Std.parseInt("42");       // 42\nvar i = Std.parseFloat("1.5");    // 1.5' } },
          {
            ul: [
              "**双引号字符串不支持 `$` 插值**，要插值必须用单引号。",
              "`Std.parseInt` 失败返回 `null`，不是 0 —— 判空再算。",
              "拼数字记得转：`\"score: \" + score` 会自动转，但 `1 + 2 + \"\"` 是 3 不是 \"12\"。"
            ]
          },

          { h: '⑥ 数组' },
          { code: { lang: 'haxe', src: 'var a:Array<Int> = [3, 1, 2];\n\n// 读\nvar first = a[0];\nvar len = a.length;\n\n// 增删\na.push(4);            // 末尾加\na.insert(0, 9);       // 指定位置插入\na.remove(1);          // 按值删一个\na.pop();              // 删末尾\n\n// 查\nif (a.contains(2)) { }\nvar idx = a.indexOf(3);      // -1 表示没有\n\n// 遍历\nfor (v in a) trace(v);\nfor (i in 0...a.length) trace(a[i]);\n\n// 处理\nvar b = a.map(function(v) return v * 2);\nvar c = a.filter(function(v) return v > 2);\na.sort(function(x, y) return x - y);   // 升序\nvar s = a.join(", ");' } },

          { h: '⑦ Map 与键值表' },
          { code: { lang: 'haxe', src: 'var m:Map<String, Int> = ["hp" => 2, "combo" => 0];\n\n// 写\nm["hp"] = 3;\nm.set("misses", 0);\n\n// 读（不存在返回 null）\nvar hp = m["hp"];\nif (m.exists("hp")) { }\n\n// 删\nm.remove("hp");\n\n// 遍历（键 => 值）\nfor (key => value in m)\n\ttrace(key + " = " + value);\n\n// 只遍历键\nfor (key in m.keys()) { }' } },
          { p: "`Map` 的键可以是 `String`、`Int`、枚举等；**不要用对象当键**（会按引用比较，基本查不到）。" },

          { h: '⑧ 条件与 switch' },
          { code: { lang: 'haxe', src: '// if / else if / else\nif (health <= 0) {\n\tgameOver();\n} else if (health < 0.5) {\n\tcamGame.shake(0.01, 0.2);\n} else {\n\t// 正常\n}\n\n// switch：可以是数字、字符串、枚举\nswitch (curRating) {\n\tcase "sick":\n\t\tscore += 350;\n\tcase "good":\n\t\tscore += 200;\n\tdefault:\n\t\tscore += 50;\n}\n\n// 多值合一\nswitch (diff) {\n\tcase "easy", "normal": trace("普通难度");\n\tcase "hard", "erect": trace("高难");\n\tdefault: trace("未知难度");\n}' } },

          { h: '⑨ 循环' },
          { code: { lang: 'haxe', src: '// 计数循环：0,1,2,3（不含 4）\nfor (i in 0...4) { }\n\n// 含末尾：0..4\nfor (i in 0...5) { }\n\n// 倒着\nvar i = 4;\nwhile (i >= 0) { i--; }\n\n// 先做后判\ndo { i++; } while (i < 3);\n\n// 遍历集合\nfor (note in playerStrums.members) note.alpha = 0.5;\n\n// 跳过 / 中断\nfor (i in 0...10) {\n\tif (i % 2 == 0) continue;   // 跳过本次\n\tif (i > 7) break;           // 结束循环\n}' } },

          { h: '⑩ 函数' },
          { code: { lang: 'haxe', src: '// 无返回值\nfunction sayHello(name:String):Void {\n\ttrace("hello " + name);\n}\n\n// 有返回值\nfunction add(a:Int, b:Int):Int {\n\treturn a + b;\n}\n\n// 默认参数\nfunction zoomTo(value:Float = 1.0):Void {\n\tFlxG.camera.zoom = value;\n}\nzoomTo();        // 用默认值\nzoomTo(1.3);     // 传值\n\n// 匿名函数（lambda）\nvar double = function (v:Int) return v * 2;\ntrace(double(4));\n\n// 把函数当参数传（回调，很常用）\nfunction apply(f:Int->Int, v:Int) return f(v);\ntrace(apply(double, 5));\n\n// 闭包：内部函数记住外部变量\nfunction makeCounter() {\n\tvar n = 0;\n\treturn function () return ++n;\n}\nvar c = makeCounter();\ntrace(c()); // 1\ntrace(c()); // 2' } },
          { callout: { kind: 'tip', title: '写回调的两种姿势', text: "短逻辑用一行 lambda（`function(v) return v*2`），长逻辑先定义具名函数再传名字。别在循环里反复创建 lambda，会一直分配新对象。" } },

          { h: '⑪ 类与对象' },
          { code: { lang: 'haxe', src: '// 用现成的类\nvar spr = new FlxSprite(100, 200);\nadd(spr);\n\n// 访问字段 / 调方法\nspr.x = 120;\nspr.alpha = 0.5;\nspr.playAnim("idle");\n\n// 静态 vs 实例\nFlxG.camera.zoom = 1.2;      // FlxG 是静态类，直接用\nspr.scale.set(2, 2);          // spr 是实例\n\n// 判断类型\nif (spr is FlxSprite) { }' } },
          { p: "HScript 里**也可以自己写 class**（依赖编译开关 `CUSTOM_CLASSES`，发行版默认开启），但多数 mod 用不到：" },
          { code: { lang: 'haxe', title: '在脚本里定义并使用一个自定义类', src: 'class Wave {\n\tpublic var amp:Float;\n\tpublic var phase:Float = 0;\n\n\tpublic function new(amp:Float) {\n\t\tthis.amp = amp;\n\t}\n\n\tpublic function value(t:Float):Float {\n\t\treturn Math.sin(t * 3 + phase) * amp;\n\t}\n}\n\nvar w = new Wave(0.02);\nfunction update(elapsed:Float) {\n\tw.phase += elapsed;\n\tcamGame.x = w.value(Conductor.songPosition / 1000) * 100;\n}' } },

          { h: '⑫ 继承与接口（进阶但要知道）' },
          { code: { lang: 'haxe', src: '// 继承：拿到父类的字段和方法\nclass Boss extends Character {\n\toverride public function playAnim(name:String, ?force:Bool, ctx = NONE, rev = false, frame = 0) {\n\t\t// 先做自己的事\n\t\tif (name == "singUP") name = "singUP-alt";\n\t\tsuper.playAnim(name, force, ctx, rev, frame);\n\t}\n}\n\n// 接口：只约定方法签名，不实现\nclass Damageable implements IDamageable {\n\tpublic var hp:Float = 100;\n\tpublic function damage(v:Float) { hp -= v; }\n}' } },

          { h: '⑬ 包与 import' },
          { p: "大多数常用类（`FlxG`、`Paths`、`PlayState`、`Conductor`…）已经被引擎预置成全局变量，**不用 import**。只有少数要显式导入：" },
          { code: { lang: 'haxe', src: '// 单个类\nimport funkin.backend.utils.WindowUtils;\nimport funkin.backend.utils.NdllUtil;\n\n// 起别名（避免重名）\nimport funkin.game.Character as Char;\n\n// 整个包（慎用，容易撞名）\nimport flixel.tweens.*;\n\n// 用别名 / 原名调用\nWindowUtils.setResolution(1600, 900);' } },
          {
            table: {
              head: ['已经预置（直接写）', '需要 import'],
              rows: [
                ['`FlxG` `FlxSprite` `FlxText` `FlxCamera` `FlxTween` `FlxEase` `FlxTimer` `FlxSound` `FlxMath`', '`WindowUtils`'],
                ['`Paths` `Conductor` `Options` `Flags` `CoolUtil` `engine`', '`NdllUtil`'],
                ['`PlayState` `Character` `Note` `Strum` `StrumLine` `Stage` `GameOverSubstate`', '`ZipUtil`（部分平台）'],
                ['`FunkinShader` `FunkinSprite` `Alphabet` `FunkinText` `FlxAnimate`', '`flixel.addons.*` 具体类'],
                ['`Std` `Math` `Reflect` `StringTools` `Json` `Xml` `Type` `Lambda` `Sys` `Date`', '`lime.*` / `openfl.*` 具体类'],
                ['`state` `window` `__script__` `disableScript()`', '`Week` `WeekData` 等工具类']
              ]
            }
          },

          { h: '⑭ null 与空安全' },
          { code: { lang: 'haxe', src: '// 判空（最常用）\nif (PlayState.instance != null) { }\nif (script != null) script.call("foo");\n\n// 空安全调用：前半是 null 就整体返回 null，不会崩\nvar anim = boyfriend?.getAnimName();\n\n// 空安全访问字段\nvar z = cam?.zoom;\n\n// null 合并给默认值\nvar speed = note?.scrollSpeed ?? 1.0;' } },
          { callout: { kind: 'warn', title: '注意', text: "HScript **不做静态空检查**。`var x:String; trace(x.length);` 会在运行时崩，且报错往往指向别处。" } },

          { h: '⑮ 让脚本「看到」游戏对象' },
          { p: "引擎给每个脚本设了一个 **parent（父对象）**。不同位置脚本的 parent 不同，能直接写的名字也不同：" },
          {
            table: {
              head: ['脚本位置', 'parent 是', '于是能直接写'],
              rows: [
                ['`songs/<歌>/scripts/*.hx`', '`PlayState`', '`boyfriend` `dad` `camGame` `health` `songScore`'],
                ['`data/stages/*.hx`', '`Stage`（注入了 PlayState 变量）', '舞台精灵名、`PlayState.SONG`'],
                ['`data/characters/*.hx`', '`Character`', '`this`（角色自己）、`playAnim(...)`'],
                ['`data/states/*.hx`', '对应 State 实例', '该 State 的字段'],
                ['`data/notes/*.hx`', '`PlayState`', '`event` 参数里的音符对象']
              ]
            }
          },
          { p: "拿不准就用全名：`PlayState.instance.health`、`PlayState.instance.boyfriend`。**全名永远不会错。**" },

          { h: '⑯ 调试' },
          { code: { lang: 'haxe', src: 'trace("普通输出");\ntrace("变量值: " + health);\ntrace(\'hp=${health} combo=${combo}\');\n\n// 对象里有什么？控制台（F2）里打：\n// help PlayState.instance' } }
        ],
        deep: [
          { h: '⑰ 泛型：类型也当参数' },
          { p: "泛型就是「这个容器装什么类型，由你指定」。它不改变运行时行为，但能让你少写一堆强转。" },
          { code: { lang: 'haxe', src: 'var nums:Array<Int> = [1, 2, 3];\nvar names:Map<String, FlxSprite> = [];\n\n// 函数也能泛型\nfunction first<T>(arr:Array<T>):Null<T> {\n\treturn arr.length > 0 ? arr[0] : null;\n}\n\nvar f = first([10, 20]);   // Int\nvar s = first(["a"]);      // String' } },
          { p: "在 HScript 里泛型**基本只是写给人看的**（解释器不校验），写了不会错，不写也不会崩。" },

          { h: '⑱ 枚举与 enum abstract' },
          { code: { lang: 'haxe', title: 'enum：一组固定取值，可以带参数', src: 'enum ItemKind {\n\tCoin;\n\tHeart(amount:Int);\n}\n\nvar k = ItemKind.Heart(2);\nswitch (k) {\n\tcase Coin: trace("硬币");\n\tcase Heart(n): trace("回血 " + n);\n}' } },
          { code: { lang: 'haxe', title: 'enum abstract：本质是整数/字符串的别名（引擎大量使用）', src: '// 引擎里 BlendMode、FlxAxes 这类都是 enum abstract\ntrace(FlxAxes.X);\ntrace(BlendMode.ADD);\n\n// 自己写一个\nenum abstract Side(Int) {\n\tvar LEFT = 0;\n\tvar DOWN = 1;\n\tvar UP = 2;\n\tvar RIGHT = 3;\n}\n\nvar side:Side = Side.LEFT;' } },
          { p: "引擎里很多「看起来像字符串」的参数其实是 enum abstract。**传字符串通常也能用**（引擎会转），但传错大小写就会静默失败。" },

          { h: '⑲ 异常处理' },
          { code: { lang: 'haxe', src: 'try {\n\tvar data = Json.parse(Assets.getText("data/config/my.json"));\n\ttrace(data.name);\n} catch (e:Dynamic) {\n\ttrace("解析失败: " + e);\n}\n\n// 也可以主动抛\n// throw "something wrong";' } },
          { callout: { kind: 'warn', title: '别滥用', text: "`try/catch` 会把真正的 bug 一起吞掉。只在「外部文件可能不存在 / 格式可能不对」的地方用。" } },

          { h: '⑳ 作用域' },
          { code: { lang: 'haxe', src: 'var outer = 1;          // 整个脚本可见\n\nfunction foo() {\n\tvar inner = 2;      // 只在 foo 内可见\n\touter = 3;          // 能改外层的\n\treturn inner;\n}\n\n// 块级作用域\nif (true) {\n\tvar blockOnly = 4;  // HScript 里其实还是函数级，别依赖这个\n}\n\n// 闭包能记住外层变量\nvar n = 0;\nvar f = function () return ++n;' } },

          { h: '㉑ HScript 与真 Haxe 的差异（重点）' },
          {
            table: {
              head: ['特性', 'Haxe（源码）', 'HScript（你的脚本）'],
              rows: [
                ['package / class 包裹', '必须有', '**不能有**（顶层直接写）'],
                ['类型检查', '编译期严格', '运行时宽松，写错多半静默变 null'],
                ['`#if` 条件编译', '支持', '支持（引擎会把编译 define 传进去）'],
                ['泛型', '真正生效', '基本只是注释'],
                ['`abstract` 自定义抽象', '支持', '受限（`HSCRIPT_ABSTRACT_SUPPORT`）'],
                ['运算符重载', '支持', '不支持'],
                ['内联 / 宏', '支持', '不支持'],
                ['访问修饰符', '`public` / `private`', '只有 `public` 有意义（跨脚本共享）'],
                ['`static var`', '类级', '全局共享，**切 mod 会清空**'],
                ['性能', '原生编译', '解释执行，热点代码要省着写']
              ]
            }
          },
          { p: "另外 HScript 还额外给了几个「不是 Haxe 原生」的便利：" },
          {
            ul: [
              "**`public var` 跨脚本共享**：同一首歌的所有脚本共用一张 public 表。",
              "**`static var` 全局共享**：跨歌曲、跨状态，切 mod 时清空。",
              "**`is` 判断类型**、**Map 可迭代**、**`?.` 空安全**。",
              "**`import` 可以引脚本**：把另一个 `.hx` 当模块用。",
              "**`disableScript()`**：脚本自己把自己关掉。"
            ]
          },

          { h: '㉒ 生命周期与执行顺序' },
          {
            ol: [
              "文件被读取 → 顶层语句按顺序执行（变量、常量初始化）。",
              "`create()` —— 对象还没建好，别在这里碰 `boyfriend`。",
              "`postCreate()` —— 对象齐全，适合改初始状态。",
              "`update(elapsed)` → `postUpdate(elapsed)` —— 每帧。",
              "`stepHit / beatHit / measureHit` —— 按拍点。",
              "`destroy()` —— 销毁前清理（**不是** `onDestroy`）。"
            ]
          },
          { callout: { kind: 'warn', title: '90% 的崩溃来自这里', text: "在 `create()` 里访问 `boyfriend` / `dad` / `camGame`。这几个要到 `postCreate()` 才保证存在。" } },

          { h: '㉓ 常见错误对照表' },
          {
            table: {
              head: ['现象', '原因', '改法'],
              rows: [
                ['脚本一点反应都没有', '把代码包进了 `class {}`', '去掉 class，顶层直接写'],
                ['`Cannot access field` 崩溃', '在 `create` 里访问未生成对象', '改到 `postCreate`'],
                ['数值变成 null', '`Std.parseInt` 失败返回 null', '判空 + 给默认值'],
                ['字符串插值不生效', '用了双引号', '改单引号 `\'$x\'`'],
                ['改了变量没效果', '改的是副本 / 或该字段每帧被覆盖', '改到 `update` 里每帧写，或改底层字段'],
                ['跨脚本读不到变量', '没有 `public`', '声明成 `public var`'],
                ['切 mod 后报错', '`static var` 被清空了', '别用 static 存持久数据'],
                ['函数没被调用', '回调名拼错（大小写）', '对照本文的回调表']
              ]
            }
          },

          { h: '㉔ 写脚本的三个习惯' },
          {
            ul: [
              "**所有可能为 null 的东西先判空**，尤其是 `PlayState.instance` 和 `?.` 拿到的值。",
              "**重计算别塞进 `update`**：用 `FlxTimer`、按拍触发、或加个 `if (dirty)` 开关。",
              "**改引擎状态前先想：重开怎么办？** 需要在 `destroy()` 里还原的，就别偷懒。"
            ]
          }
        ]
      },

      /* ------------------------------------------------ 19 */
      {
        id: 'shaders',
        num: '19',
        title: '着色器（Shader）专项',
        en: 'SHADERS / .FRAG',
        tags: ['GLSL', '.frag', '特效', 'FunkinShader'],
        simple: [
          { p: "着色器就是「**对画面的每一个像素做一次数学运算**」的小程序。它能让画面变模糊、变扭曲、加扫描线、加色差、加暗角 —— 游戏里那些「看起来不像 Flixel 能做出来的效果」，基本都是它。" },
          { p: "在 Codename 里做着色器只要两步：**写一个 `.frag` 文件**，**在脚本里 new 出来挂到相机或精灵上**。" }
        ],
        core: [
          { h: '规则：外部着色器只认 `.frag`' },
          { p: "**着色器文件格式只认 `.frag`。** 你要做的特效，全部写在一个 `.frag` 文件里，放在 `assets/shaders/`（或 mod 的 `shaders/`）下，文件名就是它的 ID。引擎内部虽然也有顶点着色器的通道，但那属于引擎自己的高级用法；对写 mod 的人来说，**一个 `.frag` 就够了**，不要指望靠额外文件才生效。" },
          { callout: { kind: 'info', title: '为什么强调这点', text: "很多人从 ShaderToy 抄代码，抄完发现要拆成 vert + frag 两个文件，然后就卡住了。Codename 的约定是：**你只写 fragment，顶点那部分引擎已经帮你处理好了**。" } },

          { h: '编写流程（五步）' },
          {
            ol: [
              "在 `assets/shaders/` 下新建 `myShader.frag`。",
              "第一行写 `#pragma header`（**必须**，否则会崩或编译失败）。",
              "写 `void main() { ... }`，用 `openfl_TextureCoordv` 取当前像素坐标，用 `flixel_texture2D(bitmap, uv)` 取颜色。",
              "需要从脚本传参数就用 `uniform`（比如 `uniform float intensity;`）。",
              "把结果写进 `gl_FragColor`。"
            ]
          },
          { p: "最小可用模板（能跑、什么都不改）：" },
          { code: { lang: 'glsl', title: 'assets/shaders/passthrough.frag', src: '#pragma header\n\nvoid main() {\n\tvec2 uv = openfl_TextureCoordv;\n\tvec4 col = flixel_texture2D(bitmap, uv);\n\tgl_FragColor = col;\n}' } },

          { h: '怎么用（调用方法）' },
          { code: { lang: 'haxe', title: '把着色器挂到相机 / 精灵上', src: '// 挂到游戏相机（影响场景，不影响 UI）\ncamGame.addShader(FunkinShader.fromFile(\"myShader\"));\n\n// 挂到 HUD 相机（影响分数、血条、音符）\ncamHUD.addShader(FunkinShader.fromFile(\"myShader\"));\n\n// 挂到整个游戏（跨状态保留，慎用）\nFlxG.game.addShader(FunkinShader.fromFile(\"myShader\"));\n\n// 只挂到一个精灵上（一个精灵同时只能有一个 shader）\nboyfriend.shader = FunkinShader.fromFile(\"myShader\");' } },
          {
            kv: [
              ['加载方式 A（推荐）', '`FunkinShader.fromFile(\"名字\")` —— 名字不带 `.frag`'],
              ['加载方式 B（旧写法）', '`new CustomShader(\"名字\")` —— 仍可用，但已标记弃用'],
              ['传参', '直接赋值：`shader.intensity = 0.5;`；vec2/vec3 用数组：`shader.offset = [0.01, 0.0];`'],
              ['移除', '`camGame.removeShader(shader);` 或 `sprite.shader = null;`'],
              ['动态更新', '在 `update()` 里改变量即可，下一帧生效']
            ]
          },

          { h: '完整示例：扫描线 + 染色' },
          { code: { lang: 'glsl', title: 'assets/shaders/scanline.frag', src: '#pragma header\n\nuniform float strength;    // 扫描线强度 0.0 ~ 1.0\nuniform float count;       // 扫描线数量，比如 180.0\nuniform vec3  tint;        // 染色目标色\nuniform float tintAmount;  // 染色比例 0.0 ~ 1.0\n\nvoid main() {\n\tvec2 uv = openfl_TextureCoordv;\n\tvec4 col = flixel_texture2D(bitmap, uv);\n\n\t// 扫描线：纵向周期性压暗\n\tfloat wave  = sin(uv.y * count * 3.14159265);\n\tfloat shade = 1.0 - strength * (0.5 + 0.5 * wave);\n\tcol.rgb *= shade;\n\n\t// 染色\n\tcol.rgb = mix(col.rgb, col.rgb * tint, tintAmount);\n\n\tgl_FragColor = col;\n}' } },
          { code: { lang: 'haxe', title: 'songs/mysong/scripts/crt.hx', src: 'var crt:FunkinShader = null;\n\nfunction postCreate() {\n\t// 尊重玩家的「游戏内着色器」开关\n\tif (!Options.gameplayShaders) return;\n\n\tcrt = FunkinShader.fromFile(\"scanline\");\n\tcrt.strength = 0.35;\n\tcrt.count = 180.0;\n\tcrt.tint = [0.75, 0.95, 1.0];\n\tcrt.tintAmount = 0.25;\n\tcamGame.addShader(crt);\n}\n\nfunction destroy() {\n\tif (crt != null) camGame.removeShader(crt);\n}' } },

          { h: '带时间与动态参数的例子' },
          { code: { lang: 'glsl', title: 'assets/shaders/wobble.frag', src: '#pragma header\n\nuniform float time;\nuniform float amplitude;\nuniform float frequency;\n\nvoid main() {\n\tvec2 uv = openfl_TextureCoordv;\n\n\t// 横向正弦扭曲\n\tuv.x += sin(uv.y * frequency + time * 3.0) * amplitude;\n\n\tvec4 col = flixel_texture2D(bitmap, uv);\n\tgl_FragColor = col;\n}' } },
          { code: { lang: 'haxe', title: '驱动它', src: 'var wobble:FunkinShader = null;\n\nfunction postCreate() {\n\tif (!Options.gameplayShaders) return;\n\twobble = FunkinShader.fromFile(\"wobble\");\n\twobble.amplitude = 0.004;\n\twobble.frequency = 30.0;\n\twobble.time = 0.0;\n\tcamGame.addShader(wobble);\n}\n\nfunction update(elapsed:Float) {\n\tif (wobble == null) return;\n\t// 用歌曲时间而不是真实时间，暂停时特效也会停\n\twobble.time = Conductor.songPosition / 1000.0;\n}' } },
          { callout: { kind: 'tip', title: '性能建议', text: "相机级别的 shader 是**全屏逐像素**运算。一个还行，三个就掉帧。上了 shader 的关卡，建议在设置里把「游戏内着色器」做成可关闭，玩家低配机器能自救。" } }
        ],
        deep: [
          { h: '可用变量与函数（header 提供的）' },
          {
            table: {
              head: ['名字', '类型', '说明'],
              rows: [
                ['`openfl_TextureCoordv`', 'vec2', '当前像素的 UV（0~1）'],
                ['`openfl_TextureSize`', 'vec2', '贴图尺寸（像素）'],
                ['`openfl_Alphav`', 'float', '当前 alpha'],
                ['`openfl_ColorMultiplierv`', 'vec4', '颜色乘算（Flixel 染色）'],
                ['`openfl_ColorOffsetv`', 'vec4', '颜色加算（Flixel 调色）'],
                ['`bitmap`', 'sampler2D', '被处理的贴图'],
                ['`flixel_texture2D(bitmap, uv)`', 'vec4', '**推荐**：取色并自动套用 Flixel 的染色/alpha'],
                ['`texture2D(bitmap, uv)`', 'vec4', '原生取色，不套 Flixel 变换'],
                ['`getCamPos(uv)`', 'vec2', '把屏幕 UV 映射到相机坐标系'],
                ['`camToOg(uv)`', 'vec2', '反向映射'],
                ['`textureCam(bitmap, pos)`', 'vec4', '在相机坐标系里取色'],
                ['`map(v, a, b, c, d)`', 'float', '数值区间映射'],
                ['`_camSize`', 'vec4', '相机尺寸']
              ]
            }
          },
          { p: "用 `flixel_texture2D` 而不是 `texture2D`，是为了让「角色受击变红」这类 Flixel 内置效果在你自己的 shader 里也能正常显示。" },

          { h: '兼容性红线（官方 Wiki 强调过，这里再列一遍）' },
          {
            ul: [
              "**浮点数必须带小数点**：写 `1.0` 不要写 `1`；`0.5` 不要写 `.5`。AMD 显卡对省略写法不友好。",
              "**不要用 `switch`**，用 `if`。macOS 上 switch 有问题。",
              "**不要用 `ivec2/3/4`、`bvec2/3/4`、`uvec*`、`uint`**。",
              "**不要用数组**。",
              "**不要用 `%`**，用 `mod()`。",
              "**变量名别用 `input` / `sample`**，AMD 驱动会挂。",
              "**全局变量不能用运行时值初始化**（`openfl_TextureCoordv` 只能在 `main()` 里用），移动端/网页尤其严格。",
              "**uniform 别在声明时写默认值**，在脚本里赋值。",
              "**不要在变量名前加 `gl_`**。"
            ]
          },

          { h: '从 ShaderToy 移植的三步替换' },
          {
            ol: [
              "`void mainImage(out vec4 fragColor, in vec2 fragCoord)` → `void main()`。",
              "`vec2 uv = fragCoord / iResolution.xy` → `vec2 uv = openfl_TextureCoordv`（如果原代码要用像素坐标，就在 main 里写 `vec2 fragCoord = openfl_TextureCoordv * openfl_TextureSize`）。",
              "`texture(iChannel0, uv)` → `flixel_texture2D(bitmap, uv)`；`fragColor = col` → `gl_FragColor = col`。"
            ]
          },
          { p: "另外 ShaderToy 里常见的 `iTime` / `iMouse` 需要你自己用 uniform 从脚本喂进去。" },

          { h: '给不同对象挂 shader 的区别' },
          {
            table: {
              head: ['挂在哪', '影响范围', '典型用途'],
              rows: [
                ['`camGame`', '场景（舞台+角色）', '色差、暗角、扭曲'],
                ['`camHUD`', 'UI（音符、分数、血条）', '屏幕抖动、故障风'],
                ['`FlxG.game`', '整个窗口，跨状态', '全局滤镜（慎用，容易忘删）'],
                ['`sprite.shader`', '单个精灵', '角色发火、图标发光'],
                ['`FlxG.camera`', '默认相机（等于 camGame 的底层）', '少见，一般用 camGame']
              ]
            }
          },
          { h: '调试技巧' },
          {
            ul: [
              "shader 编译失败不会崩游戏，但会**静默不生效** —— 先看日志里有没有 `[Shader]` 开头的错误。",
              "排查时先把 `main` 写成 `gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);`，全屏变红说明 shader 确实挂上了。",
              "`Flags.SHADERS_CACHE_RESET_ON_SWITCH_STATE = true` 可以在切状态时重编译 shader，改代码后不用重启（开发期用）。",
              "`#pragma header` 漏了 → 大概率直接崩或者画面全黑。"
            ]
          }
        ]
      },

      /* ------------------------------------------------ 20 */
      {
        id: 'ndll',
        num: '20',
        title: 'NDLL 专项：调用原生扩展',
        en: 'NDLL / NATIVE EXTENSIONS',
        tags: ['ndll', 'CFFI', '原生', 'Windows'],
        simple: [
          { p: "`ndll` 就是一个**用 C++ 写出来的动态库**（Windows 上是 `.dll`，改个名字叫 `.ndll`）。它能做 Haxe 做不到的事：读注册表、调系统 API、跑高性能计算。" },
          { p: "你不需要会写 C++ —— 大多数情况下你只是**调用别人写好的 ndll**。" }
        ],
        core: [
          { h: '它是什么' },
          { p: "NDLL = **N**eko **D**ynamic **L**ibrary。在 hxcpp（Haxe 的 C++ 后端）里，它就是一个导出了若干 C 函数的动态库。引擎通过 Lime 的 `CFFI` 按名字 + 参数个数把函数取出来，包装成一个可以在脚本里直接调用的函数。" },
          { p: "引擎对它的支持由编译开关 `NDLLS_SUPPORTED` 控制（web / hl 平台默认关闭）。" },

          { h: '格式要求（必须严格遵守）' },
          {
            table: {
              head: ['要求', '细节'],
              rows: [
                ['命名', '`<名字>-windows.ndll` / `<名字>-linux.ndll` / `<名字>-mac.ndll`'],
                ['位置', '放在 mod 的 `ndlls/` 目录（不是 `assets/`）'],
                ['架构', '必须和引擎一致（x64 对 x64，32 位对 32 位）'],
                ['运行时', '必须用**同版本 hxcpp** 编译，否则 CFFI 结构体对不上会直接崩'],
                ['导出', '用 `DEFINE_PRIM(函数名, 参数个数)` 导出，否则找不到'],
                ['数量', '参数个数最多 25 个（引擎侧限制）']
              ]
            }
          },
          { callout: { kind: 'warn', title: '踩坑预警', text: "ndll 加载失败通常**不会给出明确错误**，只会「函数返回空」。所以先确认文件名、位数、hxcpp 版本三件事。" } },

          { h: '怎么调用' },
          { code: { lang: 'haxe', title: '调用一个名为 mymath 的 ndll 里的 add 函数', src: 'import funkin.backend.utils.NdllUtil;\n\nfunction create() {\n\t// 参数：ndll 名、函数名、参数个数\n\tvar addFn = NdllUtil.getFunction(\"mymath\", \"add\", 2);\n\n\tvar result = addFn(21, 21);\n\ttrace(\"原生函数返回: \" + result);\n}' } },
          {
            kv: [
              ['路径规则', '`NdllUtil` 会自动在名字后面拼 `-windows` / `-linux` / `-mac`，再拼 `.ndll`'],
              ['所以文件要叫', '`ndlls/mymath-windows.ndll`'],
              ['找不到时', '返回一个「空函数」，调用不崩、但什么也不做，日志里会有一条警告'],
              ['参数个数', '必须和 ndll 里导出时声明的一致，否则取不到函数']
            ]
          },

          { h: '完整示例：带返回值的字符串处理' },
          { code: { lang: 'haxe', title: 'data/scripts/native.hx', src: 'import funkin.backend.utils.NdllUtil;\n\nvar toUpper:Dynamic = null;\n\nfunction postCreate() {\n\t// 假设 ndll 里导出了 DEFINE_PRIM(my_upper, 1)\n\ttoUpper = NdllUtil.getFunction(\"mystring\", \"my_upper\", 1);\n\n\tvar input:String = \"codename engine\";\n\tvar output:Dynamic = toUpper(input);\n\ttrace(\"转换结果: \" + output);\n}' } },
          { p: "对应的 C++ 侧大概长这样（了解即可，不用会写）：" },
          { code: { lang: 'cpp', title: 'ndll 源码示意（hxcpp CFFI）', src: '#include <hx/CFFI.h>\n\nvalue my_upper(value str) {\n    const char* s = val_string(str);\n    // ... 转大写 ...\n    return alloc_string(result);\n}\n\nDEFINE_PRIM(my_upper, 1);' } },
          { p: "编译产物是 `mystring.dll`，把它改名成 `mystring-windows.ndll`，放进 `mods/你的mod/ndlls/`。" },

          { h: '不用 NdllUtil 的备选写法' },
          { code: { lang: 'haxe', title: '直接走 Lime CFFI（更底层）', src: 'import lime.system.CFFI;\n\nfunction create() {\n\tvar path = Assets.getPath(\"ndlls/mymath-windows.ndll\");\n\tvar fn = CFFI.load(path, \"add\", 2);\n\tif (fn != null) trace(fn(1, 2));\n\telse trace(\"加载失败\");\n}' } },
          { callout: { kind: 'info', title: '推荐', text: "优先用 `NdllUtil.getFunction`：它帮你处理了平台后缀、缺失文件、异常，容错更好。" } }
        ],
        deep: [
          { h: '为什么 ndll 特别容易崩' },
          { p: "CFFI 的函数签名是**按参数个数**匹配的。Haxe 侧只知道「有 2 个参数的函数」，不知道类型。如果你传了 `Int` 而 ndll 期待 `String`，不会报错，而是把整数当指针用 —— 直接段错误。所以：" },
          {
            ul: [
              "ndll 的作者必须在文档里写清楚每个函数的参数类型与个数。",
              "调用时参数个数、顺序、类型必须完全一致。",
              "返回值同理：返回 `value` 的东西不能当 `String` 直接用时要 `.getStr()` 之类处理。"
            ]
          },
          { h: '平台差异' },
          {
            table: {
              head: ['平台', '文件后缀', '备注'],
              rows: [
                ['Windows', '`-windows.ndll`', '本质是 `.dll`，可能需要 VC++ 运行库'],
                ['Linux', '`-linux.ndll`', '本质是 `.so`'],
                ['macOS', '`-mac.ndll`', '本质是 `.dylib`，还要过签名/隔离'],
                ['Web / HashLink', '不支持', '`NDLLS_SUPPORTED` 在这些平台被禁用']
              ]
            }
          },
          { h: '安全提醒' },
          { p: "ndll 是**任意原生代码**。你从网上下载的 mod 里带 ndll，等于让它的作者在你的电脑上执行任意程序。只运行来源可信的 ndll；不确定就用沙箱/虚拟机跑一遍。" },
          { h: '我自己要写一个怎么办' },
          {
            ol: [
              "装 hxcpp，新建一个 Haxe 的 C++ 项目。",
              "在 `ExternalInterface.cpp` 里用 `DEFINE_PRIM` 导出函数。",
              "用和引擎相同版本的 hxcpp 编译。",
              "把产物改名成 `<名字>-<平台>.ndll`，放进 `ndlls/`。",
              "在脚本里用 `NdllUtil.getFunction` 调。"
            ]
          },
          { p: "官方有一个 `ndll-example` 仓库专门演示这件事，建议直接照抄结构。" }
        ]
      },

      /* ------------------------------------------------ 21 */
      {
        id: 'three-d',
        num: '21',
        title: '3D 外部代码与模型加载',
        en: '3D / FOXLITE',
        tags: ['3D', 'foxlite', 'OBJ', '模型'],
        simple: [
          { p: "Codename 能跑 3D，靠的是 **foxlite** —— 一个给 HaxeFlixel 用的 3D 渲染器。你不需要装任何东西，引擎已经内置了（编译开关 `THREE_D_SUPPORT`）。" },
          { p: "用法：**一个场景 + 一个相机 + 一个模型**，然后把场景当普通精灵 add 进游戏。" }
        ],
        core: [
          { h: '3D 是「外部代码」' },
          { p: "**3D 不是引擎自带的一套「3D 舞台系统」**，它是一组**外部脚本接口**。引擎把 foxlite 的类注册成了脚本里的全局名字（`FoxScene`、`FoxCamera`、`FoxModel`、`FoxOBJLoader`…），你在 `.hx` 里自己 new、自己管。历史上有过 `away3d` / `flx3d` 的方案，现在这一版用的是 **foxlite**。" },
          {
            table: {
              head: ['脚本里能直接用的 3D 类', '作用'],
              rows: [
                ['`FoxScene`', '3D 世界容器（本身是个 FlxSprite，可以 add 进游戏）'],
                ['`FoxCamera`', '3D 相机（透视/正交，有 fov、near、far）'],
                ['`FoxFPSCamera`', '第一人称相机（WASD 移动那种）'],
                ['`FoxModel`', '模型（可以 loadOBJ / loadJSON，可以多 mesh）'],
                ['`FoxOBJLoader` / `FoxMTLLoader`', '手动加载 OBJ / MTL'],
                ['`FoxMaterial`', '材质（颜色、贴图、深度测试、混合模式）'],
                ['`FoxTexture`', '贴图'],
                ['`FoxShader`', '3D 着色器'],
                ['`FoxDirectionalLight`', '平行光'],
                ['`FoxPanoramaSky`', '全景天空盒'],
                ['`FoxFunkinSprite`', '把你的 2D 精灵贴到 3D 里'],
                ['`FoxLoaderUtil`', '路径工具（可接到引擎的资源系统上）']
              ]
            }
          },

          { h: '模型格式：用 `.obj` 最省事' },
          { p: "脚本层对外暴露的加载器主要是 **OBJ + MTL** 这一套：`FoxOBJLoader.load(name)` 会同时读同名 `.mtl`（如果存在）。模型放在 `assets/models/`（mod 里就是 `models/`），路径写 `models/xxx.obj`。" },
          {
            kv: [
              ['支持', '`.obj` + 可选 `.mtl` + 贴图'],
              ['也支持', 'foxlite 自己的 JSON 模型（`model.loadJSON(...)`）'],
              ['路径', '`models/<名字>.obj`，引擎的 `Paths.obj()` 也是这个约定'],
              ['注意', 'OBJ 是**静态模型**，没有骨骼动画；要做动画得在代码里转/位移，或者用 glTF（foxlite 本体支持）']
            ]
          },

          { h: '去哪找一个通用模型' },
          { p: "不想自己建模的话，这几个都是**免费、通用、到处都有**的：" },
          {
            ul: [
              "**Blender 自带的 Suzanne（猴子头）** —— 打开 Blender → 添加 → 猴子 → 文件 → 导出 → Wavefront (.obj)。最省事，还自带 UV。",
              "**Stanford Bunny / Utah Teapot** —— 图形学界的「Hello World」，网上到处都是 OBJ 版本。",
              "**Khronos glTF Sample Models** —— 官方样例模型库（Duck、Avocado 等），有 glTF 也有转好的 OBJ。"
            ]
          },
          { p: "下面这段我直接给你一个**可以手打的立方体 OBJ**，不下载任何东西也能跑通流程：" },
          { code: { lang: 'ini', title: 'assets/models/cube.obj', src: 'mtllib cube.mtl\no Cube\nv -1.0 -1.0  1.0\nv  1.0 -1.0  1.0\nv  1.0  1.0  1.0\nv -1.0  1.0  1.0\nv -1.0 -1.0 -1.0\nv  1.0 -1.0 -1.0\nv  1.0  1.0 -1.0\nv -1.0  1.0 -1.0\nvt 0.0 0.0\nvt 1.0 0.0\nvt 1.0 1.0\nvt 0.0 1.0\nvn  0.0  0.0  1.0\nvn  0.0  0.0 -1.0\nvn  0.0  1.0  0.0\nvn  0.0 -1.0  0.0\nvn  1.0  0.0  0.0\nvn -1.0  0.0  0.0\nusemtl CubeMaterial\ns off\nf 1/1/1 2/2/1 3/3/1\nf 1/1/1 3/3/1 4/4/1\nf 6/2/2 5/1/2 8/4/2\nf 6/2/2 8/4/2 7/3/2\nf 4/1/3 3/2/3 7/3/3\nf 4/1/3 7/3/3 8/4/3\nf 5/1/4 6/2/4 2/3/4\nf 5/1/4 2/3/4 1/4/4\nf 2/1/5 6/2/5 7/3/5\nf 2/1/5 7/3/5 3/4/5\nf 5/2/6 1/1/6 4/3/6\nf 5/2/6 4/3/6 8/4/6' } },
          { code: { lang: 'ini', title: 'assets/models/cube.mtl', src: 'newmtl CubeMaterial\nKa 0.20 0.20 0.20\nKd 0.80 0.80 0.95\nKs 0.00 0.00 0.00\nd 1.0\nillum 2' } },

          { h: '完整可运行示例：把模型放进打歌界面' },
          { code: { lang: 'haxe', title: 'songs/mysong/scripts/threeD.hx', src: '// 3D 场景三件套\nvar scene:FoxScene = null;\nvar cam:FoxCamera = null;\nvar model:FoxModel = null;\n\nfunction postCreate() {\n\t// 1) 场景：尺寸一般跟游戏分辨率一致\n\tscene = new FoxScene(FlxG.width, FlxG.height);\n\tscene.screenCenter();\n\tscene.scrollFactor.set(0, 0);   // 不跟随 2D 镜头\n\tadd(scene);                      // 当普通精灵加进 PlayState\n\n\t// 2) 相机：往后退一点，不然在模型里面\n\tcam = new FoxCamera(0, 0, -6);\n\tcam.fov = 60;\n\tscene.foxCameras.push(cam);\n\n\t// 3) 模型：路径相对 assets/（mod 里就是 mod 根）\n\tmodel = new FoxModel();\n\tmodel.loadOBJ(\"models/cube.obj\");\n\tscene.add(model);\n}\n\nfunction update(elapsed:Float) {\n\tif (model == null) return;\n\n\t// 让它转起来\n\tmodel.rotationY += 40 * elapsed;\n\tmodel.rotationX += 12 * elapsed;\n}' } },
          { callout: { kind: 'tip', title: '如果画面是黑的', text: "按顺序查：① `scene` 有没有 `add()`；② `cam` 有没有 `push` 进 `scene.foxCameras`；③ 相机 z 是不是在模型外侧（模型在原点，相机 z 要更负或更正）；④ `loadOBJ` 的路径对不对（大小写！Linux 上区分）。" } }
        ],
        deep: [
          { h: '把 OBJ 换成你自己的模型' },
          {
            ol: [
              "Blender 里选中模型 → 文件 → 导出 → Wavefront (.obj)。",
              "导出选项勾上 **Triangulated Mesh**（foxlite 只吃三角面）。",
              "勾上 **Write Materials**，会同时导出 `.mtl`。",
              "把 `.obj` / `.mtl` / 贴图一起放到 `assets/models/`（贴图路径要对）。",
              "脚本里把 `models/cube.obj` 换成你的文件名。"
            ]
          },
          { p: "模型太大/太小怎么办？两个办法：`model.scale` 直接缩放，或者在 `FoxModel` 外面套一层父对象做变换。前者改的是变换矩阵，不改顶点数据，很便宜。" },

          { h: '相机与投影' },
          {
            kv: [
              ['`fov`', '视野角度，默认 90。越小越「长焦」，越大越「广角鱼眼」'],
              ['`near` / `far`', '近/远裁剪面。模型被切掉一半时调这两个'],
              ['`orthogonal`', '正交投影（没有近大远小），做 2.5D 时有用'],
              ['`bgColor`', '相机背景色'],
              ['`passes`', '渲染通道，想做后处理（bloom/描边）就在这里加'],
              ['`projectionOrigin`', '投影原点，用来做偏移视角']
            ]
          },
          { p: "相机坐标系的约定：**相机在 z 轴负方向看向原点**。所以 `new FoxCamera(0, 0, -6)` 表示「站在 z=-6，往 +z 看」。模型在原点，就正好在视野中央。" },

          { h: '和 2D 混排' },
          { p: "`FoxScene` 是 `FlxSprite` 的子类，所以它的层级完全由你 `add()` 的顺序决定。想让它盖住舞台但被 HUD 盖住，就把 `add(scene)` 放在角色之后、`camHUD` 的东西之前（HUD 是另一个相机，天然在上面）。" },
          { p: "反过来，如果你想让 2D 精灵出现在 3D 里面，用 `FoxFunkinSprite` —— 它会把一个 `FlxAnimate` 精灵当成贴图贴进 3D 场景（要求精灵开了 `useRenderTexture` 并挂着一个 shader）。" },

          { h: '性能与兼容' },
          {
            ul: [
              "3D 会**额外开一个 framebuffer**，每个相机一次。多相机 = 多倍开销。",
              "模型的三角面数量是主要瓶颈，几千面没问题，几十万面就开始掉帧。",
              "某些老显卡/核显的 OpenGL ES 支持不全，`foxlite` 会退化甚至黑屏 —— 做 3D mod 建议在设置里留一个开关。",
              "`THREE_D_SUPPORT` 如果被发行版关掉，脚本里的 `FoxScene` 会直接不存在，**记得判空或用 `#if` 保护**。"
            ]
          },
          { h: 'glTF 怎么办' },
          { p: "foxlite 本体支持 glTF 2.0（含骨骼动画、`.glb`、embedded glTF），但**脚本层暴露出来的加载器别名是 OBJ/MTL 这一套**。所以：想做带骨骼的角色动画，要么用 `FoxLoaderUtil` 自己接，要么等引擎把 glTF 加载器也暴露出来。稳妥起见，**先做 OBJ**。" }
        ]
      },

      {
        id: 'window-commands',
        num: '22',
        title: '命令代码：从脚本指挥引擎',
        en: 'COMMANDS',
        tags: ['窗口', '分辨率', '音量', '状态', '控制台', '系统'],
        simple: [
          { p: "「命令代码」指的是：**你写一行，引擎立刻照做**的那类调用。改窗口大小只是其中一种 —— 还有音量、帧率、全屏、跳状态、开控制台命令、弹系统对话框……" },
          {
            table: {
              head: ['你想干什么', '用哪个'],
              rows: [
                ['改窗口大小 / 标题', '`WindowUtils`'],
                ['全屏 / 缩放', '`FlxG.fullscreen`、`camGame.zoom`'],
                ['改帧率', '`Options.framerate` + `applySettings()`'],
                ['调音量', '`FlxG.sound.volume`'],
                ['跳界面 / 重开', '`FlxG.switchState` / `resetState`'],
                ['暂停 / 结束歌曲', '`game.pauseGame()` / `endSong()`'],
                ['跑一条控制台命令', '`ConsoleCommandManager.tryExecute`'],
                ['切 mod', '`ModsFolder.switchMod`'],
                ['开链接 / 退出', '`CoolUtil.openURL` / `Sys.exit`'],
                ['系统弹窗 / 控制台', '`NativeAPI`（Windows）']
              ]
            }
          },
          { callout: { kind: 'tip', title: '规律', text: "这类 API 几乎都是「**静态类 + 静态方法**」，直接写 `类名.方法()`，不用 new、不用 add。" } }
        ],
        core: [
          { h: '① 窗口与分辨率（最常被当成「命令代码」的代表）' },
          {
            table: {
              head: ['`WindowUtils`（需要 import）', '作用'],
              rows: [
                ['`setResolution(w, h, updateWindow?)`', '改内部渲染分辨率（并默认同步窗口大小、居中）'],
                ['`setWindow(?title, ?image)`', '同时改标题与图标'],
                ['`title` / `prefix` / `suffix`', '窗口标题的三段（改任意一段都会立即刷新）'],
                ['`updateTitle()`', '强制刷新标题'],
                ['`resetTitle()` / `resetAffixes()`', '恢复默认标题 / 清空前缀后缀'],
                ['`resetIcon()` / `setWindow(null, "icon")`', '恢复 / 设置图标'],
                ['`preventClosing` / `onClosing` / `resetClosing()`', '拦截关闭 → 用于「有未保存改动」提示']
              ]
            }
          },
          { code: { lang: 'haxe', title: '窗口相关的一整套', src: 'import funkin.backend.utils.WindowUtils;\n\nfunction postCreate() {\n\t// 分辨率（第三个参数 false = 只改内部，不动窗口）\n\tWindowUtils.setResolution(1600, 900);\n\n\t// 标题三段\n\tWindowUtils.prefix = "[MY MOD] ";\n\tWindowUtils.title  = "My Mod";\n\tWindowUtils.suffix = " - test";\n\n\t// 图标（路径相对 images/，不用写扩展名）\n\tWindowUtils.setWindow(null, "icon");\n}' } },
          { p: "只想改窗口、不改画面坐标系的话，直接动系统窗口：" },
          { code: { lang: 'haxe', src: 'import openfl.Lib;\n\nfunction postCreate() {\n\tLib.application.window.resize(1600, 900);   // 只拉窗口\n\tLib.application.window.move(120, 80);        // 挪位置\n}' } },

          { h: '② 全屏与画面缩放' },
          { code: { lang: 'haxe', src: 'function toggleFS() {\n\tFlxG.fullscreen = !FlxG.fullscreen;\n}\n\nfunction zoom() {\n\tdefaultCamZoom = 0.8;   // 场景默认缩放（越小看得越远）\n\tcamGame.zoom = 0.8;\n\tcamHUD.zoom = 1.1;      // UI 放大\n}' } },
          { callout: { kind: 'warn', title: '别乱动 scaleMode', text: "引擎默认用 `FunkinRatioScaleMode`（16:9 + 黑边）。改 `FlxG.scaleMode` 很容易在所有分辨率上崩布局，除非你确定要自己做拉伸。" } },

          { h: '③ 帧率与时间' },
          { code: { lang: 'haxe', src: '// 直接改引擎设置（推荐，会存盘）\nOptions.framerate = 240;\nOptions.applySettings();\n\n// 临时改（不存盘）\nFlxG.updateFramerate = 60;\nFlxG.drawFramerate = 60;' } },
          { p: "上限是 `Options.maxFrameRate`（240）。超过它会被当成「不限制」，也就是 `0`。" },

          { h: '④ 音量与声音' },
          { code: { lang: 'haxe', src: '// 总音量\nFlxG.sound.volume = 0.5;\n\n// 只改音乐组（不影像效）\nFlxG.sound.defaultMusicGroup.volume = 0.3;\n\n// 暂停 / 继续当前音乐\nif (FlxG.sound.music != null) {\n\tFlxG.sound.music.pause();\n\t// FlxG.sound.music.resume();\n}\n\n// 静音切换\nFlxG.sound.mute = !FlxG.sound.mute;' } },

          { h: '⑤ 状态与流程命令' },
          {
            table: {
              head: ['命令', '作用'],
              rows: [
                ['`FlxG.switchState(new XxxState())`', '切界面（`FreeplayState` / `MainMenuState` / `OptionsMenu`…）'],
                ['`FlxG.resetState()`', '重建当前界面（= 按 F5 的效果）'],
                ['`openSubState(sub)` / `closeSubState()`', '打开 / 关闭子状态（暂停、弹窗）'],
                ['`game.pauseGame()`', '走暂停菜单'],
                ['`game.endSong()`', '结束本曲（走结算）'],
                ['`game.gameOver()`', '触发死亡'],
                ['`game.nextSong()`', '故事模式下一首'],
                ['`game.startCountdown()`', '重新开始倒计时']
              ]
            }
          },
          { code: { lang: 'haxe', title: '跳转示例', src: '// 回主菜单\nFlxG.switchState(new MainMenuState());\n\n// 进某首歌（先 loadSong 再 switchState，缺一不可）\nPlayState.loadSong("bopeebo", "hard", null, false, false);\nFlxG.switchState(new PlayState());\n\n// 重开\nFlxG.resetState();' } },

          { h: '⑥ 直接执行控制台命令' },
          { p: "这是最「命令」的一条：把玩家在 `F2` 控制台里敲的东西，用代码执行。" },
          { code: { lang: 'haxe', src: 'import funkin.backend.system.console.ConsoleCommandManager;\n\nfunction quickTest() {\n\t// 内置命令都能这么跑\n\tConsoleCommandManager.tryExecute("loadSong bopeebo hard");\n\tConsoleCommandManager.tryExecute("endSong");\n\tConsoleCommandManager.tryExecute("goToMainMenu");\n}' } },
          {
            kv: [
              ['可用命令', '就是第 13 节那 20 条（`loadSong` `endSong` `switchMod` `reloadState` `goTo…`）'],
              ['找不到命令时', '返回 false，不会崩'],
              ['注意', '命令里的参数用空格分隔，带空格的参数要用引号']
            ]
          },

          { h: '⑦ 切 Mod 与重载' },
          { code: { lang: 'haxe', src: 'import funkin.backend.assets.ModsFolder;\n\n// 切到某个 mod（null = 回原版），内部会重建 MainState\nModsFolder.switchMod("my-mod");\n\n// 只要重载当前界面\nFlxG.resetState();' } },

          { h: '⑧ 系统级命令' },
          {
            table: {
              head: ['命令', '作用', '平台'],
              rows: [
                ['`CoolUtil.openURL(url)`', '用系统浏览器打开链接', '全平台（桌面）'],
                ['`Sys.exit(0)`', '退出游戏', '桌面'],
                ['`Clipboard.generalClipboard.setData(...)`', '写系统剪贴板', '桌面'],
                ['`NativeAPI.allocConsole()`', '打开原生控制台窗口', '**Windows**'],
                ['`NativeAPI.showMessageBox(caption, msg, icon)`', '弹系统消息框', '**Windows**'],
                ['`NativeAPI.setDarkMode(title, enable)`', '窗口标题栏深色', '**Windows**'],
                ['`NativeAPI.setCursorIcon(icon)`', '换鼠标指针', 'Windows / Mac'],
                ['`NativeAPI.setFileAttributes(...)`', '改文件属性（隐藏/只读）', '**Windows**']
              ]
            }
          },
          { code: { lang: 'haxe', title: '系统命令示例', src: 'import funkin.backend.utils.NativeAPI;\nimport openfl.desktop.Clipboard;\n\nfunction systemStuff() {\n\tCoolUtil.openURL("https://codename-engine.com/wiki/");\n\n\t#if windows\n\tNativeAPI.showMessageBox("提示", "这是一条系统消息框");\n\tNativeAPI.setDarkMode(null, true);\n\t#end\n\n\t// 复制到剪贴板（桌面平台）\n\t// Clipboard.generalClipboard.setData(ClipboardFormats.TEXT_FORMAT, "hello");\n}' } },
          { callout: { kind: 'warn', title: '平台差异', text: "`NativeAPI` 里大量方法只在 **Windows** 有效；在其他平台上调用会静默什么都不做。跨平台 mod 记得用 `#if windows` 包起来。" } },

          { h: '⑨ 设置、存档与语言' },
          { code: { lang: 'haxe', src: '// 设置：改完要存盘 + 应用\nOptions.downscroll = true;\nOptions.save();\nOptions.applySettings();\n\n// 存档\nFlxG.save.data.myFlag = true;\nFlxG.save.flush();\n\n// 最高分\nFunkinSave.flush();\n\n// 语言\nTranslationUtil.setLanguage("en");' } },

          { h: '⑩ 一页速查' },
          {
            table: {
              head: ['目标', '一行代码'],
              rows: [
                ['窗口 1600×900', '`WindowUtils.setResolution(1600, 900)`'],
                ['只改窗口大小', '`Lib.application.window.resize(1600,900)`'],
                ['改标题', '`WindowUtils.title = "xxx"`'],
                ['全屏', '`FlxG.fullscreen = true`'],
                ['帧率 240', '`Options.framerate = 240; Options.applySettings()`'],
                ['音量 50%', '`FlxG.sound.volume = 0.5`'],
                ['回主菜单', '`FlxG.switchState(new MainMenuState())`'],
                ['重开', '`FlxG.resetState()`'],
                ['暂停', '`game.pauseGame()`'],
                ['结束歌曲', '`game.endSong()`'],
                ['跑命令', '`ConsoleCommandManager.tryExecute("endSong")`'],
                ['切 mod', '`ModsFolder.switchMod("x")`'],
                ['开链接', '`CoolUtil.openURL("https://…")`'],
                ['退出', '`Sys.exit(0)`']
              ]
            }
          }
        ],
        deep: [
          { h: '⑪ 命令的「生效时机」' },
          {
            table: {
              head: ['类型', '什么时候生效', '例子'],
              rows: [
                ['立即', '这一行执行完就生效', '`FlxG.sound.volume`、`spr.visible`'],
                ['下一帧', '下次 update/draw 才看到', '`camGame.zoom`（会被 lerp）、`health`'],
                ['需要 apply', '要调 `applySettings()`', '帧率、键位、音量组'],
                ['需要重建', '要 `resetState` / `switchState`', '切 mod、改分辨率（打歌中）'],
                ['需要重启', '要重开游戏', '改 `Flags.GAME_WIDTH` 这类编译期常量']
              ]
            }
          },
          { callout: { kind: 'warn', title: '打歌中途别改分辨率', text: "音符位置是按坐标算的，中途改会让已生成的音符错位。要改就在 `postCreate` 里改。" } },

          { h: '⑫ 危险命令清单' },
          {
            ul: [
              "`ModsFolder.switchMod(...)` —— 会销毁整个 `MainState`，当前状态里的东西全部失效，**后面别再碰旧对象**。",
              "`Sys.exit(0)` —— 不会走存档保存流程，先 `Options.save()` + `FlxG.save.flush()`。",
              "`FlxG.scaleMode = ...` —— 影响所有界面布局，改错会全屏错位。",
              "`FlxG.resetState()` —— 正在跑的脚本会全部重建，闭包状态丢失。",
              "`WindowUtils.preventClosing` —— 忘了 `resetClosing()` 的话窗口关不掉。"
            ]
          },

          { h: '⑬ 自己注册一条控制台命令' },
          { p: "除了执行内置命令，你还能注册自己的命令，让它出现在 `F2` 控制台里（只对当前 mod 有效，切 mod 自动注销）：" },
          { code: { lang: 'haxe', title: '思路（API 名称见 ConsoleCommandManager）', src: 'import funkin.backend.system.console.ConsoleCommandManager;\n\n// 具体签名：registerCommand(command)\n// 命令对象需要 name / description / 执行回调\n// 简化理解：注册后就能在控制台敲你的命令名\n\n// 想省事？直接用 HScript Call 事件或在控制台里执行 hscript\n// 控制台本身就是「命令优先，找不到就当代码执行」' } },
          { p: "如果只是想要「一条能在控制台里跑的自定义功能」，更省事的做法是把它写成脚本函数，然后在控制台里直接调用（控制台会把它当 HScript 执行）。" },

          { h: '⑭ 组合示例：一个自检面板' },
          { code: { lang: 'haxe', title: '按 F9 打印当前环境（演示多条命令组合）', src: 'function postCreate() {\n\tFlxG.keys.onKeyDown.add(function (key) {\n\t\tif (key != F9) return;\n\n\t\ttrace("=== 环境自检 ===");\n\t\ttrace("分辨率: " + FlxG.width + "x" + FlxG.height);\n\t\ttrace("窗口: " + Lib.application.window.width + "x" + Lib.application.window.height);\n\t\ttrace("帧率上限: " + Options.framerate);\n\t\ttrace("音量: " + FlxG.sound.volume);\n\t\ttrace("全屏: " + FlxG.fullscreen);\n\t\ttrace("当前 mod: " + (ModsFolder.currentModFolder ?? "(原版)"));\n\t});\n}' } }
        ]
      },

      /* ------------------------------------------------ 23 */
      {
        id: 'calling-engine',
        num: '23',
        title: '调用源码功能：隐藏、改分、进游戏',
        en: 'CALLING ENGINE FEATURES',
        tags: ['PlayState', '评分', '隐藏', '切换状态'],
        simple: [
          { p: "外部脚本最大的用处，是把引擎**已有**的功能拿来用：隐藏血条、改分数、直接跳进某首歌、让角色播某个动画。" },
          { p: "这一节讲「从外部能改什么」。**普通档里每一段都是完整代码**，可以直接粘进 `songs/<歌>/scripts/xxx.hx` 跑；这里先讲清楚有哪些能改。" }
        ],
        core: [
          { h: '隐藏界面元素' },
          { code: { lang: 'haxe', title: '隐藏 HUD / 血条 / 分数', src: 'function postCreate() {\n\t// 整个 HUD 相机（音符、分数、血条全没）\n\tcamHUD.visible = false;\n}\n\nfunction hideEverything() {\n\t// 单独隐藏\n\tscoreTxt.visible = false;\n\tmissesTxt.visible = false;\n\taccuracyTxt.visible = false;\n\thealthBar.visible = false;\n\thealthBarBG.visible = false;\n\ticonP1.visible = false;\n\ticonP2.visible = false;\n}\n\nfunction hideCharacter() {\n\tboyfriend.visible = false;\n\tdad.visible = false;\n\tgf.visible = false;\n}\n\nfunction hideStageSprite() {\n\t// 舞台精灵按 XML 里的 name 取\n\tvar bg = stage.stageSprites.get(\"bg\");\n\tif (bg != null) bg.visible = false;\n}' } },

          { h: '改分数 / 血量 / 连击' },
          { code: { lang: 'haxe', title: '直接改数值', src: 'function postCreate() {\n\t// 血量（默认上限 2.0）\n\thealth = 1.5;\n\n\t// 分数\n\tsongScore = 99999;\n\n\t// 连击与漏键\n\tcombo = 100;\n\tmisses = 0;\n}\n\n// 想让分数文字立刻更新，可以直接写文本\nfunction refreshScoreText() {\n\tscoreTxt.text = \"SCORE: \" + songScore;\n}' } },
          { code: { lang: 'haxe', title: '在命中时额外加分', src: 'function onNoteHit(event) {\n\tif (event.note != null && event.note.mustPress)\n\t\tsongScore += 100;\n}' } },
          { callout: { kind: 'warn', title: '注意', text: "分数变量叫 **`songScore`**，不是 `score`。改完不一定会立刻刷新文字（引擎在下次命中时重算），要立即显示就自己写 `scoreTxt.text`。" } },

          { h: '直接进游戏 / 进歌曲 / 进周' },
          { code: { lang: 'haxe', title: '最常用的跳转', src: '// 1) 进某首歌（最常用）\nfunction goToSong() {\n\tPlayState.loadSong(\"bopeebo\", \"hard\", null, false, false);\n\tFlxG.switchState(new PlayState());\n}\n\n// 2) 带变体 + 对手模式\nfunction goToVariant() {\n\tPlayState.loadSong(\"pico\", \"erect\", \"erect\", true, false);\n\tFlxG.switchState(new PlayState());\n}\n\n// 3) 回主菜单\nfunction backToMenu() {\n\tFlxG.switchState(new MainMenuState());\n}\n\n// 4) 回自由游玩\nfunction backToFreeplay() {\n\tFlxG.switchState(new FreeplayState());\n}' } },
          {
            kv: [
              ['`loadSong(名字, 难度, 变体, 对手模式, 双人模式)`', '**只加载数据**，不会自动切状态'],
              ['`FlxG.switchState(new PlayState())`', '真正进入打歌，必须成对使用'],
              ['`new PlayState()` 之前没 loadSong', '会崩或进空谱面']
            ]
          },

          { h: '进故事模式的某一周' },
          { code: { lang: 'haxe', src: 'import funkin.backend.week.Week;\n\nfunction startWeek() {\n\tvar week = Week.loadWeek(\"week1\");   // 周文件名，不带 .xml\n\tif (week == null) { trace(\"周不存在\"); return; }\n\n\tPlayState.loadWeek(week, \"hard\");\n\tFlxG.switchState(new PlayState());\n}' } },

          { h: '控制播放流程' },
          { code: { lang: 'haxe', src: 'function restartSong() {\n\tFlxG.resetState();\n}\n\nfunction pauseIt() {\n\tif (PlayState.instance != null) PlayState.instance.pauseGame();\n}\n\nfunction endIt() {\n\tif (PlayState.instance != null) PlayState.instance.endSong();\n}\n\nfunction dieNow() {\n\tif (PlayState.instance != null) PlayState.instance.gameOver();\n}' } },

          { h: '让角色播动画 / 改镜头' },
          { code: { lang: 'haxe', src: 'function cutscene() {\n\t// 参数：动画名, 是否强制打断, 上下文\n\tboyfriend.playAnim(\"hey\", true);\n\tdad.playAnim(\"idle\", true);\n\n\t// 镜头跟随某个人\n\tcamFollow.setPosition(dad.getMidpoint().x + 150, dad.getMidpoint().y - 100);\n\n\t// 推近\n\tFlxTween.tween(camGame, {zoom: 1.2}, 1.0, {ease: FlxEase.cubeOut});\n}' } },

          { h: '播音效 / 音乐' },
          { code: { lang: 'haxe', src: 'function sfx() {\n\tFlxG.sound.play(Paths.sound(\"confirmMenu\"));\n}\n\n// 循环播放一首背景音乐\nvar bgm:FlxSound = null;\nfunction playBGM() {\n\tbgm = FlxG.sound.play(Paths.music(\"breakfast\"), 0.5, true);\n}\nfunction stopBGM() {\n\tif (bgm != null) bgm.stop();\n}' } },

          { h: '存档与设置' },
          { code: { lang: 'haxe', src: 'function saveFlag() {\n\t// mod 自己的数据放 FlxG.save（和引擎设置分开）\n\tFlxG.save.data.myClearCount = 3;\n\tFlxG.save.flush();\n\n\t// 引擎设置\n\tOptions.downscroll = true;\n\tOptions.save();\n}' } }
        ],
        deep: [
          { h: 'PlayState 常用字段速查' },
          {
            table: {
              head: ['字段', '类型', '说明'],
              rows: [
                ['`boyfriend` / `bf`', 'Character', '玩家角色'],
                ['`dad`', 'Character', '对手角色'],
                ['`gf`', 'Character', 'GF'],
                ['`camGame` / `camHUD`', 'FlxCamera', '场景相机 / UI 相机'],
                ['`stage`', 'Stage', '舞台对象'],
                ['`health` / `maxHealth`', 'Float', '血量与上限'],
                ['`songScore`', 'Int', '分数'],
                ['`combo` / `misses`', 'Int', '连击 / 漏键数'],
                ['`accuracy`', 'Float', '准确率'],
                ['`playerStrums` / `cpuStrums`', 'FlxTypedGroup', '玩家 / 对手轨道'],
                ['`strumLines`', 'FlxTypedGroup', '所有轨道组'],
                ['`curCameraTarget`', 'Int', '镜头当前跟谁（0=对手 1=玩家）'],
                ['`defaultCamZoom`', 'Float', '默认缩放'],
                ['`scrollSpeed`', 'Float', '谱面流速'],
                ['`startedCountdown`', 'Bool', '倒计时是否结束'],
                ['`endedSong` / `endingSong`', 'Bool', '结束状态'],
                ['`isStoryMode`', 'Bool', '是不是故事模式'],
                ['`SONG`', 'Chart', '当前歌曲数据（**静态**）'],
                ['`difficulty` / `variation`', 'String', '当前难度 / 变体（**静态**）']
              ]
            }
          },
          { h: 'Conductor：所有时间相关的东西' },
          {
            kv: [
              ['`Conductor.bpm`', '当前 BPM'],
              ['`Conductor.crochet`', '一拍的毫秒数'],
              ['`Conductor.stepCrochet`', '一步的毫秒数'],
              ['`Conductor.songPosition`', '当前歌曲位置（毫秒）'],
              ['`Conductor.curBeat` / `curStep` / `curMeasure`', '当前拍 / 步 / 小节'],
              ['`Conductor.songOffset`', '偏移'],
              ['`Conductor.changeBPM(x)`', '改 BPM']
            ]
          },
          { p: "写时间相关的逻辑**一律用 `Conductor`**，不要用 `FlxG.elapsed` 累加 —— 后者在掉帧时会漂。" },

          { h: '事件对象里的 cancel' },
          { p: "很多回调收到的 `event` 是 `CancellableEvent`，调 `event.cancel()` 可以**阻止引擎的默认行为**：" },
          { code: { lang: 'haxe', src: 'function onNoteHit(event) {\n\t// 这个音符不计分（比如做「摆设音符」）\n\tevent.cancel();\n}\n\nfunction onSongEnd(event) {\n\t// 不让它结束（做循环段）\n\tevent.cancel();\n}' } },
          { callout: { kind: 'warn', title: '小心', text: "`onSongEnd` 里 cancel 会让游戏卡在歌里出不去。除非你确定要在别的地方手动 `endSong()`。" } },

          { h: '拿不准字段名的时候' },
          { p: "按 `F4` 打开检查器，选中 `PlayState`，右边会列出**当前版本所有真实字段**。比翻文档快，也比猜靠谱。" }
        ]
      },

      /* ------------------------------------------------ 24 */
      {
        id: 'events-and-pack',
        num: '24',
        title: '事件系统与 pack 打包',
        en: 'EVENTS & .PACK',
        tags: ['Events', 'JSON', 'pack', '自定义事件'],
        simple: [
          { p: "**事件（Event）**就是谱面里那些「到某个时间点做某件事」的指令：推镜头、闪白、变速、播动画。" },
          { p: "引擎自带 14 个事件。想加自己的，需要**一个 JSON（定义参数）+ 一个 HX（执行逻辑）**。打包就是把它们塞进一个 `.pack` 文件里。" }
        ],
        core: [
          { h: '谱面里的事件长什么样' },
          { p: "歌曲的 `events.json` 里，每条事件 = 名字 + 时间（毫秒）+ 参数数组。" },
          { code: { lang: 'json', title: 'songs/bopeebo/events.json', src: '{\n\t"events": [\n\t\t{\n\t\t\t"name": "Play Animation",\n\t\t\t"time": 4200,\n\t\t\t"params": [1, "hey", true]\n\t\t}\n\t]\n}' } },
          { p: "`params` 的顺序**严格对应**事件定义的参数顺序。上面这条的意思是：在第 4200ms，让第 1 条轨道（玩家）的角色强制播放 `hey`。" },

          { h: '引擎自带的事件（14 个）' },
          {
            table: {
              head: ['事件', '参数（按顺序）'],
              rows: [
                ['`HScript Call`', '函数名、参数字符串（逗号分隔）'],
                ['`Camera Movement`', '目标轨道、是否补间、时长（步）、缓动、缓动类型、X 偏移、Y 偏移'],
                ['`Camera Position`', 'X、Y、是否补间、时长、缓动、缓动类型、是否偏移'],
                ['`Add Camera Zoom`', '增量、相机（camGame/camHUD）'],
                ['`Camera Bop`', '增量'],
                ['`Camera Zoom`', '是否补间、目标缩放、相机、时长、缓动、缓动类型、模式、是否乘算'],
                ['`Camera Modulo Change`', '间隔、强度、按（BEAT/MEASURE/STEP）、拍偏移'],
                ['`Camera Flash`', '是否反向、颜色、时长、相机'],
                ['`BPM Change`', '目标 BPM'],
                ['`Continuous BPM Change`', '目标 BPM、时长'],
                ['`Time Signature Change`', '分子、分母、分母是否为「步每拍」'],
                ['`Scroll Speed Change`', '是否补间、新流速、时长、缓动、缓动类型、是否乘算'],
                ['`Alt Animation Toggle`', '作用于 sing、作用于 idle、轨道'],
                ['`Play Animation`', '轨道、动画名、是否强制、上下文']
              ]
            }
          },
          { callout: { kind: 'tip', title: '最实用的两个', text: "`HScript Call` 是万能入口 —— 它能在事件时间点调用你脚本里的任意函数，等于「事件 → 代码」的桥。`Play Animation` 是做过场最省事的。" } },

          { h: '自定义事件：JSON 定义参数' },
          { p: "在 `data/events/` 下建一个 `MyEvent.json`，文件名就是事件名。里面声明参数名、类型、默认值：" },
          { code: { lang: 'json', title: 'data/events/MyEvent.json', src: '{\n\t"params": [\n\t\t{\n\t\t\t"name": "Amount",\n\t\t\t"type": "Float(-10, 10, 0.01, 2)",\n\t\t\t"defaultValue": 0.1,\n\t\t\t"saveIfDefault": true\n\t\t},\n\t\t{\n\t\t\t"name": "Mode",\n\t\t\t"type": "DropDown(\'A\', \'B\', \'C\')",\n\t\t\t"defaultValue": "A"\n\t\t},\n\t\t{\n\t\t\t"name": "Target",\n\t\t\t"type": "StrumLine",\n\t\t\t"defaultValue": 0\n\t\t},\n\t\t{\n\t\t\t"name": "Enabled",\n\t\t\t"type": "Bool",\n\t\t\t"defaultValue": true,\n\t\t\t"saveIfDefault": false\n\t\t}\n\t]\n}' } },
          {
            table: {
              head: ['type 可写', '变成什么控件'],
              rows: [
                ['`Bool`', '复选框'],
                ['`Int(min, max, step)`', '整数输入'],
                ['`Float(min, max, step, precision)`', '小数输入'],
                ['`String`', '文本输入'],
                ['`StrumLine`', '轨道选择（0=对手，1=玩家…）'],
                ['`ColorWheel`', '颜色选择器'],
                ['`DropDown(\'a\', \'b\')`', '下拉框'],
                ['`Character`', '角色选择'],
                ['`Stage`', '舞台选择']
              ]
            }
          },
          { p: "`saveIfDefault: false` 的意思是「值等于默认值时不写进谱面文件」，可以让事件 JSON 更干净。" },

          { h: '自定义事件：HX 执行逻辑' },
          { p: "同一个名字建一个 `MyEvent.hx`。当这首歌用到这个事件时，引擎会自动加载它，并把它加入脚本包，所以它能收到 `onEvent`：" },
          { code: { lang: 'haxe', title: 'data/events/MyEvent.hx', src: 'function onEvent(event) {\n\t// 只处理自己的事件\n\tif (event.event.name != \"MyEvent\") return;\n\n\t// 按 JSON 里的顺序取参数\n\tvar amount  = event.event.params[0];\n\tvar mode    = event.event.params[1];\n\tvar target  = event.event.params[2];\n\tvar enabled = event.event.params[3];\n\n\ttrace(\"MyEvent: \" + amount + \" / \" + mode);\n\n\tif (!enabled) return;\n\n\t// 干点事\n\tif (mode == \"A\") {\n\t\tFlxTween.tween(camGame, {zoom: camGame.zoom + amount}, 0.4);\n\t}\n\n\t// 阻止其它默认处理（可选）\n\t// event.cancel();\n}' } },

          { h: 'pack：把事件的三件套塞进一个文件' },
          { p: "一个 `.pack` 文件用固定分隔符把内容拼起来：" },
          { code: { lang: 'ini', title: '分隔符', src: '________PACKSEP________' } },
          {
            table: {
              head: ['段', '内容', '谁读它'],
              rows: [
                ['第 1 段', '文件名（含扩展名）', '引擎用来判断类型'],
                ['第 2 段', 'HScript 代码', '脚本系统'],
                ['第 3 段', '事件 JSON', '事件系统（只有事件 pack 需要）']
              ]
            }
          },
          { p: "所以一个 `MyEvent.pack` 的内容结构是：" },
          { code: { lang: 'ini', title: 'data/events/MyEvent.pack 的结构', src: 'MyEvent.hx\n________PACKSEP________\nfunction onEvent(event) {\n\tif (event.event.name != "MyEvent") return;\n\tcamHUD.zoom += event.event.params[0];\n}\n________PACKSEP________\n{"params":[{"name":"Amount","type":"Float(-1,1,0.01,2)","defaultValue":0.05}]}' } },
          { p: "**注意**：`pack` 里的 JSON 段必须是**纯 JSON**，不能有注释；代码段里如果出现分隔符字符串会被截断（基本不可能，但别故意写）。" },
          { p: "用 pack 的好处：一个事件只占一个文件，复制给别人时不会漏。坏处：不能单独编辑，且出问题时更难定位。" }
        ],
        deep: [
          { h: '事件是怎么被执行的' },
          {
            ol: [
              "`PlayState` 每帧检查 `events` 数组，时间到了就调用 `executeEvent(event)`。",
              "先派发 `onEvent`（EventGameEvent）给所有脚本和角色 —— **这一步可以被 Cancel**。",
              "没被 Cancel 就走内置的 `switch`：`Camera Movement` 就走镜头补间，`BPM Change` 就改 `Conductor`。",
              "最后派发 `onPostEvent`，给「事后处理」留口子。"
            ]
          },
          { p: "所以自定义事件有两种写法：**写进 `data/events/X.hx` 用 onEvent 处理**，或者在歌曲脚本里统一接 `onEvent` 自己 switch。前者更模块化，后者更省文件。" },

          { h: '手写 `events.json` 的注意事项' },
          {
            ul: [
              "`time` 是**毫秒**，不是拍。用 `Conductor` 换算：`Conductor.crochet * 4` 是一小节。",
              "事件数组**必须按时间排序**吗？不必须，引擎会处理，但乱序会让你自己看不懂。",
              "`params` 少写会变成 `null`，多写会被忽略。",
              "字符串里的引号要转义 `\\\"`。",
              "改完 events.json 要重进歌曲才生效（它是在加载谱面时读的）。"
            ]
          },

          { h: '打包一个「事件 + 脚本 + JSON」的完整例子' },
          { p: "假设你要做一个「屏幕抖动」事件，参数是强度和时长：" },
          { code: { lang: 'json', title: 'data/events/Screen Shake.json', src: '{\n\t"params": [\n\t\t{"name": "Strength", "type": "Float(0, 50, 0.5, 1)", "defaultValue": 4},\n\t\t{"name": "Duration", "type": "Float(0.1, 5, 0.1, 1)", "defaultValue": 0.4}\n\t]\n}' } },
          { code: { lang: 'haxe', title: 'data/events/Screen Shake.hx', src: 'function onEvent(event) {\n\tif (event.event.name != "Screen Shake") return;\n\n\tvar strength:Float = event.event.params[0];\n\tvar duration:Float = event.event.params[1];\n\n\t// 抖相机（FlxCamera 自带 shake）\n\tcamGame.shake(strength / 100.0, duration);\n\tcamHUD.shake(strength / 100.0, duration);\n}' } },
          { p: "然后在谱面编辑器里，这个事件就会出现在事件列表里，带两个参数输入框。**不需要重启引擎** —— 事件列表在进入状态时会重新扫描 `data/events/`。" },

          { h: '事件与脚本的边界' },
          { p: "一个常见困惑：**什么时候用事件，什么时候用脚本？**" },
          {
            table: {
              head: ['场景', '用哪个'],
              rows: [
                ['「第 32 拍推一下镜头」', '事件（谱面里可视化，改时间方便）'],
                ['「每次命中都闪一下」', '脚本（`onNoteHit`）'],
                ['「血量低于 1 时变红」', '脚本（`update` 里判断）'],
                ['「特定时间点触发一段复杂演出」', '事件 + `HScript Call` 调脚本函数'],
                ['「给谱师用的可配置效果」', '事件（谱师不用会写代码）']
              ]
            }
          },
          { p: "经验法则：**能做成事件的就做成事件** —— 因为改起来不用碰代码，团队里不会写代码的人也能调。" },
          { h: '自定义事件的 JSON：`data/events/<名字>.json`' },
          { p: "引擎自带的 14 个事件是写死在 `EventsData.defaultEventsParams` 里的。你自己的事件用 JSON 定义 —— **一个事件一个文件**，文件名就是事件名。" },
          { code: { lang: 'json', title: 'data/events/My Event.json', src: '{\n\t"params": [\n\t\t{\n\t\t\t"name": "目标轨道",\n\t\t\t"type": "Int(0, 3)",\n\t\t\t"defaultValue": 0\n\t\t},\n\t\t{\n\t\t\t"name": "强度",\n\t\t\t"type": "Float(0, 2, 0.1, 2)",\n\t\t\t"defaultValue": 1\n\t\t},\n\t\t{\n\t\t\t"name": "是否循环",\n\t\t\t"type": "Bool",\n\t\t\t"defaultValue": false\n\t\t}\n\t]\n}' } },
          {
            table: {
              head: ['字段', '说明'],
              rows: [
                ['`params`', '参数数组，**顺序就是谱面里 `params[]` 的顺序**'],
                ['`params[].name`', '编辑器里显示的名字（可以写中文）'],
                ['`params[].type`', '**一段 HScript 表达式字符串**（见下表）'],
                ['`params[].defaultValue`', '默认值'],
                ['`params[].saveIfDefault`', '等于默认值时是否还写进谱面（`false` 能让谱面文件更干净）']
              ]
            }
          },
          { p: "`type` 不是枚举，是**表达式**。引擎会用一个只暴露这几个构造器的 HScript 解释器去求值：" },
          {
            table: {
              head: ['写什么', '得到什么', '参数'],
              rows: [
                ['`Bool`', '开关', '—'],
                ['`Int(min, max, step)`', '整数', '都可省略'],
                ['`Float(min, max, step, precision)`', '小数', '都可省略'],
                ['`String`', '文本框', '—'],
                ['`DropDown("A", "B", "C")`', '下拉框', '任意个值'],
                ['`ColorWheel`', '取色器', '—'],
                ['`StrumLine`', '选一条轨道', '—'],
                ['`Character`', '选一个角色', '—'],
                ['`Stage`', '选一个舞台', '—']
              ]
            }
          },
          { callout: { kind: 'tip', title: '精简写法', text: "`Int` / `Float` 不传参数就是「不限范围」，比如 `\"type\": \"Float\"` 就是一个任意小数。" } },

          { h: '`.pack` 格式：把名字和内容塞进一个文件' },
          { p: "除了 `.json`，`data/events/` 还认 `.pack`。它用固定分隔符把「事件名」和「JSON 内容」拼在一起，方便你在不能建文件名的环境里传事件：" },
          { code: { lang: 'ini', title: '结构', src: '事件名________PACKSEP________（占位，忽略）________PACKSEP________{"params":[...]}' } },
          { p: "实际用不到就别碰，`.json` 更直观。**改完事件定义要重进一次歌曲/编辑器**（引擎在 `reloadEvents()` 里只读一次）。" },
        ]
      },

      /* ------------------------------------------------ 25 */
      {
        id: 'full-mod',
        num: '25',
        title: '整合：从零做一个完整 mod',
        en: 'PUTTING IT TOGETHER',
        tags: ['实战', '整合', '打包发布'],
        simple: [
          { p: "前面都是零件，这一节把它们拼成一个能发布的 mod。假设我们要做一首歌：自定义人物 + 自定义舞台 + 一个着色器 + 一个自定义事件。" },
          { p: "跟着目录树抄一遍，改名字就能用。" }
        ],
        core: [
          { h: '最终目录结构' },
          { code: { lang: 'ini', title: 'mods/neon-demo/', src: 'mods/neon-demo/\n├─ data/\n│  ├─ config/\n│  │  └─ modpack.ini\n│  ├─ characters/\n│  │  ├─ neon-bf.xml\n│  │  └─ neon-bf.hx          ← 角色脚本（可选）\n│  ├─ stages/\n│  │  ├─ neon-stage.xml\n│  │  └─ neon-stage.hx        ← 舞台脚本（可选）\n│  └─ events/\n│     ├─ Neon Pulse.json\n│     └─ Neon Pulse.hx\n├─ images/\n│  ├─ characters/neon-bf/\n│  │  ├─ neon-bf.png\n│  │  └─ neon-bf.xml          ← 图集\n│  ├─ stages/neon-stage/\n│  │  └─ bg.png\n│  └─ icons/neon-bf/\n│     └─ icon.png\n├─ shaders/\n│  └─ neon.frag\n└─ songs/\n   └─ neon-demo/\n      ├─ meta.json\n      ├─ events.json\n      ├─ charts/\n      │  └─ normal.json\n      ├─ scripts/\n      │  └─ neon.hx           ← 这首歌的逻辑\n      └─ song/\n         └─ Inst.ogg' } },

          { h: '① 元数据' },
          { code: { lang: 'ini', title: 'data/config/modpack.ini', src: '[Common]\nNAME="Neon Demo"\nDESCRIPTION="一个演示用的小 mod"\nAUTHOR="your name"\nVERSION="1.0.0"\nAPI_VERSION=3\n\n[Flags]\nDISABLE_WARNING_SCREEN=true' } },

          { h: '② 歌曲元数据' },
          { code: { lang: 'json', title: 'songs/neon-demo/meta.json', src: '{\n\t"displayName": "Neon Demo",\n\t"icon": "neon-bf",\n\t"color": "#31B0D1",\n\t"bpm": 150,\n\t"stepsPerBeat": 4,\n\t"beatsPerMeasure": 4,\n\t"difficulties": ["normal"],\n\t"needsVoices": false,\n\t"opponentModeAllowed": false,\n\t"coopAllowed": false,\n\t"stage": "neon-stage"\n}' } },

          { h: '③ 歌曲脚本（挂 shader）' },
          { code: { lang: 'haxe', title: 'songs/neon-demo/scripts/neon.hx', src: 'var neon:FunkinShader = null;\n\nfunction postCreate() {\n\tif (!Options.gameplayShaders) return;\n\n\tneon = FunkinShader.fromFile(\"neon\");\n\tneon.strength = 0.4;\n\tneon.time = 0.0;\n\tcamGame.addShader(neon);\n}\n\nfunction update(elapsed:Float) {\n\tif (neon == null) return;\n\tneon.time = Conductor.songPosition / 1000.0;\n}\n\nfunction destroy() {\n\tif (neon != null) camGame.removeShader(neon);\n}' } },

          { h: '④ 舞台脚本（跟拍发光）' },
          { code: { lang: 'haxe', title: 'data/stages/neon-stage.hx', src: 'function create() {\n\t// stage XML 里有个 name="neonLight" 的精灵\n\tif (neonLight != null) neonLight.alpha = 0.3;\n}\n\nfunction beatHit(curBeat:Int) {\n\tif (neonLight == null) return;\n\n\t// 偶数拍亮起来\n\tneonLight.alpha = (curBeat % 2 == 0) ? 1.0 : 0.35;\n}' } },

          { h: '⑤ 自定义事件' },
          { code: { lang: 'json', title: 'data/events/Neon Pulse.json', src: '{\n\t"params": [\n\t\t{"name": "Strength", "type": "Float(0, 2, 0.05, 2)", "defaultValue": 0.6}\n\t]\n}' } },
          { code: { lang: 'haxe', title: 'data/events/Neon Pulse.hx', src: 'function onEvent(event) {\n\tif (event.event.name != "Neon Pulse") return;\n\n\tvar strength:Float = event.event.params[0];\n\n\t// 让场景相机脉冲一下\n\tFlxTween.cancelTweensOf(camGame);\n\tcamGame.zoom = defaultCamZoom - 0.08 * strength;\n\tFlxTween.tween(camGame, {zoom: defaultCamZoom}, 0.5, {ease: FlxEase.quadOut});\n}' } },

          { h: '⑥ 打包发布' },
          {
            ol: [
              "确认 `mods/neon-demo/` 能跑（按 `TAB` 选它 → 进自由游玩 → 选歌）。",
              "把 `neon-demo` 整个文件夹压成 **zip**，**打开 zip 第一层就应该看到 `data/`**。",
              "发给别人，让他丢进 `mods/` 目录（不用解压）。",
              "或者打包成独立可执行模组：把整个引擎目录一起发（注意遵守官方使用规约，保留贡献者页面）。"
            ]
          },
          { callout: { kind: 'warn', title: '自查清单', text: "① 所有文件名大小写和 XML 里一致；② `modpack.ini` 的 `API_VERSION=3`；③ 没有引用不存在的图片；④ 关了开发者模式也能进；⑤ 删掉你电脑上的缓存再测一遍。" } },

          { video: { src: 'assets/video/demo.mp4', cap: '演示视频位：把录好的 mp4 放到 assets/video/demo.mp4，刷新页面就会自动出现播放器。' } }
        ],
        deep: [
          { h: '团队协作时怎么分工' },
          {
            table: {
              head: ['角色', '只碰哪些目录'],
              rows: [
                ['谱师', '`songs/<歌>/charts/` + `events.json`（用编辑器）'],
                ['美术', '`images/` 下的对应文件夹'],
                ['程序', '`scripts/` + `data/states/` + `shaders/`'],
                ['策划', '`meta.json` + `freeplaySonglist.txt` + `weeks/`']
              ]
            }
          },
          { h: '加进自由游玩列表' },
          { p: "如果歌在 mod 里而你没有 `freeplaySonglist.txt`，引擎会自动扫描到它。但**顺序会乱**，而且可能排在很后面。想固定位置就在 mod 里再放一份 `data/config/freeplaySonglist.txt` —— 注意这会**整份覆盖**原版列表，所以要把原版内容一起抄过去。" },

          { h: '版本兼容' },
          {
            ul: [
              "`API_VERSION` 写得太低，引擎会提示「这个 mod 用的旧 API」。",
              "`API_VERSION` 写得比引擎高，可能直接拒绝加载。",
              "升级引擎后，先跑一遍你的 mod，重点看：脚本回调名、字段名、着色器。"
            ]
          },
          { p: "保守做法：在 `modpack.ini` 里写 `API_VERSION=3`（当前版本），并在 mod 的介绍里注明「适用于 Build #1392」。" }
        ]
      },

      /* ------------------------------------------------ 26 */
      {
        id: 'pros-cons',
        num: '26',
        title: '客观评价：优点、缺点与常见的坑',
        en: 'HONEST REVIEW',
        tags: ['优缺点', '评价', '踩坑', '选型'],
        simple: [
          { p: "不吹不黑地说：**这引擎上限很高，但要你自己爬。**" },
          {
            ul: [
              "**爽的地方**：软编码做得彻底（人物/舞台/周/标题全是 XML）、编辑器完整、脚本能力强、调试工具齐全、性能有在认真优化。",
              "**难受的地方**：更新太快文档跟不上、生态比 Psych 小、错误提示不友好、上手曲线陡、Web/手机端不支持。",
              "**一句话选型**：想做完整作品、愿意花时间学结构 → 选它；只想十分钟换个皮 → 用 Psych 更省事。"
            ]
          },
          { callout: { kind: 'info', title: '提醒', text: "这一节的两面都会讲到：**能做什么**、**卡在哪**。想快速判断「这引擎适不适合我」，去普通档看那张评分表和「适合谁 / 不适合谁」。" } }
        ],
        core: [
          { h: '① 做得好的地方（逐条讲清为什么）' },
          {
            ul: [
              "**软编码做得彻底**：人物、舞台、周、标题界面、字体、音符溅射全是 XML/JSON，改这些东西**不需要编译**。大多数引擎只做到「换皮」，它做到了「换结构」。",
              "**编辑器完成度高**：谱面编辑器支持 Note Types、多轨道、变体、书签、播放变速、自动保存、同一步叠多事件 —— 基本能脱离外部工具做完整首歌。",
              "**脚本能力强**：基于 hscript-improved，支持 `import`、继承、`public`（同包共享）、`static`（全局），写复杂逻辑不至于捉襟见肘。",
              "**调试工具齐全**：控制台（能当 REPL 用）+ 对象检查器 + F5 热重载 + 帧率面板，这套东西在 FNF 引擎里算豪华。",
              "**性能有在认真优化**：图集复用、可关着色器、低内存模式、可关 3D 编译，能看出作者真的在意低配机器。",
              "**开源且活跃**：Apache 2.0，贡献者页面自动从 GitHub 拉，更新频率高（高到有点跟不上）。",
              "**结构可预测**：`mods/<名>/` 直接映射 `assets/`，同名覆盖，学一次就能套用所有资源。"
            ]
          },

          { h: '② 必须承认的缺点（同样逐条）' },
          {
            ul: [
              "**更新太快，文档跟不上**：接口改名、目录挪位是常态。网上搜到的教程经常是旧版本，照抄会踩坑。",
              "**生态比 Psych 小**：现成 mod、可抄的代码、能搜到的问答都少一截；遇到冷门问题基本只能自己读源码。",
              "**错误提示不友好**：XML 写错、脚本类型错、shader 编译失败，经常是**静默失效**，只能靠日志和经验排查。",
              "**上手曲线陡**：资源结构、脚本目录、XML 约定、三个概念叠一起，第一周基本在「我文件放哪」。",
              "**平台受限**：Web / 移动端未支持；NDLL 在 web/hl 直接不可用；3D 依赖 OpenGL 特性。",
              "**编辑器偶有未完成处**：Alphabet 编辑器的撤销还没做完，个别菜单项是空的。",
              "**体积不小**：引擎本体 + 官方资源体积偏大，对只想做小改版的人是负担。"
            ]
          },

          { h: '③ 一张表：它到底适合谁' },
          {
            table: {
              head: ['你的情况', '建议', '原因'],
              rows: [
                ['想做完整作品、有演出、要长期维护', '**推荐**', '结构化的收益在这里最大'],
                ['喜欢用编辑器而不是手写谱面', '**推荐**', '谱面编辑器是它的强项'],
                ['需要精细控制性能和内存', '**推荐**', '开关多、优化到位'],
                ['只想 10 分钟换个皮发出去', '不推荐', 'Psych 更快'],
                ['需要 Web / 手机端发布', '不推荐', '目前不支持'],
                ['指望抄现成 mod 拼作品', '不推荐', '生态还不够大'],
                ['完全不会写代码', '谨慎', 'XML 能撑一阵，但迟早要碰脚本']
              ]
            }
          },

          { h: '④ 最常见的十个坑' },
          {
            table: {
              head: ['#', '现象', '原因 / 解法'],
              rows: [
                ['1', '改的东西没生效', '放错层级：`mods/x/data/...` 不是 `mods/x/assets/data/...`'],
                ['2', '舞台全黑', 'XML 解析失败（少 `/`、属性值有 `&`、编码带 BOM）'],
                ['3', '人物不显示', '贴图路径/大小写不对，或图集 XML 没跟着放'],
                ['4', '脚本没执行', '位置不对，或回调名写错（是 `destroy` 不是 `onDestroy`）'],
                ['5', '脚本崩在 create', '`create()` 里访问了还没生成的 `boyfriend`，改到 `postCreate`'],
                ['6', 'shader 没效果', '忘了 `#pragma header`，或 uniform 名字拼错（静默失效）'],
                ['7', 'ndll 调不动', '文件名缺 `-windows`，或位数/hxcpp 版本不匹配'],
                ['8', '3D 黑屏', '没 `add(scene)`、相机没进 `foxCameras`、相机 z 在模型内部'],
                ['9', '歌不显示', '`meta.json` 缺 `difficulties`，或 `charts/` 没对应难度文件'],
                ['10', '切 mod 后报错', '`static var` 被清空后还在用，或残留了上个 mod 的对象']
              ]
            }
          },

          { h: '⑤ 和 Psych Engine 的对比（只说事实）' },
          {
            table: {
              head: ['维度', 'Codename', 'Psych'],
              rows: [
                ['软编码范围', '人物/舞台/周/标题/字体全是 XML', '主要靠 JSON + 部分硬编码'],
                ['脚本语言', 'HScript（类 Haxe）', 'Lua'],
                ['编辑器', '谱面/人物/舞台/字体 四套', '谱面编辑器为主'],
                ['资源结构', '`songs/<歌>/charts|song|scripts`', '`data/<歌>/`'],
                ['生态', '小但活跃', '大，教程多'],
                ['上手难度', '较高', '较低'],
                ['平台', 'Win/Mac/Linux', '含 Web/移动（部分分支）'],
                ['适用场景', '结构复杂、长期维护的作品', '快速产出、小改版']
              ]
            }
          },

          { h: '⑥ 怎么用才不难受（实战建议）' },
          {
            ol: [
              "**锁定版本**：项目开始时把引擎版本固定（比如就钉在 #1392），不要一更新就跟着更。",
              "**少碰内部实现**：只用有文档的接口；没文档的字段改了，下次更新就崩。",
              "**先立目录再写内容**：`mods/<名>/` 的骨架搭好，再往里填，别边写边挪。",
              "**善用开关**：上 shader、加 3D、开高画质的效果，都要能在设置里关掉，给低配玩家留活路。",
              "**日志当朋友**：静默失效时先看日志，再怀疑代码。"
            ]
          },

          { h: '⑦ 一个客观的结论' },
          { p: "Codename 不是「更好的 FNF 引擎」，而是「**另一种取向**」的引擎：把复杂度前置到结构上，换取后期改动的自由度。如果你要做的是有演出、有自定义系统、要长期维护的作品，这套结构会帮你；如果只是做个小改版，它会拖慢你。**先想清楚要做什么，再选工具。**" }
        ],
        deep: [
          { h: '⑧ 评分表（满分 5，主观但尽量有据）' },
          {
            table: {
              head: ['维度', '分数', '理由'],
              rows: [
                ['软编码能力', '★★★★★', '人物/舞台/周/标题/字体全覆盖，同类里最彻底'],
                ['编辑器', '★★★★☆', '谱面很强，Alphabet 还欠收尾'],
                ['脚本自由度', '★★★★☆', 'HScript 够用，但比真 Haxe 少抽象/宏'],
                ['上手友好度', '★★☆☆☆', '结构多、错误提示弱'],
                ['文档与生态', '★★★☆☆', '官方 Wiki 质量不错，但第三方资料少'],
                ['性能与优化', '★★★★☆', '开关齐全，官方称多数场景 <500MB'],
                ['稳定性', '★★★☆☆', 'beta 阶段，接口会变'],
                ['平台覆盖', '★★★☆☆', '桌面三平台，缺 Web/移动']
              ]
            }
          },

          { h: '⑨ 「更新太快」到底该怎么应对' },
          { p: "这不是缺点，而是**处于 beta 阶段的必然** —— 官方在 PATCHNOTES 里写明了「引擎从 alpha 进入 beta」。在这个阶段，接口变动是常态。应对办法只有两个：" },
          {
            ol: [
              "**锁定版本**：把引擎版本固定，不要一更新就跟着更；要更，就单开一个分支试。",
              "**少依赖内部实现**：尽量只用文档里写明的接口。"
            ]
          },
          { p: "另外建议在 mod 的 `modpack.ini` 里写清 `API_VERSION`，这样引擎升级后能第一时间提示你「这个 mod 用的是旧 API」。" },

          { h: '⑩ 客观评价里最容易被忽略的三件事' },
          {
            ul: [
              "**「功能多」不等于「你都需要」**：3D、NDLL、modchart 这些，多数 mod 一辈子用不上，别为了用而用。",
              "**「软编码」不等于「不用写代码」**：XML 能解决 60% 的需求，剩下的演出逻辑还是要脚本。",
              "**「开源」不等于「有人帮你修」**：遇到问题，能指望的通常只有日志、源码、和官方 Wiki。"
            ]
          },

          { h: '⑪ 和其他引擎的一句话定位' },
          {
            table: {
              head: ['引擎', '一句话'],
              rows: [
                ['**Codename**', '结构化程度最高、上限最高，代价是学习成本'],
                ['Psych', '生态最大、最好上手，适合快速产出'],
                ['Kade', '轻量、老牌，功能相对基础'],
                ['V-Slice（官方）', '官方方向，但可扩展性与第三方 mod 支持另说']
              ]
            }
          },
          { p: "这一栏不做排名。**引擎没有好坏，只有合不合适。**" }
        ]
      },
    ]
  });
})();
