// assets/js/price-chart.js v3
// CommodityNode — reads from /assets/data/chart-data.json (same-origin, no CORS)

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
      console.warn('chart-data.json not found:', e.message);
      return null;
    }
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  }

  function formatPrice(p, decimals) {
    if (p == null || isNaN(p)) return 'N/A';
    return '$' + (+p).toLocaleString('en-US', { minimumFractionDigits: decimals || 2, maximumFractionDigits: decimals || 2 });
  }

  function renderChart(container, candles, symbol, name) {
    const ctx = container.querySelector('canvas');
    if (!ctx) return;
    if (ctx._chart) { ctx._chart.destroy(); ctx._chart = null; }

    const first = candles[0].c, last = candles[candles.length - 1].c;
    const change = ((last - first) / first * 100).toFixed(2);
    const isUp = +change >= 0;

    const priceEl  = container.querySelector('.cn-price');
    const changeEl = container.querySelector('.cn-change');
    const updEl    = container.querySelector('.cn-updated');
    if (priceEl)  priceEl.textContent = formatPrice(last);
    if (changeEl) { changeEl.textContent = (isUp ? '+' : '') + change + '%'; changeEl.className = 'cn-change ' + (isUp ? 'up' : 'down'); }
    if (updEl)    updEl.textContent = 'Updated ' + formatDate(candles[candles.length - 1].x);

    const UP = '#22c55e', DOWN = '#ef4444', GRID = 'rgba(255,255,255,0.05)', TEXT = '#71717a';

    const chartData  = candles.map(c => ({ x: c.x, o: c.o, h: c.h, l: c.l, c: c.c }));
    const volumeData = candles.map(c => ({ x: c.x, y: c.v, color: c.c >= c.o ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)' }));

    ctx._chart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: symbol,
            data: chartData,
            color: { up: UP, down: DOWN, unchanged: '#94a3b8' },
            borderColor: { up: UP, down: DOWN, unchanged: '#94a3b8' },
            backgroundColors: { up: UP, down: DOWN, unchanged: '#94a3b8' },
          },
          {
            type: 'bar', label: 'Volume',
            data: volumeData,
            backgroundColor: volumeData.map(v => v.color),
            yAxisID: 'volume', order: 2,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 500 },
        layout: { padding: { top: 8, right: 20, bottom: 4, left: 4 } },
        scales: {
          x: {
            type: 'time',
            time: { tooltipFormat: 'MMM d, yyyy' },
            grid: { color: GRID, drawBorder: false },
            ticks: { color: TEXT, maxTicksLimit: 8, font: { family: 'Inter', size: 11 } },
            adapters: { date: { locale: 'en-US' } }
          },
          y: {
            position: 'right',
            grid: { color: GRID, drawBorder: false },
            ticks: { color: TEXT, font: { family: 'JetBrains Mono', size: 11 }, callback: v => '$' + v.toLocaleString() }
          },
          volume: {
            position: 'left',
            max: Math.max(...candles.map(c => c.v || 0)) * 5,
            grid: { display: false }, ticks: { display: false },
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index', intersect: false,
            backgroundColor: 'rgba(10,10,18,0.96)',
            borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
            titleColor: '#e4e4e7', bodyColor: '#a1a1aa', padding: 12,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              title: items => formatDate(items[0].parsed?.x ?? items[0].raw?.x),
              label: item => {
                if (item.datasetIndex === 1) return `Vol: ${((item.parsed.y||0)/1e6).toFixed(1)}M`;
                const d = item.raw;
                if (!d) return '';
                return [`O: $${(+d.o).toFixed(2)}  H: $${(+d.h).toFixed(2)}`, `L: $${(+d.l).toFixed(2)}  C: $${(+d.c).toFixed(2)}`];
              }
            }
          }
        },
        interaction: { mode: 'index', intersect: false },
      }
    });
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
          <span class="cn-updated" style="font-size:0.72rem;color:#52525b;font-family:'JetBrains Mono',monospace;"></span>
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

    // Load Chart.js if needed
    if (!window.Chart) {
      await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.1/dist/chartjs-chart-financial.min.js');
    }

    const chartData = await loadChartData();
    let currentPeriod = '3M';

    async function loadAndRender(period) {
      loadingEl.style.display = 'flex';
      el.querySelector('canvas').style.opacity = '0';

      const symbolData = chartData?.[symbol];
      const periodData = symbolData?.[period];
      const candles = periodData?.candles;

      loadingEl.style.display = 'none';
      el.querySelector('canvas').style.opacity = '1';

      if (candles && candles.length > 0) {
        renderChart(el, candles, symbol, name);
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
