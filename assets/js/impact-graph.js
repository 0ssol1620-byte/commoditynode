/* CommodityNode — Impact Graph v10
   Advanced: collapse/expand, type filters, search, trace downstream,
   pin node, selected-chain highlight, smooth transitions
   D3 zoom.filter() for mobile scroll/pinch separation */
(function () {
  'use strict';
  document.querySelectorAll('#impact-graph').forEach(initGraph);

  function hexPath(cx, cy, r) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i - Math.PI / 6;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return 'M' + pts.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join('L') + 'Z';
  }

  function initGraph(container) {
    const rawData = window.COMMODITY_DATA;
    if (!rawData) return;

    let levels;
    if (rawData.levels) { levels = rawData.levels; }
    else if (rawData.nodes && rawData.links) {
      const c = rawData.nodes.find(n => n.type === 'commodity') || rawData.nodes[0];
      levels = [{ nodes: rawData.nodes.filter(n => n !== c) }];
    } else return;

    const commodity = rawData.commodity || rawData.nodes?.find(n => n.type === 'commodity');
    const CLR = {
      commodity:'#fbbf24', etf:'#818cf8', positive:'#22c55e', negative:'#ef4444',
      producer:'#f59e0b', processor:'#06b6d4', consumer:'#fb923c', supplier:'#34d399',
      macro:'#a78bfa', policy:'#f472b6', substitute:'#facc15', regional:'#38bdf8',
      default:'#94a3b8'
    };

    const nodes = [], links = [];
    let maxVisibleLevel = Infinity;
    let sentimentFilter = 'all';
    let typeFilter = 'all';
    let searchTerm = '';
    let tracedChain = null;
    const pinnedNodes = new Set();
    const collapsedNodes = new Set();

    const center = { id: commodity?.id||'center', label: commodity?.label||'Commodity', type:'commodity', level:0, impact:null };
    nodes.push(center);
    levels.forEach((lvl, li) => {
      (lvl.nodes||[]).forEach(n => {
        nodes.push({...n, level: li+1});
        links.push({ source: n.parentId||center.id, target: n.id, correlation: n.correlation||0.5, impact: n.impact||0 });
      });
    });

    // Build parent/child maps
    const childMap = {};
    const parentMap = {};
    links.forEach(lk => {
      const sid = typeof lk.source === 'object' ? lk.source.id : lk.source;
      const tid = typeof lk.target === 'object' ? lk.target.id : lk.target;
      if (!childMap[sid]) childMap[sid] = [];
      childMap[sid].push(tid);
      parentMap[tid] = sid;
    });

    function getDescendants(nodeId) {
      const desc = new Set();
      const queue = [nodeId];
      while (queue.length) {
        const cur = queue.shift();
        (childMap[cur] || []).forEach(ch => {
          if (!desc.has(ch)) { desc.add(ch); queue.push(ch); }
        });
      }
      return desc;
    }

    function getAncestors(nodeId) {
      const anc = new Set();
      let cur = nodeId;
      while (parentMap[cur]) {
        anc.add(parentMap[cur]);
        cur = parentMap[cur];
      }
      return anc;
    }

    function getFullChain(nodeId) {
      const chain = new Set([nodeId]);
      getDescendants(nodeId).forEach(d => chain.add(d));
      getAncestors(nodeId).forEach(a => chain.add(a));
      return chain;
    }

    const isMob = window.innerWidth < 768;
    const W = container.offsetWidth || 700;
    const H = isMob ? 460 : 580;
    container.style.height = H + 'px';
    container.style.position = 'relative';
    container.innerHTML = '';

    const svg = d3.select(container).append('svg')
      .attr('width', '100%').attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('overflow', 'hidden').style('display', 'block');

    const defs = svg.append('defs');

    // Filters
    [3, 7, 14].forEach((sd, i) => {
      const f = defs.append('filter').attr('id', `gf${i}`)
        .attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
      f.append('feGaussianBlur').attr('stdDeviation', sd).attr('result', 'blur');
      const m = f.append('feMerge');
      m.append('feMergeNode').attr('in', 'blur');
      m.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Gradients
    const lt = (hex, a) => {
      const c = parseInt(hex.slice(1), 16);
      return `rgb(${Math.min(255,(c>>16)+Math.round(255*a))},${Math.min(255,((c>>8)&0xff)+Math.round(255*a))},${Math.min(255,(c&0xff)+Math.round(255*a))})`;
    };
    Object.entries(CLR).forEach(([t, color]) => {
      const gr = defs.append('radialGradient').attr('id', `gr-${t}`).attr('cx','35%').attr('cy','30%').attr('r','70%');
      gr.append('stop').attr('offset','0%').attr('stop-color', lt(color, 0.45));
      gr.append('stop').attr('offset','100%').attr('stop-color', color);
    });

    // Arrows
    ['pos','neg','neu'].forEach(k => {
      const col = k==='pos'?'#22c55e':k==='neg'?'#ef4444':'#52525b';
      defs.append('marker').attr('id',`am${k}`)
        .attr('viewBox','0 -4 8 8').attr('refX',16).attr('refY',0)
        .attr('markerWidth',4).attr('markerHeight',4).attr('orient','auto')
        .append('path').attr('d','M0,-4L8,0L0,4').attr('fill',col).attr('opacity',0.75);
    });

    // Zoom group
    const g = svg.append('g').attr('class', 'cn-g');

    let currentTransform = d3.zoomIdentity;
    const zoom = d3.zoom()
      .scaleExtent([0.15, 6])
      .filter(function(event) {
        if (event.ctrlKey) return false;
        if (event.type === 'touchstart' || event.type === 'touchmove') {
          return event.touches.length >= 2;
        }
        return !event.button;
      })
      .on('zoom', (event) => {
        currentTransform = event.transform;
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    svg.node().addEventListener('touchmove', function(e) {
      if (e.touches.length >= 2) e.preventDefault();
    }, { passive: false });

    // Reset button
    const resetBtn = svg.append('g')
      .attr('class', 'cn-reset-btn')
      .attr('transform', `translate(${W - 44}, 12)`)
      .style('cursor', 'pointer')
      .style('opacity', 0.7);

    resetBtn.append('rect')
      .attr('width', 32).attr('height', 32).attr('rx', 6)
      .attr('fill', 'rgba(13,13,24,0.85)').attr('stroke', 'rgba(34,211,238,0.3)').attr('stroke-width', 1);

    resetBtn.append('text')
      .attr('x', 16).attr('y', 16).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('font-size', '14px').attr('fill', '#22d3ee').attr('font-family', 'sans-serif')
      .text('\u2299');

    resetBtn.on('click touchend', function() {
      tracedChain = null;
      collapsedNodes.clear();
      updateVisibility();
      fitAll(true);
    }).on('mouseenter', function() {
      d3.select(this).style('opacity', 1);
    }).on('mouseleave', function() {
      d3.select(this).style('opacity', 0.7);
    });

    function fitAll(animate) {
      try {
        const b = g.node().getBBox();
        if (!b.width) return;
        const pad = 48;
        const sc = Math.min(0.92, Math.min((W-pad*2)/b.width, (H-pad*2)/b.height));
        const tx = (W - b.width*sc)/2 - b.x*sc;
        const ty = (H - b.height*sc)/2 - b.y*sc;
        const t = d3.zoomIdentity.translate(tx, ty).scale(sc);
        if (animate) {
          svg.transition().duration(500).call(zoom.transform, t);
        } else {
          svg.call(zoom.transform, t);
        }
      } catch(e) {}
    }

    const HR = d => d.level===0?30:d.level===1?21:d.level===2?16:d.level===3?13:11;
    const maxLevel = Math.max(...nodes.map(n => n.level));
    const ringR = isMob ? 80 : 108;

    // ── CONTROLS ──
    const controls = d3.select(container).append('div').attr('class','cn-graph-controls');

    // Build type filter buttons based on what types exist in data
    const presentTypes = new Set(nodes.map(n => n.type).filter(t => t !== 'commodity'));
    const typeLabels = {
      etf: 'ETFs', producer: 'Producers', processor: 'Processors',
      positive: 'Positive', negative: 'Negative', consumer: 'Consumers',
      supplier: 'Suppliers', macro: 'Macro', policy: 'Policy',
      substitute: 'Substitutes', regional: 'Regional'
    };
    const typeButtons = Array.from(presentTypes).slice(0, 5).map(t =>
      `<button type="button" data-type="${t}">${typeLabels[t] || t}</button>`
    ).join('');

    controls.html(`
      <div class="cn-graph-control-group">
        <span class="cn-graph-control-label">Depth</span>
        <button type="button" class="is-active" data-depth="99">All</button>
        <button type="button" data-depth="1">L1</button>
        <button type="button" data-depth="2">L2</button>
        <button type="button" data-depth="3">L3</button>
      </div>
      <div class="cn-graph-control-group">
        <span class="cn-graph-control-label">Type</span>
        <button type="button" class="is-active" data-type="all">All</button>
        ${typeButtons}
      </div>
      <div class="cn-graph-control-group cn-search-group">
        <input type="text" class="cn-graph-search" placeholder="Search nodes..." aria-label="Search nodes">
      </div>
    `);

    // Simulation
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d=>d.id).distance(d=>{
        const sl = typeof d.source==='object'?d.source.level:0;
        const tl = typeof d.target==='object'?d.target.level:0;
        return ringR*(0.85+Math.max(sl,tl)*0.18);
      }).strength(0.65))
      .force('charge', d3.forceManyBody().strength(d=>d.level===0?-700:-280))
      .force('collide', d3.forceCollide(d=>HR(d)+30))
      .force('center', d3.forceCenter(W/2,H/2).strength(0.06))
      .force('radial', d3.forceRadial(d=>d.level*ringR, W/2, H/2).strength(0.55))
      .stop();
    for (let i = 0; i < 300; i++) sim.tick();

    // Links
    const lG = g.append('g');
    const lEls = lG.selectAll('path').data(links).join('path')
      .attr('fill', 'none')
      .attr('stroke', d=>d.impact>0?'rgba(34,197,94,0.35)':d.impact<0?'rgba(239,68,68,0.35)':'rgba(120,120,150,0.18)')
      .attr('stroke-width', d=>Math.max(1,Math.min(3,Math.abs(d.correlation||0.3)*3)))
      .attr('stroke-linecap','round')
      .attr('marker-end', d=>d.impact>0?'url(#ampos)':d.impact<0?'url(#amneg)':'url(#amneu)')
      .attr('d', lp).attr('opacity', 0);

    function lp(d) {
      const sx=d.source.x,sy=d.source.y,tx=d.target.x,ty=d.target.y;
      const dx=tx-sx,dy=ty-sy,dist=Math.sqrt(dx*dx+dy*dy)||1;
      const cv=Math.min(28,dist*0.18);
      return `M${sx},${sy} Q${(sx+tx)/2-dy/dist*cv},${(sy+ty)/2+dx/dist*cv} ${tx},${ty}`;
    }

    // Particles
    const pd = [];
    links.forEach((lk,li) => { for(let p=0;p<2;p++) pd.push({li,t:p/2,spd:0.004+Math.random()*0.003}); });
    const pG = g.append('g');
    const pEls = pG.selectAll('circle').data(pd).join('circle')
      .attr('r', isMob?1.5:2)
      .attr('fill', d=>links[d.li].impact>0?'#22c55e':links[d.li].impact<0?'#ef4444':'#52525b')
      .attr('opacity', 0.6);

    // Node groups
    const nG = g.append('g');
    const nEls = nG.selectAll('g').data(nodes).join('g')
      .attr('class','cn-nd')
      .attr('transform', d=>`translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Pulse ring
    nEls.filter(d=>d.level===0||Math.abs(d.impact||0)>=8)
      .append('path').attr('class','cn-ph')
      .attr('d',d=>hexPath(0,0,HR(d)+10)).attr('fill','none')
      .attr('stroke',d=>CLR[d.type]||CLR.default).attr('stroke-width',1).attr('opacity',0);

    // Hex
    nEls.append('path').attr('class','cn-hex')
      .attr('d',d=>hexPath(0,0,HR(d)))
      .attr('fill',d=>`url(#gr-${CLR[d.type] ? d.type : 'default'})`)
      .attr('stroke',d=>CLR[d.type]||CLR.default)
      .attr('stroke-width',d=>d.level===0?2:1.2)
      .attr('filter',d=>{if(d.level===0)return'url(#gf2)';const a=Math.abs(d.impact||0);return a>=10?'url(#gf1)':a>=5?'url(#gf0)':null;})
      .attr('opacity',0);

    // Pin indicator
    nEls.append('circle').attr('class','cn-pin-dot')
      .attr('cx', d => HR(d) - 4).attr('cy', d => -(HR(d) - 4))
      .attr('r', 3).attr('fill', '#22d3ee').attr('stroke', '#050508').attr('stroke-width', 1)
      .attr('opacity', 0);

    // Impact %
    nEls.filter(d=>d.level<=2&&d.impact!=null)
      .append('text').attr('text-anchor','middle').attr('dy','0.35em')
      .attr('font-family','JetBrains Mono,monospace')
      .attr('font-size',d=>d.level===0?'10px':'8px').attr('font-weight','800')
      .attr('fill','#050508').attr('pointer-events','none').attr('opacity',0)
      .text(d=>d.impact!=null?(d.impact>0?'+':'')+d.impact+'%':'');

    // Label
    function abbr(l,mx) {
      if(!l||l.length<=mx)return l;
      const m=l.match(/\(([A-Z0-9\-\.=]+)\)$/);
      if(m){const t=m[1],w=l.replace(/\s*\([^)]+\)$/,'').split(' ');for(let n=w.length;n>=1;n--){const s=w.slice(0,n).join(' ')+' ('+t+')';if(s.length<=mx)return s;}return'('+t+')';}
      return l.slice(0,mx-1)+'\u2026';
    }
    const LMAX = isMob ? 13 : 17;

    nEls.append('rect').attr('class','cn-lbg')
      .attr('rx',3).attr('fill','rgba(4,4,12,0.82)').attr('pointer-events','none').attr('opacity',0);

    nEls.append('text').attr('class','cn-lbl')
      .attr('text-anchor','middle').attr('dy',d=>(HR(d)+16)+'px')
      .attr('font-family','Inter,sans-serif')
      .attr('font-size',d=>d.level===0?'12px':d.level<=2?'10px':'9px')
      .attr('font-weight',d=>d.level<=1?'700':'500')
      .attr('fill','#f0f0f5').attr('pointer-events','none').attr('opacity',0)
      .text(d=>abbr(d.label,LMAX));

    function fitBgs() {
      nEls.each(function() {
        const el = d3.select(this);
        const t = el.select('.cn-lbl').node();
        if (!t) return;
        try { const b=t.getBBox(); el.select('.cn-lbg').attr('x',b.x-3).attr('y',b.y-2).attr('width',b.width+6).attr('height',b.height+4); }
        catch(e) {}
      });
    }

    // Tooltip
    const tip = d3.select(container).append('div').attr('class','cn-graph-tooltip').style('display','none');
    function showT(d, cx, cy) {
      const lines = [`<strong>${d.label}</strong>`];
      if(d.impact!=null){const s=d.impact>0?'+':'',col=d.impact>0?'#22c55e':'#ef4444';lines.push(`<span style="color:${col};font-weight:700">Impact: ${s}${d.impact}%</span>`);}
      if(d.correlation) lines.push(`Correlation: ${(+d.correlation).toFixed(2)}`);
      if(d.sector)      lines.push(`Sector: ${d.sector}`);
      if(d.marketCap)   lines.push(`Mkt Cap: $${d.marketCap}`);
      if(d.type && d.type !== 'commodity') lines.push(`Type: ${d.type}`);
      const hasChildren = (childMap[d.id] || []).length > 0;
      if(hasChildren) lines.push(`<span style="color:#71717a;font-size:11px">Click to ${collapsedNodes.has(d.id)?'expand':'collapse'} children</span>`);
      lines.push(`<span style="color:#71717a;font-size:11px">Double-click to ${pinnedNodes.has(d.id)?'unpin':'pin'}</span>`);
      const r = container.getBoundingClientRect();
      tip.style('display','block').html(lines.join('<br>'))
        .style('left',(cx-r.left+14)+'px').style('top',(cy-r.top-10)+'px');
    }

    nEls
      .on('mouseenter',(e,d)=>{d3.select(e.currentTarget).select('.cn-hex').transition().duration(100).attr('d',hexPath(0,0,HR(d)*1.2));showT(d,e.clientX,e.clientY);})
      .on('mousemove',(e,d)=>showT(d,e.clientX,e.clientY))
      .on('mouseleave',(e,d)=>{d3.select(e.currentTarget).select('.cn-hex').transition().duration(100).attr('d',hexPath(0,0,HR(d)));tip.style('display','none');});

    // Click = collapse/expand children
    let clickTimer = null;
    nEls.on('click', function(event, d) {
      if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; return; }
      clickTimer = setTimeout(() => {
        clickTimer = null;
        const hasChildren = (childMap[d.id] || []).length > 0;
        if (hasChildren) {
          if (collapsedNodes.has(d.id)) {
            collapsedNodes.delete(d.id);
          } else {
            collapsedNodes.add(d.id);
          }
          updateVisibility();
        } else {
          // Trace downstream for leaf nodes
          if (tracedChain && tracedChain.has(d.id)) {
            tracedChain = null;
          } else {
            tracedChain = getFullChain(d.id);
          }
          updateVisibility();
        }
      }, 250);
    });

    // Double-click = pin/unpin
    nEls.on('dblclick', function(event, d) {
      if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
      event.stopPropagation();
      if (pinnedNodes.has(d.id)) {
        pinnedNodes.delete(d.id);
        d.fx = null;
        d.fy = null;
      } else {
        pinnedNodes.add(d.id);
        d.fx = d.x;
        d.fy = d.y;
      }
      nEls.select('.cn-pin-dot')
        .transition().duration(200)
        .attr('opacity', nd => pinnedNodes.has(nd.id) ? 1 : 0);
    });

    // Mobile tap = tooltip
    nEls.on('touchstart', function(event, d) {
      if (event.touches.length === 1) {
        const t = event.touches[0];
        showT(d, t.clientX, t.clientY);
        setTimeout(() => tip.style('display','none'), 2500);
      }
    });

    // Desktop drag
    nEls.call(d3.drag()
      .filter(event => !event.button && event.touches?.length !== 2)
      .on('start',(e,d)=>{ d.fx=d.x; d.fy=d.y; })
      .on('drag',(e,d)=>{
        d.fx=e.x; d.fy=e.y; d.x=e.x; d.y=e.y;
        d3.select(e.sourceEvent.target.closest('.cn-nd')).attr('transform',`translate(${e.x},${e.y})`);
        lEls.attr('d',lp);
      })
    );

    // ── VISIBILITY LOGIC ──
    function isCollapsedDescendant(nodeId) {
      let cur = nodeId;
      while (parentMap[cur]) {
        if (collapsedNodes.has(parentMap[cur])) return true;
        cur = parentMap[cur];
      }
      return false;
    }

    function nodeVisible(d) {
      if (d.level === 0) return true;
      // Collapsed check
      if (isCollapsedDescendant(d.id)) return false;
      // Depth filter
      const passesDepth = d.level <= maxVisibleLevel;
      if (!passesDepth) return false;
      // Sentiment filter
      if (sentimentFilter === 'positive' && !(d.impact == null || d.impact >= 0 || d.type === 'etf')) return false;
      if (sentimentFilter === 'negative' && !(d.impact == null || d.impact <= 0 || d.type === 'etf')) return false;
      // Type filter
      if (typeFilter !== 'all' && d.type !== typeFilter && d.type !== 'commodity') return false;
      return true;
    }

    function linkVisible(d) {
      const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
      const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
      return source && target && nodeVisible(source) && nodeVisible(target);
    }

    function updateVisibility() {
      const dur = 300;

      // Node visibility with smooth transition
      nEls.each(function(d) {
        const el = d3.select(this);
        const vis = nodeVisible(d);
        el.transition().duration(dur)
          .style('opacity', vis ? 1 : 0)
          .style('pointer-events', vis ? 'all' : 'none');
      });

      // Link visibility
      lEls.each(function(d) {
        const vis = linkVisible(d);
        d3.select(this).transition().duration(dur)
          .style('opacity', vis ? 1 : 0);
      });

      // Particle visibility
      pEls.each(function(d) {
        const vis = linkVisible(links[d.li]);
        d3.select(this).transition().duration(dur)
          .style('opacity', vis ? 0.6 : 0);
      });

      // Search highlight
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        nEls.each(function(d) {
          const match = d.label.toLowerCase().includes(term) ||
                       (d.sector && d.sector.toLowerCase().includes(term)) ||
                       (d.id && d.id.toLowerCase().includes(term));
          d3.select(this).select('.cn-hex')
            .transition().duration(dur)
            .attr('stroke-width', match ? 3 : (d.level===0?2:1.2))
            .attr('stroke', match ? '#fff' : (CLR[d.type]||CLR.default));
        });
      } else {
        nEls.select('.cn-hex')
          .transition().duration(dur)
          .attr('stroke-width', d => d.level===0?2:1.2)
          .attr('stroke', d => CLR[d.type]||CLR.default);
      }

      // Traced chain highlight
      if (tracedChain) {
        nEls.each(function(d) {
          const inChain = tracedChain.has(d.id);
          d3.select(this)
            .transition().duration(dur)
            .style('opacity', function() {
              if (!nodeVisible(d)) return 0;
              return inChain ? 1 : 0.15;
            });
        });
        lEls.each(function(d) {
          const sid = typeof d.source === 'object' ? d.source.id : d.source;
          const tid = typeof d.target === 'object' ? d.target.id : d.target;
          const inChain = tracedChain.has(sid) && tracedChain.has(tid);
          d3.select(this)
            .transition().duration(dur)
            .style('opacity', function() {
              if (!linkVisible(d)) return 0;
              return inChain ? 1 : 0.05;
            })
            .attr('stroke-width', inChain ? 3 : Math.max(1,Math.min(3,Math.abs(d.correlation||0.3)*3)));
        });
      }

      fitBgs();
    }

    // ── CONTROL HANDLERS ──
    controls.selectAll('[data-depth]').on('click', function() {
      const button = d3.select(this);
      const depth = +button.attr('data-depth');
      maxVisibleLevel = depth >= 99 ? Infinity : depth;
      controls.selectAll('[data-depth]').classed('is-active', false);
      button.classed('is-active', true);
      tracedChain = null;
      updateVisibility();
    });

    controls.selectAll('[data-type]').on('click', function() {
      const button = d3.select(this);
      typeFilter = button.attr('data-type');
      controls.selectAll('[data-type]').classed('is-active', false);
      button.classed('is-active', true);
      tracedChain = null;
      updateVisibility();
    });

    controls.select('.cn-graph-search').on('input', function() {
      searchTerm = this.value.trim();
      updateVisibility();
    });

    // ── STAGGERED REVEAL ──
    for (let l=0; l<=maxLevel; l++) {
      const dl = l*120;
      nG.selectAll('.cn-nd').filter(d=>d.level===l).selectAll('path,text,rect')
        .transition().delay(dl).duration(320).attr('opacity',1);
    }
    lEls.transition().delay(maxLevel*120+80).duration(450).attr('opacity',1);
    pEls.transition().delay(maxLevel*120+350).duration(500).attr('opacity',0.6);

    setTimeout(fitBgs, maxLevel*120+420);

    // Pulse ring
    function pulseH() {
      nEls.selectAll('.cn-ph').transition().duration(1800).ease(d3.easeSinInOut)
        .attr('d',d=>hexPath(0,0,HR(d)+16)).attr('opacity',0)
        .transition().duration(0).attr('d',d=>hexPath(0,0,HR(d)+8)).attr('opacity',0.18)
        .on('end',pulseH);
    }
    setTimeout(pulseH, maxLevel*120+550);

    // Particles
    function ptick() {
      pEls.each(function(d) {
        d.t=(d.t+d.spd)%1;
        const lk=links[d.li];
        const sx=lk.source.x,sy=lk.source.y,tx=lk.target.x,ty=lk.target.y;
        const dx=tx-sx,dy=ty-sy,dist=Math.sqrt(dx*dx+dy*dy)||1;
        const cv=Math.min(28,dist*0.18);
        const qx=(sx+tx)/2-dy/dist*cv,qy=(sy+ty)/2+dx/dist*cv,t=d.t;
        d3.select(this)
          .attr('cx',(1-t)*(1-t)*sx+2*(1-t)*t*qx+t*t*tx)
          .attr('cy',(1-t)*(1-t)*sy+2*(1-t)*t*qy+t*t*ty);
      });
      requestAnimationFrame(ptick);
    }
    setTimeout(ptick, maxLevel*120+350);

    // Legend — expanded with new types
    const legendTypes = [
      {c:'#fbbf24',l:'Commodity'},{c:'#818cf8',l:'ETF'},{c:'#22c55e',l:'Positive'},
      {c:'#ef4444',l:'Negative'},{c:'#f59e0b',l:'Producer'},{c:'#06b6d4',l:'Processor'}
    ];
    // Only show types present in data
    const activeLegend = legendTypes.filter(lt => nodes.some(n => {
      if (lt.l === 'Positive') return n.type === 'positive';
      if (lt.l === 'Negative') return n.type === 'negative';
      return n.type === lt.l.toLowerCase();
    }));
    const leg = activeLegend.length > 0 ? activeLegend : legendTypes.slice(0, 4);

    const legG = svg.append('g').attr('transform',`translate(12,${H-12-leg.length*22})`);
    leg.forEach((item,i) => {
      const row = legG.append('g').attr('transform',`translate(0,${i*22})`);
      row.append('path').attr('d',hexPath(6,0,6)).attr('fill',item.c).attr('opacity',0.9);
      row.append('text').attr('x',16).attr('dy','0.35em').attr('font-size','11px').attr('font-family','Inter,sans-serif').attr('fill','#71717a').text(item.l);
    });

    // Hint text
    svg.append('text').attr('x',W-48).attr('y',H-10).attr('text-anchor','end')
      .attr('font-size','10px').attr('font-family','Inter').attr('fill','#3f3f5a')
      .text(isMob ? 'Pinch zoom \u00b7 Tap \u2299 to reset' : 'Click collapse \u00b7 Dbl-click pin \u00b7 \u2299 reset');

    // Auto-fit after reveal
    setTimeout(() => { fitAll(false); updateVisibility(); }, maxLevel*120+700);
  }
})();
