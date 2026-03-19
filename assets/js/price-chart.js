// assets/js/price-chart.js
// CommodityNode — Premium Candlestick Chart v2
// Multi-proxy fallback for reliable Yahoo Finance data

(function() {
  'use strict';

  // Multiple CORS proxies — try in order until one works
  const PROXIES = [
    url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    url => `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
  ];
  const YF_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';
  const TIMEOUT_MS = 8000;

  const PERIODS = {
    '1M': { range: '1mo', interval: '1d' },
    '3M': { range: '3mo', interval: '1d' },
    '1Y': { range: '1y',  interval: '1wk' },
    '5Y': { range: '5y',  interval: '1mo' },
  };

  function formatDate(ts) {
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  }

  function formatPrice(p, decimals) {
    if (p === null || p === undefined || isNaN(p)) return 'N/A';
    return '$' + p.toLocaleString('en-US', { minimumFractionDigits: decimals || 2, maximumFractionDigits: decimals || 2 });
  }

  function fetchWithTimeout(url, ms) {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
    ]);
  }

  async function fetchViaProxy(yfUrl, proxyFn) {
    const res = await fetchWithTimeout(proxyFn(yfUrl), TIMEOUT_MS);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    // allorigins wraps in {contents: "..."}; corsproxy.io returns raw JSON
    const raw = json.contents ? JSON.parse(json.contents) : json;
    return raw;
  }

  async function fetchData(symbol, period) {
    const cfg = PERIODS[period] || PERIODS['3M'];
    const yfUrl = `${YF_BASE}${encodeURIComponent(symbol)}?range=${cfg.range}&interval=${cfg.interval}&includePrePost=false`;

    let data = null;
    for (const proxyFn of PROXIES) {
      try {
        data = await fetchViaProxy(yfUrl, proxyFn);
        if (data?.chart?.result) break;
      } catch (e) {
        console.warn('Proxy failed, trying next...', e.message);
      }
    }

    if (!data?.chart?.result?.[0]) return null;

    try {
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const ohlcv = result.indicators.quote[0];

      const candles = timestamps.map((ts, i) => ({
        x: ts * 1000,
        o: ohlcv.open[i],
        h: ohlcv.high[i],
        l: ohlcv.low[i],
        c: ohlcv.close[i],
        v: ohlcv.volume[i],
      })).filter(c => c.o && c.h && c.l && c.c);

      const meta = result.meta;
      return { candles, meta, currency: meta.currency || 'USD' };
    } catch (e) {
      console.warn('Parse failed:', e);
      return null;
    }
  }

  function renderChart(container, candles, symbol, currency) {
    const ctx = container.querySelector('canvas');
    if (!ctx) return;

    const first = candles[0].c;
    const last  = candles[candles.length - 1].c;
    const change = ((last - first) / first * 100).toFixed(2);
    const isUp = change >= 0;

    const priceEl  = container.querySelector('.cn-price');
    const changeEl = container.querySelector('.cn-change');
    if (priceEl)  priceEl.textContent = formatPrice(last, currency === 'USD' ? 2 : 4);
    if (changeEl) {
      changeEl.textContent = (isUp ? '+' : '') + change + '%';
      changeEl.className = 'cn-change ' + (isUp ? 'up' : 'down');
    }

    if (ctx._chart) ctx._chart.destroy();

    const UP_COLOR   = '#22c55e';
    const DOWN_COLOR = '#ef4444';
    const GRID       = 'rgba(255,255,255,0.06)';
    const TEXT       = '#a1a1aa';

    const chartData  = candles.map(c => ({ x: c.x, o: c.o, h: c.h, l: c.l, c: c.c }));
    const volumeData = candles.map(c => ({
      x: c.x, y: c.v,
      color: c.c >= c.o ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'
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
            type: 'bar',
            label: 'Volume',
            data: volumeData,
            backgroundColor: volumeData.map(v => v.color),
            yAxisID: 'volume',
            order: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeInOutQuart' },
        layout: { padding: { top: 8, right: 16, bottom: 8, left: 8 } },
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
            ticks: {
              color: TEXT,
              font: { family: 'JetBrains Mono', size: 11 },
              callback: v => '$' + v.toLocaleString()
            }
          },
          volume: {
            position: 'left',
            max: Math.max(...candles.map(c => c.v)) * 5,
            grid: { display: false },
            ticks: { display: false },
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(13,13,20,0.95)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            titleColor: '#e4e4e7',
            bodyColor: '#a1a1aa',
            padding: 12,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              title: items => formatDate(items[0].parsed.x / 1000),
              label: item => {
                if (item.dataset.type === 'bar') return `Vol: ${(item.parsed.y/1e6).toFixed(1)}M`;
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
        <div class="cn-period-btns">
          ${Object.keys(PERIODS).map((p, i) =>
            `<button class="cn-period${i===1?' active':''}" data-period="${p}">${p}</button>`
          ).join('')}
        </div>
      </div>
      <div class="cn-chart-body">
        <div class="cn-chart-loading">
          <div class="cn-loading-spinner"></div>
          <span>Fetching price data…</span>
        </div>
        <canvas></canvas>
      </div>
    `;

    const canvas    = el.querySelector('canvas');
    const loadingEl = el.querySelector('.cn-chart-loading');

    if (!window.Chart) {
      await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.1/dist/chartjs-chart-financial.min.js');
    }

    let currentPeriod = '3M';

    async function loadAndRender(period) {
      loadingEl.style.display = 'flex';
      canvas.style.opacity = '0';

      const data = await fetchData(symbol, period);

      loadingEl.style.display = 'none';
      canvas.style.opacity = '1';

      if (data && data.candles.length > 0) {
        renderChart(el, data.candles, symbol, data.currency);
      } else {
        loadingEl.querySelector('span').textContent = 'Price data unavailable';
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

  function init() {
    document.querySelectorAll('.cn-price-chart').forEach(initChart);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.CommodityNodeChart = { init, initChart };
})();
