/* ================================================================
   CommodityNode — Impact Graph v6 (Premium 2D)
   Full-bleed · Particle links · Pulse · Glow-by-impact
   D3 v7 force simulation — no external deps beyond D3
   ================================================================ */
(function () {
  'use strict';

  document.querySelectorAll('#impact-graph').forEach(initGraph);

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

    // Color palette
    const TYPE_COLOR = {
      commodity: '#fbbf24', etf: '#818cf8',
      positive: '#22c55e', negative: '#ef4444',
      producer: '#f59e0b', processor: '#06b6d4', default: '#94a3b8',
    };

    // Build graph
    const nodes = [];
    const links = [];
    const center = {
      id: commodity?.id || 'center', label: commodity?.label || 'Commodity',
      type: 'commodity', level: 0, impact: null
    };
    nodes.push(center);
    levels.forEach((lvl, li) => {
      (lvl.nodes || []).forEach(n => {
        nodes.push({ ...n, level: li + 1 });
        links.push({ source: n.parentId || center.id, target: n.id,
                     correlation: n.correlation || 0.5, impact: n.impact || 0 });
      });
    });

    // Dimensions — full bleed
    const isMob = window.innerWidth < 768;
    const W = container.offsetWidth || window.innerWidth;
    const H = isMob ? 440 : 580;
    container.style.height = H + 'px';
    container.innerHTML = '';

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%').attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('overflow', 'hidden').style('display', 'block');

    const defs = svg.append('defs');

    // Glow filters — one per intensity level
    [4, 8, 14].forEach((std, i) => {
      const f = defs.append('filter').attr('id', `glow-${i}`)
        .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      f.append('feGaussianBlur').attr('stdDeviation', std).attr('result', 'blur');
      const m = f.append('feMerge');
      m.append('feMergeNode').attr('in', 'blur');
      m.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Radial gradients per node type
    const lighten = (hex, a) => {
      const c = parseInt(hex.slice(1), 16);
      const r = Math.min(255, (c >> 16) + Math.round(255 * a));
      const g = Math.min(255, ((c >> 8) & 0xff) + Math.round(255 * a));
      const b = Math.min(255, (c & 0xff) + Math.round(255 * a));
      return `rgb(${r},${g},${b})`;
    };
    Object.entries(TYPE_COLOR).forEach(([t, color]) => {
      const grad = defs.append('radialGradient').attr('id', `rg-${t}`)
        .attr('cx', '35%').attr('cy', '30%').attr('r', '70%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', lighten(color, 0.55));
      grad.append('stop').attr('offset', '100%').attr('stop-color', color);
    });

    // Arrow markers
    ['pos', 'neg', 'neu'].forEach(k => {
      const color = k === 'pos' ? '#22c55e' : k === 'neg' ? '#ef4444' : '#52525b';
      defs.append('marker').attr('id', `arr-${k}`)
        .attr('viewBox', '0 -4 8 8').attr('refX', 16).attr('refY', 0)
        .attr('markerWidth', 4).attr('markerHeight', 4).attr('orient', 'auto')
        .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', color).attr('opacity', 0.7);
    });

    // Zoom + pan group
    const g = svg.append('g').attr('class', 'cn-g');
    const zoom = d3.zoom().scaleExtent([0.25, 5])
      .on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoom).on('dblclick.zoom', null);

    // Node radius
    const R = d => d.level === 0 ? 30 : d.level === 1 ? 21 : d.level === 2 ? 16 : d.level === 3 ? 12 : 10;

    // Glow filter by impact magnitude
    const glowFilter = d => {
      if (d.level === 0) return 'url(#glow-2)';
      const abs = Math.abs(d.impact || 0);
      if (abs >= 10) return 'url(#glow-1)';
      if (abs >= 5)  return 'url(#glow-0)';
      return null;
    };

    // Force simulation
    const maxLevel = Math.max(...nodes.map(n => n.level));
    const ringR = isMob ? 75 : 105;

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id)
        .distance(d => {
          const srcLvl = (typeof d.source === 'object' ? d.source.level : 0);
          const tgtLvl = (typeof d.target === 'object' ? d.target.level : 0);
          return ringR * (0.85 + Math.max(srcLvl, tgtLvl) * 0.18);
        }).strength(0.65))
      .force('charge', d3.forceManyBody().strength(d => d.level === 0 ? -700 : -280))
      .force('collide', d3.forceCollide(d => R(d) + 30))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.06))
      .force('radial', d3.forceRadial(d => d.level * ringR, W / 2, H / 2).strength(0.55))
      .stop();

    // Pre-run headlessly
    for (let i = 0; i < 300; i++) sim.tick();

    // ── Links (curved paths) ──
    const linkG = g.append('g');
    const linkEls = linkG.selectAll('path').data(links).join('path')
      .attr('fill', 'none')
      .attr('stroke', d => d.impact > 0 ? 'rgba(34,197,94,0.4)' : d.impact < 0 ? 'rgba(239,68,68,0.4)' : 'rgba(120,120,150,0.2)')
      .attr('stroke-width', d => Math.max(1, Math.min(3.5, Math.abs(d.correlation || 0.3) * 3.5)))
      .attr('stroke-linecap', 'round')
      .attr('marker-end', d => d.impact > 0 ? 'url(#arr-pos)' : d.impact < 0 ? 'url(#arr-neg)' : 'url(#arr-neu)')
      .attr('d', lPath).attr('opacity', 0);

    function lPath(d) {
      const sx = d.source.x, sy = d.source.y, tx = d.target.x, ty = d.target.y;
      const dx = tx - sx, dy = ty - sy, dist = Math.sqrt(dx*dx+dy*dy) || 1;
      const curve = Math.min(30, dist * 0.2);
      const cx = (sx+tx)/2 - dy/dist*curve;
      const cy = (sy+ty)/2 + dx/dist*curve;
      return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
    }

    // ── Particle system on links ──
    const PARTICLE_COUNT = 2;
    const particleData = [];
    links.forEach((link, li) => {
      for (let p = 0; p < PARTICLE_COUNT; p++) {
        particleData.push({ linkIdx: li, t: p / PARTICLE_COUNT, speed: 0.004 + Math.random() * 0.003 });
      }
    });

    const particleG = g.append('g').attr('class', 'cn-particles');
    const particleEls = particleG.selectAll('circle').data(particleData).join('circle')
      .attr('r', 2.5)
      .attr('fill', d => links[d.linkIdx].impact > 0 ? '#22c55e' : links[d.linkIdx].impact < 0 ? '#ef4444' : '#52525b')
      .attr('opacity', 0.7);

    // ── Node groups ──
    const nodeG = g.append('g');
    const nodeEls = nodeG.selectAll('g').data(nodes).join('g')
      .attr('class', 'cn-nd')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'grab');

    // Outer pulse ring (center + high-impact nodes)
    nodeEls.filter(d => d.level === 0 || Math.abs(d.impact || 0) >= 10)
      .append('circle').attr('class', 'cn-pulse-ring')
      .attr('r', d => R(d) + 9)
      .attr('fill', 'none')
      .attr('stroke', d => TYPE_COLOR[d.type] || TYPE_COLOR.default)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0);

    // Main circle
    nodeEls.append('circle').attr('class', 'cn-circle')
      .attr('r', R)
      .attr('fill', d => `url(#rg-${d.type || 'default'})`)
      .attr('stroke', d => TYPE_COLOR[d.type] || TYPE_COLOR.default)
      .attr('stroke-width', d => d.level === 0 ? 2.5 : 1.5)
      .attr('filter', glowFilter)
      .attr('opacity', 0);

    // Impact % label inside node
    nodeEls.filter(d => d.level <= 2 && d.impact != null)
      .append('text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => d.level === 0 ? '10px' : '8px')
      .attr('font-weight', '800').attr('fill', '#050508')
      .attr('pointer-events', 'none').attr('opacity', 0)
      .text(d => d.impact != null ? (d.impact > 0 ? '+' : '') + d.impact + '%' : '');

    // Label below
    function abbr(label, max) {
      if (!label || label.length <= max) return label;
      const m = label.match(/\(([A-Z0-9\-\.=]+)\)$/);
      if (m) {
        const t = m[1], words = label.replace(/\s*\([^)]+\)$/, '').split(' ');
        for (let n = words.length; n >= 1; n--) {
          const s = words.slice(0, n).join(' ') + ' (' + t + ')';
          if (s.length <= max) return s;
        }
        return '(' + t + ')';
      }
      return label.slice(0, max-1) + '\u2026';
    }

    nodeEls.append('text').attr('class', 'cn-lbl')
      .attr('text-anchor', 'middle')
      .attr('dy', d => (R(d) + 15) + 'px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', d => d.level === 0 ? '12px' : d.level <= 2 ? '10px' : '9px')
      .attr('font-weight', d => d.level <= 1 ? '700' : '500')
      .attr('fill', '#e4e4e7')
      .attr('stroke', '#0a0a12').attr('stroke-width', '3.5')
      .attr('paint-order', 'stroke')
      .attr('pointer-events', 'none').attr('opacity', 0)
      .text(d => abbr(d.label, isMob ? 12 : 17));

    // ── Tooltip ──
    const tip = d3.select(container).append('div').attr('class', 'cn-graph-tooltip')
      .style('display', 'none');

    const showTip = (event, d, touch) => {
      const lines = [`<strong>${d.label}</strong>`];
      if (d.impact != null) {
        const s = d.impact > 0 ? '+' : '', c = d.impact > 0 ? '#22c55e' : '#ef4444';
        lines.push(`<span style="color:${c};font-weight:700">Impact: ${s}${d.impact}%</span>`);
      }
      if (d.correlation) lines.push(`Correlation: ${(+d.correlation).toFixed(2)}`);
      if (d.sector)      lines.push(`Sector: ${d.sector}`);
      if (d.marketCap)   lines.push(`Mkt Cap: $${d.marketCap}`);
      const rect = container.getBoundingClientRect();
      const ex = (touch || event).clientX - rect.left;
      const ey = (touch || event).clientY - rect.top;
      tip.style('display', 'block').html(lines.join('<br>'))
        .style('left', (ex + 14) + 'px').style('top', (ey - 10) + 'px');
    };

    nodeEls
      .on('mouseenter', (e, d) => {
        d3.select(e.currentTarget).select('.cn-circle').transition().duration(120).attr('r', R(d) * 1.22);
        showTip(e, d);
      })
      .on('mousemove', (e, d) => showTip(e, d))
      .on('mouseleave', (e, d) => {
        d3.select(e.currentTarget).select('.cn-circle').transition().duration(120).attr('r', R(d));
        tip.style('display', 'none');
      })
      .on('touchstart', function(e, d) {
        e.preventDefault();
        showTip(e, d, e.touches[0]);
        setTimeout(() => tip.style('display', 'none'), 2500);
      }, { passive: false });

    // Drag
    nodeEls.call(d3.drag()
      .on('start', (e, d) => { d.fx = d.x; d.fy = d.y; })
      .on('drag',  (e, d) => {
        d.fx = e.x; d.fy = e.y;
        d3.select(e.sourceEvent.target.closest('.cn-nd')).attr('transform', `translate(${e.x},${e.y})`);
        linkEls.attr('d', lPath);
      })
    );

    // ── Staggered reveal animation ──
    for (let l = 0; l <= maxLevel; l++) {
      const delay = l * 130;
      nodeG.selectAll('.cn-nd').filter(d => d.level === l)
        .selectAll('.cn-circle, .cn-lbl, text')
        .transition().delay(delay).duration(380).attr('opacity', 1);
    }
    linkEls.transition().delay(maxLevel * 130 + 100).duration(500).attr('opacity', 1);
    particleEls.transition().delay(maxLevel * 130 + 400).duration(600).attr('opacity', 0.7);

    // ── Pulse ring animation ──
    function pulseTick() {
      nodeEls.selectAll('.cn-pulse-ring')
        .transition().duration(1800).ease(d3.easeSinInOut)
        .attr('r', d => R(d) + 16).attr('opacity', 0)
        .transition().duration(0)
        .attr('r', d => R(d) + 6).attr('opacity', 0.25)
        .on('end', pulseTick);
    }
    setTimeout(pulseTick, maxLevel * 130 + 600);

    // ── Particle animation loop ──
    function particleTick() {
      particleEls.each(function(d) {
        d.t = (d.t + d.speed) % 1;
        const link = links[d.linkIdx];
        const sx = link.source.x, sy = link.source.y;
        const tx = link.target.x, ty = link.target.y;
        const dx = tx - sx, dy = ty - sy, dist = Math.sqrt(dx*dx+dy*dy) || 1;
        const curve = Math.min(30, dist * 0.2);
        const qx = (sx+tx)/2 - dy/dist*curve;
        const qy = (sy+ty)/2 + dx/dist*curve;
        const t = d.t;
        const bx = (1-t)*(1-t)*sx + 2*(1-t)*t*qx + t*t*tx;
        const by = (1-t)*(1-t)*sy + 2*(1-t)*t*qy + t*t*ty;
        d3.select(this).attr('cx', bx).attr('cy', by);
      });
      requestAnimationFrame(particleTick);
    }
    setTimeout(particleTick, maxLevel * 130 + 400);

    // ── Legend ──
    const legendData = [
      { color: '#fbbf24', label: 'Commodity' }, { color: '#818cf8', label: 'ETF' },
      { color: '#22c55e', label: 'Positive' },  { color: '#ef4444', label: 'Negative' },
    ];
    const leg = svg.append('g').attr('transform', `translate(14, ${H - 14 - legendData.length * 22})`);
    legendData.forEach((item, i) => {
      const row = leg.append('g').attr('transform', `translate(0,${i*22})`);
      row.append('circle').attr('r', 5.5).attr('cx', 5.5).attr('fill', item.color).attr('opacity', 0.9);
      row.append('text').attr('x', 15).attr('dy', '0.35em')
        .attr('font-size', '11px').attr('font-family', 'Inter, sans-serif')
        .attr('fill', '#71717a').text(item.label);
    });

    // Hint
    svg.append('text').attr('x', W - 12).attr('y', H - 10)
      .attr('text-anchor', 'end').attr('font-size', '10px')
      .attr('font-family', 'Inter').attr('fill', '#3f3f5a')
      .text('Scroll to zoom · Drag nodes');

    // ── Auto-fit after reveal ──
    setTimeout(() => {
      try {
        const b = g.node().getBBox();
        if (!b.width) return;
        const pad = 40;
        const scale = Math.min(0.92, Math.min((W - pad*2) / b.width, (H - pad*2) / b.height));
        const tx = (W - b.width * scale) / 2 - b.x * scale;
        const ty = (H - b.height * scale) / 2 - b.y * scale;
        svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
      } catch(e) {}
    }, maxLevel * 130 + 700);
  }
})();
