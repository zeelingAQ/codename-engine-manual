/* ============================================================
   因果线 v3 —— 「少而活」
   这次修的：
     1. 线太多 → 8 条（原来 15 条）
     2. 鼠标没反应 → 光标变成「牵线的手」：把附近的线明显拉向自己，
        并画出可见的牵线 + 光环 + 移动火花
     3. 线是单向漂的 → 每个控制点都有 x / y 往复摆动，
        另有整片横向摇摆，看起来是「来回游动」
   ============================================================ */
(function causalThreadsV3() {
  var canvas = document.getElementById('causal');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  var fxCanvas = document.getElementById('causal-fx');
  var fxc = fxCanvas && fxCanvas.getContext ? fxCanvas.getContext('2d', { alpha: true }) : null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 0, H = 0, DPR = 1, CX = 0, CY = 0;
  var running = true, raf = 0, lastT = 0;

  var WARM = [[255, 82, 64], [255, 128, 74], [214, 84, 46], [255, 180, 126]];
  var COOL = [[150, 214, 255], [235, 244, 255]];

  var filaments = [];
  var dust = [];
  var shocks = [];
  var sparks = [];
  var mouse = { x: -9999, y: -9999, active: false };
  var realMoved = false;   // 真实鼠标动过没有（没动过就自己演示）
  var CALM = reduce ? 0.8 : 1;      // 减少动效时略放慢
  var AMP  = reduce ? 0.7 : 1;      // 摆动幅度

  var FILAMENT_COUNT = 8;
  var MOUSE_R = 380;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    CX = W * 0.5;
    CY = H * 0.5;

    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    if (fxc) {
      fxCanvas.width = canvas.width;
      fxCanvas.height = canvas.height;
      fxCanvas.style.width = W + 'px';
      fxCanvas.style.height = H + 'px';
      fxc.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    buildFilaments();
    buildDust();
  }

  function makeFilament() {
    var cool = Math.random() < 0.2;
    var pal = cool ? COOL : WARM;
    var c = pal[(Math.random() * pal.length) | 0];
    var z = 0.3 + Math.pow(Math.random(), 1.3) * 0.7;

    var pts = [];
    var n = 6;
    var baseY = H * (0.15 + Math.random() * 0.7);
    var slope = (Math.random() - 0.5) * 1.1;

    for (var k = 0; k < n; k++) {
      var fx = (k / (n - 1)) * (W * 1.2) - W * 0.1;
      pts.push({
        x0: fx,
        y0: baseY + slope * (fx - CX) * 0.35 + (Math.random() - 0.5) * H * 0.14,
        ax: W * (0.012 + Math.random() * 0.03) * AMP,
        ay: H * (0.07 + Math.random() * 0.13) * AMP,
        sx: 1.10 + Math.random() * 1.40,   // 周期 ≈ 2.5~5.7 秒
        sy: 1.30 + Math.random() * 1.70,   // 周期 ≈ 2.0~4.8 秒
        px: Math.random() * Math.PI * 2,
        py: Math.random() * Math.PI * 2
      });
    }

    return {
      pts: pts,
      color: c,
      z: z,
      width: 0.6 + z * 2.6,
      alpha: 0.14 + z * 0.62,
      phase: Math.random() * 100
    };
  }

  function buildFilaments() {
    filaments.length = 0;
    for (var i = 0; i < FILAMENT_COUNT; i++) filaments.push(makeFilament());
  }

  function gauss() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function buildDust() {
    var target = Math.min(1500, Math.round(W * H / 1600));
    dust.length = 0;
    for (var i = 0; i < target; i++) {
      var r = Math.abs(gauss()) * 0.42;
      var a = Math.random() * Math.PI * 2;
      dust.push({
        x: CX + Math.cos(a) * r * W * 0.55,
        y: CY + Math.sin(a) * r * H * 0.55,
        r: 0.4 + Math.random() * 1.3,
        base: 0.14 + Math.random() * 0.66,
        tw: Math.random() * Math.PI * 2,
        tws: 0.6 + Math.random() * 1.8,
        cool: Math.random() < 0.3,
        drift: (Math.random() - 0.5) * 0.05
      });
    }
  }

  function catmull(p0, p1, p2, p3, t) {
    var t2 = t * t, t3 = t2 * t;
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
  }

  function pointAt(p, tSec, sway) {
    var ox = Math.sin(tSec * p.sx + p.px) * p.ax + sway * (0.5 + p.sx);
    var oy = Math.sin(tSec * p.sy + p.py) * p.ay;
    return { x: p.x0 + ox, y: p.y0 + oy };
  }

  function sampleFilament(f, tSec, segments) {
    var pts = f.pts, n = pts.length;
    var live = [];
    var sway = Math.sin(tSec * 0.9) * (W * 0.025);
    for (var i = 0; i < n; i++) live.push(pointAt(pts[i], tSec, sway));

    var out = [];
    var steps = segments * (n - 1);
    for (var s = 0; s <= steps; s++) {
      var gt = s / steps;
      var seg = Math.min(n - 2, Math.floor(gt * (n - 1)));
      var t = gt * (n - 1) - seg;
      var i0 = Math.max(0, seg - 1), i1 = seg, i2 = Math.min(n - 1, seg + 1), i3 = Math.min(n - 1, seg + 2);

      var x = catmull(live[i0].x, live[i1].x, live[i2].x, live[i3].x, t);
      var y = catmull(live[i0].y, live[i1].y, live[i2].y, live[i3].y, t);

      if (mouse.active) {
        var dx = mouse.x - x, dy = mouse.y - y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < MOUSE_R) {
          var k = 1 - d / MOUSE_R;
          var pull = k * k * 90;
          x += (dx / d) * pull;
          y += (dy / d) * pull;
        }
        x += (mouse.x - CX) * f.z * 0.018;
        y += (mouse.y - CY) * f.z * 0.018;
      }

      out.push([x, y, gt]);
    }
    return out;
  }

  function draw(dt, now) {
    ctx.clearRect(0, 0, W, H);
    if (fxc) fxc.clearRect(0, 0, W, H);

    var tSec = now / 1000 * CALM;

    var coreR = Math.min(W, H) * 0.6;
    var g = ctx.createRadialGradient(CX, CY, 0, CX, CY, coreR);
    g.addColorStop(0, 'rgba(130,160,185,0.06)');
    g.addColorStop(0.4, 'rgba(80,110,140,0.03)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      d.x += d.drift * dt * 8;
      d.y += Math.sin(now * 0.0002 + d.tw) * 0.06;

      var dx0 = d.x, dy0 = d.y;
      if (mouse.active) {
        var mx = mouse.x - d.x, my = mouse.y - d.y;
        var md = Math.sqrt(mx * mx + my * my);
        if (md < 150) {
          var pull2 = (1 - md / 150) * 10;
          dx0 += (mx / (md || 1)) * pull2;
          dy0 += (my / (md || 1)) * pull2;
        }
      }

      var tw = 0.55 + 0.45 * Math.sin(now * 0.0035 * d.tws + d.tw);
      var rgb = d.cool ? '200,225,255' : '235,240,250';
      ctx.fillStyle = 'rgba(' + rgb + ',' + (d.base * tw).toFixed(3) + ')';
      ctx.fillRect(dx0, dy0, d.r, d.r);
    }

    filaments.sort(function (a, b) { return a.z - b.z; });
    var nearPoints = [];

    for (var f = 0; f < filaments.length; f++) {
      var fl = filaments[f];
      var pts = sampleFilament(fl, tSec, 22);
      var c = fl.color;
      var alpha = fl.alpha * (0.82 + 0.18 * Math.sin(now * 0.0007 + fl.phase));

      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var p = 1; p < pts.length; p++) ctx.lineTo(pts[p][0], pts[p][1]);
      ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha.toFixed(3) + ')';
      ctx.lineWidth = fl.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + Math.min(1, alpha * 0.75).toFixed(3) + ')';
      ctx.lineWidth = Math.max(0.35, fl.width * 0.34);
      ctx.stroke();

      if (mouse.active) {
        for (var q = 0; q < pts.length; q += 3) {
          var ddx = pts[q][0] - mouse.x, ddy = pts[q][1] - mouse.y;
          if (ddx * ddx + ddy * ddy < MOUSE_R * MOUSE_R) nearPoints.push(pts[q]);
        }
      }
    }

    if (mouse.active) {
      var L = fxc || ctx;   // 没有交互层就画在底层上
      var pulse = 0.6 + 0.4 * Math.sin(now * 0.005);
      var halo = L.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
      halo.addColorStop(0, 'rgba(255,150,110,' + (0.16 * pulse).toFixed(3) + ')');
      halo.addColorStop(0.45, 'rgba(255,110,90,' + (0.05 * pulse).toFixed(3) + ')');
      halo.addColorStop(1, 'rgba(255,110,90,0)');
      L.fillStyle = halo;
      L.beginPath();
      L.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
      L.fill();

      var near = nearPoints.slice(0, 60);
      near.sort(function (a, b) {
        var da = (a[0] - mouse.x) * (a[0] - mouse.x) + (a[1] - mouse.y) * (a[1] - mouse.y);
        var db = (b[0] - mouse.x) * (b[0] - mouse.x) + (b[1] - mouse.y) * (b[1] - mouse.y);
        return da - db;
      });
      var linkCount = Math.min(10, near.length);
      for (var li = 0; li < linkCount; li++) {
        var np = near[li];
        var dd = Math.sqrt((np[0] - mouse.x) * (np[0] - mouse.x) + (np[1] - mouse.y) * (np[1] - mouse.y));
        var t2 = Math.max(0, 1 - dd / MOUSE_R);
        var lg = L.createLinearGradient(np[0], np[1], mouse.x, mouse.y);
        lg.addColorStop(0, 'rgba(255,140,100,0)');
        lg.addColorStop(1, 'rgba(255,170,130,' + (0.6 * t2).toFixed(3) + ')');
        L.strokeStyle = lg;
        L.lineWidth = 0.8 + t2 * 1.5;
        L.beginPath();
        L.moveTo(np[0], np[1]);
        L.lineTo(mouse.x, mouse.y);
        L.stroke();
      }

      L.fillStyle = 'rgba(255,246,240,' + (0.85 * pulse).toFixed(3) + ')';
      L.beginPath();
      L.arc(mouse.x, mouse.y, 2.4, 0, Math.PI * 2);
      L.fill();
      L.strokeStyle = 'rgba(255,160,120,' + (0.5 * pulse).toFixed(3) + ')';
      L.lineWidth = 1;
      L.beginPath();
      L.arc(mouse.x, mouse.y, 14 + 4 * pulse, 0, Math.PI * 2);
      L.stroke();

      for (var s = sparks.length - 1; s >= 0; s--) {
        var sp = sparks[s];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vy += 24 * dt;
        sp.life -= dt;
        if (sp.life <= 0) { sparks.splice(s, 1); continue; }
        var a2 = Math.max(0, sp.life / sp.max) * 0.9;
        L.fillStyle = 'rgba(255,170,130,' + a2.toFixed(3) + ')';
        L.fillRect(sp.x, sp.y, 1.6, 1.6);
      }
    }

    for (var sh = shocks.length - 1; sh >= 0; sh--) {
      var sk = shocks[sh];
      sk.t += dt;
      var pr = sk.t / sk.dur;
      if (pr >= 1) { shocks.splice(sh, 1); continue; }
      var rr = sk.r0 + (sk.r1 - sk.r0) * pr;
      ctx.strokeStyle = 'rgba(255,140,100,' + ((1 - pr) * 0.34).toFixed(3) + ')';
      ctx.lineWidth = 1.6 * (1 - pr) + 0.3;
      ctx.beginPath();
      ctx.arc(sk.x, sk.y, rr, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function loop(t) {
    if (!running) return;
    var dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016;
    lastT = t;

    // 演示光标：没检测到真实鼠标时，它自己游走（让交互效果一直是活的）
    if (!realMoved) {
      var tt = t / 1000;
      mouse.x = CX + Math.cos(tt * 0.33) * W * 0.26 + Math.sin(tt * 0.71) * W * 0.05;
      mouse.y = CY + Math.sin(tt * 0.47) * H * 0.23 + Math.cos(tt * 0.29) * H * 0.04;
      mouse.active = true;
    }

    draw(dt, t);
    raf = requestAnimationFrame(loop);
  }

  function start() { if (running) return; running = true; lastT = 0; raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function onMove(e) {
    realMoved = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    if (reduce) draw(0, performance.now());
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('pointerout', function (e) { if (!e.relatedTarget) mouse.active = false; }, { passive: true });
  window.addEventListener('blur', function () { mouse.active = false; });

  var lastSpark = 0;
  window.addEventListener('pointermove', function (e) {
    var now = performance.now();
    if (now - lastSpark < 28) return;
    lastSpark = now;
    for (var i = 0; i < 2; i++) {
      sparks.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 60,
        vy: (Math.random() - 0.5) * 60 - 20,
        life: 0.5 + Math.random() * 0.4,
        max: 0.9
      });
    }
    if (sparks.length > 120) sparks.splice(0, sparks.length - 120);
  }, { passive: true });

  window.addEventListener('pointerdown', function (e) {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    shocks.push({ x: e.clientX, y: e.clientY, t: 0, dur: 1.0, r0: 8, r1: Math.min(W, H) * 0.45 });
    for (var i = 0; i < 18; i++) {
      var a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 180;
      sparks.push({
        x: e.clientX, y: e.clientY,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0.6 + Math.random() * 0.5, max: 1.1
      });
    }
    if (reduce) draw(0, performance.now());
  }, { passive: true });

  resize();
  window.addEventListener('resize', function () { resize(); }, { passive: true });

  // 常驻动画：即使系统开了「减少动态效果」也动，只是放慢一点
  start();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
})();
