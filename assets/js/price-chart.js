// assets/js/price-chart.js
// CommodityNode — Premium Candlestick Chart v3
// Reads from /assets/data/chart-data.json (same-origin, no CORS issues)
// Falls back gracefully with "Live data temporarily unavailable" message

(function() {
  'use strict';

  const CHART_DATA_URL = '/assets/data/chart-data.json';
  const PERIODS = ['1M', '3M', '1Y', '5Y'];

  let _cache = null;
  let _fetchPromise = null;

  function getChartData() {
    if (_cache) return Promise.resolve(_cache);
    if (_fetchPromise) return _fetchPromise;
    _fetchPromise = fetch(CHART_DATA_URL)
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => { _cache = data; return data; })
      .catch(err => { console.warn('[CommodityNode] chart-data.json unavailable:', err.message); return null; });
    return _fetchPromise;
  }

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  }

  function formatPrice(p) {
    if (p === null || p === undefined || isNaN(p)) return 'N/A';
    return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderChart(container, candles, symbol, updatedAt) {
    const ctx = container.querySelector('canvas');
    if (!ctx) return;

    const first = candles[0].c;
    const last  = candles[candles.length - 1].c;
    const change = ((last - first) / first * 100).toFixed(2);
    const isUp = parseFloat(change) >= 0;

    const priceEl  = container.querySelector('.cn-price');
    const changeEl = container.querySelector('.cn-change');
    const updateEl = container.querySelector('.cn-updated');
    if (priceEl)  priceEl.textContent = formatPrice(last);
    if (changeEl) {
      changeEl.textContent = (isUp ? '+' : '') + change + '%';
      changeEl.className = 'cn-change ' + (isUp ? 'up' : 'down');
    }
    if (updateEl && updatedAt) {
      try {
        const d = new Date(updatedAt);
        if (!isNaN(d)) {
          updateEl.textContent = 'Updated: ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } catch(e) {}
    }

    if (ctx._chart) ctx._chart.destroy();

    const UP_COLOR   = '#22c55e';
    const DOWN_COLOR = '#ef4444';
    const GRID_C     = 'rgba(255,255,255,0.06)';
    const TEXT_C     = '#a1a1aa';

    const chartData  = candles.map(c => ({ x: c.x, o: c.o, h: c.h, l: c.l, c: c.c }));
    const maxVol     = Math.max(...candles.map(c => c.v || 0), 1);
    const volumeData = candles.map(c => ({
      x: c.x, y: c.v || 0,
      color: (c.c >= c.o) ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'
    }));

    ctx._chart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: symbol,
            data: chartData,
            color: { up: UP_COLOR, down: DOWN_COLOR, unchanged: '#94a3b8' },
            borderColor: { up: UP_COLOR, down: DOWN_COLOR, unchanged: '#94a3b8' },
            backgroundColors: { up: UP_COLOR, down: DOWN_COLOR, unchanged: '#94a3b8' },
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
        animation: { duration: 500, easing: 'easeInOutQuart' },
        layout: { padding: { top: 8, right: 16, bottom: 8, left: 8 } },
        scales: {
          x: {
            type: 'time', time: { tooltipFormat: 'MMM d, yyyy' },
            grid: { color: GRID_C, drawBorder: false },
            ticks: { color: TEXT_C, maxTicksLimit: 8, font: { family: 'Inter', size: 11 } },
            adapters: { date: { locale: 'en-US' } }
          },
          y: {
            position: 'right',
            grid: { color: GRID_C, drawBorder: false },
            ticks: { color: TEXT_C, font: { family: 'JetBrains Mono', size: 11 }, callback: v => '$' + v.toLocaleString() }
          },
          volume: { position: 'left', max: maxVol * 5, grid: { display: false }, ticks: { display: false } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index', intersect: false,
            backgroundColor: 'rgba(13,13,20,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
            titleColor: '#e4e4e7', bodyColor: '#a1a1aa', padding: 12,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              title: items => formatDate(items[0].parsed.x),
              label: item => {
                if (item.datasetIndex === 1) return `Vol: ${((item.parsed.y||0)/1e6).toFixed(1)}M`;
                const d = item.raw;
                return [`O: $${d.o?.toFixed(2)}  H: $${d.h?.toFixed(2)}`, `L: $${d.l?.toFixed(2)}  C: $${d.c?.toFixed(2)}`];
              }
            }
          },
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
        <div class="cn-chart-header-right" style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <span class="cn-updated" style="font-size:0.7rem;color:#52525b;font-family:'JetBrains Mono',monospace;"></span>
          <div class="cn-period-btns">
            ${PERIODS.map((p,i) => `<button class="cn-period${i===1?' active':''}" data-period="${p}">${p}</button>`).join('')}
          </div>
        </div>
      </div>
      <div class="cn-chart-body">
        <div class="cn-chart-loading">
          <div class="cn-loading-spinner"></div>
          <span>Loading chart data\u2026</span>
        </div>
        <canvas></canvas>
      </div>
    `;

    const canvas    = el.querySelector('canvas');
    const loadingEl = el.querySelector('.cn-chart-loading');
    let currentPeriod = '3M';

    if (!window.Chart) {
      await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.1/dist/chartjs-chart-financial.min.js');
    }

    async function loadAndRender(period) {
      loadingEl.innerHTML = '<div class="cn-loading-spinner"></div><span>Loading chart data\u2026</span>';
      loadingEl.style.display = 'flex';
      canvas.style.opacity = '0';

      const allData = await getChartData();
      if (allData && allData[symbol] && allData[symbol][period] &&
          allData[symbol][period].candles && allData[symbol][period].candles.length > 0) {
        loadingEl.style.display = 'none';
        canvas.style.opacity = '1';
        renderChart(el, allData[symbol][period].candles, symbol, allData[symbol].updated_at);
      } else {
        loadingEl.innerHTML = '<span style="color:#52525b;font-family:\'JetBrains Mono\',monospace;font-size:0.82rem;text-align:center;padding:8px;line-height:1.5">Live data temporarily unavailable<br>\u2014 showing latest cached prices</span>';
        loadingEl.style.display = 'flex';
        canvas.style.opacity = '0';
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
