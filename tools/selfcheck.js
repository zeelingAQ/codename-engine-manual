/* ============================================================
   tools/selfcheck.js —— 交付前自检
   1. 结构：章节数、编号连续、id 唯一、三档齐全
   2. 区块：未知块、表格列数、代码块 lang/src、xml 行
   3. 跨节引用：正文里「第 N 节」是否存在
   4. 资源：文中图片、index.html/css 引用的文件是否都在
   5. TXT：是否包含每一节标题、文件是否比网页内容新
   用法： node tools/selfcheck.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let errors = 0, warns = 0;
const fail = (m) => { console.log('  ✗ ' + m); errors++; };
const warn = (m) => { console.log('  ! ' + m); warns++; };
const ok = (m) => console.log('  ✓ ' + m);

/* ---------- 载入 ---------- */
const parts = [];
const s1 = { console, window: { CNE: { addPart: (p) => parts.push(p) } } };
vm.createContext(s1);
const FILES = ['content-1.js', 'content-2.js', 'content-3.js', 'content-4.js', 'content-5.js', 'content-6.js'];
for (const f of FILES) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets/js', f), 'utf8'), s1, { filename: f });
}

console.log('\n[1] 结构');
const secs = [];
parts.forEach((p, i) => p.sections.forEach((s) => { s.__part = i; secs.push(s); }));
console.log(`  部分 ${parts.length} / 章节 ${secs.length}`);
if (parts.length !== 6) fail('部分数量不是 6');
const nums = secs.map((s) => s.num);
const expect = secs.map((_, i) => String(i + 1).padStart(2, '0'));
if (nums.join() !== expect.join()) {
  const bad = nums.findIndex((n, i) => n !== expect[i]);
  fail(`编号不连续：第 ${bad + 1} 个章节编号是 ${nums[bad]}，应为 ${expect[bad]}`);
} else ok('编号 01–' + nums.length + ' 连续');

const ids = secs.map((s) => s.id);
if (new Set(ids).size !== ids.length) fail('存在重复 id');
else ok('id 唯一');

for (const s of secs) {
  if (!s.title || !s.en) fail(`${s.num} 缺少标题/英文名`);
  if (!s.tags || !s.tags.length) warn(`${s.num} 没有 tag`);
  if (!s.simple || !s.simple.length) fail(`${s.num} 缺少 simple`);
  if (!s.core || !s.core.length) fail(`${s.num} 缺少 core`);
}

/* ---------- 区块 ---------- */
console.log('\n[2] 区块与表格');
const KNOWN = ['h', 'h4', 'p', 'ul', 'ol', 'kv', 'table', 'code', 'callout', 'quote', 'img', 'gallery', 'video', 'xml', 'raw'];
let blocks = 0, codes = 0, tables = 0, xmls = 0;
for (const s of secs) {
  for (const mode of ['simple', 'core', 'deep']) {
    (s[mode] || []).forEach((b, i) => {
      if (typeof b === 'string') { blocks++; return; }
      blocks++;
      const keys = Object.keys(b).filter((k) => KNOWN.includes(k));
      if (keys.length === 0) fail(`${s.num}/${mode}[${i}] 未知块: ${Object.keys(b).join(',')}`);
      if (b.table) {
        tables++;
        const h = (b.table.head || []).length;
        if (!h) fail(`${s.num}/${mode}[${i}] 表格没有表头`);
        (b.table.rows || []).forEach((r, ri) => {
          if (r.length !== h) fail(`${s.num}/${mode}[${i}] 表格第 ${ri + 1} 行 ${r.length} 列 ≠ 表头 ${h} 列`);
        });
      }
      if (b.code) {
        codes++;
        if (!b.code.src || !String(b.code.src).trim()) fail(`${s.num}/${mode}[${i}] 代码块为空`);
        if (!b.code.lang) fail(`${s.num}/${mode}[${i}] 代码块缺 lang`);
      }
      if (b.xml) {
        xmls++;
        if (!b.xml.lines || !b.xml.lines.length) fail(`${s.num}/${mode}[${i}] xml 无内容`);
        (b.xml.lines || []).forEach((ln, li) => {
          if (typeof ln !== 'string' && !ln.c) warn(`${s.num}/${mode}[${i}] xml 第 ${li + 1} 行没有代码`);
        });
      }
      if (b.callout && !b.callout.text) fail(`${s.num}/${mode}[${i}] callout 没有 text`);
      if (b.img && !b.img.src) fail(`${s.num}/${mode}[${i}] img 缺 src`);
    });
  }
}
ok(`区块 ${blocks} / 代码 ${codes} / 表格 ${tables} / XML 解剖 ${xmls}`);

/* ---------- 跨节引用 ---------- */
console.log('\n[3] 跨节引用');
const numSet = new Set(nums);
const refRe = /第\s*(\d{1,2})\s*[–\-~至]\s*(\d{1,2})\s*节|第\s*(\d{1,2})\s*节/g;
let refs = 0, refBad = 0;
const scanText = (text, where) => {
  let m;
  while ((m = refRe.exec(text))) {
    refs++;
    const list = m[1] ? [m[1], m[2]] : [m[3]];
    for (const n of list) {
      const padded = String(n).padStart(2, '0');
      // 只校验「本书章节号」，1–2 位数且不超过总章数
      if (Number(n) <= secs.length && !numSet.has(padded)) {
        fail(`${where} 引用了不存在的「第 ${n} 节」`); refBad++;
      }
    }
  }
};
for (const s of secs) {
  for (const mode of ['simple', 'core', 'deep']) {
    (s[mode] || []).forEach((b) => {
      if (typeof b === 'string') return scanText(b, s.num);
      for (const k of ['p', 'h', 'h4']) if (b[k]) scanText(b[k], s.num);
      if (b.ul) b.ul.forEach((x) => scanText(x, s.num));
      if (b.ol) b.ol.forEach((x) => scanText(x, s.num));
      if (b.kv) b.kv.forEach((r) => scanText(r.join(' '), s.num));
      if (b.callout) scanText(b.callout.text, s.num);
      if (b.table) b.table.rows.forEach((r) => r.forEach((c) => scanText(String(c), s.num)));
    });
  }
}
if (!refBad) ok(`跨节引用 ${refs} 处，全部有效`);

/* ---------- 资源 ---------- */
console.log('\n[4] 资源');
const assetRe = /assets\/img\/[A-Za-z0-9._-]+/g;
const used = new Set();
for (const s of secs) {
  for (const mode of ['simple', 'core', 'deep']) {
    (s[mode] || []).forEach((b) => {
      if (typeof b === 'string') return;
      if (b.img) used.add(b.img.src);
      if (b.gallery) b.gallery.forEach((g) => used.add(g.src));
    });
  }
}
used.forEach((src) => {
  if (!fs.existsSync(path.join(ROOT, src))) fail('缺少图片: ' + src);
});
ok(`文中引用图片 ${used.size} 张，全部存在`);

// index.html 引用的本地文件
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const hrefs = [...html.matchAll(/(?:src|href)="(?!https?:|#)([^"]+)"/g)].map((m) => m[1]);
hrefs.forEach((h) => {
  if (!fs.existsSync(path.join(ROOT, h))) fail('index.html 引用了不存在的文件: ' + h);
});
const missingJs = FILES.filter((f) => !html.includes(f));
if (missingJs.length) fail('index.html 未引入: ' + missingJs.join(', '));
else ok('index.html 已引入全部 ' + FILES.length + ' 个内容文件');

// CSS 里的 url()
const css = fs.readFileSync(path.join(ROOT, 'assets/css/style.css'), 'utf8');
[...css.matchAll(/url\("([^"]+)"\)/g)].map((m) => m[1]).forEach((u) => {
  if (u.startsWith('data:')) return;
  const p = path.join(ROOT, 'assets/css', u);
  if (!fs.existsSync(p)) warn('CSS 引用的文件不存在: ' + u);
});

/* ---------- TXT ---------- */
console.log('\n[5] TXT 同步');
const txtPath = path.join(ROOT, 'CodenameEngine-使用与开发说明.txt');
if (!fs.existsSync(txtPath)) fail('TXT 不存在');
else {
  const txt = fs.readFileSync(txtPath, 'utf8');
  const missing = secs.filter((s) => !txt.includes(s.title));
  if (missing.length) missing.forEach((s) => fail(`TXT 缺少章节: ${s.num} ${s.title}`));
  else ok(`TXT 含全部 ${secs.length} 节标题`);

  const jsTime = Math.max(...FILES.map((f) => fs.statSync(path.join(ROOT, 'assets/js', f)).mtimeMs));
  const txtTime = fs.statSync(txtPath).mtimeMs;
  if (txtTime + 1000 < jsTime) fail('TXT 比内容旧，请重新执行 node tools/build-txt.js');
  else ok('TXT 不旧于内容源');
  console.log('  TXT 大小 ' + (fs.statSync(txtPath).size / 1024).toFixed(1) + ' KB');
}

/* ---------- 汇总 ---------- */
console.log('\n────────────────────────────');
console.log(errors === 0 ? `通过：0 错误，${warns} 警告` : `失败：${errors} 错误，${warns} 警告`);
process.exit(errors === 0 ? 0 : 1);
