/* ============================================================
   CODENAME ENGINE // FIELD MANUAL
   渲染与交互（原生 JS，无依赖）
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. 数据入口
     --------------------------------------------------------- */
  var PARTS = [];
  var SECTIONS = [];

  window.CNE = {
    addPart: function (part) {
      part.index = PARTS.length;
      PARTS.push(part);
      (part.sections || []).forEach(function (s) {
        s.part = part;
        s.order = SECTIONS.length;
        SECTIONS.push(s);
      });
    },
    parts: PARTS,
    sections: SECTIONS
  };

  /* ---------------------------------------------------------
     1. 工具
     --------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inline(s) {
    var t = esc(s);
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, label, url) {
      var ex = /^https?:/i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + url + '"' + ex + '>' + label + '</a>';
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    return t;
  }

  function plainText(s) {
    return String(s == null ? '' : s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
      .replace(/`([^`]+)`/g, '$1');
  }

  /* ---------------------------------------------------------
     2. 语法着色
     --------------------------------------------------------- */
  var KW = {
    haxe: 'var final function class new return if else for while do break continue switch case default try catch throw import package using extends implements static public private inline override dynamic abstract enum typedef interface null true false this super cast is it untyped macro extern',
    glsl: 'void main if else for while return float vec2 vec3 vec4 mat2 mat3 mat4 int bool sampler2D uniform varying attribute const discard struct precision highp mediump lowp in out inout',
    json: 'true false null',
    js: 'var let const function return if else for while new this class extends true false null undefined typeof',
    ini: ''
  };

  var TYPES = {
    haxe: /^(String|Int|Float|Bool|Array|Map|Dynamic|Void|Any|Null|UInt|Bool)$/,
    glsl: /^(float|vec2|vec3|vec4|mat2|mat3|mat4|int|bool|sampler2D|void)$/
  };

  var LANG_ALIAS = {
    hx: 'haxe', hscript: 'haxe', haxe: 'haxe', as: 'haxe',
    glsl: 'glsl', frag: 'glsl', vert: 'glsl', shader: 'glsl',
    json: 'json', js: 'js', javascript: 'js',
    xml: 'xml', html: 'xml', ini: 'ini', txt: 'ini', bash: 'ini', cmd: 'ini',
    cpp: 'cpp', c: 'cpp'
  };

  function tokenizeLine(line, lang, state) {
    var out = '';
    var i = 0;
    var n = line.length;
    var kw = (KW[lang] || '').split(' ');
    var reWord = /[A-Za-z_$][A-Za-z0-9_$]*/;

    while (i < n) {
      if (state.block) {
        var endB = line.indexOf('*/', i);
        if (endB === -1) {
          out += '<span class="tk-c">' + esc(line.slice(i)) + '</span>';
          return out;
        }
        out += '<span class="tk-c">' + esc(line.slice(i, endB + 2)) + '</span>';
        i = endB + 2;
        state.block = false;
        continue;
      }

      var ch = line.charAt(i);
      var two = line.substr(i, 2);

      // 行注释
      if (two === '//' || (lang === 'ini' && ch === '#')) {
        out += '<span class="tk-c">' + esc(line.slice(i)) + '</span>';
        return out;
      }
      // 块注释
      if (two === '/*') {
        var endB2 = line.indexOf('*/', i + 2);
        if (endB2 === -1) {
          out += '<span class="tk-c">' + esc(line.slice(i)) + '</span>';
          state.block = true;
          return out;
        }
        out += '<span class="tk-c">' + esc(line.slice(i, endB2 + 2)) + '</span>';
        i = endB2 + 2;
        continue;
      }
      // 字符串
      if (ch === '"' || ch === "'") {
        var q = ch, j = i + 1, buf = ch;
        while (j < n) {
          var cj = line.charAt(j);
          if (cj === '\\') { buf += cj + line.charAt(j + 1); j += 2; continue; }
          buf += cj; j++;
          if (cj === q) break;
        }
        out += '<span class="tk-s">' + esc(buf) + '</span>';
        i = j;
        continue;
      }
      // 数字
      if (/[0-9]/.test(ch) && !/[A-Za-z_$]/.test(line.charAt(i - 1))) {
        var m = /^[0-9][0-9a-fA-FxX._]*/.exec(line.slice(i));
        out += '<span class="tk-n">' + esc(m[0]) + '</span>';
        i += m[0].length;
        continue;
      }
      // 单词
      if (/[A-Za-z_$]/.test(ch)) {
        var wm = reWord.exec(line.slice(i));
        var w = wm[0];
        var rest = line.slice(i + w.length);
        if (kw.indexOf(w) !== -1) {
          out += '<span class="tk-k">' + esc(w) + '</span>';
        } else if ((TYPES[lang] && TYPES[lang].test(w)) || /^[A-Z][A-Za-z0-9_]*$/.test(w)) {
          out += '<span class="tk-t">' + esc(w) + '</span>';
        } else if (/^\s*\(/.test(rest)) {
          out += '<span class="tk-f">' + esc(w) + '</span>';
        } else {
          out += esc(w);
        }
        i += w.length;
        continue;
      }
      out += esc(ch);
      i++;
    }
    return out;
  }

  function hlXmlLine(line, state) {
    var out = '', i = 0, n = line.length;
    while (i < n) {
      if (state.c) {
        var e = line.indexOf('-->', i);
        if (e === -1) { out += '<span class="tk-c">' + esc(line.slice(i)) + '</span>'; return out; }
        out += '<span class="tk-c">' + esc(line.slice(i, e + 3)) + '</span>';
        i = e + 3; state.c = false; continue;
      }
      if (line.substr(i, 4) === '<!--') {
        var e2 = line.indexOf('-->', i + 4);
        if (e2 === -1) { out += '<span class="tk-c">' + esc(line.slice(i)) + '</span>'; state.c = true; return out; }
        out += '<span class="tk-c">' + esc(line.slice(i, e2 + 3)) + '</span>';
        i = e2 + 3; continue;
      }
      var ch = line.charAt(i);
      if (ch === '<') {
        var m = /^<\/?[A-Za-z0-9_:.-]+/.exec(line.slice(i));
        if (m) { out += '<span class="tk-t">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      }
      if (ch === '!' && line.substr(i, 1) === '!') {
        var dm = /^![A-Za-z]+/.exec(line.slice(i));
        if (dm) { out += '<span class="tk-k">' + esc(dm[0]) + '</span>'; i += dm[0].length; continue; }
      }
      if (ch === '"' || ch === "'") {
        var q = ch, j = i + 1, buf = ch;
        while (j < n) { var cj = line.charAt(j); buf += cj; j++; if (cj === q) break; }
        out += '<span class="tk-s">' + esc(buf) + '</span>'; i = j; continue;
      }
      if (/[A-Za-z_:]/.test(ch)) {
        var am = /^[A-Za-z_:][A-Za-z0-9_:.-]*/.exec(line.slice(i));
        var after = line.slice(i + am[0].length);
        if (/^\s*=/.test(after)) { out += '<span class="tk-a">' + esc(am[0]) + '</span>'; }
        else { out += esc(am[0]); }
        i += am[0].length; continue;
      }
      out += esc(ch); i++;
    }
    return out;
  }

  function highlightCode(src, lang) {
    var out = [], state = { block: false, c: false };
    var lines = String(src).replace(/\t/g, '    ').split('\n');
    for (var i = 0; i < lines.length; i++) {
      out.push(lang === 'xml' ? hlXmlLine(lines[i], state) : tokenizeLine(lines[i], lang, state));
    }
    return out;
  }

  /* ---------------------------------------------------------
     3. 代码块
     --------------------------------------------------------- */
  var COPY_DONE = {};

  var CB_N = 0;

  function codeBlock(spec) {
    var lang = LANG_ALIAS[String(spec.lang || '').toLowerCase()] || 'haxe';
    var title = spec.title || '';
    var raw = String(spec.src || '').replace(/^\n+|\n+$/g, '');
    var rows = highlightCode(raw, lang);
    var id = 'cb' + (++CB_N);

    var html = '<div class="codeblock" data-raw="' + esc(raw) + '" data-lang="' + lang + '">'
      + '<div class="codeblock__bar">'
      + '<span class="codeblock__lang">' + esc(lang === 'haxe' ? 'HScript' : lang.toUpperCase()) + '</span>'
      + (title ? '<span class="codeblock__title">' + esc(title) + '</span>' : '<span class="codeblock__spacer"></span>')
      + '<button class="copybtn" type="button" data-copy="' + id + '">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
      + '复制</button>'
      + '</div>'
      + '<pre><code id="' + id + '">';
    for (var i = 0; i < rows.length; i++) {
      html += '<span class="cl"><span class="cl__no">' + (i + 1) + '</span><span class="cl__tx">' + (rows[i] || ' ') + '</span></span>';
    }
    html += '</code></pre></div>';
    return html;
  }

  /* ---------------------------------------------------------
     4. XML 逐行解剖
     --------------------------------------------------------- */
  function xmlLab(spec) {
    var lines = spec.lines || [];
    var html = '<div class="xmllab">'
      + '<div class="xmllab__bar"><span>XML 逐行解剖 / LINE BY LINE</span>'
      + '<span class="xmllab__hint">← 点击任意一行看解释</span></div>'
      + '<div class="xmlbody" role="list">';
    var state = { c: false };
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      var code = typeof ln === 'string' ? ln : (ln.c || '');
      var note = typeof ln === 'string' ? '' : (ln.n || '');
      var rendered = hlXmlLine(code, state);
      html += '<div class="xmlrow" role="listitem" data-note="' + esc(note) + '" data-n="' + (i + 1) + '">'
        + '<span class="xmlrow__no">' + (i + 1) + '</span>'
        + '<code class="xmlrow__code">' + (rendered || ' ') + '</code>'
        + '</div>';
    }
    html += '</div><div class="xmlnote"><b>第 1 行</b><span class="xmlnote__t">' + inline(lines.length ? (typeof lines[0] === 'string' ? '' : (lines[0].n || '')) : '') + '</span></div></div>';
    return html;
  }

  /* ---------------------------------------------------------
     5. 区块渲染
     --------------------------------------------------------- */
  function renderBlocks(blocks) {
    var out = '';
    (blocks || []).forEach(function (b) {
      if (!b) return;
      if (typeof b === 'string') { out += '<p>' + inline(b) + '</p>'; return; }
      if (b.h) { out += '<h3>' + inline(b.h) + '</h3>'; return; }
      if (b.h4) { out += '<h4>' + inline(b.h4) + '</h4>'; return; }
      if (b.p) { out += '<p>' + inline(b.p) + '</p>'; return; }
      if (b.ul) {
        out += '<ul>' + b.ul.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</ul>';
        return;
      }
      if (b.ol) {
        out += '<ol>' + b.ol.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</ol>';
        return;
      }
      if (b.kv) {
        out += '<div class="kv">' + b.kv.map(function (r) {
          return '<div class="kv__row"><div class="kv__k">' + esc(r[0]) + '</div><div class="kv__v">' + inline(r[1]) + '</div></div>';
        }).join('') + '</div>';
        return;
      }
      if (b.table) {
        var t = b.table;
        out += '<div class="tablewrap"><table><thead><tr>'
          + (t.head || []).map(function (h) { return '<th>' + inline(h) + '</th>'; }).join('')
          + '</tr></thead><tbody>'
          + (t.rows || []).map(function (r) {
            return '<tr>' + r.map(function (c) {
              return '<td>' + inline(c) + '</td>';
            }).join('') + '</tr>';
          }).join('')
          + '</tbody></table></div>';
        return;
      }
      if (b.code) { out += codeBlock(b.code); return; }
      if (b.callout) {
        var k = b.callout.kind || 'info';
        out += '<div class="callout callout--' + k + '"><b>' + esc(b.callout.title || 'NOTE') + '</b>'
          + '<span>' + inline(b.callout.text) + '</span></div>';
        return;
      }
      if (b.quote) { out += '<div class="pullquote">' + inline(b.quote) + '</div>'; return; }
      if (b.img) {
        out += '<figure class="figure" data-src="' + esc(b.img.src) + '" data-cap="' + esc(b.img.cap || '') + '">'
          + '<img src="' + esc(b.img.src) + '" alt="' + esc(b.img.alt || b.img.cap || '') + '" loading="lazy">'
          + (b.img.cap ? '<figcaption>' + inline(b.img.cap) + '</figcaption>' : '')
          + '</figure>';
        return;
      }
      if (b.gallery) {
        out += '<div class="gallery">' + b.gallery.map(function (g) {
          return '<figure class="figure" data-src="' + esc(g.src) + '" data-cap="' + esc(g.cap || '') + '">'
            + '<img src="' + esc(g.src) + '" alt="' + esc(g.cap || '') + '" loading="lazy">'
            + (g.cap ? '<figcaption>' + inline(g.cap) + '</figcaption>' : '')
            + '</figure>';
        }).join('') + '</div>';
        return;
      }
      if (b.video) {
        out += '<div class="videobox" data-video="' + esc(b.video.src) + '">'
          + '<div class="videobox__empty"><b>DEMO VIDEO</b><span>' + inline(b.video.cap || '演示视频位：把录好的 mp4 放到指定路径即可自动播放。') + '</span></div>'
          + '</div>';
        return;
      }
      if (b.xml) { out += xmlLab(b.xml); return; }
      if (b.raw) { out += b.raw; return; }
    });
    return out;
  }

  /* ---------------------------------------------------------
     6. 章节
     --------------------------------------------------------- */
  function blocksFor(sec, mode) {
    if (mode === 'simple') return sec.simple || sec.core || [];
    if (mode === 'detailed') return (sec.core || []).concat(sec.deep || []);
    return sec.core || [];
  }

  function textOf(sec) {
    var parts = [sec.title, sec.en || '', (sec.tags || []).join(' ')];
    ['simple', 'core', 'deep'].forEach(function (k) {
      (sec[k] || []).forEach(function (b) {
        if (typeof b === 'string') parts.push(b);
        else {
          if (b.h) parts.push(b.h);
          if (b.h4) parts.push(b.h4);
          if (b.p) parts.push(b.p);
          if (b.ul) parts.push(b.ul.join(' '));
          if (b.ol) parts.push(b.ol.join(' '));
          if (b.kv) parts.push(b.kv.map(function (r) { return r.join(' '); }).join(' '));
          if (b.table) parts.push((b.table.head || []).join(' ') + ' ' + (b.table.rows || []).map(function (r) { return r.join(' '); }).join(' '));
          if (b.callout) parts.push(b.callout.title + ' ' + b.callout.text);
          if (b.code) parts.push(b.code.src);
          if (b.xml) parts.push(b.xml.lines.map(function (l) { return typeof l === 'string' ? l : (l.c + ' ' + l.n); }).join(' '));
        }
      });
    });
    return plainText(parts.join(' '));
  }

  function countChars(sec, mode) {
    var n = 0;
    blocksFor(sec, mode).forEach(function (b) {
      if (typeof b === 'string') n += b.length;
      else if (b.p) n += b.p.length;
      else if (b.ul) n += b.ul.join('').length;
      else if (b.ol) n += b.ol.join('').length;
      else if (b.code) n += b.code.src.length * 0.6;
    });
    return Math.round(n);
  }

  function readingTime(sec, mode) {
    var c = countChars(sec, mode);
    var mins = Math.max(1, Math.round(c / 320));
    return mins + ' 分钟';
  }

  var state = {
    mode: 'normal',
    activeId: null,
    read: {}
  };

  function buildSectionHtml(sec, mode) {
    var core = sec.core || [];
    var deep = sec.deep || [];
    var body;
    if (mode === 'simple') {
      body = renderBlocks(sec.simple || core);
    } else if (mode === 'detailed') {
      body = renderBlocks(core)
        + (deep.length ? '<h3 style="border-left-color:var(--yellow)">深度解析 · DEEP DIVE</h3>' + renderBlocks(deep) : '');
    } else {
      body = renderBlocks(core);
    }

    return '<article class="sec" id="' + sec.id + '" style="--pc:' + sec.part.color + '">'
      + '<header class="sec__head">'
      + '<div class="sec__no">' + sec.num + '</div>'
      + '<div class="sec__titles">'
      + '<h2>' + esc(sec.title) + '</h2>'
      + (sec.en ? '<div class="sec__en">' + esc(sec.en) + '</div>' : '')
      + '<div class="sec__meta">'
      + (sec.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('')
      + '<span class="tag tag--time">' + readingTime(sec, mode) + '</span>'
      + '</div></div></header>'
      + '<div class="sec__body">' + body + '</div>'
      + '</article>';
  }

  function renderSections() {
    document.getElementById('sections').innerHTML = SECTIONS.map(function (s) {
      return buildSectionHtml(s, state.mode);
    }).join('');
    probeVideos();
  }

  /* 委托只绑定一次，避免重渲染后重复触发 */
  function initDelegates() {
    document.getElementById('sections').addEventListener('click', function (e) {
      var btn = e.target.closest('.copybtn');
      if (btn) {
        var box = btn.closest('.codeblock');
        copyText(box.getAttribute('data-raw'), btn);
        return;
      }
      var row = e.target.closest('.xmlrow');
      if (row) {
        var lab = row.closest('.xmllab');
        lab.querySelectorAll('.xmlrow.is-on').forEach(function (r) { r.classList.remove('is-on'); });
        row.classList.add('is-on');
        var note = lab.querySelector('.xmlnote');
        note.querySelector('b').textContent = '第 ' + row.getAttribute('data-n') + ' 行';
        var nt = row.getAttribute('data-note');
        note.querySelector('.xmlnote__t').innerHTML = nt ? inline(nt) : '（这一行没有额外说明，看相邻行即可。）';
        return;
      }
      var fig = e.target.closest('.figure');
      if (fig) openLightbox(fig.getAttribute('data-src'), fig.getAttribute('data-cap'));
    });
  }

  /* 演示视频：存在才替换占位，不存在也不报错 */
  function probeVideos() {
    document.querySelectorAll('.videobox').forEach(function (box) {
      if (box.getAttribute('data-probed')) return;
      box.setAttribute('data-probed', '1');
      var src = box.getAttribute('data-video');
      if (!src) return;
      var probe = document.createElement('video');
      probe.preload = 'metadata';
      probe.muted = true;
      probe.playsInline = true;
      probe.controls = true;
      probe.addEventListener('loadedmetadata', function () {
        probe.removeAttribute('data-probed');
        box.innerHTML = '';
        box.appendChild(probe);
        var cap = document.createElement('figcaption');
        cap.style.cssText = 'padding:8px 12px;font-size:11.5px;color:var(--dim);border-top:1px solid var(--line)';
        cap.textContent = '演示视频 · ' + src;
        box.appendChild(cap);
      });
      probe.addEventListener('error', function () { });
      probe.src = src;
      probe.load();
    });
  }

  /* ---------------------------------------------------------
     7. 复制
     --------------------------------------------------------- */
  function copyText(text, btn) {
    var done = function () {
      if (btn) {
        btn.classList.add('is-done');
        var old = btn.querySelector('span');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>已复制';
        setTimeout(function () {
          btn.classList.remove('is-done');
          btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>复制';
        }, 1800);
        judge(btn);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else fallback();

    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { }
      document.body.removeChild(ta);
      done();
    }
  }

  var JUDGE_TEXTS = ['PERFECT', 'COPY!', '100%', 'NICE', 'SICK!'];
  function judge(btn) {
    var r = btn.getBoundingClientRect();
    var el = document.createElement('div');
    el.className = 'judge';
    el.textContent = JUDGE_TEXTS[Math.floor(Math.random() * JUDGE_TEXTS.length)];
    el.style.left = (r.left + r.width / 2) + 'px';
    el.style.top = (r.top - 6) + 'px';
    el.style.color = ['#57ef5f', '#38d9f2', '#ffd447', '#c24b99'][Math.floor(Math.random() * 4)];
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 900);
  }

  /* ---------------------------------------------------------
     8. 左侧导航
     --------------------------------------------------------- */
  function renderRail() {
    var html = '<div class="rail__head"><span>CHART / 目录</span><span>' + SECTIONS.length + ' 节</span></div>';
    PARTS.forEach(function (part, pi) {
      html += '<div class="rail__part" style="--pc:' + part.color + '"><i></i><span>' + esc(part.name) + '</span><em>' + esc(part.short || '') + '</em></div>';
      (part.sections || []).forEach(function (s, si) {
        var rot = (pi + si) % 4 * 90;
        html += '<a class="rail__item" href="#' + s.id + '" data-id="' + s.id + '" style="--pc:' + part.color + '">'
          + '<span class="rail__num">' + s.num + '</span>'
          + '<svg class="rail__arrow" style="--rot:' + rot + 'deg" viewBox="0 0 10 10"><path d="M1 1 L9 5 L1 9 Z"/></svg>'
          + '<span class="rail__t">' + esc(s.title) + '</span></a>';
      });
    });
    document.getElementById('rail').innerHTML = html;

    document.getElementById('rail').addEventListener('click', function (e) {
      var a = e.target.closest('.rail__item');
      if (!a) return;
      e.preventDefault();
      scrollToSection(a.getAttribute('data-id'));
    });
  }

  /* ---------------------------------------------------------
     9. 右侧仪表
     --------------------------------------------------------- */
  function renderHud() {
    var total = SECTIONS.length;
    var codes = 0;
    SECTIONS.forEach(function (s) {
      ['core', 'deep', 'simple'].forEach(function (k) {
        (s[k] || []).forEach(function (b) { if (b && b.code) codes++; });
      });
    });

    var html = ''
      + '<div class="hud__card">'
      + '<div class="hud__label"><span>READING PROGRESS</span><b id="hudPct">0%</b></div>'
      + '<div class="ring">'
      + '<svg viewBox="0 0 64 64"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0%" stop-color="#c24b99"/><stop offset="55%" stop-color="#38d9f2"/><stop offset="100%" stop-color="#57ef5f"/>'
      + '</linearGradient></defs>'
      + '<circle class="track" cx="32" cy="32" r="27"/>'
      + '<circle class="bar" id="ringBar" cx="32" cy="32" r="27" stroke-dasharray="169.6" stroke-dashoffset="169.6"/>'
      + '</svg>'
      + '<div class="ring__txt"><strong id="hudRead">0</strong><span>/ ' + total + ' 节读完</span></div>'
      + '</div></div>'

      + '<div class="hud__card">'
      + '<div class="hud__label"><span>CURRENT SECTION</span><b id="hudMode">' + state.mode.toUpperCase() + '</b></div>'
      + '<div class="hud__now" id="hudNow"><span>NOW READING</span>—</div>'
      + '<div class="stat"><span>章节总数</span><b>' + total + '</b></div>'
      + '<div class="stat"><span>示例代码块</span><b>' + codes + '</b></div>'
      + '<div class="stat"><span>当前模式字数</span><b id="hudChars">—</b></div>'
      + '<div class="stat"><span>文档整理</span><b>2026-10-23</b></div>'
      + '</div>'

      + '<div class="hud__card">'
      + '<div class="hud__label"><span>ENGINE</span><b>#1392</b></div>'
      + '<div class="stat"><span>版本</span><b>1.1.0</b></div>'
      + '<div class="stat"><span>Mod API</span><b>v3</b></div>'
      + '<div class="stat"><span>3D 后端</span><b>foxlite</b></div>'
      + '<div style="margin-top:10px"><a class="btn btn--primary" style="padding:9px;font-size:12.5px" href="https://codename-engine.com/wiki/" target="_blank" rel="noopener noreferrer">官方 Wiki ↗</a></div>'
      + '</div>'

      + '<div class="hud__card">'
      + '<div class="hud__label"><span>OPTIONS</span><b>LIVE</b></div>'
      + '<label class="toggle"><span>节拍脉冲背景</span><input type="checkbox" id="optBeat"><span class="toggle__sw"></span></label>'
      + '<label class="toggle" style="margin-top:8px"><span>代码自动换行</span><input type="checkbox" id="optWrap"><span class="toggle__sw"></span></label>'
      + '</div>'

      + '<div class="hud__card">'
      + '<div class="hud__label"><span>SHORTCUTS</span><b>?</b></div>'
      + '<div class="keys">'
      + '<div><span>简单 / 普通 / 详细</span><span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd></span></div>'
      + '<div><span>搜索</span><span><kbd>Ctrl</kbd>+<kbd>K</kbd></span></div>'
      + '<div><span>上一章 / 下一章</span><span><kbd>K</kbd><kbd>J</kbd></span></div>'
      + '<div><span>帮助</span><span><kbd>?</kbd></span></div>'
      + '</div></div>';

    document.getElementById('hud').innerHTML = html;

    document.getElementById('optBeat').addEventListener('change', function (e) {
      document.body.classList.toggle('beatpulse', e.target.checked);
    });
    document.getElementById('optWrap').addEventListener('change', function (e) {
      document.body.classList.toggle('codewrap', e.target.checked);
    });
    updateHudChars();
  }

  function updateHudChars() {
    var n = 0;
    SECTIONS.forEach(function (s) { n += countChars(s, state.mode); });
    var el = document.getElementById('hudChars');
    if (el) el.textContent = (n / 1000).toFixed(1) + 'k 字';
    var m = document.getElementById('hudMode');
    if (m) m.textContent = state.mode.toUpperCase();
  }

  /* ---------------------------------------------------------
     10. 进度 / 当前章节
     --------------------------------------------------------- */
  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;

    document.getElementById('hbFill').style.width = (p * 100) + '%';
    document.getElementById('hbPin').style.left = (p * 100) + '%';
  }

  function trackActive() {
    if (Date.now() < trackLockUntil) return;

    var secs = Array.prototype.slice.call(document.querySelectorAll('.sec'));
    if (!secs.length) return;

    // 判定线：视口上方 45%（上限 300px，下限 140px）
    // 只要某节的标题进入这条线以上，就认为「正在读这一节」
    var vh = window.innerHeight || 800;
    var line = Math.max(140, Math.min(300, vh * 0.45));

    var cur = secs[0];
    for (var i = 0; i < secs.length; i++) {
      var r = secs[i].getBoundingClientRect();
      if (r.top <= line) cur = secs[i];
      else break;
    }
    if (!cur) return;
    if (cur.id === state.activeId) return;
    applyActive(cur);
  }

  /* 把某一节设为「当前节」：左栏高亮 + 仪表 + 已读统计 */
  function applyActive(sec) {
    if (!sec) return;
    var id = sec.id;
    state.activeId = id;

    document.querySelectorAll('.rail__item').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-id') === id);
    });

    // 让当前章节在左栏里保持可见（只滚动左栏，不动页面）
    var rail = document.getElementById('rail');
    var act = rail && rail.querySelector('.rail__item.is-active');
    if (act && rail.scrollHeight > rail.clientHeight) {
      var rr = rail.getBoundingClientRect();
      var ar = act.getBoundingClientRect();
      if (ar.top < rr.top + 10) rail.scrollTop -= (rr.top + 10 - ar.top);
      else if (ar.bottom > rr.bottom - 10) rail.scrollTop += (ar.bottom - rr.bottom + 10);
    }

    var now = document.getElementById('hudNow');
    if (now) now.innerHTML = '<span>NOW READING · ' + esc(sec.part.short || '') + '</span>' + esc(sec.title);

    state.read[id] = true;
    var readCount = Object.keys(state.read).length;
    var rd = document.getElementById('hudRead');
    if (rd) rd.textContent = readCount;

    var total = SECTIONS.length;
    var ratio = total ? readCount / total : 0;
    var ringBar = document.getElementById('ringBar');
    if (ringBar) {
      var C = 2 * Math.PI * 27;
      ringBar.style.strokeDashoffset = String(C * (1 - ratio));
    }
    var pctEl = document.getElementById('hudPct');
    if (pctEl) pctEl.textContent = Math.round(ratio * 100) + '%';
  }

  /* 精确跳转到某一节：自己算落点，避免 scroll-margin / 平滑滚动漂移 */
  var trackLockUntil = 0;

  function topbarHeight() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--topbar-h');
    var n = parseInt(v, 10);
    return isNaN(n) ? 62 : n;
  }

  function scrollToSection(id, smooth) {
    var el = document.getElementById(id);
    if (!el) return;

    var target = el.getBoundingClientRect().top + window.scrollY - topbarHeight() - 18;
    target = Math.max(0, target);

    // 跳转期间锁住自动跟踪，避免动画途中高亮乱跳
    trackLockUntil = Date.now() + 700;

    window.scrollTo({ top: target, behavior: smooth === false ? 'auto' : 'smooth' });
    try { history.replaceState(null, '', '#' + id); } catch (e) { }

    var sec = SECTIONS.filter(function (s) { return s.id === id; })[0];
    if (sec) applyActive(sec);

    setTimeout(function () {
      trackLockUntil = 0;
      trackActive();
    }, 720);
  }

  /* ---------------------------------------------------------
     11. 模式切换
     --------------------------------------------------------- */
  function setMode(mode, silent) {
    if (!mode || mode === state.mode) return;
    state.mode = mode;

    document.querySelectorAll('.modeswitch__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mode') === mode ? 'true' : 'false');
    });
    try { localStorage.setItem('cne-mode', mode); } catch (e) { }

    var anchorId = state.activeId;

    renderSections();
    resetBindingsAfterRender();
    updateHudChars();

    // 重新渲染后按「当前章节」的真实新位置定位，避免前面章节变长导致跑偏
    if (anchorId) scrollToSection(anchorId, false);
    if (!silent) toast('MODE → ' + ({ simple: '简单', normal: '普通', detailed: '详细' })[mode]);
  }

  function resetBindingsAfterRender() {
    // 章节重渲染后，重新把当前高亮补回去
    if (state.activeId) {
      document.querySelectorAll('.rail__item').forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-id') === state.activeId);
      });
    }
    trackActive();
  }

  /* ---------------------------------------------------------
     12. Toast
     --------------------------------------------------------- */
  function toast(msg) {
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);'
      + 'background:#111823;border:1px solid #33415a;color:#dfe8f6;font-family:var(--mono);'
      + 'font-size:11px;letter-spacing:1.4px;padding:9px 16px;border-radius:8px;z-index:480;'
      + 'box-shadow:0 10px 30px rgba(0,0,0,.6);pointer-events:none;transition:opacity .3s,transform .3s';
    document.body.appendChild(el);
    setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translate(-50%,8px)'; }, 1300);
    setTimeout(function () { el.remove(); }, 1750);
  }

  /* ---------------------------------------------------------
     13. 弹层：gate / palette / sheet / lightbox
     --------------------------------------------------------- */
  function openGate() {
    document.getElementById('gate').classList.add('is-open');
    document.body.classList.add('is-gated');
  }
  function closeGate() {
    document.getElementById('gate').classList.remove('is-open');
    document.body.classList.remove('is-gated');
    try { localStorage.setItem('cne-gate', '1'); } catch (e) { }
  }

  function openSheet() { document.getElementById('sheet').classList.add('is-open'); }
  function closeSheet() { document.getElementById('sheet').classList.remove('is-open'); }

  function openLightbox(src, cap) {
    var lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightboxCap').textContent = cap || '';
    lb.classList.add('is-open');
  }
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('is-open');
  }

  /* 搜索 */
  var searchIndex = [];
  function buildSearch() {
    searchIndex = SECTIONS.map(function (s) {
      return {
        id: s.id,
        num: s.num,
        title: s.title,
        part: s.part.short || s.part.name,
        hay: textOf(s).toLowerCase()
      };
    });
  }

  function openPalette() {
    document.getElementById('palette').classList.add('is-open');
    var inp = document.getElementById('paletteInput');
    inp.value = '';
    inp.focus();
    renderResults('');
  }
  function closePalette() {
    document.getElementById('palette').classList.remove('is-open');
  }

  var selIdx = 0, results = [];
  function renderResults(q) {
    q = q.trim().toLowerCase();
    results = searchIndex.filter(function (it) {
      return !q || it.title.toLowerCase().indexOf(q) !== -1 || it.hay.indexOf(q) !== -1;
    }).map(function (it) {
      var score = 0;
      if (q && it.title.toLowerCase().indexOf(q) !== -1) score += 10;
      if (q && it.hay.indexOf(q) !== -1) score += 2;
      return { it: it, score: score };
    }).sort(function (a, b) { return b.score - a.score; }).map(function (x) { return x.it; });

    if (!q) results = results;
    selIdx = 0;

    var host = document.getElementById('paletteList');
    if (!results.length) {
      host.innerHTML = '<div class="palette__empty">没有匹配的章节。试试「着色器」「XML」「设置」「pack」。</div>';
      return;
    }
    host.innerHTML = results.slice(0, 40).map(function (it, i) {
      return '<div class="palette__item' + (i === 0 ? ' is-sel' : '') + '" data-id="' + it.id + '">'
        + '<b>' + it.num + '</b><span>' + esc(it.title) + '</span><small>' + esc(it.part) + '</small></div>';
    }).join('');
  }

  function moveSel(d) {
    var items = document.querySelectorAll('.palette__item');
    if (!items.length) return;
    selIdx = (selIdx + d + items.length) % items.length;
    items.forEach(function (el, i) { el.classList.toggle('is-sel', i === selIdx); });
    items[selIdx].scrollIntoView({ block: 'nearest' });
  }

  function goSel() {
    var el = document.querySelectorAll('.palette__item')[selIdx];
    if (!el) return;
    closePalette();
    scrollToSection(el.getAttribute('data-id'));
  }

  /* ---------------------------------------------------------
     14. 键盘
     --------------------------------------------------------- */
  var keyBuf = '';
  var sevenCount = 0, sevenTimer = null;
  var userScrolled = false;

  // 用户一旦自己滚动/翻页，就不再自动对齐锚点
  ['wheel', 'touchmove'].forEach(function (ev) {
    window.addEventListener(ev, function () { userScrolled = true; }, { passive: true });
  });
  document.addEventListener('keydown', function (e) {
    if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End', ' '].indexOf(e.key) !== -1) userScrolled = true;
  });

  function onKey(e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea';

    // 命令面板打开时，优先处理面板内的按键（输入框也算）
    var palOpen = document.getElementById('palette').classList.contains('is-open');
    if (palOpen) {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(-1); return; }
      if (e.key === 'Enter') { e.preventDefault(); goSel(); return; }
      if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }
      return; // 其余按键交给输入框
    }

    if (e.key === 'Escape') {
      closeSheet(); closeLightbox();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault(); openPalette(); return;
    }
    if (typing) return;

    if (e.key === '/') { e.preventDefault(); openPalette(); return; }
    if (e.key === '?') { e.preventDefault(); openSheet(); return; }
    if (e.key === '1') { setMode('simple'); return; }
    if (e.key === '2') { setMode('normal'); return; }
    if (e.key === '3') { setMode('detailed'); return; }

    if (e.key.toLowerCase() === 'j') { jumpSection(1); return; }
    if (e.key.toLowerCase() === 'k') { jumpSection(-1); return; }

    if (e.key.toLowerCase() === 'g') { keyBuf = 'g'; setTimeout(function () { keyBuf = ''; }, 900); return; }
    if (e.key.toLowerCase() === 't' && keyBuf === 'g') {
      window.scrollTo({ top: 0, behavior: 'smooth' }); keyBuf = ''; return;
    }

    // 彩蛋：连按三次 7
    if (e.key === '7') {
      sevenCount++;
      clearTimeout(sevenTimer);
      sevenTimer = setTimeout(function () { sevenCount = 0; }, 1400);
      if (sevenCount >= 3) {
        sevenCount = 0;
        document.body.classList.add('dev-unlocked');
        toast('DEV ACCESS GRANTED · 你找到了隐藏的开发者入口');
        var hud = document.getElementById('hud');
        if (hud && !document.getElementById('hudSecret')) {
          var card = document.createElement('div');
          card.className = 'hud__card';
          card.id = 'hudSecret';
          card.innerHTML = '<div class="hud__label"><span>DEV ACCESS</span><b>UNLOCKED</b></div>'
            + '<div class="stat"><span>文档构建</span><b>cne-docs/1</b></div>'
            + '<div class="stat"><span>渲染</span><b>原生 DOM</b></div>'
            + '<div class="stat"><span>依赖</span><b>0</b></div>'
            + '<div class="stat"><span>评论区</span><b>无（永不添加）</b></div>'
            + '<div class="stat"><span>制作</span><b>一人制作</b></div>';
          hud.appendChild(card);
        }
      }
    }
  }

  function jumpSection(d) {
    var idx = SECTIONS.findIndex ? SECTIONS.findIndex(function (s) { return s.id === state.activeId; })
      : (function () { for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].id === state.activeId) return i; return 0; })();
    if (idx < 0) idx = 0;
    var next = SECTIONS[Math.min(SECTIONS.length - 1, Math.max(0, idx + d))];
    if (next) scrollToSection(next.id);
  }

  /* ---------------------------------------------------------
     15. 启动
     --------------------------------------------------------- */
  function init() {
    // 恢复上次的阅读模式（没有就用普通）
    try {
      var saved = localStorage.getItem('cne-mode');
      if (saved === 'simple' || saved === 'normal' || saved === 'detailed') state.mode = saved;
    } catch (e) { }
    document.querySelectorAll('.modeswitch__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-mode') === state.mode ? 'true' : 'false');
    });

    // 委托（只绑一次）
    initDelegates();

    // 章节
    renderSections();
    renderRail();
    renderHud();
    buildSearch();

    // 门禁
    document.getElementById('gateStay').addEventListener('click', closeGate);
    document.getElementById('gate').addEventListener('click', function (e) {
      if (e.target === this) closeGate();
    });
    // 弹窗打开时，Enter 直接继续（但如果焦点在「官方 Wiki」链接上，就让链接正常跳转）
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      if (!document.body.classList.contains('is-gated')) return;
      var ae = document.activeElement;
      if (ae && ae.tagName === 'A' && ae.closest && ae.closest('#gate')) return;
      e.preventDefault();
      closeGate();
    });

    // 模式
    document.querySelectorAll('.modeswitch__btn').forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });

    // 顶栏按钮
    document.getElementById('btnSearch').addEventListener('click', openPalette);
    document.getElementById('btnKeys').addEventListener('click', openSheet);
    document.getElementById('sheetClose').addEventListener('click', closeSheet);
    document.getElementById('sheet').addEventListener('click', function (e) { if (e.target === this) closeSheet(); });
    document.getElementById('footerKeys').addEventListener('click', function (e) { e.preventDefault(); openSheet(); });

    var txtLink = document.getElementById('footerTxt');
    if (txtLink) {
      txtLink.setAttribute('href', 'CodenameEngine-使用与开发说明.txt');
      txtLink.setAttribute('target', '_blank');
      txtLink.setAttribute('rel', 'noopener');
    }

    // 搜索交互
    var pi = document.getElementById('paletteInput');
    pi.addEventListener('input', function () { renderResults(pi.value); });
    document.getElementById('paletteList').addEventListener('click', function (e) {
      var it = e.target.closest('.palette__item');
      if (!it) return;
      closePalette();
      scrollToSection(it.getAttribute('data-id'));
    });
    document.getElementById('palette').addEventListener('click', function (e) {
      if (e.target === this) closePalette();
    });

    // 灯箱
    document.getElementById('lightbox').addEventListener('click', closeLightbox);

    // 滚动
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          updateProgress();
          trackActive();
          ticking = false;
        });
      }
    }, { passive: true });

    window.addEventListener('resize', function () { updateProgress(); });

    document.addEventListener('keydown', onKey);

    // 初始定位
    var rl = document.getElementById('rail');
    if (rl) rl.scrollTop = 0;
    updateProgress();
    trackActive();
    if (location.hash) {
      var hid = location.hash.slice(1);
      setTimeout(function () { scrollToSection(hid, false); }, 140);
      // 图片/字体加载完高度会变，若用户还没手动滚过，就再对齐一次
      window.addEventListener('load', function () {
        if (!userScrolled) setTimeout(function () { scrollToSection(hid, false); }, 60);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ============================================================
   背景音乐：CC0 素材（Juhani Junkala / Chiptune Adventures）
   - 首次必须由用户手势触发（浏览器自动播放策略）
   - 默认开，可记忆，可 M 键切换
   ============================================================ */
(function bgmPlayer() {
  var audio = document.getElementById('bgm');
  var btn = document.getElementById('btnBgm');
  if (!audio || !btn) return;

  var KEY = 'cne-bgm';
  var TARGET = 0.22;           // 目标音量
  var started = false;
  var fadeTimer = null;

  function wantOn() {
    try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; }
  }
  function remember(on) {
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
  }
  function paint() {
    var on = !audio.paused && !audio.ended;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('is-on', on);
    btn.title = on ? '背景音乐：开（M 关闭）' : '背景音乐：关（M 开启）';
  }
  function fadeTo(to, ms) {
    if (fadeTimer) clearInterval(fadeTimer);
    var from = audio.volume;
    var steps = Math.max(1, Math.round(ms / 40));
    var i = 0;
    fadeTimer = setInterval(function () {
      i++;
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
      if (i >= steps) { clearInterval(fadeTimer); fadeTimer = null; }
    }, 40);
  }
  function play() {
    if (!audio.paused) return;
    audio.volume = 0;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { paint(); });
    fadeTo(TARGET, 1200);
    started = true;
    paint();
  }
  function stop() {
    if (audio.paused) return;
    fadeTo(0, 300);
    setTimeout(function () { audio.pause(); paint(); }, 320);
  }

  btn.addEventListener('click', function () {
    if (audio.paused) { remember(true); play(); }
    else { remember(false); stop(); }
  });

  // 用户手势：关掉警示弹窗时开始播放
  var gateStay = document.getElementById('gateStay');
  if (gateStay) gateStay.addEventListener('click', function () { if (wantOn()) setTimeout(play, 260); });
  var gateBtn = document.getElementById('gateWiki');
  if (gateBtn) gateBtn.addEventListener('click', function () { if (wantOn()) setTimeout(play, 260); });

  // M 键切换（不在输入框里时）
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'm' || e.key === 'M') {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      btn.click();
    }
  });

  // 关掉过一次就不再自动播
  audio.addEventListener('pause', paint);
  audio.addEventListener('playing', paint);

  paint();
  // 如果用户之前手动关过，保持关闭；否则等弹窗手势
  if (!document.body.classList.contains('is-gated') && wantOn()) play();
})();
