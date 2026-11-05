/* ============================================================
   UI 增强：主题 / 缩放 / 背景开关 / 简约模式 / 开发者模式 / 更新日志
   全部状态存在 localStorage，刷新后保持。
   ============================================================ */
(function uiExtras() {
  var html = document.documentElement;
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------- 主题 ---------------- */
  var THEME_KEY = 'cne-theme';
  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    LS.set(THEME_KEY, t);
    var seg = document.getElementById('themeSeg');
    if (seg) [].forEach.call(seg.children, function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-theme') === t);
    });
  }
  applyTheme(LS.get(THEME_KEY, 'dark'));

  /* ---------------- 缩放 ---------------- */
  var ZOOM_KEY = 'cne-zoom';
  var ZOOM_LABEL = ['86%', '100%', '114%', '130%', '150%'];
  var zoom = parseInt(LS.get(ZOOM_KEY, '1'), 10);
  if (isNaN(zoom) || zoom < 0 || zoom > 4) zoom = 1;

  function applyZoom(z) {
    zoom = Math.max(0, Math.min(4, z));
    html.setAttribute('data-zoom', String(zoom));
    LS.set(ZOOM_KEY, String(zoom));
    var lab = document.getElementById('zoomLabel');
    if (lab) lab.textContent = ZOOM_LABEL[zoom];
  }
  applyZoom(zoom);

  /* ---------------- 背景因果线 ---------------- */
  var BG_KEY = 'cne-bgfx';
  function applyBg(on) {
    LS.set(BG_KEY, on ? 'on' : 'off');
    if (window.CNE_BGFX) {
      if (on) window.CNE_BGFX.enable(); else window.CNE_BGFX.disable();
    }
    // causal.js 启动时也会读 localStorage，这里同步一份
    try { localStorage.setItem('cne-bgfx', on ? 'on' : 'off'); } catch (e) {}
    var off = document.getElementById('bgfxOff');
    var onB = document.getElementById('bgfxOn');
    if (off) off.classList.toggle('is-on', !on);
    if (onB) onB.classList.toggle('is-on', on);
  }
  // 默认关闭
  applyBg(LS.get(BG_KEY, 'off') === 'on');

  /* ---------------- 简约 / 复杂 ---------------- */
  var UI_KEY = 'cne-ui';
  function applyUi(mode) {
    html.setAttribute('data-ui', mode);
    LS.set(UI_KEY, mode);
    var c = document.getElementById('uiComplex');
    var s = document.getElementById('uiSimple');
    if (c) c.classList.toggle('is-on', mode === 'complex');
    if (s) s.classList.toggle('is-on', mode === 'simple');
  }
  applyUi(LS.get(UI_KEY, 'complex'));

  /* ---------------- 开发者模式 ---------------- */
  var DEV_KEY = 'cne-dev';
  function applyDev(on) {
    document.body.classList.toggle('dev-mode', on);
    LS.set(DEV_KEY, on ? 'on' : 'off');
  }
  applyDev(LS.get(DEV_KEY, 'off') === 'on');

  /* ---------------- 设置面板 ---------------- */
  var sheet = document.getElementById('settingsSheet');
  function openSheet(open) {
    if (!sheet) return;
    sheet.classList.toggle('is-open', open);
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function bind(id, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }

  bind('btnSettings', function () { openSheet(!sheet.classList.contains('is-open')); });
  bind('settingsClose', function () { openSheet(false); });
  if (sheet) sheet.addEventListener('click', function (e) { if (e.target === sheet) openSheet(false); });

  var seg = document.getElementById('themeSeg');
  if (seg) [].forEach.call(seg.children, function (b) {
    b.addEventListener('click', function () { applyTheme(b.getAttribute('data-theme')); });
  });

  bind('zoomIn', function () { applyZoom(zoom + 1); });
  bind('zoomOut', function () { applyZoom(zoom - 1); });
  bind('bgfxOn', function () { applyBg(true); });
  bind('bgfxOff', function () { applyBg(false); });
  bind('uiComplex', function () { applyUi('complex'); });
  bind('uiSimple', function () { applyUi('simple'); });
  bind('devToggle', function () { applyDev(!document.body.classList.contains('dev-mode')); });

  /* 快捷键：7 = 开发者模式（标注：正在开发中） */
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === '7' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      applyDev(!document.body.classList.contains('dev-mode'));
    }
  });

  /* ---------------- 更新日志 ---------------- */
  var VERSIONS = [
    {
      tag: 'v1.2',
      date: '2026-10-23',
      title: '界面与体验大更新',
      latest: true,
      items: [
        '<b>因果线背景</b>：改成「丝线 + 星尘」，颜色变浅，<b>默认关闭</b>，可在 ⚙ 设置里打开</b>',
        '<b>白天 / 黑夜主题</b>：⚙ 设置一键切换，黑夜模式为护眼底色',
        '<b>字号缩放</b>：86% / 100% / 114% / 130% / 150% 五档，设置面板里点 A− / A＋',
        '<b>简约模式</b>：隐藏左右栏与背景特效，专为手机/平板排版',
        '<b>开发者模式</b>：按 <b>7</b> 开关（右下角角标提示「正在开发中」）',
        '<b>备用入口</b>：页面顶部常驻 GitHub 仓库 / Pages 镜像 / ZIP 下载三条链接',
        '<b>更新内容</b>：你正在看的这个区域，含版本选择器',
        '<b>第五部分完整示例</b>：12 节各补一个可直接运行的文件级示例',
        '<b>工具</b>：新增 <code>tools/diff-versions.py</code>，可对比两个版本文件夹'
      ]
    },
    {
      tag: 'v1.1',
      date: '2026-10-22',
      title: '补遗：把漏掉的全捞回来',
      items: [
        '新增<b>第六部分 · 配与修</b>（8 节）：自定义设置项 / 自定义按键 / StateRedirects / flags.ini / 命令行 / 日志崩溃 / 性能 / 报错速查',
        '<b>195 个 Flags 全表</b>（按字母序，含类型与默认值）',
        '<b>回调补遗 53 个</b>，含 7 个「脚本给引擎返回值」的资源提供者钩子',
        '<b>事件对象补遗 9 个</b>（共 53 个事件类）',
        '<code>Options</code> 全部 86 个非按键字段表',
        '<code>CoolUtil</code> / <code>Conductor</code> / <code>Paths</code> 的遗漏成员补齐'
      ]
    },
    {
      tag: 'v1.0',
      date: '2026-10-21',
      title: '初版：四部分 26 节',
      items: [
        '第一部分 · 认识它（4 节）：文档定位 / 引擎表面 / 引擎深处 / 制作团队',
        '第二部分 · 用它（10 节）：界面地图 / 标题 / 主菜单 / Freeplay / 故事 / 暂停 / 设置 / 开发者模式 / 控制台 / 编辑器',
        '第三部分 · 摸清它（3 节）：目录总览 / 模组文件格式 / XML 逐行解剖',
        '第四部分 · 改它（9 节）：Haxe 语法 / Shader / NDLL / 3D / 命令代码 / 调源码 / 事件与 pack / 整合 / 客观评价'
      ]
    }
  ];

  var sel = document.getElementById('verSelect');
  var list = document.getElementById('changeList');
  var banner = document.getElementById('verBanner');

  function renderVersion(idx) {
    if (!list) return;
    var v = VERSIONS[idx];
    if (!v) return;
    list.innerHTML = VERSIONS.map(function (x, i) {
      if (i !== idx) return '';
      return '<div class="ver">' +
        '<div class="ver__top"><span class="ver__tag">' + x.tag + '</span>' +
        '<span class="ver__date">' + x.date + '</span></div>' +
        '<div class="ver__title">' + x.title + '</div>' +
        '<ul>' + x.items.map(function (it) { return '<li>' + it + '</li>'; }).join('') + '</ul>' +
        '</div>';
    }).join('');
    if (banner) {
      if (v.latest) { banner.hidden = true; banner.textContent = ''; }
      else {
        banner.hidden = false;
        banner.textContent = '你正在查看 ' + v.tag + ' 的更新记录。正文内容始终是最新版（' + VERSIONS[0].tag + '）。';
      }
    }
  }

  /* ---------------- 更新前后对比（读 changes.json）---------------- */
  var DIFF = null;
  var diffBox = document.createElement('div');
  diffBox.className = 'verdiff';
  diffBox.hidden = true;

  function renderDiff(idx) {
    if (!DIFF || !diffBox) return;
    var v = (DIFF.versions || [])[idx];
    if (!v) { diffBox.hidden = true; return; }
    var s = v.stats || {};
    var rows = (v.files || []).map(function (f) {
      var cls = f.status === 'added' ? 'add' : (f.status === 'removed' ? 'del' : 'mod');
      var sign = f.status === 'added' ? '新增' : (f.status === 'removed' ? '删除' : '修改');
      return '<tr class="' + cls + '">' +
        '<td><code>' + f.path + '</code></td>' +
        '<td>' + sign + '</td>' +
        '<td class="num">+' + (f.lines_added || 0) + '</td>' +
        '<td class="num">-' + (f.lines_removed || 0) + '</td>' +
        '<td>' + (f.note || '') + '</td>' +
        '</tr>';
    }).join('');

    diffBox.innerHTML =
      '<h3 class="verdiff__title">' + v.tag + ' 的文件级改动</h3>' +
      '<p class="verdiff__sum">新增 <b>' + (s.added || 0) + '</b> · 修改 <b>' + (s.modified || 0) +
      '</b> · 删除 <b>' + (s.removed || 0) + '</b> · 行 <b>+' + (s.lines_added || 0) +
      '</b> / <b>-' + (s.lines_removed || 0) + '</b></p>' +
      '<div class="verdiff__wrap"><table class="verdiff__table">' +
      '<thead><tr><th>文件</th><th>类型</th><th>+</th><th>−</th><th>说明</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>' +
      '<p class="verdiff__hint">这张表由 <code>tools/diff-versions.py</code> 生成的数据渲染；' +
      '真实使用时把脚本输出的 JSON 放进 <code>assets/data/changes.json</code> 即可。</p>';
    diffBox.hidden = false;
  }

  fetch('assets/data/changes.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      DIFF = j;
      if (list && list.parentNode) list.parentNode.insertBefore(diffBox, list.nextSibling);
      var cur = sel ? parseInt(sel.value, 10) || 0 : 0;
      renderDiff(cur);
    })
    .catch(function () { /* 没有 changes.json 就静默跳过 */ });

  if (sel) {
    sel.innerHTML = VERSIONS.map(function (v, i) {
      return '<option value="' + i + '">' + v.tag + ' · ' + v.title + '</option>';
    }).join('');
    sel.addEventListener('change', function () {
      var i = parseInt(sel.value, 10) || 0;
      renderVersion(i);
      renderDiff(i);
    });
    renderVersion(0);
  }

  /* 有资料更新时提示一次 */
  var SEEN_KEY = 'cne-seen-ver';
  var latest = VERSIONS[0].tag;
  if (LS.get(SEEN_KEY, '') !== latest) {
    LS.set(SEEN_KEY, latest);
    setTimeout(function () {
      var tip = document.createElement('div');
      tip.className = 'update-tip';
      tip.innerHTML = '<b>资料已更新到 ' + latest + '</b><span>' + VERSIONS[0].title + '</span>' +
        '<button type="button">看更新内容</button>';
      tip.querySelector('button').addEventListener('click', function () {
        var cl = document.getElementById('changelog');
        if (cl) cl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        tip.remove();
      });
      document.body.appendChild(tip);
      setTimeout(function () { if (tip.parentNode) tip.remove(); }, 12000);
    }, 1800);
  }
})();


/* ============================================================
   简版目录：仅在简约模式显示
   数据来源：优先读 #sections 里已渲染的 section，其次读 rail 链接
   ============================================================ */
(function miniToc(){
  var sel = document.getElementById('tocSelect');
  var prev = document.getElementById('tocPrev');
  var next = document.getElementById('tocNext');
  if (!sel) return;

  function collect() {
    var out = [];
    // ① 首选：左栏导航链接（引擎已渲染，标签干净且带编号）
    var links = document.querySelectorAll('#rail a[href^="#"]');
    for (var j = 0; j < links.length; j++) {
      var a = links[j];
      var id = a.getAttribute('data-id') || a.getAttribute('href').slice(1);
      var label = a.textContent.replace(/\s+/g, ' ').trim();
      if (id && label) out.push({ id: id, label: label });
    }
    // ② 兜底：直接从 section 取
    if (!out.length) {
      var nodes = document.querySelectorAll('#sections [id]');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var h = el.querySelector('h2, h3');
        var t2 = el.getAttribute('data-title') || (h ? h.textContent : '');
        if (t2) out.push({ id: el.id, label: t2.trim() });
      }
    }
    return out;
  }

  var items = [];
  function build() {
    items = collect().filter(function (x) { return x.id; });
    if (!items.length) return false;
    sel.innerHTML = items.map(function (x) {
      return '<option value="' + x.id + '">' + x.label + '</option>';
    }).join('');
    return true;
  }

  if (!build()) {
    // 渲染可能有延迟，重试几次
    var tries = 0;
    var t = setInterval(function () {
      if (build() || ++tries > 20) clearInterval(t);
    }, 150);
  }

  function idx(id) {
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return i;
    return 0;
  }

  sel.addEventListener('change', function () {
    var id = sel.value;
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  if (prev) prev.addEventListener('click', function () {
    var i = Math.max(0, idx(sel.value) - 1);
    sel.value = items[i].id; sel.dispatchEvent(new Event('change'));
  });
  if (next) next.addEventListener('click', function () {
    var i = Math.min(items.length - 1, idx(sel.value) + 1);
    sel.value = items[i].id; sel.dispatchEvent(new Event('change'));
  });

  // 滚动时同步下拉框
  var lock = 0;
  window.addEventListener('scroll', function () {
    if (Date.now() < lock) return;
    lock = Date.now() + 250;
    var best = null, bestTop = -1e9;
    for (var i = 0; i < items.length; i++) {
      var el = document.getElementById(items[i].id);
      if (!el) continue;
      var top = el.getBoundingClientRect().top;
      if (top < 160 && top > bestTop) { bestTop = top; best = items[i].id; }
    }
    if (best && sel.value !== best) sel.value = best;
  }, { passive: true });
})();
