// price-chart.js v7 — Pure Canvas candlestick (no external plugin)
(function () {
  'use strict';

  const PERIODS = ['1M','3M','1Y','5Y'];
  let _data = null;

  async function getData() {
    if (_data) return _data;
    try {
      const r = await fetch('/assets/data/chart-data.json');
      if (!r.ok) throw new Error(r.status);
      _data = await r.json();
      return _data;
    } catch(e) { console.warn('chart-data:', e.message); return null; }
  }

  function fmt(p) {
    if (p == null || isNaN(p)) return '—';
    const n = +p;
    if (n >= 10000) return '$' + (n/1000).toFixed(1) + 'k';
    if (n >= 1000)  return '$' + n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    return '$' + n.toFixed(n < 10 ? 3 : 2);
  }
  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'2-digit'});
  }
  function sma(candles, n) {
    const out = [];
    for (let i = n-1; i < candles.length; i++) {
      out.push(candles.slice(i-n+1,i+1).reduce((s,c)=>s+c.c,0)/n);
    }
    return out;
  }

  function drawChart(canvas, candles) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const PAD = { top:12, right:60, bottom:28, left:4 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top  - PAD.bottom;

    // Price range
    const highs  = candles.map(c=>c.h);
    const lows   = candles.map(c=>c.l);
    const maxP   = Math.max(...highs);
    const minP   = Math.min(...lows);
    const range  = maxP - minP || 1;
    const padP   = range * 0.08;
    const pMax   = maxP + padP, pMin = minP - padP;
    const pRange = pMax - pMin;

    const volumes = candles.map(c=>c.v||0);
    const maxVol  = Math.max(...volumes) || 1;

    const n = candles.length;
    const candleW = Math.max(2, Math.floor(cW / n * 0.7));
    const step    = cW / n;

    function xOf(i) { return PAD.left + (i + 0.5) * step; }
    function yOf(p) { return PAD.top + cH * (1 - (p - pMin) / pRange); }

    // Background
    ctx.fillStyle = '#07070f';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = PAD.top + cH * i / 5;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
    }
    const xGridCount = Math.min(6, n);
    for (let i = 0; i <= xGridCount; i++) {
      const x = PAD.left + cW * i / xGridCount;
      ctx.beginPath(); ctx.moveTo(x, PAD.top); ctx.lineTo(x, PAD.top + cH); ctx.stroke();
    }

    // Volume bars (bottom 15% of chart height)
    const volH = cH * 0.15;
    candles.forEach((c, i) => {
      const x = xOf(i);
      const h = (c.v||0) / maxVol * volH;
      const isUp = c.c >= c.o;
      ctx.fillStyle = isUp ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)';
      ctx.fillRect(x - candleW/2, PAD.top + cH - h, candleW, h);
    });
    // Current price dashed line
    const lastC = candles[n-1].c;
    const isUp  = lastC >= candles[0].c;
    const ACCENT = isUp ? '#22c55e' : '#ef4444';
    const yLast = yOf(lastC);
    ctx.strokeStyle = ACCENT + '88';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(PAD.left, yLast); ctx.lineTo(W - PAD.right, yLast); ctx.stroke();
    ctx.setLineDash([]);

    // Candlesticks
    candles.forEach((c, i) => {
      const x   = xOf(i);
      const yO  = yOf(c.o), yC = yOf(c.c);
      const yH  = yOf(c.h), yL = yOf(c.l);
      const up  = c.c >= c.o;
      const col = up ? '#22c55e' : '#ef4444';
      const bodyTop = Math.min(yO, yC);
      const bodyH   = Math.max(1, Math.abs(yO - yC));

      // Wick
      ctx.strokeStyle = col;
      ctx.lineWidth = Math.max(1, candleW * 0.15);
      ctx.beginPath(); ctx.moveTo(x, yH); ctx.lineTo(x, yL); ctx.stroke();

      // Body
      ctx.fillStyle = up ? '#22c55e' : '#ef4444';
      if (up) {
        // hollow for up candles (optional — solid looks cleaner on dark bg)
        ctx.fillRect(x - candleW/2, bodyTop, candleW, bodyH);
      } else {
        ctx.fillRect(x - candleW/2, bodyTop, candleW, bodyH);
      }
    });

    // Y-axis price labels
    ctx.fillStyle = '#4a4a6a';
    ctx.font = `10px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const p = pMin + pRange * i / 5;
      const y = yOf(p);
      ctx.fillText(fmt(p), W - PAD.right + 6, y);
    }

    // Current price label (right axis)
    ctx.fillStyle = ACCENT + '22';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(W - PAD.right + 4, yLast - 9, PAD.right - 6, 18, 3);
    else ctx.rect(W - PAD.right + 4, yLast - 9, PAD.right - 6, 18);
    ctx.fill();
    ctx.fillStyle = ACCENT;
    ctx.font = `bold 10px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(fmt(lastC), W - PAD.right/2 + 2, yLast);

    // X-axis date labels — auto-spacing to prevent overlap
    ctx.fillStyle = '#4a4a6a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    // Estimate label width and compute max labels that fit
    const dateStr = fmtDate(candles[0].x);
    ctx.font = `10px 'JetBrains Mono', monospace`;
    const labelW = ctx.measureText(dateStr).width + 8; // +8 padding
    const maxLabels = Math.max(2, Math.floor(cW / labelW));
    const labelEvery = Math.ceil(n / maxLabels);
    candles.forEach((c, i) => {
      if (i % labelEvery === 0) {
        // Short date format: "Mar 20" instead of "Mar 20, 26"
        const d = new Date(c.x);
        const label = d.toLocaleDateString('en-US', {month:'short', day:'numeric'});
        ctx.fillText(label, xOf(i), PAD.top + cH + 5);
      }
    });
    // Tooltip on hover (store data for mouse handler)
    canvas._candles = candles;
    canvas._xOf = xOf;
    canvas._yOf = yOf;
    canvas._step = step;
    canvas._draw = () => drawChart(canvas, candles);
    canvas._PAD = PAD;
    canvas._pMin = pMin;
    canvas._pRange = pRange;
    canvas._cH = cH;
  }

  function addTooltip(canvas, container) {
    const tip = container.querySelector('.cn-canvas-tip') || document.createElement('div');
    tip.className = 'cn-canvas-tip';
    tip.style.cssText = 'position:absolute;display:none;background:rgba(6,6,14,0.97);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:10px 14px;font-size:11px;font-family:JetBrains Mono,monospace;color:#a1a1aa;pointer-events:none;z-index:10;white-space:nowrap;';
    if (!container.querySelector('.cn-canvas-tip')) container.appendChild(tip);

    function onMove(e) {
      const candles = canvas._candles;
      if (!candles) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      const step = canvas._step;
      const PAD = canvas._PAD;
      const idx = Math.round((mx - PAD.left) / step - 0.5);
      if (idx < 0 || idx >= candles.length) { tip.style.display='none'; return; }
      const c = candles[idx];
      const isUp = c.c >= c.o;
      const col  = isUp ? '#22c55e' : '#ef4444';
      tip.innerHTML = `
        <div style="color:#e4e4e7;font-weight:700;margin-bottom:4px">${fmtDate(c.x)}</div>
        <div>O <span style="color:#e4e4e7">${fmt(c.o)}</span> &nbsp; H <span style="color:#22c55e">${fmt(c.h)}</span></div>
        <div>L <span style="color:#ef4444">${fmt(c.l)}</span> &nbsp; C <span style="color:${col};font-weight:700">${fmt(c.c)}</span></div>
        ${c.v ? `<div style="margin-top:4px;color:#52525b">Vol ${c.v>1e6?(c.v/1e6).toFixed(1)+'M':c.v>1e3?(c.v/1e3).toFixed(0)+'K':c.v}</div>` : ''}
      `;
      let tx = mx + 12, ty = 8;
      if (tx + 150 > rect.width) tx = mx - 160;
      tip.style.display = 'block';
      tip.style.left = tx + 'px';
      tip.style.top  = ty + 'px';
    }
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, {passive:true});
    canvas.addEventListener('mouseleave', () => tip.style.display='none');
    canvas.addEventListener('touchend',   () => setTimeout(()=>tip.style.display='none', 1500));
  }

  async function initChart(el) {
    if (el.dataset.ci) return;
    el.dataset.ci = '1';
    const symbol = el.dataset.symbol;
    const name   = el.dataset.name || symbol;
    if (!symbol) return;

    el.innerHTML = `
      <div class="cn-chart-header">
        <div class="cn-chart-title">
          <span class="cn-chart-name">${name}</span>
          <span class="cn-price">—</span>
          <span class="cn-change">—</span>
        </div>
        <div class="cn-chart-right">
          <span class="cn-updated" style="font-size:0.68rem;color:#3f3f5a;font-family:'JetBrains Mono',monospace"></span>
          <div class="cn-period-btns">
            ${PERIODS.map((p,i)=>`<button class="cn-period${i===1?' active':''}" data-period="${p}">${p}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="cn-chart-body" style="position:relative">
        <div class="cn-chart-loading"><div class="cn-loading-spinner"></div><span>Loading…</span></div>
        <canvas style="width:100%;height:100%;display:block"></canvas>
      </div>
    `;

    const loading = el.querySelector('.cn-chart-loading');
    const canvas  = el.querySelector('canvas');
    const allData = await getData();
    let period = '3M';

    function render(p) {
      loading.style.display = 'flex';
      canvas.style.opacity  = '0';

      const candles = allData?.[symbol]?.[p]?.candles;

      if (candles && candles.length > 1) {
        const last  = candles[candles.length-1].c;
        const first = candles[0].c;
        const chg   = ((last-first)/first*100).toFixed(2);
        const isUp  = +chg >= 0;

        const pEl = el.querySelector('.cn-price');
        const cEl = el.querySelector('.cn-change');
        const uEl = el.querySelector('.cn-updated');
        if (pEl) pEl.textContent = fmt(last);
        if (cEl) { cEl.textContent=(isUp?'+':'')+chg+'%'; cEl.className='cn-change '+(isUp?'up':'down'); }
        if (uEl) uEl.textContent = fmtDate(candles[candles.length-1].x);

        loading.style.display = 'none';
        canvas.style.opacity  = '1';

        // Small delay to ensure canvas has correct dimensions
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            drawChart(canvas, candles);
            addTooltip(canvas, el.querySelector('.cn-chart-body'));
          });
        });
      } else {
        loading.querySelector('span').textContent = 'Price data temporarily unavailable';
        loading.querySelector('.cn-loading-spinner').style.display = 'none';
        loading.style.display = 'flex';
      }
    }

    // Redraw on resize
    const ro = new ResizeObserver(() => {
      if (canvas._candles) drawChart(canvas, canvas._candles);
    });
    ro.observe(el.querySelector('.cn-chart-body'));

    el.querySelectorAll('.cn-period').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.cn-period').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        period = btn.dataset.period;
        render(period);
      });
    });

    render(period);
  }

  function init() {
    document.querySelectorAll('.cn-price-chart:not([data-ci])').forEach(initChart);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', () => {
    document.querySelectorAll('.cn-price-chart:not([data-ci])').forEach(initChart);
  });

  window.CommodityNodeChart = { init, initChart };
})();
