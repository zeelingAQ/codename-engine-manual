          { h: '制作名单页：其实每个 mod 都能有自己的' },
          { p: "`CreditsMain` 启动时会**遍历所有已加载资源库**，分别找 `config/credits/LIB_<mod>`（第 48 节的 `LIB_` 机制）。也就是说：你的 mod 可以自带一份制作名单，会和原版并存。" },
          { code: { lang: 'ini', title: '文件放哪', src: 'mods/my-mod/data/config/credits.xml\n# 引擎读的虚拟路径：config/credits/LIB_my-mod' } },
          { h: 'credits.xml 支持三种节点' },
          { code: { lang: 'xml', title: '三种写法', src: '<credits>\n\t<!-- ① 直接拉 GitHub 头像 -->\n\t<github user="zeelingAQ" customName="文档作者" desc="一人制作" size="96" />\n\n\t<!-- ② 用自己的头像图（放 images/credits/<icon>.png） -->\n\t<credit name="Juhani Junkala" icon="junkala" desc="CC0 音乐"\n\t        url="https://juhanijunkala.com/" size="96" />\n\n\t<!-- ③ 子分类（点进去是另一屏） -->\n\t<menu name="特别感谢" desc="下面这些人帮了大忙" />\n</credits>' } },
          {
            table: {
              head: ['属性', '适用', '说明'],
              rows: [
                ['`user`', '`<github>`', '**必需**，GitHub 用户名（头像自动从 `github.com/<user>.png` 拉）'],
                ['`name`', '`<credit>` / `<menu>`', '**必需**，显示名'],
                ['`desc`', '全部', '副标题，默认 `No Description`'],
                ['`icon`', '`<credit>`', '头像图，相对 `images/credits/`（找不到就用默认）'],
                ['`url`', '`<credit>`', '点一下用浏览器打开'],
                ['`size`', '全部', '头像大小，默认 96'],
                ['`portrait`', '全部', '`false` 时不用头像（纯文字条目）'],
                ['`color`', '全部', '文字颜色'],
                ['`customName`', '`<github>`', '显示名和 GitHub 用户名不一致时用']
              ]
            }
          },
          { h: '另外两处「署名」相关' },
          {
            kv: [
              ['`data/specialThanks.txt`', '特别感谢的纯文本，一行一个名字'],
              ['`Options.contributors` / `Options.mainDevs`', '贡献者列表字段（`GITHUB_API` 开启时从 GitHub 拉）'],
              ['你的 mod 本身', '`modpack.ini` 的 `[Common] AUTHOR` 会显示在 Mod 菜单里']
            ]
          },
          { callout: { kind: 'info', title: '署名也是「软编码」', text: "不需要改源码就能让自己出现在制作名单里 —— 加个 `credits.xml` 就行。反过来说，**别人做的素材记得在这里署名**，这是社区的基本规矩。" } },
          { h: '关于「一人制作」' },
          { p: "本文档由**一人**整理：查源码、写条目、做网页、生成 TXT 版本。所以：**会有错**、**会有漏**，遇到和官方不一致的地方以官方为准，也欢迎直接提 issue 纠正。" },
