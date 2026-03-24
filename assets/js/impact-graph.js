/* CommodityNode — Orbital Impact Graph v11
   Space/Universe theme with orbital rings, star field, gravitational lines
   D3.js v7 — collapse/expand, type filters, search, trace, pin, depth filters
   50+ node support with 5 orbital levels */
(function () {
  'use strict';

  var _bootAttempts = 0;
  function boot() {
    _bootAttempts++;
    if (_bootAttempts > 60) return; // give up after 3s
    if (typeof d3 === 'undefined') { setTimeout(boot, 50); return; }
    // Only run on pages that have #impact-graph
    var els = document.querySelectorAll('#impact-graph');
    if (!els.length) return;
    if (!window.COMMODITY_DATA) { setTimeout(boot, 50); return; }
    els.forEach(function(el) {
      var w = el.getBoundingClientRect().width;
      if (w > 10) {
        initGraph(el);
      } else {
        // Element has no width yet — use ResizeObserver + fallback timeout
        var done = false;
        var ro = new ResizeObserver(function(entries) {
          if (done) return;
          var rw = entries[0].contentRect.width;
          if (rw > 10) { done = true; ro.disconnect(); initGraph(el); }
        });
        ro.observe(el);
        // Fallback: force render after 800ms using window width
        setTimeout(function() {
          if (done) return;
          done = true;
          ro.disconnect();
          el.style.width = '100%';
          initGraph(el);
        }, 800);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
  // Extra retry for mobile in-app browsers (Threads/Instagram) — layout settles after 1.5s
  window.addEventListener('load', () => setTimeout(boot, 1500));

  function initGraph(container) {
    const rawData = window.COMMODITY_DATA;
    if (!rawData) return;
    if (container.dataset.cnInit) return;
    container.dataset.cnInit = '1';

    let levels;
    if (rawData.levels) { levels = rawData.levels; }
    else if (rawData.nodes && rawData.links) {
      const c = rawData.nodes.find(n => n.type === 'commodity') || rawData.nodes[0];
      levels = [{ nodes: rawData.nodes.filter(n => n !== c) }];
    } else return;

    const commodity = rawData.commodity || rawData.nodes?.find(n => n.type === 'commodity');

    // ── COLOR PALETTE ──
    const CLR = {
      commodity:'#fbbf24', etf:'#818cf8', positive:'#22c55e', negative:'#ef4444',
      producer:'#f59e0b', processor:'#06b6d4', consumer:'#fb923c', supplier:'#34d399',
      macro:'#a78bfa', policy:'#f472b6', substitute:'#facc15', regional:'#38bdf8',
      fx:'#60a5fa', freight:'#fb7185', index:'#c084fc', default:'#94a3b8'
    };

    // ── BUILD NODE/LINK DATA ──
    const nodes = [], links = [];
    let maxVisibleLevel = Infinity;
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

    // Parent/child maps
    const childMap = {}, parentMap = {};
    links.forEach(lk => {
      const sid = typeof lk.source === 'object' ? lk.source.id : lk.source;
      const tid = typeof lk.target === 'object' ? lk.target.id : lk.target;
      if (!childMap[sid]) childMap[sid] = [];
      childMap[sid].push(tid);
      parentMap[tid] = sid;
    });

    function getDescendants(nodeId) {
      const desc = new Set(), queue = [nodeId];
      while (queue.length) {
        const cur = queue.shift();
        (childMap[cur] || []).forEach(ch => { if (!desc.has(ch)) { desc.add(ch); queue.push(ch); } });
      }
      return desc;
    }
    function getAncestors(nodeId) {
      const anc = new Set(); let cur = nodeId;
      while (parentMap[cur]) { anc.add(parentMap[cur]); cur = parentMap[cur]; }
      return anc;
    }
    function getFullChain(nodeId) {
      const chain = new Set([nodeId]);
      getDescendants(nodeId).forEach(d => chain.add(d));
      getAncestors(nodeId).forEach(a => chain.add(a));
      return chain;
    }

    // ── LOADING STATE ──
    container.innerHTML = '<div style="text-align:center;padding:60px;color:#94a3b8;"><div style="margin-bottom:16px;font-size:2rem;">&#10779;</div>Loading Impact Map...</div>';

    // ── DIMENSIONS ──
    const isMob = window.innerWidth < 768;
    // Force layout recalculation before measuring (fixes mobile Threads in-app browser)
    container.style.display = 'block';
    container.style.width = '100%';
    container.style.minWidth = '0';
    // Multiple fallbacks for width measurement
    let W = container.getBoundingClientRect().width
         || container.offsetWidth
         || container.clientWidth
         || container.parentElement?.getBoundingClientRect().width
         || container.parentElement?.offsetWidth
         || window.innerWidth
         || (isMob ? 360 : 700);
    // Clamp to reasonable values
    if (W < 50) W = isMob ? (window.screen?.width || 360) : 700;
    const H = isMob ? 520 : 640;
    container.style.height = H + 'px';
    container.style.position = 'relative';
    container.innerHTML = '';

    // ── ORBITAL RADII ──
    const baseRadii = [0, 95, 175, 250, 320, 385];
    const radii = baseRadii.map(r => isMob ? r * 0.7 : r);
    const maxLevel = Math.max(...nodes.map(n => n.level));

    // ── SVG SETUP ──
    const svg = d3.select(container).append('svg')
      .attr('width', '100%').attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('overflow', 'hidden').style('display', 'block')
      .style('background', 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 50%, #020208 100%)');

    const defs = svg.append('defs');

    // ── GLOW FILTERS ──
    [3, 7, 14, 20].forEach((sd, i) => {
      const f = defs.append('filter').attr('id', `glow${i}`)
        .attr('x','-80%').attr('y','-80%').attr('width','260%').attr('height','260%');
      f.append('feGaussianBlur').attr('stdDeviation', sd).attr('result', 'blur');
      const m = f.append('feMerge');
      m.append('feMergeNode').attr('in', 'blur');
      m.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Sun glow filter
    const sunFilter = defs.append('filter').attr('id', 'sunGlow')
      .attr('x','-100%').attr('y','-100%').attr('width','300%').attr('height','300%');
    sunFilter.append('feGaussianBlur').attr('stdDeviation', 25).attr('result', 'blur');
    const sunMerge = sunFilter.append('feMerge');
    sunMerge.append('feMergeNode').attr('in', 'blur');
    sunMerge.append('feMergeNode').attr('in', 'blur');
    sunMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Radial gradients per type
    Object.entries(CLR).forEach(([t, color]) => {
      const gr = defs.append('radialGradient').attr('id', `orb-${t}`).attr('cx','40%').attr('cy','35%').attr('r','65%');
      const c = parseInt(color.slice(1), 16);
      const r = (c>>16)&0xff, g = (c>>8)&0xff, b = c&0xff;
      gr.append('stop').attr('offset','0%').attr('stop-color', `rgb(${Math.min(255,r+100)},${Math.min(255,g+100)},${Math.min(255,b+100)})`);
      gr.append('stop').attr('offset','60%').attr('stop-color', color);
      gr.append('stop').attr('offset','100%').attr('stop-color', `rgb(${Math.max(0,r-40)},${Math.max(0,g-40)},${Math.max(0,b-40)})`);
    });

    // Sun gradient
    const sunGr = defs.append('radialGradient').attr('id', 'sun-grad').attr('cx','40%').attr('cy','35%').attr('r','70%');
    sunGr.append('stop').attr('offset','0%').attr('stop-color','#fff7d4');
    sunGr.append('stop').attr('offset','30%').attr('stop-color','#fbbf24');
    sunGr.append('stop').attr('offset','70%').attr('stop-color','#f59e0b');
    sunGr.append('stop').attr('offset','100%').attr('stop-color','#d97706');

    // Arrow markers
    ['pos','neg','neu'].forEach(k => {
      const col = k==='pos'?'#22c55e':k==='neg'?'#ef4444':'#3f3f5a';
      defs.append('marker').attr('id',`arrow-${k}`)
        .attr('viewBox','0 -4 8 8').attr('refX',14).attr('refY',0)
        .attr('markerWidth',4).attr('markerHeight',4).attr('orient','auto')
        .append('path').attr('d','M0,-3L8,0L0,3').attr('fill',col).attr('opacity',0.6);
    });

    // ── ZOOM ──
    const g = svg.append('g').attr('class', 'cn-orbital-g');
    const zoom = d3.zoom()
      .scaleExtent([0.12, 8])
      .filter(function(event) {
        if (event.ctrlKey) return false;
        // Exclude controls from zoom (reset button is now HTML overlay outside SVG)
        if (event.target.closest && event.target.closest('.cn-graph-controls, .cn-reset-overlay-btn')) return false;
        if (event.type === 'touchstart' || event.type === 'touchmove') return event.touches.length >= 2;
        return !event.button;
      })
      .on('zoom', (event) => { g.attr('transform', event.transform); });
    svg.call(zoom);
    svg.node().addEventListener('touchmove', function(e) { if (e.touches.length >= 2) e.preventDefault(); }, { passive: false });

    function fitAll(animate) {
      try {
        const b = g.node().getBBox();
        if (!b || b.width <= 0 || b.height <= 0) return;
        const pad = 20;
        // Scale up more to fill space — min 0.9, max 2.2 (was 1.6)
        const sc = Math.max(0.9, Math.min(2.2, Math.min((W-pad*2)/b.width, (H-pad*2)/b.height)));
        const tx = (W - b.width*sc)/2 - b.x*sc;
        const ty = (H - b.height*sc)/2 - b.y*sc;
        const t = d3.zoomIdentity.translate(tx, ty).scale(sc);
        if (animate) svg.transition().duration(600).call(zoom.transform, t);
        else svg.call(zoom.transform, t);
      } catch(e) {}
    }

    // ── STAR FIELD ──
    const starG = g.append('g').attr('class', 'stars');
    const cx = W/2, cy = H/2;
    for (let i = 0; i < 50; i++) {
      const sx = cx + (Math.random() - 0.5) * W * 2.5;
      const sy = cy + (Math.random() - 0.5) * H * 2.5;
      const sr = Math.random() * 1.5 + 0.3;
      const star = starG.append('circle')
        .attr('cx', sx).attr('cy', sy).attr('r', sr)
        .attr('fill', '#fff').attr('opacity', Math.random() * 0.4 + 0.1);
      // Twinkle animation on some stars
      if (Math.random() > 0.6) {
        (function twinkle(el) {
          el.transition().duration(1500 + Math.random() * 3000).ease(d3.easeSinInOut)
            .attr('opacity', Math.random() * 0.3 + 0.05)
            .transition().duration(1500 + Math.random() * 3000).ease(d3.easeSinInOut)
            .attr('opacity', Math.random() * 0.5 + 0.2)
            .on('end', function() { twinkle(d3.select(this)); });
        })(star);
      }
    }

    // ── ORBITAL RINGS ──
    const ringsG = g.append('g').attr('class', 'orbit-rings');
    for (let l = 1; l <= Math.min(maxLevel, 5); l++) {
      ringsG.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', radii[l] || radii[radii.length-1])
        .attr('fill', 'none')
        .attr('stroke', 'rgba(100,120,180,0.08)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,8');
    }

    // ── NODE SIZE ──
    function nodeR(d) {
      if (d.level === 0) return isMob ? 28 : 36;
      const base = isMob ? [0, 16, 12, 9, 7, 6] : [0, 22, 17, 13, 10, 8];
      const sizeBase = base[Math.min(d.level, 5)] || 8;
      const impactBoost = Math.min(8, Math.abs(d.impact || 0) * 0.4);
      return sizeBase + impactBoost;
    }

    // ── FORCE SIMULATION ──
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d=>d.id).distance(d => {
        const tl = typeof d.target === 'object' ? d.target.level : 1;
        return radii[Math.min(tl, 5)] * 0.4 + 40;
      }).strength(0.3))
      .force('charge', d3.forceManyBody().strength(d => d.level === 0 ? -1000 : -250 - nodes.length * 1.0))
      .force('collide', d3.forceCollide(d => nodeR(d) + 30))
      .force('center', d3.forceCenter(cx, cy).strength(0.04))
      .force('radial', d3.forceRadial(d => {
        if (d.level === 0) return 0;
        return radii[Math.min(d.level, 5)] || radii[radii.length-1];
      }, cx, cy).strength(0.7))
      .stop();
    for (let i = 0; i < 400; i++) sim.tick();

    // ── GRAVITATIONAL LINKS (curved) ──
    const linkG = g.append('g');
    const linkEls = linkG.selectAll('path').data(links).join('path')
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.impact > 0) return 'rgba(34,197,94,0.2)';
        if (d.impact < 0) return 'rgba(239,68,68,0.2)';
        return 'rgba(100,120,180,0.1)';
      })
      .attr('stroke-width', d => Math.max(0.8, Math.min(2.5, Math.abs(d.correlation||0.3)*2.5)))
      .attr('stroke-linecap','round')
      .attr('marker-end', d => d.impact>0?'url(#arrow-pos)':d.impact<0?'url(#arrow-neg)':'url(#arrow-neu)')
      .attr('d', curvePath)
      .attr('opacity', 0);

    function curvePath(d) {
      const sx=d.source.x, sy=d.source.y, tx=d.target.x, ty=d.target.y;
      const dx=tx-sx, dy=ty-sy, dist=Math.sqrt(dx*dx+dy*dy)||1;
      const cv = Math.min(35, dist*0.15);
      return `M${sx},${sy} Q${(sx+tx)/2 - dy/dist*cv},${(sy+ty)/2 + dx/dist*cv} ${tx},${ty}`;
    }

    // ── PARTICLES ──
    const particleData = [];
    links.forEach((lk, li) => {
      const count = Math.abs(lk.impact||0) > 5 ? 3 : 2;
      for (let p = 0; p < count; p++) particleData.push({ li, t: p/count, spd: 0.003 + Math.random()*0.003 });
    });
    const particleG = g.append('g');
    const particleEls = particleG.selectAll('circle').data(particleData).join('circle')
      .attr('r', isMob ? 1.2 : 1.8)
      .attr('fill', d => {
        const imp = links[d.li].impact;
        return imp > 0 ? '#22c55e' : imp < 0 ? '#ef4444' : '#64748b';
      })
      .attr('opacity', 0);

    // ── NODE GROUPS ──
    const nodeG = g.append('g');
    const nodeEls = nodeG.selectAll('g').data(nodes).join('g')
      .attr('class','cn-orb-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Outer glow ring (impact-based)
    nodeEls.filter(d => d.level === 0 || Math.abs(d.impact||0) >= 6)
      .append('circle').attr('class','cn-glow-ring')
      .attr('r', d => nodeR(d) + (d.level === 0 ? 15 : 8))
      .attr('fill', 'none')
      .attr('stroke', d => CLR[d.type] || CLR.default)
      .attr('stroke-width', d => d.level === 0 ? 2 : 1)
      .attr('opacity', 0);

    // Main circle (planet/sun)
    nodeEls.append('circle').attr('class','cn-orb')
      .attr('r', d => nodeR(d))
      .attr('fill', d => d.level === 0 ? 'url(#sun-grad)' : `url(#orb-${CLR[d.type] ? d.type : 'default'})`)
      .attr('stroke', d => CLR[d.type] || CLR.default)
      .attr('stroke-width', d => d.level === 0 ? 2.5 : 1)
      .attr('filter', d => {
        if (d.level === 0) return 'url(#sunGlow)';
        const a = Math.abs(d.impact||0);
        if (a >= 10) return 'url(#glow2)';
        if (a >= 6) return 'url(#glow1)';
        return 'url(#glow0)';
      })
      .attr('opacity', 0);

    // Correlation glow halo
    nodeEls.filter(d => d.level > 0 && Math.abs(d.correlation||0) > 0.5)
      .append('circle').attr('class','cn-corr-halo')
      .attr('r', d => nodeR(d) + 4)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.impact > 0) return '#22c55e';
        if (d.impact < 0) return '#ef4444';
        return '#60a5fa';
      })
      .attr('stroke-width', d => Math.abs(d.correlation||0) * 2)
      .attr('opacity', d => Math.abs(d.correlation||0) * 0.4);

    // Pin indicator
    nodeEls.append('circle').attr('class','cn-pin-dot')
      .attr('cx', d => nodeR(d) - 3).attr('cy', d => -(nodeR(d) - 3))
      .attr('r', 3).attr('fill', '#22d3ee').attr('stroke', '#050508').attr('stroke-width', 1)
      .attr('opacity', 0);

    // Impact text
    nodeEls.filter(d => d.level <= 3 && d.impact != null)
      .append('text').attr('text-anchor','middle').attr('dy','0.35em')
      .attr('font-family','JetBrains Mono,monospace')
      .attr('font-size', d => d.level === 0 ? '11px' : d.level <= 2 ? '8px' : '7px')
      .attr('font-weight','800')
      .attr('fill', d => d.level === 0 ? '#1a0e00' : '#050508')
      .attr('pointer-events','none').attr('opacity',0)
      .text(d => d.impact != null ? (d.impact > 0 ? '+' : '') + d.impact + '%' : '');

    // Label
    function abbr(l, mx) {
      if (!l || l.length <= mx) return l;
      const m = l.match(/\(([A-Z0-9\-\.=]+)\)$/);
      if (m) { const t = m[1], w = l.replace(/\s*\([^)]+\)$/, '').split(' '); for (let n = w.length; n >= 1; n--) { const s = w.slice(0,n).join(' ')+' ('+t+')'; if (s.length <= mx) return s; } return '('+t+')'; }
      return l.slice(0, mx-1) + '\u2026';
    }
    const LMAX = isMob ? 12 : 18;

    nodeEls.append('rect').attr('class','cn-lbg')
      .attr('rx', 3).attr('fill', 'rgba(4,4,12,0.85)').attr('pointer-events','none').attr('opacity', 0);

    nodeEls.append('text').attr('class','cn-lbl')
      .attr('text-anchor','middle').attr('dy', d => (nodeR(d) + 14) + 'px')
      .attr('font-family','Inter,system-ui,sans-serif')
      .attr('font-size', d => d.level === 0 ? '12px' : d.level <= 2 ? '10px' : '8px')
      .attr('font-weight', d => d.level <= 1 ? '700' : '500')
      .attr('fill', d => d.level === 0 ? '#fbbf24' : '#e0e0f0')
      .attr('pointer-events','none').attr('opacity', 0)
      .text(d => abbr(d.label, LMAX));

    function fitBgs() {
      nodeEls.each(function() {
        const el = d3.select(this);
        const t = el.select('.cn-lbl').node();
        if (!t) return;
        try { const b = t.getBBox(); el.select('.cn-lbg').attr('x',b.x-3).attr('y',b.y-1).attr('width',b.width+6).attr('height',b.height+2); }
        catch(e) {}
      });
    }

    // ── TOOLTIP ──
    const tip = d3.select(container).append('div').attr('class','cn-graph-tooltip').style('display','none');
    function showT(d, ex, ey) {
      const lines = [`<strong>${d.label}</strong>`];
      if (d.impact != null) {
        const s = d.impact > 0 ? '+' : '', col = d.impact > 0 ? '#22c55e' : '#ef4444';
        lines.push(`<span style="color:${col};font-weight:700">Impact: ${s}${d.impact}%</span>`);
      }
      if (d.correlation) lines.push(`Correlation: ${(+d.correlation).toFixed(2)}`);
      if (d.sector) lines.push(`Sector: ${d.sector}`);
      if (d.marketCap) lines.push(`Mkt Cap: $${d.marketCap}`);
      if (d.type && d.type !== 'commodity') lines.push(`Type: <span style="color:${CLR[d.type]||CLR.default}">${d.type}</span>`);
      const hasChildren = (childMap[d.id] || []).length > 0;
      if (hasChildren) lines.push(`<span style="color:#71717a;font-size:11px">\u25C9 Click: ${collapsedNodes.has(d.id)?'expand':'collapse'}</span>`);
      lines.push(`<span style="color:#71717a;font-size:11px">\u25CE Dbl-click: ${pinnedNodes.has(d.id)?'unpin':'pin'}</span>`);
      const r = container.getBoundingClientRect();
      tip.style('display','block').html(lines.join('<br>'))
        .style('left', (ex - r.left + 14) + 'px').style('top', (ey - r.top - 10) + 'px');
    }

    // ── INTERACTIONS ──
    nodeEls
      .on('mouseenter', (e, d) => {
        const el = d3.select(e.currentTarget);
        el.select('.cn-orb').transition().duration(150).attr('r', nodeR(d) * 1.2);
        // Brighten children, dim others
        const desc = getDescendants(d.id);
        desc.add(d.id);
        getAncestors(d.id).forEach(a => desc.add(a));
        nodeEls.each(function(nd) {
          if (!nodeVisible(nd)) return;
          d3.select(this).transition().duration(150)
            .style('opacity', desc.has(nd.id) ? 1 : 0.25);
        });
        linkEls.each(function(ld) {
          const sid = typeof ld.source === 'object' ? ld.source.id : ld.source;
          const tid = typeof ld.target === 'object' ? ld.target.id : ld.target;
          d3.select(this).transition().duration(150)
            .style('opacity', (desc.has(sid) && desc.has(tid)) ? 0.8 : 0.03);
        });
        showT(d, e.clientX, e.clientY);
      })
      .on('mousemove', (e, d) => showT(d, e.clientX, e.clientY))
      .on('mouseleave', (e, d) => {
        d3.select(e.currentTarget).select('.cn-orb').transition().duration(150).attr('r', nodeR(d));
        tip.style('display','none');
        updateVisibility();
      });

    // Click = collapse/expand or trace
    let clickTimer = null;
    nodeEls.on('click', function(event, d) {
      if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; return; }
      clickTimer = setTimeout(() => {
        clickTimer = null;
        const hasChildren = (childMap[d.id] || []).length > 0;
        if (hasChildren) {
          if (collapsedNodes.has(d.id)) collapsedNodes.delete(d.id);
          else collapsedNodes.add(d.id);
        } else {
          if (tracedChain && tracedChain.has(d.id)) tracedChain = null;
          else tracedChain = getFullChain(d.id);
        }
        updateVisibility();
      }, 250);
    });

    // Double-click = pin
    nodeEls.on('dblclick', function(event, d) {
      if (clickTimer) { clearTimeout(clickTimer); clickTimer = null; }
      event.stopPropagation();
      if (pinnedNodes.has(d.id)) { pinnedNodes.delete(d.id); d.fx = null; d.fy = null; }
      else { pinnedNodes.add(d.id); d.fx = d.x; d.fy = d.y; }
      nodeEls.select('.cn-pin-dot').transition().duration(200).attr('opacity', nd => pinnedNodes.has(nd.id) ? 1 : 0);
    });

    // Mobile tap
    nodeEls.on('touchstart', function(event, d) {
      if (event.touches.length === 1) {
        const t = event.touches[0];
        showT(d, t.clientX, t.clientY);
        setTimeout(() => tip.style('display','none'), 2500);
      }
    });

    // Drag
    nodeEls.call(d3.drag()
      .filter(event => !event.button && event.touches?.length !== 2)
      .on('start', (e, d) => { d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => {
        d.fx = e.x; d.fy = e.y; d.x = e.x; d.y = e.y;
        d3.select(e.sourceEvent.target.closest('.cn-orb-node')).attr('transform', `translate(${e.x},${e.y})`);
        linkEls.attr('d', curvePath);
      })
    );

    // ── VISIBILITY ──
    function isCollapsedDescendant(nodeId) {
      let cur = nodeId;
      while (parentMap[cur]) { if (collapsedNodes.has(parentMap[cur])) return true; cur = parentMap[cur]; }
      return false;
    }

    function nodeVisible(d) {
      if (d.level === 0) return true;
      if (isCollapsedDescendant(d.id)) return false;
      if (d.level > maxVisibleLevel) return false;
      if (typeFilter !== 'all' && d.type !== typeFilter && d.type !== 'commodity') return false;
      // Mobile: hide L4+ by default unless expanded
      if (isMob && d.level >= 4 && !mobileExpanded) return false;
      return true;
    }
    function linkVisible(d) {
      const source = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
      const target = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
      return source && target && nodeVisible(source) && nodeVisible(target);
    }

    let mobileExpanded = false;

    function updateVisibility() {
      const dur = 300;
      nodeEls.each(function(d) {
        const el = d3.select(this), vis = nodeVisible(d);
        el.transition().duration(dur).style('opacity', vis ? 1 : 0).style('pointer-events', vis ? 'all' : 'none');
      });
      linkEls.each(function(d) {
        d3.select(this).transition().duration(dur).style('opacity', linkVisible(d) ? 1 : 0);
      });
      particleEls.each(function(d) {
        d3.select(this).transition().duration(dur).style('opacity', linkVisible(links[d.li]) ? 0.5 : 0);
      });
      // Update orbit ring visibility
      ringsG.selectAll('circle').each(function(_, i) {
        const l = i + 1;
        const hasVisibleNodes = nodes.some(n => n.level === l && nodeVisible(n));
        d3.select(this).transition().duration(dur).attr('opacity', hasVisibleNodes ? 1 : 0);
      });

      // Search highlight
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        nodeEls.each(function(d) {
          const match = d.label.toLowerCase().includes(term) || (d.sector && d.sector.toLowerCase().includes(term)) || (d.id && d.id.toLowerCase().includes(term));
          d3.select(this).select('.cn-orb').transition().duration(dur)
            .attr('stroke-width', match ? 3 : (d.level===0?2.5:1))
            .attr('stroke', match ? '#fff' : (CLR[d.type]||CLR.default));
        });
      } else {
        nodeEls.select('.cn-orb').transition().duration(dur)
          .attr('stroke-width', d => d.level===0?2.5:1)
          .attr('stroke', d => CLR[d.type]||CLR.default);
      }

      // Traced chain
      if (tracedChain) {
        nodeEls.each(function(d) {
          const inChain = tracedChain.has(d.id);
          d3.select(this).transition().duration(dur)
            .style('opacity', !nodeVisible(d) ? 0 : inChain ? 1 : 0.1);
        });
        linkEls.each(function(d) {
          const sid = typeof d.source === 'object' ? d.source.id : d.source;
          const tid = typeof d.target === 'object' ? d.target.id : d.target;
          const inChain = tracedChain.has(sid) && tracedChain.has(tid);
          d3.select(this).transition().duration(dur)
            .style('opacity', !linkVisible(d) ? 0 : inChain ? 0.9 : 0.03)
            .attr('stroke-width', inChain ? 3 : Math.max(0.8, Math.abs(d.correlation||0.3)*2.5));
        });
      }
      fitBgs();
    }

    // ── CONTROLS ──
    // Insert controls BEFORE the graph container (outside the canvas)
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'cn-graph-controls';
    container.parentNode.insertBefore(controlsDiv, container);
    const controls = d3.select(controlsDiv);
    const presentTypes = new Set(nodes.map(n => n.type).filter(t => t !== 'commodity'));
    const typeLabels = {
      etf:'ETFs', producer:'Producers', processor:'Processors', positive:'Positive', negative:'Negative',
      consumer:'Consumers', supplier:'Suppliers', macro:'Macro', policy:'Policy',
      substitute:'Substitutes', regional:'Regional', fx:'FX', freight:'Freight', index:'Index'
    };
    const typeButtons = Array.from(presentTypes).map(t =>
      `<button type="button" data-type="${t}">${typeLabels[t] || t}</button>`
    ).join('');

    let mobileBtn = '';
    if (isMob && nodes.some(n => n.level >= 4)) {
      mobileBtn = '<button type="button" class="cn-expand-universe" id="cn-expand-btn">Show Full Universe</button>';
    }

    controls.html(`
      <div class="cn-graph-control-group">
        <span class="cn-graph-control-label">Orbit</span>
        <button type="button" class="is-active" data-depth="99">All</button>
        <button type="button" data-depth="1">L1</button>
        <button type="button" data-depth="2">L2</button>
        <button type="button" data-depth="3">L3</button>
        ${maxLevel >= 4 ? '<button type="button" data-depth="4">L4</button>' : ''}
        ${maxLevel >= 5 ? '<button type="button" data-depth="5">L5</button>' : ''}
      </div>
      <div class="cn-graph-control-group">
        <span class="cn-graph-control-label">Type</span>
        <button type="button" class="is-active" data-type="all">All</button>
        ${typeButtons}
      </div>
      <div class="cn-graph-control-group cn-search-group">
        <input type="text" class="cn-graph-search" placeholder="Search nodes..." aria-label="Search nodes">
      </div>
      ${mobileBtn}
    `);

    controls.selectAll('[data-depth]').on('click', function() {
      const btn = d3.select(this), depth = +btn.attr('data-depth');
      maxVisibleLevel = depth >= 99 ? Infinity : depth;
      controls.selectAll('[data-depth]').classed('is-active', false);
      btn.classed('is-active', true);
      tracedChain = null;
      updateVisibility();
    });
    controls.selectAll('[data-type]').on('click', function() {
      const btn = d3.select(this);
      typeFilter = btn.attr('data-type');
      controls.selectAll('[data-type]').classed('is-active', false);
      btn.classed('is-active', true);
      tracedChain = null;
      updateVisibility();
    });
    controls.select('.cn-graph-search').on('input', function() {
      searchTerm = this.value.trim();
      updateVisibility();
    });

    // Mobile expand button
    const expandBtn = controls.select('#cn-expand-btn');
    if (expandBtn.node()) {
      expandBtn.on('click', function() {
        mobileExpanded = !mobileExpanded;
        d3.select(this).text(mobileExpanded ? 'Hide Outer Orbits' : 'Show Full Universe');
        updateVisibility();
        setTimeout(() => fitAll(true), 350);
      });
    }

    // Reset button (appended after zoom so it sits on top)
    function handleReset() {
      tracedChain = null; collapsedNodes.clear(); typeFilter = 'all'; maxVisibleLevel = Infinity; searchTerm = '';
      controls.selectAll('[data-depth]').classed('is-active', false);
      controls.select('[data-depth="99"]').classed('is-active', true);
      controls.selectAll('[data-type]').classed('is-active', false);
      controls.select('[data-type="all"]').classed('is-active', true);
      controls.select('.cn-graph-search').property('value', '');
      updateVisibility();
      fitAll(true);
    }
    const resetOverlay = document.createElement('button');
    resetOverlay.className = 'cn-reset-overlay-btn';
    resetOverlay.innerHTML = '⊙ Reset';
    resetOverlay.style.cssText = 'position:absolute;top:8px;right:8px;background:rgba(10,10,26,0.9);border:1px solid rgba(34,211,238,0.4);border-radius:8px;color:#22d3ee;font-size:12px;padding:6px 12px;cursor:pointer;z-index:10;transition:all 0.2s;';
    resetOverlay.addEventListener('mouseenter', () => { resetOverlay.style.borderColor = 'rgba(34,211,238,0.8)'; resetOverlay.style.opacity = '1'; });
    resetOverlay.addEventListener('mouseleave', () => { resetOverlay.style.borderColor = 'rgba(34,211,238,0.4)'; });
    resetOverlay.addEventListener('click', handleReset);
    container.style.position = 'relative';
    container.appendChild(resetOverlay);

    // ── STAGGERED REVEAL ──
    for (let l = 0; l <= maxLevel; l++) {
      const dl = l * 140;
      nodeG.selectAll('.cn-orb-node').filter(d => d.level === l).selectAll('circle,text,rect')
        .transition().delay(dl).duration(400).attr('opacity', function() {
          const cls = d3.select(this).attr('class');
          if (cls === 'cn-pin-dot') return 0;
          if (cls === 'cn-glow-ring') return 0.3;
          if (cls === 'cn-corr-halo') return d3.select(this.parentNode).datum().correlation ? Math.abs(d3.select(this.parentNode).datum().correlation) * 0.4 : 0;
          return 1;
        });
    }
    linkEls.transition().delay(maxLevel * 140 + 100).duration(500).attr('opacity', 1);
    particleEls.transition().delay(maxLevel * 140 + 400).duration(500).attr('opacity', 0.5);
    setTimeout(fitBgs, maxLevel * 140 + 500);
    // Signal graph rendering complete
    setTimeout(function() { window.dispatchEvent(new Event('graph-ready')); }, maxLevel * 140 + 600);

    // ── SUN PULSE ──
    function sunPulse() {
      nodeEls.filter(d => d.level === 0).select('.cn-glow-ring')
        .transition().duration(2000).ease(d3.easeSinInOut)
        .attr('r', d => nodeR(d) + 22).attr('opacity', 0)
        .transition().duration(0)
        .attr('r', d => nodeR(d) + 8).attr('opacity', 0.35)
        .on('end', sunPulse);
    }
    setTimeout(sunPulse, maxLevel * 140 + 600);

    // High-impact node pulse
    function impactPulse() {
      nodeEls.filter(d => d.level > 0 && Math.abs(d.impact||0) >= 6).select('.cn-glow-ring')
        .transition().duration(2500).ease(d3.easeSinInOut)
        .attr('r', d => nodeR(d) + 14).attr('opacity', 0)
        .transition().duration(0)
        .attr('r', d => nodeR(d) + 5).attr('opacity', 0.25)
        .on('end', impactPulse);
    }
    setTimeout(impactPulse, maxLevel * 140 + 900);

    // ── PARTICLE ANIMATION ──
    var _particleRafId = null;
    function particleTick() {
      particleEls.each(function(d) {
        d.t = (d.t + d.spd) % 1;
        const lk = links[d.li];
        const sx = lk.source.x, sy = lk.source.y, tx = lk.target.x, ty = lk.target.y;
        const dx = tx-sx, dy = ty-sy, dist = Math.sqrt(dx*dx+dy*dy) || 1;
        const cv = Math.min(35, dist*0.15);
        const qx = (sx+tx)/2 - dy/dist*cv, qy = (sy+ty)/2 + dx/dist*cv;
        const t = d.t;
        d3.select(this)
          .attr('cx', (1-t)*(1-t)*sx + 2*(1-t)*t*qx + t*t*tx)
          .attr('cy', (1-t)*(1-t)*sy + 2*(1-t)*t*qy + t*t*ty);
      });
      _particleRafId = requestAnimationFrame(particleTick);
    }
    setTimeout(function() { _particleRafId = requestAnimationFrame(particleTick); }, maxLevel * 140 + 400);
    window.addEventListener('beforeunload', function() { if (_particleRafId) cancelAnimationFrame(_particleRafId); });

    // ── LEGEND ──
    const legendItems = [
      {c:'#fbbf24',l:'Commodity'},{c:'#818cf8',l:'ETF'},{c:'#22c55e',l:'Positive'},
      {c:'#ef4444',l:'Negative'},{c:'#f59e0b',l:'Producer'},{c:'#06b6d4',l:'Processor'},
      {c:'#fb923c',l:'Consumer'},{c:'#34d399',l:'Supplier'},{c:'#a78bfa',l:'Macro'},
      {c:'#f472b6',l:'Policy'},{c:'#facc15',l:'Substitute'},{c:'#38bdf8',l:'Regional'},
      {c:'#60a5fa',l:'FX'},{c:'#fb7185',l:'Freight'},{c:'#c084fc',l:'Index'}
    ];
    const activeLegend = legendItems.filter(lt => nodes.some(n => n.type === lt.l.toLowerCase()));
    const leg = activeLegend.length > 0 ? activeLegend : legendItems.slice(0, 6);

    const legG = svg.append('g').attr('transform', `translate(12,${H - 14 - leg.length * 18})`);
    leg.forEach((item, i) => {
      const row = legG.append('g').attr('transform', `translate(0,${i*18})`);
      row.append('circle').attr('cx', 5).attr('cy', 0).attr('r', 4).attr('fill', item.c).attr('opacity', 0.85);
      row.append('text').attr('x', 14).attr('dy', '0.35em').attr('font-size', '10px')
        .attr('font-family','Inter,system-ui,sans-serif').attr('fill','#52525b').text(item.l);
    });

    // Node count badge
    svg.append('text').attr('x', 12).attr('y', 18)
      .attr('font-size', '10px').attr('font-family', 'JetBrains Mono,monospace')
      .attr('fill', '#3f3f5a').text(`${nodes.length} nodes \u00b7 ${links.length} links`);

    // Hint
    svg.append('text').attr('x', W - 48).attr('y', H - 10).attr('text-anchor', 'end')
      .attr('font-size', '10px').attr('font-family', 'Inter,system-ui,sans-serif').attr('fill', '#2a2a3f')
      .text(isMob ? 'Pinch zoom \u00b7 Tap \u2299 reset' : 'Click collapse \u00b7 Dbl-click pin \u00b7 Scroll zoom \u00b7 \u2299 reset');

    // Auto-fit
    setTimeout(() => { fitAll(false); updateVisibility(); }, maxLevel * 140 + 800);
  }

  window.CommodityNodeGraph = { init: function(el) { initGraph(el); } };
})();
