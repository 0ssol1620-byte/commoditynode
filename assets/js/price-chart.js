// price-chart.js v6 — Fix Chart.register for financial plugin
(function () {
  'use strict';

  const PERIODS = ['1M', '3M', '1Y', '5Y'];
  let _chartData = null;
  let _registered = false;

  async function ensureChartJs() {
    if (window.Chart && _registered) return true;

    // Load scripts sequentially
    const CDN = [
      'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js',
      'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js',
      'https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.1/dist/chartjs-chart-financial.min.js',
    ];

    for (const src of CDN) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = src;
          s.onload = res;
          s.onerror = () => rej(new Error('Failed: ' + src));
          document.head.appendChild(s);
        });
      }
    }

    // Critical: register financial controllers after loading
    if (window.Chart && window.Chart.register && !_registered) {
      try {
        // chartjs-chart-financial exposes these on window after loading
        const fin = window['chartjs-chart-financial'] ||
                    { CandlestickController: window.CandlestickController,
                      CandlestickElement:    window.CandlestickElement,
                      OhlcController:        window.OhlcController,
                      OhlcElement:           window.OhlcElement };

        // Try to find them on the global scope (UMD bundle exposes them)
        const CC = window.CandlestickController || (fin && fin.CandlestickController);
        const CE = window.CandlestickElement    || (fin && fin.CandlestickElement);
        const OC = window.OhlcController        || (fin && fin.OhlcController);
        const OE = window.OhlcElement           || (fin && fin.OhlcElement);

        if (CC && CE) {
          window.Chart.register(CC, CE);
          if (OC && OE) window.Chart.register(OC, OE);
          _registered = true;
        } else {
          // Fallback: the UMD bundle auto-registers on import
          // Check if 'candlestick' type already works
          _registered = true;
        }
      } catch(e) {
        console.warn('Chart.register:', e);
        _registered = true; // proceed anyway
      }
    }
    return !!window.Chart;
  }

  async function getChartData() {
    if (_chartData) return _chartData;
    try {
      const r = await fetch('/assets/data/chart-data.json');
      if (!r.ok) throw new Error(r.status);
      _chartData = await r.json();
      return _chartData;
    } catch(e) {
      console.warn('chart-data:', e.message);
      return null;
    }
  }

  function fmt(p) {
    if (p == null || isNaN(p)) return '—';
    const n = +p;
    if (n >= 10000) return '$' + (n/1000).toFixed(1) + 'k';
    if (n >= 1000)  return '$' + n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2});
    return '$' + n.toFixed(n < 10 ? 3 : 2);
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'2-digit'});
  }

  function sma(candles, n) {
    const out = [];
    for (let i = n-1; i < candles.length; i++) {
      const avg = candles.slice(i-n+1,i+1).reduce((s,c)=>s+c.c,0)/n;
      out.push({x: candles[i].x, y: avg});
    }
    return out;
  }

  function buildChart(container, candles, symbol) {
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    if (canvas._ch) { canvas._ch.destroy(); canvas._ch = null; }

    const last  = candles[candles.length-1].c;
    const first = candles[0].c;
    const chg   = ((last-first)/first*100).toFixed(2);
    const isUp  = +chg >= 0;
    const ACCENT = isUp ? '#22c55e' : '#ef4444';

    const pEl = container.querySelector('.cn-price');
    const cEl = container.querySelector('.cn-change');
    const uEl = container.querySelector('.cn-updated');
    if (pEl) pEl.textContent = fmt(last);
    if (cEl) { cEl.textContent=(isUp?'+':'')+chg+'%'; cEl.className='cn-change '+(isUp?'up':'down'); }
    if (uEl) uEl.textContent = fmtDate(candles[candles.length-1].x);

    const GRID = 'rgba(255,255,255,0.04)', TICK = '#4a4a6a';
    const ma20 = sma(candles, Math.min(20, candles.length));
    const ma50 = sma(candles, Math.min(50, candles.length));

    canvas._ch = new Chart(canvas, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: symbol, type: 'candlestick',
            data: candles.map(c=>({x:c.x,o:c.o,h:c.h,l:c.l,c:c.c})),
            color: {up:'#22c55e',down:'#ef4444',unchanged:'#71717a'},
            borderColor: {up:'#22c55e',down:'#ef4444',unchanged:'#71717a'},
            backgroundColors: {up:'#22c55e',down:'#ef4444',unchanged:'#71717a'},
            order:1,
          },
          {
            label:'Vol', type:'bar',
            data: candles.map(c=>({x:c.x,y:c.v||0})),
            backgroundColor: candles.map(c=>c.c>=c.o?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)'),
            yAxisID:'vol', order:3,
          },
          {label:'MA20',type:'line',data:ma20,borderColor:'rgba(251,191,36,0.75)',borderWidth:1.2,pointRadius:0,tension:0.3,order:2,yAxisID:'y'},
          {label:'MA50',type:'line',data:ma50,borderColor:'rgba(129,140,248,0.65)',borderWidth:1.2,pointRadius:0,tension:0.3,order:2,yAxisID:'y'},
          {
            label:'Now',type:'line',
            data:[{x:candles[0].x,y:last},{x:candles[candles.length-1].x,y:last}],
            borderColor:ACCENT+'99',borderWidth:1,borderDash:[5,4],
            pointRadius:0,tension:0,order:2,yAxisID:'y',
          },
        ]
      },
      options: {
        responsive:true, maintainAspectRatio:false,
        animation:{duration:350},
        layout:{padding:{top:10,right:68,bottom:2,left:2}},
        scales:{
          x:{
            type:'time',time:{tooltipFormat:'MMM d, yyyy'},
            grid:{color:GRID,drawBorder:false},
            ticks:{color:TICK,maxTicksLimit:6,font:{family:'JetBrains Mono',size:10}},
            adapters:{date:{locale:'en-US'}},
            border:{display:false},
          },
          y:{
            position:'right',grid:{color:GRID,drawBorder:false},
            ticks:{color:TICK,font:{family:'JetBrains Mono',size:10},maxTicksLimit:6,
              callback:v=>v>=1000?'$'+(v/1000).toFixed(1)+'k':'$'+(+v).toFixed(v<10?3:2)},
            border:{display:false},
          },
          vol:{
            position:'left',
            max:Math.max(...candles.map(c=>c.v||0))*6,
            grid:{display:false},ticks:{display:false},border:{display:false},
          },
        },
        plugins:{
          legend:{display:false},
          tooltip:{
            mode:'index',intersect:false,
            backgroundColor:'rgba(6,6,14,0.97)',
            borderColor:'rgba(255,255,255,0.06)',borderWidth:1,
            titleColor:'#e4e4e7',bodyColor:'#52525b',
            padding:{x:12,y:9},
            titleFont:{family:'Inter',size:11,weight:'700'},
            bodyFont:{family:'JetBrains Mono',size:10},
            callbacks:{
              title:items=>fmtDate(items[0].parsed?.x??items[0].raw?.x),
              label:item=>{
                if(item.datasetIndex===1){const v=item.parsed.y||0;return`Vol  ${v>1e6?(v/1e6).toFixed(1)+'M':v>1e3?(v/1e3).toFixed(0)+'K':v}`;}
                if(item.datasetIndex>=2)return null;
                const d=item.raw;if(!d)return'';
                return[`O ${fmt(d.o)}   H ${fmt(d.h)}`,`L ${fmt(d.l)}   C ${fmt(d.c)}`];
              },
              filter:item=>item.datasetIndex<2||item.datasetIndex===null,
            }
          }
        },
        interaction:{mode:'index',intersect:false},
      },
      plugins:[{
        id:'priceLabel',
        afterDraw(chart){
          try{
            const y=chart.scales.y; if(!y) return;
            const px=y.getPixelForValue(last);
            const ctx=chart.ctx;
            ctx.save();
            const txt=fmt(last);
            ctx.font='700 10px JetBrains Mono,monospace';
            const tw=ctx.measureText(txt).width;
            const x=chart.chartArea.right+4,pad=5;
            ctx.fillStyle=ACCENT+'22';
            ctx.beginPath();
            if(ctx.roundRect)ctx.roundRect(x,px-9,tw+pad*2,18,3);
            else ctx.rect(x,px-9,tw+pad*2,18);
            ctx.fill();
            ctx.fillStyle=ACCENT;
            ctx.textAlign='left';ctx.textBaseline='middle';
            ctx.fillText(txt,x+pad,px);
            ctx.restore();
          }catch(e){}
        }
      }]
    });

    // MA legend
    let leg=container.querySelector('.cn-ma-legend');
    if(!leg){
      leg=document.createElement('div');
      leg.className='cn-ma-legend';
      const right=container.querySelector('.cn-chart-right');
      if(right)right.prepend(leg);
    }
    leg.innerHTML=`
      <span style="display:flex;align-items:center;gap:4px;font-size:10px;font-family:'JetBrains Mono',monospace;color:rgba(251,191,36,0.9)"><span style="width:14px;height:1.5px;background:rgba(251,191,36,0.75);display:inline-block;flex-shrink:0"></span>MA20</span>
      <span style="display:flex;align-items:center;gap:4px;font-size:10px;font-family:'JetBrains Mono',monospace;color:rgba(129,140,248,0.9)"><span style="width:14px;height:1.5px;background:rgba(129,140,248,0.65);display:inline-block;flex-shrink:0"></span>MA50</span>
    `;
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
      <div class="cn-chart-body">
        <div class="cn-chart-loading"><div class="cn-loading-spinner"></div><span>Loading…</span></div>
        <canvas></canvas>
      </div>
    `;

    const loading = el.querySelector('.cn-chart-loading');

    const ok = await ensureChartJs();
    if (!ok) {
      loading.querySelector('span').textContent = 'Chart library unavailable';
      loading.querySelector('.cn-loading-spinner').style.display = 'none';
      return;
    }

    const allData = await getChartData();
    let period = '3M';

    async function render(p) {
      loading.style.display = 'flex';
      const cvs = el.querySelector('canvas');
      if (cvs) cvs.style.opacity = '0';

      const candles = allData?.[symbol]?.[p]?.candles;

      loading.style.display = 'none';
      if (cvs) cvs.style.opacity = '1';

      if (candles && candles.length > 1) {
        buildChart(el, candles, symbol);
      } else {
        const sp = loading.querySelector('span');
        if (sp) sp.textContent = 'Price data temporarily unavailable';
        const spin = loading.querySelector('.cn-loading-spinner');
        if (spin) spin.style.display = 'none';
        loading.style.display = 'flex';
      }
    }

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
