/* ============================================================
   build-txt.js
   把网页内容（content-*.js）转成纯中文 TXT 版，保证两份文档同源、不跑偏。
   用法： node tools/build-txt.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'CodenameEngine-使用与开发说明.txt');

/* ---------- 1. 载入内容 ---------- */
const parts = [];
const sandbox = {
  console,
  window: { CNE: { addPart: (p) => parts.push(p) } }
};
vm.createContext(sandbox);
for (const f of ['content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8'), sandbox, { filename: f });
}
parts.forEach((p, i) => {
  p.index = i;
  (p.sections || []).forEach((s, j) => { s.part = p; s.order = j; });
});

/* ---------- 2. 文本工具 ---------- */
const W = 74; // 半角宽度预算

function stripInline(s) {
  return String(s == null ? '' : s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1（$2）')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1');
}

function widthOf(str) {
  let w = 0;
  for (const ch of str) {
    const c = ch.codePointAt(0);
    w += (c > 0x2e80 && c < 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xff60) ? 2 : 1;
  }
  return w;
}

const NO_LEAD = '，。、；：！？）」』】…—·%';
const NO_TAIL = '（「『【';

function tokenize(text) {
  const tokens = [];
  let buf = '';
  for (const ch of text) {
    const c = ch.codePointAt(0);
    const isCJK = (c > 0x2e80 && c < 0x9fff) || (c >= 0x3000 && c <= 0x303f) || (c >= 0xff00 && c <= 0xff60);
    if (ch === ' ') {
      if (buf) { tokens.push(buf); buf = ''; }
      tokens.push(' ');
    } else if (isCJK) {
      if (buf) { tokens.push(buf); buf = ''; }
      tokens.push(ch);
    } else {
      buf += ch;
    }
  }
  if (buf) tokens.push(buf);
  return tokens;
}

function wrap(text, indent, budget) {
  budget = budget || W;
  const indF = Array.isArray(indent) ? indent[0] : indent;
  const indR = Array.isArray(indent) ? indent[1] : indent;
  let pad = ' '.repeat(indF);
  const tokens = tokenize(String(text));
  const lines = [];
  let cur = '';
  let curW = 0;

  const flush = () => {
    lines.push(pad + cur.replace(/\s+$/, ''));
    cur = ''; curW = 0;
    pad = ' '.repeat(indR);
  };

  for (let i = 0; i < tokens.length; i++) {
    const tk = tokens[i];
    if (tk === '\n') { flush(); continue; }

    // 中文标点不放行首：直接挂在上一行末尾
    const isNoLead = tk.length === 1 && NO_LEAD.indexOf(tk) !== -1;
    const w = widthOf(tk);

    if (cur && curW + w > budget && !isNoLead) {
      flush();
      if (tk === ' ') continue;
    }

    // 超长英文串（URL 等）硬切
    if (!cur && w > budget) {
      let piece = '';
      let pw = 0;
      for (const ch of tk) {
        const cw = widthOf(ch);
        if (pw + cw > budget) { lines.push(pad + piece); piece = ''; pw = 0; }
        piece += ch; pw += cw;
      }
      cur = piece; curW = pw;
      continue;
    }

    if (tk === ' ' && !cur) continue;
    cur += tk;
    curW += w;
  }
  if (cur.length) lines.push(pad + cur.replace(/\s+$/, ''));
  return lines.join('\n');
}

function blank(n) { return '\n'.repeat(n == null ? 1 : n); }

/* ---------- 3. 区块渲染 ---------- */
const CALLOUT_LABEL = {
  info: '说明',
  tip: '建议',
  warn: '注意',
  dev: '开发提示'
};

function renderBlocks(blocks, out) {
  for (const b of blocks || []) {
    if (!b) continue;
    if (typeof b === 'string') { out.push(wrap(stripInline(b), 4)); out.push(''); continue; }

    if (b.h) {
      out.push('');
      out.push('  ■ ' + stripInline(b.h));
      out.push('  ' + '─'.repeat(Math.min(38, Math.max(6, widthOf(stripInline(b.h))))));
      out.push('');
      continue;
    }
    if (b.h4) { out.push('  ● ' + stripInline(b.h4)); out.push(''); continue; }

    if (b.p) { out.push(wrap(stripInline(b.p), 4)); out.push(''); continue; }

    if (b.ul) {
      for (const it of b.ul) {
        const t = stripInline(it);
        out.push(wrap('· ' + t, [6, 8]));
      }
      out.push('');
      continue;
    }
    if (b.ol) {
      b.ol.forEach((it, i) => {
        out.push(wrap((i + 1) + '. ' + stripInline(it), [6, 8]));
      });
      out.push('');
      continue;
    }
    if (b.kv) {
      for (const [k, v] of b.kv) {
        out.push(wrap('▸ ' + stripInline(k), 6));
        out.push(wrap(stripInline(v), 10));
      }
      out.push('');
      continue;
    }
    if (b.table) {
      const t = b.table;
      if (t.head && t.head.length) out.push(wrap('［' + t.head.map(stripInline).join(' ｜ ') + '］', 4));
      for (const row of t.rows || []) {
        out.push(wrap('· ' + row.map(stripInline).join(' ｜ '), [6, 8]));
      }
      out.push('');
      continue;
    }
    if (b.callout) {
      const c = b.callout;
      const label = CALLOUT_LABEL[c.kind] || '说明';
      out.push(wrap('【' + label + (c.title ? '：' + stripInline(c.title) : '') + '】', 4));
      out.push(wrap(stripInline(c.text), 6));
      out.push('');
      continue;
    }
    if (b.quote) { out.push(wrap('“' + stripInline(b.quote) + '”', 8)); out.push(''); continue; }

    if (b.code) {
      const c = b.code;
      out.push('  ┌─ 代码' + (c.title ? '：' + stripInline(c.title) : '') + ' ［' + (c.lang || 'haxe') + '］');
      for (const line of String(c.src).split('\n')) out.push('  │ ' + line);
      out.push('  └─ 代码结束');
      out.push('');
      continue;
    }

    if (b.xml) {
      const x = b.xml;
      out.push('  ┌─ XML 逐行说明' + (x.title ? '：' + stripInline(x.title) : ''));
      (x.lines || []).forEach((ln, i) => {
        const code = typeof ln === 'string' ? ln : ln.c;
        const note = typeof ln === 'string' ? '' : ln.n;
        out.push('  │ ' + String(i + 1).padStart(2, '0') + ' | ' + code);
        if (note) out.push(wrap('说明：' + stripInline(note), 10, W - 4));
      });
      out.push('  └─ XML 说明结束');
      out.push('');
      continue;
    }

    if (b.img) { out.push(wrap('［图］' + stripInline(b.img.cap || b.img.src), 4)); out.push(''); continue; }
    if (b.gallery) {
      for (const g of b.gallery) out.push(wrap('［图］' + stripInline(g.cap || g.src), 4));
      out.push('');
      continue;
    }
    if (b.video) { out.push(wrap('［演示视频］' + stripInline(b.video.cap || b.video.src), 4)); out.push(''); continue; }
    if (b.raw) continue;
  }
}

/* ---------- 4. 组装 ---------- */
const out = [];
const line = (s) => out.push(s == null ? '' : s);

line('════════════════════════════════════════════════════════════════════════');
line('　　CODENAME ENGINE　使用与开发说明（纯文本版）');
line('　　Friday Night Funkin\' 引擎 · 中文实战手册');
line('════════════════════════════════════════════════════════════════════════');
line('');
line('　当前版本：Windows Builds #1392（引擎版本 1.1.0，Mod API v3）');
line('　文档整理时间：2026-10-23');
line('　制作：一人制作');
line('');
line('　本文档对应的下载地址：');
line('　　https://github.com/CodenameCrew/CodenameEngine/actions/runs/39722789627');
line('　官方 Wiki（强烈建议优先阅读）：');
line('　　https://codename-engine.com/wiki/');
line('');
line('────────────────────────────────────────────────────────────────────────');
line('　阅读前须知');
line('────────────────────────────────────────────────────────────────────────');
line('');
line(wrap('本网页（或本版本）不保证对后续更新完全有效。引擎更新很快，接口会改名、目录会挪位，某些写法过一两个版本就失效。本文整理于 2026-10-23，对应 Windows Builds #1392；若你手上的引擎更新，请把本文当作思路参考，而不是标准答案。', 2));
line('');
line(wrap('你有更好的选择。官方 Wiki 才是唯一权威、随时更新、还带官方示例的地方。本文只是把中文环境下最容易卡住的地方讲得更细一点。', 2));
line('');
line('────────────────────────────────────────────────────────────────────────');
line('　这份文档怎么读');
line('────────────────────────────────────────────────────────────────────────');
line('');
line(wrap('全文分五部分：第一部分认识引擎，第二部分讲界面与设置，第三部分拆目录与 XML，第四部分讲外部脚本开发（着色器、NDLL、3D、事件与打包），第五部分是 API 速查（全局对象、核心对象、回调、事件对象、底层库）。', 2));
line('');
line(wrap('本文是「详细版」，内容最全。网页版还提供「简单 / 普通」两档，可在浏览器里切换。', 2));
line('');
line(wrap('所有代码都可以直接复制使用；代码块用 ┌─ / └─ 包起来，中间的行是可以拿去用的原文。', 2));
line('');
line('');

/* 目录 */
line('════════════════════════════════════════════════════════════════════════');
line('　目　录');
line('════════════════════════════════════════════════════════════════════════');
line('');
for (const p of parts) {
  line('　' + p.name);
  for (const s of p.sections) {
    line('　　' + s.num + '　' + s.title + (s.en ? '（' + s.en + '）' : ''));
  }
  line('');
}
line('');

/* 正文 */
for (const p of parts) {
  line('');
  line('════════════════════════════════════════════════════════════════════════');
  line('　' + p.name);
  line('════════════════════════════════════════════════════════════════════════');
  line('');

  for (const s of p.sections) {
    line('');
    line('────────────────────────────────────────────────────────────────────────');
    line('　第 ' + s.num + ' 节　' + s.title);
    if (s.en) line('　' + s.en);
    line('────────────────────────────────────────────────────────────────────────');
    line('');
    if (s.tags && s.tags.length) { line('　关键词：' + s.tags.join('、')); line(''); }
    renderBlocks((s.core || []).concat(s.deep || []), out);
  }
}

line('');
line('════════════════════════════════════════════════════════════════════════');
line('　附：常见问题速查');
line('════════════════════════════════════════════════════════════════════════');
line('');
line('　1. 文件放哪？');
line(wrap('mods/你的mod/data/... 对应 assets/data/...，mod 里没有 assets 这一层。', 6));
line('　2. 想改人物？');
line(wrap('改 data/characters/<名字>.xml 与 images/characters/<名字>/ 下的贴图。', 6));
line('　3. 想改舞台？');
line(wrap('改 data/stages/<名字>.xml，贴图放 images/stages/<名字>/。', 6));
line('　4. 想加歌？');
line(wrap('songs/<歌名>/ 下放 meta.json、charts/<难度>.json、song/Inst.ogg，再把歌名加进 data/config/freeplaySonglist.txt。', 6));
line('　5. 编辑器怎么开？');
line(wrap('设置 → 杂项 → 开发者模式 打开，然后主菜单按 7。', 6));
line('　6. 脚本改了没生效？');
line(wrap('按 F5 重载状态（需开发者模式），或确认脚本放对了目录。', 6));
line('　7. 着色器没效果？');
line(wrap('确认第一行是 #pragma header，文件名与 new FunkinShader("名字") 一致，文件是 .frag。', 6));
line('　8. 3D 黑屏？');
line(wrap('确认 add(scene)、scene.foxCameras.push(cam)、相机 z 在模型外侧、模型路径正确。', 6));
line('');
line('');
line('────────────────────────────────────────────────────────────────────────');
line(wrap('本文档基于 Codename Engine 1.1.0 / Build #1392 的源码与资源目录实读整理。', 2));
line(wrap('引擎仍在快速迭代，遇到与官方 Wiki 冲突之处，以官方 Wiki 与你手上版本的实际表现为准。', 2));
line('');
line(wrap('制作：一人制作', 2));
line('────────────────────────────────────────────────────────────────────────');

fs.writeFileSync(OUT, out.join('\n'), 'utf8');
const stat = fs.statSync(OUT);
console.log('written:', OUT);
console.log('size:', (stat.size / 1024).toFixed(1) + ' KB', ' lines:', out.length);
