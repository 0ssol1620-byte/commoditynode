/* ================================================================
   CommodityNode — Supply Chain Impact Graph v5
   D3 v7 — Force simulation (300 pre-ticks), curved paths,
           radial gradients, smart label positioning
   ================================================================ */
(function () {
  'use strict';

  document.querySelectorAll('#impact-graph').forEach(function (container) {
    initGraph(container);
  });

  function nodeRadius(d) {
    if (d.level === 0) return 32;
    if (d.level === 1) return 20;
    if (d.level === 2) return 15;
    if (d.level === 3) return 12;
    return 10;
  }

  function initGraph(container) {
    const rawData = window.COMMODITY_DATA;
    if (!rawData) return;

    let levels;
    if (rawData.levels) {
      levels = rawData.levels;
    } else if (rawData.nodes && rawData.links) {
      const commodity = rawData.nodes.find(n => n.type === 'commodity') || rawData.nodes[0];
      const rest = rawData.nodes.filter(n => n !== commodity);
      levels = [{ nodes: rest }];
    } else { return; }

    const commodity = rawData.commodity || rawData.nodes?.find(n => n.type === 'commodity');

    const TYPE_COLOR = {
      commodity: '#fbbf24', etf: '#818cf8', positive: '#22c55e',
      negative: '#ef4444', producer: '#f59e0b', processor: '#06b6d4', default: '#94a3b8',
    };

    const nodes = [], links = [];
    const centerNode = {
      id: commodity?.id || 'center',
      label: commodity?.label || 'Commodity',
      type: 'commodity', level: 0, impact: null,
    };
    nodes.push(centerNode);

    levels.forEach((lvl, li) => {
      (lvl.nodes || []).forEach(n => {
        nodes.push({ ...n, level: li + 1 });
        links.push({ source: n.parentId || centerNode.id, target: n.id, correlation: n.correlation || 0.5, impact: n.impact || 0 });
      });
    });

    const isMobile = window.innerWidth < 768;
    const W = Math.max(container.clientWidth || 700, isMobile ? 320 : 600);
    const H = isMobile ? 420 : 520;
    const cx = W / 2, cy = H / 2;
    const maxLevel = Math.max(...nodes.map(n => n.level));
    const ringSpacing = isMobile
      ? Math.min(62, (W / 2 - 40) / Math.max(maxLevel, 1))
      : Math.min(105, (Math.min(W, H) / 2 - 55) / Math.max(maxLevel, 1));
    const RADII = [0];
    for (let i = 1; i <= maxLevel; i++) RADII.push(Math.round(ringSpacing * i));

    container.style.minHeight = H + 'px';
    container.innerHTML = '';

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%').attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('overflow', 'hidden').style('touch-action', 'none');

    const g = svg.append('g').attr('class', 'zoom-group');
    const zoom = d3.zoom().scaleExtent([0.3, 3])
      .on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoom);

    const defs = svg.append('defs');

    /* Glow filter */
    const filt = defs.append('filter').attr('id', 'ig-glow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filt.append('feGaussianBlur').attr('stdDeviation', 4).attr('result', 'blur');
    const fm = filt.append('feMerge');
    fm.append('feMergeNode').attr('in', 'blur');
    fm.append('feMergeNode').attr('in', 'SourceGraphic');

    /* Radial gradients */
    Object.entries(TYPE_COLOR).forEach(([type, color]) => {
      const grad = defs.append('radialGradient')
        .attr('id', `ig-grad-${type}`).attr('cx', '38%').attr('cy', '35%').attr('r', '65%');
      const r16 = parseInt(color.slice(1,3), 16);
      const g16 = parseInt(color.slice(3,5), 16);
      const b16 = parseInt(color.slice(5,7), 16);
      const lighter = `rgb(${Math.min(255,r16+60)},${Math.min(255,g16+60)},${Math.min(255,b16+60)})`;
      grad.append('stop').attr('offset', '0%').attr('stop-color', lighter);
      grad.append('stop').attr('offset', '100%').attr('stop-color', color);
    });

    /* Arrow markers */
    [{t:'positive',c:'#22c55e'},{t:'negative',c:'#ef4444'},{t:'neutral',c:'#52525b'}].forEach(m => {
      defs.append('marker').attr('id', `ig-arr-${m.t}`)
        .attr('viewBox', '0 -5 10 10').attr('refX', 25).attr('refY', 0)
        .attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
        .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', m.c).attr('opacity', 0.75);
    });

    /* Ring guides */
    const RING_COLORS = ['#fbbf24','#818cf8','#34d399','#f472b6','#fb923c','#22d3ee'];
    RADII.slice(1).forEach((r, i) => {
      g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r)
        .attr('fill', 'none').attr('stroke', RING_COLORS[i+1] || '#444')
        .attr('stroke-width', 0.5).attr('stroke-dasharray', '3,6').attr('opacity', 0.18);
    });

    /* Pre-position nodes on rings */
    const byLevel = {};
    nodes.forEach(n => { if (!byLevel[n.level]) byLevel[n.level] = []; byLevel[n.level].push(n); });
    let seed = 1;
    Object.entries(byLevel).forEach(([lvl, grp]) => {
      const r = RADII[+lvl] || 0;
      grp.forEach((n, i) => {
        const jitter = (((seed++ * 2.618) % 1) - 0.5) * 12;
        const angle = (2 * Math.PI * i / grp.length) - Math.PI / 2;
        n.x = cx + (r + jitter) * Math.cos(angle);
        n.y = cy + (r + jitter) * Math.sin(angle);
      });
    });
    centerNode.x = cx; centerNode.y = cy;
    centerNode.fx = cx; centerNode.fy = cy;

    /* Force simulation — 300 silent ticks */
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id)
        .distance(d => { const lvl = d.target.level || 1; return (RADII[lvl] - RADII[Math.max(0, lvl-1)]) * 0.75 + 10; })
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300).distanceMax(RADII[maxLevel] * 1.5))
      .force('collide', d3.forceCollide().radius(d => nodeRadius(d) + 28).strength(0.85).iterations(3))
      .force('radial', d3.forceRadial(d => RADII[d.level] || 0, cx, cy).strength(d => d.level === 0 ? 1 : 0.65))
      .force('center', d3.forceCenter(cx, cy).strength(0.04))
      .stop();
    for (let i = 0; i < 300; i++) sim.tick();

    /* Curved link paths (quadratic bezier) */
    function curvePath(d) {
      const sx = d.source.x, sy = d.source.y, tx = d.target.x, ty = d.target.y;
      const mx = (sx + tx) / 2 - (ty - sy) * 0.18;
      const my = (sy + ty) / 2 + (tx - sx) * 0.18;
      return `M${sx},${sy} Q${mx},${my} ${tx},${ty}`;
    }

    const linkG = g.append('g').attr('class', 'links');
    linkG.selectAll('path').data(links).join('path')
      .attr('fill', 'none')
      .attr('stroke', d => d.impact > 0 ? 'rgba(34,197,94,0.5)' : d.impact < 0 ? 'rgba(239,68,68,0.5)' : 'rgba(100,100,130,0.28)')
      .attr('stroke-width', d => Math.max(0.8, Math.min(3.5, Math.abs(d.correlation || 0.3) * 3.5)))
      .attr('marker-end', d => d.impact > 0 ? 'url(#ig-arr-positive)' : d.impact < 0 ? 'url(#ig-arr-negative)' : 'url(#ig-arr-neutral)')
      .attr('d', curvePath)
      .attr('opacity', 0)
      .transition().delay(350).duration(500).attr('opacity', 1);

    /* Node groups */
    const nodeG = g.append('g').attr('class', 'nodes');
    const nodeEnter = nodeG.selectAll('g').data(nodes).join('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    /* Circles with radial gradient */
    nodeEnter.append('circle')
      .attr('r', d => nodeRadius(d))
      .attr('fill', d => {
        const t = TYPE_COLOR[d.type] ? d.type : 'default';
        return `url(#ig-grad-${t})`;
      })
      .attr('stroke', '#0a0a12')
      .attr('stroke-width', d => d.level === 0 ? 2.5 : 1.5)
      .attr('filter', d => d.level === 0 ? 'url(#ig-glow)' : null);

    /* Impact % inside node */
    nodeEnter.filter(d => d.impact !== null && d.impact !== undefined && d.impact !== 0 && d.level <= 2)
      .append('text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => d.level === 0 ? '10px' : '8px')
      .attr('font-weight', '700').attr('fill', 'rgba(5,5,8,0.9)')
      .attr('pointer-events', 'none')
      .text(d => (d.impact > 0 ? '+' : '') + d.impact + '%');

    /* Label abbreviation */
    function abbreviate(label, maxLen) {
      if (label.length <= maxLen) return label;
      const m = label.match(/\(([A-Z0-9\-\.=]+)\)$/);
      if (m) {
        const words = label.replace(/\s*\([^)]+\)$/, '').split(' ');
        const s = words.slice(0, 2).join(' ') + ' (' + m[1] + ')';
        if (s.length <= maxLen) return s;
        return words[0] + ' (' + m[1] + ')';
      }
      return label.slice(0, maxLen - 1) + '\u2026';
    }

    /* Smart label positioning — push away from center */
    nodeEnter.each(function(d) {
      const el = d3.select(this);
      const dx = d.x - cx, dy = d.y - cy;
      const angle = Math.atan2(dy, dx);
      const r = nodeRadius(d) + 7;
      const lx = Math.cos(angle) * r;
      const ly = Math.sin(angle) * r;
      const absA = Math.abs(angle);
      let anchor;
      if (d.level === 0) { anchor = 'middle'; }
      else if (absA > 2.2) anchor = 'end';
      else if (absA < 0.95) anchor = 'start';
      else anchor = 'middle';

      const maxLen = isMobile ? (d.level <= 1 ? 12 : 10) : (d.level <= 1 ? 18 : d.level <= 3 ? 15 : 12);
      const labelText = abbreviate(d.label, maxLen);

      /* Stroke-paint-order trick for legibility */
      el.append('text')
        .attr('class', 'node-label')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', anchor)
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-size', d.level === 0 ? '12px' : d.level <= 2 ? (isMobile ? '9px' : '10px') : '9px')
        .attr('font-weight', d.level === 0 ? '700' : '500')
        .attr('fill', '#e4e4e7')
        .attr('stroke', '#0a0a12').attr('stroke-width', '3').attr('paint-order', 'stroke')
        .attr('pointer-events', 'none')
        .text(labelText);
    });

    /* Staggered reveal */
    const maxLvl = Math.max(...nodes.map(n => n.level));
    for (let l = 0; l <= maxLvl; l++) {
      nodeG.selectAll('g.node-group')
        .filter(d => d.level === l)
        .transition().delay(l * 160).duration(380).attr('opacity', 1);
    }

    /* Tooltip */
    const tooltip = d3.select(container).append('div')
      .attr('class', 'cn-graph-tooltip').style('display', 'none');

    nodeEnter
      .on('mouseenter touchstart', function(event, d) {
        event.preventDefault && event.preventDefault();
        d3.select(this).select('circle').transition().duration(150)
          .attr('r', nodeRadius(d) * 1.25);
        const lines = [`<strong>${d.label}</strong>`];
        if (d.impact !== null && d.impact !== undefined) {
          const sign = d.impact > 0 ? '+' : '';
          const col = d.impact > 0 ? '#22c55e' : '#ef4444';
          lines.push(`<span style="color:${col};font-weight:700">Impact: ${sign}${d.impact}%</span>`);
        }
        if (d.correlation) lines.push(`Correlation: ${d.correlation}`);
        if (d.sector) lines.push(`Sector: ${d.sector}`);
        if (d.marketCap) lines.push(`Market Cap: $${d.marketCap}`);
        if (d.type) lines.push(`Type: ${d.type.charAt(0).toUpperCase() + d.type.slice(1)}`);
        tooltip.style('display','block').html(lines.join('<br>'));
      })
      .on('mousemove', function(event) {
        const rect = container.getBoundingClientRect();
        tooltip.style('left', (event.clientX - rect.left + 12) + 'px').style('top', (event.clientY - rect.top - 8) + 'px');
      })
      .on('mouseleave touchend', function(event, d) {
        d3.select(this).select('circle').transition().duration(150).attr('r', nodeRadius(d));
        setTimeout(() => tooltip.style('display', 'none'), 200);
      });

    /* Legend — 4 items bottom-left */
    const legendData = [
      { color: '#fbbf24', label: 'Commodity' }, { color: '#818cf8', label: 'ETF' },
      { color: '#22c55e', label: 'Positive' },  { color: '#ef4444', label: 'Negative' },
    ];
    const legendX = 12, legendY = H - 12 - legendData.length * 20;
    const legend = svg.append('g').attr('transform', `translate(${legendX},${legendY})`);
    legendData.forEach((item, i) => {
      const row = legend.append('g').attr('transform', `translate(0,${i*20})`);
      row.append('circle').attr('r', 5).attr('cx', 5).attr('cy', 0).attr('fill', item.color);
      row.append('text').attr('x', 14).attr('dy', '0.35em')
        .attr('font-size', '10px').attr('font-family', 'Inter').attr('fill', '#a1a1aa')
        .text(item.label);
    });

    setTimeout(() => svg.call(zoom.transform, d3.zoomIdentity), 50);
  }
})();
