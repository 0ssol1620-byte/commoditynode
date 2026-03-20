// assets/js/price-chart.js v5 — Robust defer-safe init
// MA20/MA50 · current price · premium dark theme · mobile optimized

(function () {
  'use strict';

  const PERIODS = ['1M', '3M', '1Y', '5Y'];
  let chartDataCache = null;
  let initDone = false;

  async function loadChartData() {
    if (chartDataCache) return chartDataCache;
    try {
      const res = await fetch('/assets/data/chart-data.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      chartDataCache = await res.json();
      return chartDataCache;
    } catch (e) {
      console.warn('chart-data.json:', e.message);
      return null;
    }
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  }

  function fmtPrice(p) {
    if (p == null || isNaN(p)) return 'N/A';
    const n = +p;
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n < 10 ? 3 : 2, maximumFractionDigits: n < 10 ? 3 : 2 });
  }

  function sma(candles, period) {
    const out = [];
    for (let i = period - 1; i < candles.length; i++) {
      const avg = candles.slice(i - period + 1, i + 1).reduce((s, c) => s + c.c, 0) / period;
      out.push({ x: candles[i].x, y: avg });
    }
    return out;
  }

  function renderChart(container, candles, symbol, name) {
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    if (canvas._chart) { canvas._chart.destroy(); canvas._chart = null; }

    const first = candles[0].c, last = candles[candles.length - 1].c;
    const chgPct = ((last - first) / first * 100).toFixed(2);
    const isUp = +chgPct >= 0;

    const priceEl  = container.querySelector('.cn-price');
    const changeEl = container.querySelector('.cn-change');
    const updEl    = container.querySelector('.cn-updated');
    if (priceEl)  priceEl.textContent = fmtPrice(last);
    if (changeEl) { changeEl.textContent = (isUp ? '+' : '') + chgPct + '%'; changeEl.className = 'cn-change ' + (isUp ? 'up' : 'down'); }
    if (updEl)    updEl.textContent = fmtDate(candles[candles.length - 1].x);

    const UP = '#22c55e', DOWN = '#ef4444';
    const ACCENT = isUp ? UP : DOWN;
    const GRID = 'rgba(255,255,255,0.04)', TICK = '#4a4a6a';

    const ma20 = sma(candles, Math.min(20, candles.length));
    const ma50 = sma(candles, Math.min(50, candles.length));

    canvas._chart = new Chart(canvas, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: symbol, type: 'candlestick', data: candles.map(c => ({ x: c.x, o: c.o, h: c.h, l: c.l, c: c.c })),
            color: { up: UP, down: DOWN, unchanged: '#71717a' },
            borderColor: { up: UP, down: DOWN, unchanged: '#71717a' },
            backgroundColors: { up: UP, down: DOWN, unchanged: '#71717a' },
            order: 1,
          },
          {
            label: 'Vol', type: 'bar',
            data: candles.map(c => ({ x: c.x, y: c.v || 0 })),
            backgroundColor: candles.map(c => c.c >= c.o ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'),
            yAxisID: 'vol', order: 3,
          },
          { label: 'MA20', type: 'line', data: ma20, borderColor: 'rgba(251,191,36,0.75)', borderWidth: 1.2, pointRadius: 0, tension: 0.3, order: 2, yAxisID: 'y' },
          { label: 'MA50', type: 'line', data: ma50, borderColor: 'rgba(129,140,248,0.65)', borderWidth: 1.2, pointRadius: 0, tension: 0.3, order: 2, yAxisID: 'y' },
          {
            label: 'Price', type: 'line',
            data: [{ x: candles[0].x, y: last }, { x: candles[candles.length-1].x, y: last }],
            borderColor: ACCENT + 'aa', borderWidth: 1, borderDash: [5, 4],
            pointRadius: 0, tension: 0, order: 2, yAxisID: 'y',
          },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 350 },
        layout: { padding: { top: 10, right: 70, bottom: 2, left: 2 } },
        scales: {
          x: {
            type: 'time', time: { tooltipFormat: 'MMM d, yyyy' },
            grid: { color: GRID, drawBorder: false },
            ticks: { color: TICK, maxTicksLimit: 6, font: { family: 'JetBrains Mono', size: 10 } },
            adapters: { date: { locale: 'en-US' } },
            border: { display: false },
          },
          y: {
            position: 'right', grid: { color: GRID, drawBorder: false },
            ticks: { color: TICK, font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 6,
              callback: v => v >= 1000 ? '$' + (v/1000).toFixed(1) + 'k' : '$' + (+v).toFixed(v < 10 ? 3 : 2) },
            border: { display: false },
          },
          vol: {
            position: 'left', max: Math.max(...candles.map(c => c.v || 0)) * 6,
            grid: { display: false }, ticks: { display: false }, border: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index', intersect: false,
            backgroundColor: 'rgba(6,6,14,0.97)',
            borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
            titleColor: '#e4e4e7', bodyColor: '#52525b', padding: { x: 12, y: 9 },
            titleFont: { family: 'Inter', size: 11, weight: '700' },
            bodyFont: { family: 'JetBrains Mono', size: 10 },
            callbacks: {
              title: items => fmtDate(items[0].parsed?.x ?? items[0].raw?.x),
              label: item => {
                if (item.datasetIndex === 1) { const v = item.parsed.y||0; return `Vol  ${v>1e6?(v/1e6).toFixed(1)+'M':v>1e3?(v/1e3).toFixed(0)+'K':v}`; }
                if (item.datasetIndex >= 2) return null;
                const d = item.raw; if (!d) return '';
                return [`O ${fmtPrice(d.o)}   H ${fmtPrice(d.h)}`, `L ${fmtPrice(d.l)}   C ${fmtPrice(d.c)}`];
              },
              filter: item => item.formattedValue !== null && item.datasetIndex < 4,
            }
          }
        },
        interaction: { mode: 'index', intersect: false },
      },
      plugins: [{
        id: 'priceLabel',
        afterDraw(chart) {
          try {
            const yScale = chart.scales.y;
            const yPx = yScale.getPixelForValue(last);
            const ctx2 = chart.ctx;
            ctx2.save();
            const txt = fmtPrice(last);
            ctx2.font = '700 10px JetBrains Mono, monospace';
            const tw = ctx2.measureText(txt).width;
            const px = chart.chartArea.right + 4;
            const pad = 5;
            ctx2.fillStyle = ACCENT + '22';
            ctx2.beginPath();
            if (ctx2.roundRect) ctx2.roundRect(px, yPx - 9, tw + pad*2, 18, 3);
            else ctx2.rect(px, yPx - 9, tw + pad*2, 18);
            ctx2.fill();
            ctx2.fillStyle = ACCENT;
            ctx2.textAlign = 'left';
            ctx2.textBaseline = 'middle';
            ctx2.fillText(txt, px + pad, yPx);
            ctx2.restore();
          } catch(e) {}
        }
      }]
    });

    // MA legend
    let leg = container.querySelector('.cn-ma-legend');
    if (!leg) {
      leg = document.createElement('div');
      leg.className = 'cn-ma-legend';
      const hdr = container.querySelector('.cn-chart-right');
      if (hdr) hdr.prepend(leg);
    }
    leg.innerHTML = `
      <span style="color:rgba(251,191,36,0.85);font-size:10px;font-family:'JetBrains Mono',monospace;display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:1.5px;background:rgba(251,191,36,0.75);flex-shrink:0"></span>MA20</span>
      <span style="color:rgba(129,140,248,0.85);font-size:10px;font-family:'JetBrains Mono',monospace;display:flex;align-items:center;gap:4px;"><span style="display:inline-block;width:14px;height:1.5px;background:rgba(129,140,248,0.65);flex-shrink:0"></span>MA50</span>
    `;
  }

  async function initChart(el) {
    if (el.dataset.chartInit) return;
    el.dataset.chartInit = '1';

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
          <span class="cn-updated" style="font-size:0.68rem;color:#3f3f5a;font-family:'JetBrains Mono',monospace;"></span>
          <div class="cn-period-btns">
            ${PERIODS.map((p, i) => `<button class="cn-period${i===1?' active':''}" data-period="${p}">${p}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="cn-chart-body">
        <div class="cn-chart-loading"><div class="cn-loading-spinner"></div><span>Loading…</span></div>
        <canvas></canvas>
      </div>
    `;

    const loadingEl = el.querySelector('.cn-chart-loading');

    if (!window.Chart) {
      await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.1/dist/chartjs-chart-financial.min.js');
    }

    const allData = await loadChartData();
    let currentPeriod = '3M';

    async function loadAndRender(period) {
      loadingEl.style.display = 'flex';
      const cvs = el.querySelector('canvas');
      if (cvs) cvs.style.opacity = '0';

      const candles = allData?.[symbol]?.[period]?.candles;

      loadingEl.style.display = 'none';
      if (cvs) cvs.style.opacity = '1';

      if (candles && candles.length > 1) {
        renderChart(el, candles, symbol, name);
      } else {
        const sp = loadingEl.querySelector('span');
        if (sp) sp.textContent = 'Price data temporarily unavailable';
        const spinner = loadingEl.querySelector('.cn-loading-spinner');
        if (spinner) spinner.style.display = 'none';
        loadingEl.style.display = 'flex';
      }
    }

    el.querySelectorAll('.cn-period').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.cn-period').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPeriod = btn.dataset.period;
        loadAndRender(currentPeriod);
      });
    });

    loadAndRender(currentPeriod);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function init() {
    if (initDone) return;
    initDone = true;
    document.querySelectorAll('.cn-price-chart').forEach(initChart);
  }

  // Multiple init triggers to handle defer timing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', init);

  window.CommodityNodeChart = { init, initChart };
})();
