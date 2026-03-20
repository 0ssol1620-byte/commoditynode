/* ================================================================
   CommodityNode — Impact Graph v7
   Hexagon nodes · ring+core · impact-glow · particles · pulse
   ================================================================ */
(function () {
  'use strict';

  document.querySelectorAll('#impact-graph').forEach(initGraph);

  function hexPath(cx, cy, r) {
    // Flat-top hexagon
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 30);
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return 'M' + pts.map(p => p.join(',')).join('L') + 'Z';
  }

  function initGraph(container) {
    const rawData = window.COMMODITY_DATA;
    if (!rawData) return;

    let levels;
    if (rawData.levels) {
      levels = rawData.levels;
    } else if (rawData.nodes && rawData.links) {
      const commodity = rawData.nodes.find(n => n.type === 'commodity') || rawData.nodes[0];
      levels = [{ nodes: rawData.nodes.filter(n => n !== commodity) }];
    } else return;

    const commodity = rawData.commodity || rawData.nodes?.find(n => n.type === 'commodity');

    const COLORS = {
      commodity: '#fbbf24', etf: '#818cf8',
      positive: '#22c55e', negative: '#ef4444',
      producer: '#f59e0b', processor: '#06b6d4', default: '#94a3b8',
    };

    // Build graph
    const nodes = [], links = [];
    const center = { id: commodity?.id || 'center', label: commodity?.label || 'Commodity', type: 'commodity', level: 0, impact: null };
    nodes.push(center);
    levels.forEach((lvl, li) => {
      (lvl.nodes || []).forEach(n => {
        nodes.push({ ...n, level: li + 1 });
        links.push({ source: n.parentId || center.id, target: n.id, correlation: n.correlation || 0.5, impact: n.impact || 0 });
      });
    });

    const isMob = window.innerWidth < 768;
    const W = container.offsetWidth || window.innerWidth;
    const H = isMob ? 440 : 580;
    container.style.height = H + 'px';
    container.innerHTML = '';

    const svg = d3.select(container)
      .append('svg').attr('width', '100%').attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`).style('overflow','hidden').style('display','block');

    const defs = svg.append('defs');

    // Glow filters
    [3, 7, 14].forEach((sd, i) => {
      const f = defs.append('filter').attr('id', `hglow-${i}`)
        .attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
      f.append('feGaussianBlur').attr('stdDeviation', sd).attr('result','blur');
      const m = f.append('feMerge');
      m.append('feMergeNode').attr('in','blur');
      m.append('feMergeNode').attr('in','SourceGraphic');
    });

    // Radial gradients per color
    const lighten = (hex, a) => {
      const c = parseInt(hex.slice(1), 16);
      return `rgb(${Math.min(255,(c>>16)+Math.round(255*a))},${Math.min(255,((c>>8)&0xff)+Math.round(255*a))},${Math.min(255,(c&0xff)+Math.round(255*a))})`;
    };
    Object.entries(COLORS).forEach(([t, color]) => {
      const g = defs.append('radialGradient').attr('id', `hg-${t}`).attr('cx','35%').attr('cy','30%').attr('r','70%');
      g.append('stop').attr('offset','0%').attr('stop-color', lighten(color, 0.45));
      g.append('stop').attr('offset','100%').attr('stop-color', color);
    });

    // Arrow markers
    ['pos','neg','neu'].forEach(k => {
      const c = k==='pos'?'#22c55e':k==='neg'?'#ef4444':'#52525b';
      defs.append('marker').attr('id',`ha-${k}`)
        .attr('viewBox','0 -4 8 8').attr('refX',17).attr('refY',0)
        .attr('markerWidth',4).attr('markerHeight',4).attr('orient','auto')
        .append('path').attr('d','M0,-4L8,0L0,4').attr('fill',c).attr('opacity',0.75);
    });

    const g = svg.append('g').attr('class','cn-g');
    const zoom = d3.zoom().scaleExtent([0.2,5]).on('zoom', e => g.attr('transform', e.transform));

    if (isMob) {
      // Mobile: only enable zoom/pan with 2 fingers (pinch) — single finger scrolls page
      svg.style('touch-action', 'pan-y');
      svg.on('touchstart', function(event) {
        if (event.touches.length >= 2) {
          event.preventDefault();
          svg.call(zoom);
        } else {
          // Single touch: remove zoom to allow page scroll
          svg.on('.zoom', null);
        }
      }, { passive: false });
      svg.on('touchend', function() {
        // Re-enable zoom after touch ends for pinch
        svg.call(zoom);
      });
    } else {
      svg.call(zoom).on('dblclick.zoom', null);
    }

    // Node size by level (hex radius)
    const HR = d => d.level===0 ? 30 : d.level===1 ? 20 : d.level===2 ? 16 : d.level===3 ? 13 : 11;

    // Force simulation
    const maxLevel = Math.max(...nodes.map(n => n.level));
    const ringR = isMob ? 78 : 108;

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d=>d.id).distance(d => {
        const sl = typeof d.source==='object'?d.source.level:0;
        const tl = typeof d.target==='object'?d.target.level:0;
        return ringR*(0.85 + Math.max(sl,tl)*0.18);
      }).strength(0.65))
      .force('charge', d3.forceManyBody().strength(d=>d.level===0?-700:-280))
      .force('collide', d3.forceCollide(d=>HR(d)+32))
      .force('center', d3.forceCenter(W/2, H/2).strength(0.06))
      .force('radial', d3.forceRadial(d=>d.level*ringR, W/2, H/2).strength(0.55))
      .stop();
    for (let i = 0; i < 300; i++) sim.tick();

    // Links
    const linkG = g.append('g');
    const linkEls = linkG.selectAll('path').data(links).join('path')
      .attr('fill','none')
      .attr('stroke', d=>d.impact>0?'rgba(34,197,94,0.35)':d.impact<0?'rgba(239,68,68,0.35)':'rgba(120,120,150,0.18)')
      .attr('stroke-width', d=>Math.max(1, Math.min(3, Math.abs(d.correlation||0.3)*3)))
      .attr('stroke-linecap','round')
      .attr('marker-end', d=>d.impact>0?'url(#ha-pos)':d.impact<0?'url(#ha-neg)':'url(#ha-neu)')
      .attr('d', lPath).attr('opacity',0);

    function lPath(d) {
      const sx=d.source.x, sy=d.source.y, tx=d.target.x, ty=d.target.y;
      const dx=tx-sx, dy=ty-sy, dist=Math.sqrt(dx*dx+dy*dy)||1;
      const cv=Math.min(28, dist*0.18);
      return `M${sx},${sy} Q${(sx+tx)/2-dy/dist*cv},${(sy+ty)/2+dx/dist*cv} ${tx},${ty}`;
    }

    // Particles
    const PCNT = 2;
    const pdata = [];
    links.forEach((lk,li)=>{
      for(let p=0;p<PCNT;p++) pdata.push({li, t:p/PCNT, spd:0.004+Math.random()*0.003});
    });
    const pG = g.append('g');
    const pEls = pG.selectAll('circle').data(pdata).join('circle')
      .attr('r',2).attr('fill', d=>links[d.li].impact>0?'#22c55e':links[d.li].impact<0?'#ef4444':'#52525b')
      .attr('opacity',0.65);

    // Nodes
    const nG = g.append('g');
    const nEls = nG.selectAll('g').data(nodes).join('g')
      .attr('class','cn-nd').attr('transform', d=>`translate(${d.x},${d.y})`).style('cursor','grab');

    // Outer glow ring (hexagon outline for high-impact)
    nEls.filter(d=>d.level===0||Math.abs(d.impact||0)>=8)
      .append('path').attr('class','cn-pulse-hex')
      .attr('d', d=>hexPath(0,0,HR(d)+10))
      .attr('fill','none')
      .attr('stroke', d=>COLORS[d.type]||COLORS.default)
      .attr('stroke-width',1).attr('opacity',0);

    // Hexagon fill
    nEls.append('path').attr('class','cn-hex')
      .attr('d', d=>hexPath(0,0,HR(d)))
      .attr('fill', d=>`url(#hg-${d.type||'default'})`)
      .attr('stroke', d=>COLORS[d.type]||COLORS.default)
      .attr('stroke-width', d=>d.level===0?2:1.2)
      .attr('filter', d=>{
        if(d.level===0) return 'url(#hglow-2)';
        const a=Math.abs(d.impact||0);
        return a>=10?'url(#hglow-1)':a>=5?'url(#hglow-0)':null;
      })
      .attr('opacity',0);

    // Inner ring for center node
    nEls.filter(d=>d.level===0)
      .append('path')
      .attr('d', hexPath(0,0,14))
      .attr('fill','rgba(5,5,8,0.6)').attr('stroke','rgba(251,191,36,0.4)').attr('stroke-width',1)
      .attr('opacity',0);

    // Impact % text
    nEls.filter(d=>d.level<=2&&d.impact!=null)
      .append('text').attr('text-anchor','middle').attr('dy','0.35em')
      .attr('font-family','JetBrains Mono,monospace')
      .attr('font-size', d=>d.level===0?'10px':'8px').attr('font-weight','800')
      .attr('fill','#050508').attr('pointer-events','none').attr('opacity',0)
      .text(d=>d.impact!=null?(d.impact>0?'+':'')+d.impact+'%':'');

    // Abbreviate label
    function abbr(label, mx) {
      if(!label||label.length<=mx) return label;
      const m=label.match(/\(([A-Z0-9\-\.=]+)\)$/);
      if(m){
        const t=m[1], wds=label.replace(/\s*\([^)]+\)$/,'').split(' ');
        for(let n=wds.length;n>=1;n--){const s=wds.slice(0,n).join(' ')+'('+t+')';if(s.length<=mx)return s;}
        return '('+t+')';
      }
      return label.slice(0,mx-1)+'\u2026';
    }

    // Label below hex
    nEls.append('text').attr('class','cn-lbl')
      .attr('text-anchor','middle').attr('dy', d=>(HR(d)+16)+'px')
      .attr('font-family','Inter,sans-serif')
      .attr('font-size', d=>d.level===0?(isMob?'11px':'12px'):d.level<=2?(isMob?'10px':'10px'):(isMob?'9px':'9px'))
      .attr('font-weight', d=>d.level<=1?'700':'500')
      .attr('fill','#e4e4e7').attr('stroke','#0a0a12').attr('stroke-width','3.5')
      .attr('paint-order','stroke').attr('pointer-events','none').attr('opacity',0)
      .text(d=>abbr(d.label, isMob?12:17));

    // Tooltip
    const tip = d3.select(container).append('div').attr('class','cn-graph-tooltip').style('display','none');
    const showTip = (ev, d, touch) => {
      const lines=[`<strong>${d.label}</strong>`];
      if(d.impact!=null){const s=d.impact>0?'+':'',c=d.impact>0?'#22c55e':'#ef4444';lines.push(`<span style="color:${c};font-weight:700">Impact: ${s}${d.impact}%</span>`);}
      if(d.correlation) lines.push(`Correlation: ${(+d.correlation).toFixed(2)}`);
      if(d.sector) lines.push(`Sector: ${d.sector}`);
      if(d.marketCap) lines.push(`Mkt Cap: $${d.marketCap}`);
      const rect=container.getBoundingClientRect();
      const ex=(touch||ev).clientX-rect.left, ey=(touch||ev).clientY-rect.top;
      tip.style('display','block').html(lines.join('<br>')).style('left',(ex+14)+'px').style('top',(ey-10)+'px');
    };

    nEls.on('mouseenter',(e,d)=>{d3.select(e.currentTarget).select('.cn-hex').transition().duration(120).attr('d',hexPath(0,0,HR(d)*1.2));showTip(e,d);})
       .on('mousemove',(e,d)=>showTip(e,d))
       .on('mouseleave',(e,d)=>{d3.select(e.currentTarget).select('.cn-hex').transition().duration(120).attr('d',hexPath(0,0,HR(d)));tip.style('display','none');})
       .on('touchstart',(e,d)=>{e.preventDefault();showTip(e,d,e.touches[0]);setTimeout(()=>tip.style('display','none'),2500);},{passive:false});

    nEls.call(d3.drag()
      .on('start',(e,d)=>{d.fx=d.x;d.fy=d.y;})
      .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;d3.select(e.sourceEvent.target.closest('.cn-nd')).attr('transform',`translate(${e.x},${e.y})`);linkEls.attr('d',lPath);})
    );

    // Reveal
    for(let l=0;l<=maxLevel;l++){
      const dl=l*130;
      nG.selectAll('.cn-nd').filter(d=>d.level===l).selectAll('.cn-hex,.cn-lbl,.cn-pulse-hex,text,path')
        .transition().delay(dl).duration(350).attr('opacity',1);
    }
    linkEls.transition().delay(maxLevel*130+100).duration(500).attr('opacity',1);
    pEls.transition().delay(maxLevel*130+400).duration(600).attr('opacity',0.65);

    // Pulse hex animation
    function pulseHex() {
      nEls.selectAll('.cn-pulse-hex')
        .transition().duration(1800).ease(d3.easeSinInOut)
        .attr('d',d=>hexPath(0,0,HR(d)+16)).attr('opacity',0)
        .transition().duration(0).attr('d',d=>hexPath(0,0,HR(d)+8)).attr('opacity',0.2)
        .on('end',pulseHex);
    }
    setTimeout(pulseHex, maxLevel*130+600);

    // Particle loop
    function ptick() {
      pEls.each(function(d){
        d.t=(d.t+d.spd)%1;
        const lk=links[d.li];
        const sx=lk.source.x,sy=lk.source.y,tx=lk.target.x,ty=lk.target.y;
        const dx=tx-sx,dy=ty-sy,dist=Math.sqrt(dx*dx+dy*dy)||1;
        const cv=Math.min(28,dist*0.18);
        const qx=(sx+tx)/2-dy/dist*cv, qy=(sy+ty)/2+dx/dist*cv;
        const t=d.t;
        d3.select(this).attr('cx',(1-t)*(1-t)*sx+2*(1-t)*t*qx+t*t*tx).attr('cy',(1-t)*(1-t)*sy+2*(1-t)*t*qy+t*t*ty);
      });
      requestAnimationFrame(ptick);
    }
    setTimeout(ptick, maxLevel*130+400);

    // Legend
    const leg=[{color:'#fbbf24',label:'Commodity'},{color:'#818cf8',label:'ETF'},{color:'#22c55e',label:'Positive'},{color:'#ef4444',label:'Negative'}];
    const lG=svg.append('g').attr('transform',`translate(14,${H-14-leg.length*22})`);
    leg.forEach((item,i)=>{
      const row=lG.append('g').attr('transform',`translate(0,${i*22})`);
      row.append('path').attr('d',hexPath(6,0,6)).attr('fill',item.color).attr('opacity',0.9);
      row.append('text').attr('x',16).attr('dy','0.35em').attr('font-size','11px').attr('font-family','Inter,sans-serif').attr('fill','#71717a').text(item.label);
    });

    svg.append('text').attr('x',W-12).attr('y',H-10).attr('text-anchor','end')
      .attr('font-size','10px').attr('font-family','Inter').attr('fill','#3f3f5a')
      .text('Scroll to zoom · Drag nodes');

    // Auto-fit
    setTimeout(()=>{
      try{
        const b=g.node().getBBox();if(!b.width)return;
        const pad=40,sc=Math.min(0.92,Math.min((W-pad*2)/b.width,(H-pad*2)/b.height));
        svg.call(zoom.transform,d3.zoomIdentity.translate((W-b.width*sc)/2-b.x*sc,(H-b.height*sc)/2-b.y*sc).scale(sc));
      }catch(e){}
    }, maxLevel*130+700);
  }
})();
