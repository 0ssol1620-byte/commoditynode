// assets/js/price-chart.js v4 — Premium
// MA20/MA50 · current price line · clean volume · dark theme

(function () {
  'use strict';

  const PERIODS = ['1M', '3M', '1Y', '5Y'];
  let chartDataCache = null;

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
    return '$' + (+p).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Simple moving average
  function sma(candles, period) {
    return candles.map((_, i) => {
      if (i < period - 1) return null;
      const slice = candles.slice(i - period + 1, i + 1);
      return { x: candles[i].x, y: slice.reduce((s, c) => s + c.c, 0) / period };
    }).filter(p => p !== null);
  }

  function renderChart(container, candles, symbol, name) {
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    if (canvas._chart) { canvas._chart.destroy(); canvas._chart = null; }

    const first = candles[0].c, last = candles[candles.length - 1].c;
    const change = ((last - first) / first * 100).toFixed(2);
    const isUp = +change >= 0;

    const priceEl  = container.querySelector('.cn-price');
    const changeEl = container.querySelector('.cn-change');
    const updEl    = container.querySelector('.cn-updated');
    if (priceEl)  priceEl.textContent = fmtPrice(last);
    if (changeEl) {
      changeEl.textContent = (isUp ? '+' : '') + change + '%';
      changeEl.className = 'cn-change ' + (isUp ? 'up' : 'down');
    }
    if (updEl) updEl.textContent = fmtDate(candles[candles.length - 1].x);

    // Colors
    const UP   = '#22c55e';
    const DOWN = '#ef4444';
    const ACCENT = isUp ? UP : DOWN;
    const GRID = 'rgba(255,255,255,0.04)';
    const TEXT = '#52525b';

    const chartData  = candles.map(c => ({ x: c.x, o: c.o, h: c.h, l: c.l, c: c.c }));
    const volumeData = candles.map(c => ({
      x: c.x, y: c.v || 0,
      color: c.c >= c.o ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)'
    }));

    // MA lines
    const ma20data = sma(candles, Math.min(20, candles.length));
    const ma50data = sma(candles, Math.min(50, candles.length));

    // Current price line dataset
    const currentPriceLine = [
      { x: candles[0].x, y: last },
      { x: candles[candles.length - 1].x, y: last }
    ];

    canvas._chart = new Chart(canvas, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: symbol, type: 'candlestick',
            data: chartData, order: 1,
            color: { up: UP, down: DOWN, unchanged: '#71717a' },
            borderColor: { up: UP, down: DOWN, unchanged: '#71717a' },
            backgroundColors: { up: UP, down: DOWN, unchanged: '#71717a' },
            barThickness: candles.length > 50 ? 'flex' : undefined,
          },
          {
            label: 'Volume', type: 'bar',
            data: volumeData,
            backgroundColor: volumeData.map(v => v.color),
            yAxisID: 'volume', order: 3,
          },
          {
            label: 'MA20', type: 'line',
            data: ma20data,
            borderColor: 'rgba(251,191,36,0.7)',
            borderWidth: 1.2, pointRadius: 0,
            tension: 0.3, order: 2,
            yAxisID: 'y',
          },
          {
            label: 'MA50', type: 'line',
            data: ma50data,
            borderColor: 'rgba(129,140,248,0.6)',
            borderWidth: 1.2, pointRadius: 0,
            tension: 0.3, order: 2,
            yAxisID: 'y',
          },
          {
            label: 'Current', type: 'line',
            data: currentPriceLine,
            borderColor: ACCENT,
            borderWidth: 1,
            borderDash: [4, 3],
            pointRadius: 0,
            tension: 0, order: 2,
            yAxisID: 'y',
          },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 400 },
        layout: { padding: { top: 12, right: 64, bottom: 4, left: 4 } },
        scales: {
          x: {
            type: 'time',
            time: { tooltipFormat: 'MMM d, yyyy' },
            grid: { color: GRID, drawBorder: false },
            ticks: {
              color: TEXT, maxTicksLimit: 7,
              font: { family: 'JetBrains Mono', size: 10 },
            },
            adapters: { date: { locale: 'en-US' } },
            border: { display: false },
          },
          y: {
            position: 'right',
            grid: { color: GRID, drawBorder: false },
            ticks: {
              color: TEXT,
              font: { family: 'JetBrains Mono', size: 10 },
              callback: v => {
                if (v >= 1000) return '$' + (v/1000).toFixed(1) + 'k';
                return '$' + v.toFixed(v < 10 ? 3 : 2);
              },
              maxTicksLimit: 6,
            },
            border: { display: false },
          },
          volume: {
            position: 'left',
            max: Math.max(...candles.map(c => c.v || 0)) * 6,
            grid: { display: false },
            ticks: { display: false },
            border: { display: false },
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index', intersect: false,
            backgroundColor: 'rgba(8,8,16,0.97)',
            borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
            titleColor: '#e4e4e7', bodyColor: '#71717a',
            padding: { x: 14, y: 10 },
            titleFont: { family: 'Inter', size: 11, weight: '700' },
            bodyFont: { family: 'JetBrains Mono', size: 10 },
            callbacks: {
              title: items => fmtDate(items[0].parsed?.x ?? items[0].raw?.x),
              label: item => {
                if (item.datasetIndex === 1) {
                  const v = item.parsed.y || 0;
                  return `Vol  ${v > 1e6 ? (v/1e6).toFixed(1)+'M' : v > 1e3 ? (v/1e3).toFixed(0)+'K' : v}`;
                }
                if (item.datasetIndex >= 2) return null; // hide MA/price line in tooltip
                const d = item.raw;
                if (!d) return '';
                const chg = d.c >= d.o ? '▲' : '▼';
                return [
                  `O ${fmtPrice(d.o)}   H ${fmtPrice(d.h)}`,
                  `L ${fmtPrice(d.l)}   C ${fmtPrice(d.c)} ${chg}`,
                ];
              },
              filter: item => item.formattedValue !== null,
            }
          }
        },
        interaction: { mode: 'index', intersect: false },
      }
    });

    // Draw current price label on right
    const origDraw = canvas._chart.draw.bind(canvas._chart);
    canvas._chart.draw = function() {
      origDraw();
      try {
        const meta = canvas._chart.getDatasetMeta(0);
        if (!meta || !meta.data.length) return;
        const yScale = canvas._chart.scales.y;
        const yPx = yScale.getPixelForValue(last);
        const ctx2 = canvas.getContext('2d');
        const labelX = canvas.width - 6;
        ctx2.save();
        ctx2.fillStyle = ACCENT;
        ctx2.font = '700 10px JetBrains Mono, monospace';
        ctx2.textAlign = 'right';
        ctx2.textBaseline = 'middle';
        // Background pill
        const txt = fmtPrice(last);
        const tw = ctx2.measureText(txt).width;
        ctx2.fillStyle = ACCENT + '22';
        const pad = 4;
        ctx2.beginPath();
        ctx2.roundRect(labelX - tw - pad*2, yPx - 9, tw + pad*2, 18, 3);
        ctx2.fill();
        ctx2.fillStyle = ACCENT;
        ctx2.fillText(txt, labelX - pad, yPx);
        ctx2.restore();
      } catch(e) {}
    };
  }

  // MA legend
  function renderLegend(container) {
    const existing = container.querySelector('.cn-ma-legend');
    if (existing) existing.remove();
    const leg = document.createElement('div');
    leg.className = 'cn-ma-legend';
    leg.innerHTML = `
      <span style="color:rgba(251,191,36,0.8);font-size:10px;font-family:'JetBrains Mono',monospace;display:flex;align-items:center;gap:4px;">
        <span style="display:inline-block;width:16px;height:1.5px;background:rgba(251,191,36,0.7);"></span>MA20
      </span>
      <span style="color:rgba(129,140,248,0.8);font-size:10px;font-family:'JetBrains Mono',monospace;display:flex;align-items:center;gap:4px;">
        <span style="display:inline-block;width:16px;height:1.5px;background:rgba(129,140,248,0.6);"></span>MA50
      </span>
    `;
    const header = container.querySelector('.cn-chart-header');
    if (header) header.appendChild(leg);
  }

  async function initChart(el) {
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
          <span class="cn-updated" style="font-size:0.7rem;color:#3f3f5a;font-family:'JetBrains Mono',monospace;"></span>
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
      el.querySelector('canvas').style.opacity = '0';

      const candles = allData?.[symbol]?.[period]?.candles;

      loadingEl.style.display = 'none';
      el.querySelector('canvas').style.opacity = '1';

      if (candles && candles.length > 1) {
        renderChart(el, candles, symbol, name);
        renderLegend(el);
      } else {
        loadingEl.querySelector('span').textContent = 'Price data temporarily unavailable';
        loadingEl.querySelector('.cn-loading-spinner').style.display = 'none';
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

  function init() { document.querySelectorAll('.cn-price-chart').forEach(initChart); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.CommodityNodeChart = { init, initChart };
})();
