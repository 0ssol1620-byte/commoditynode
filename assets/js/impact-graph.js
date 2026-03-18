/* ================================================================
   CommodityNode — Supply Chain Impact Graph v3
   D3 v7 radial force layout — clean, no controls
   ================================================================ */
(function () {
  'use strict';

  document.querySelectorAll('#impact-graph').forEach(function (container) {
    initGraph(container);
  });

  function initGraph(container) {
    const rawData = window.COMMODITY_DATA;
    if (!rawData) return;

    /* ── Normalize data ── */
    let levels;
    if (rawData.levels) {
      levels = rawData.levels;
    } else if (rawData.nodes && rawData.links) {
      // Legacy flat format
      const commodity = rawData.nodes.find(n => n.type === 'commodity') || rawData.nodes[0];
      const rest = rawData.nodes.filter(n => n !== commodity);
      levels = [{ nodes: rest }];
    } else {
      return;
    }

    const commodity = rawData.commodity || rawData.nodes?.find(n => n.type === 'commodity');

    /* ── Color scheme ── */
    const TYPE_COLOR = {
      commodity: '#fbbf24',
      etf:       '#818cf8',
      positive:  '#22c55e',
      negative:  '#ef4444',
      producer:  '#f59e0b',
      processor: '#06b6d4',
      default:   '#94a3b8',
    };
    const LEVEL_RING_COLOR = ['#fbbf24','#818cf8','#34d399','#f472b6','#fb923c','#22d3ee'];

    /* ── Build flat node/link arrays ── */
    const nodes = [];
    const links = [];

    // Level 0: commodity center
    const centerNode = {
      id: commodity?.id || 'center',
      label: commodity?.label || 'Commodity',
      type: 'commodity',
      level: 0,
      impact: null,
      correlation: null,
      sector: null,
      marketCap: commodity?.marketCap || null,
    };
    nodes.push(centerNode);

    // Level 1+
    levels.forEach((lvl, li) => {
      (lvl.nodes || []).forEach(n => {
        const node = { ...n, level: li + 1 };
        nodes.push(node);
        const srcId = n.parentId || centerNode.id;
        links.push({ source: srcId, target: n.id, correlation: n.correlation || 0.5, impact: n.impact || 0 });
      });
    });

    /* ── Dimensions ── */
    const isMobile = window.innerWidth < 768;
    const maxLevel = Math.max(...nodes.map(n => n.level));
    const RADII = [0, 110, 200, 295, 400, 510].slice(0, maxLevel + 1);
    const outerR = RADII[maxLevel] || 300;
    const W = container.clientWidth || 700;
    const H = isMobile ? Math.min(420, W) : Math.min(640, outerR * 2 + 100);
    const cx = W / 2, cy = H / 2;

    container.style.minHeight = H + 'px';
    container.innerHTML = '';

    /* ── SVG ── */
    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('overflow', 'visible');

    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'node-glow');
    filter.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'blur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers
    ['positive','negative','neutral'].forEach(type => {
      const color = type === 'positive' ? '#22c55e' : type === 'negative' ? '#ef4444' : '#52525b';
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 18).attr('refY', 0)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', color);
    });

    // Ring guides
    RADII.slice(1).forEach((r, i) => {
      svg.append('circle')
        .attr('cx', cx).attr('cy', cy).attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', LEVEL_RING_COLOR[i + 1] || '#333')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '3,6')
        .attr('opacity', 0.25);
    });

    /* ── Pre-position nodes on rings ── */
    // Group by level
    const byLevel = {};
    nodes.forEach(n => {
      if (!byLevel[n.level]) byLevel[n.level] = [];
      byLevel[n.level].push(n);
    });

    // Assign initial positions evenly spaced on each ring
    Object.entries(byLevel).forEach(([lvl, grp]) => {
      const r = RADII[+lvl] || 0;
      grp.forEach((n, i) => {
        const angle = (2 * Math.PI * i / grp.length) - Math.PI / 2;
        n.x = cx + r * Math.cos(angle);
        n.y = cy + r * Math.sin(angle);
        n.fx = n.x; // Fix positions — no force simulation chaos
        n.fy = n.y;
      });
    });
    // Center node fixed at center
    centerNode.fx = cx;
    centerNode.fy = cy;

    /* ── Links ── */
    const linkG = svg.append('g').attr('class', 'links');
    const link = linkG.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => d.impact > 0 ? 'rgba(34,197,94,0.5)' : d.impact < 0 ? 'rgba(239,68,68,0.5)' : 'rgba(100,100,130,0.3)')
      .attr('stroke-width', d => Math.max(0.8, Math.min(4, Math.abs(d.correlation || 0.3) * 4)))
      .attr('marker-end', d => d.impact > 0 ? 'url(#arrow-positive)' : d.impact < 0 ? 'url(#arrow-negative)' : 'url(#arrow-neutral)')
      .attr('opacity', 0);

    /* ── Node groups ── */
    const nodeG = svg.append('g').attr('class', 'nodes');
    const nodeEnter = nodeG.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Circle
    nodeEnter.append('circle')
      .attr('r', d => d.level === 0 ? 26 : d.level === 1 ? 16 : d.level === 2 ? 13 : 10)
      .attr('fill', d => TYPE_COLOR[d.type] || TYPE_COLOR.default)
      .attr('stroke', '#0a0a12')
      .attr('stroke-width', d => d.level === 0 ? 3 : 1.5)
      .attr('filter', d => d.level === 0 ? 'url(#node-glow)' : null)
      .attr('opacity', 0);

    // Impact label inside circle (for level 1-2)
    nodeEnter.filter(d => d.level <= 2 && d.impact !== null && d.impact !== undefined)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => d.level === 0 ? '10px' : '8px')
      .attr('font-weight', '700')
      .attr('fill', d => d.level === 0 ? '#050508' : 'rgba(5,5,8,0.9)')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text(d => d.impact !== null ? (d.impact > 0 ? '+' : '') + d.impact + '%' : '');

    // Label below node
    nodeEnter.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', d => (d.level === 0 ? 38 : d.level === 1 ? 26 : d.level === 2 ? 22 : 18) + 'px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', d => d.level === 0 ? '12px' : d.level <= 2 ? '10px' : '9px')
      .attr('font-weight', d => d.level === 0 ? '700' : '500')
      .attr('fill', '#e4e4e7')
      .attr('stroke', '#0a0a12')
      .attr('stroke-width', '3')
      .attr('paint-order', 'stroke')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text(d => {
        const maxLen = d.level <= 1 ? 18 : d.level <= 3 ? 15 : 12;
        return d.label.length > maxLen ? d.label.slice(0, maxLen - 1) + '\u2026' : d.label;
      });

    /* ── Tooltip ── */
    const tooltip = d3.select(container)
      .append('div')
      .attr('class', 'cn-graph-tooltip')
      .style('display', 'none');

    nodeEnter
      .on('mouseenter', function(event, d) {
        d3.select(this).select('circle')
          .transition().duration(150)
          .attr('r', function() {
            const base = d.level === 0 ? 26 : d.level === 1 ? 16 : d.level === 2 ? 13 : 10;
            return base * 1.25;
          });

        const lines = [`<strong>${d.label}</strong>`];
        if (d.impact !== null && d.impact !== undefined) {
          const sign = d.impact > 0 ? '+' : '';
          const color = d.impact > 0 ? '#22c55e' : '#ef4444';
          lines.push(`<span style="color:${color};font-weight:700">Impact: ${sign}${d.impact}%</span>`);
        }
        if (d.correlation) lines.push(`Correlation: ${d.correlation}`);
        if (d.sector) lines.push(`Sector: ${d.sector}`);
        if (d.marketCap) lines.push(`Market Cap: $${d.marketCap}`);
        if (d.type) lines.push(`Type: ${d.type.charAt(0).toUpperCase() + d.type.slice(1)}`);

        tooltip
          .style('display', 'block')
          .html(lines.join('<br>'));
      })
      .on('mousemove', function(event) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        tooltip
          .style('left', (x + 12) + 'px')
          .style('top', (y - 8) + 'px');
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).select('circle')
          .transition().duration(150)
          .attr('r', d.level === 0 ? 26 : d.level === 1 ? 16 : d.level === 2 ? 13 : 10);
        tooltip.style('display', 'none');
      });

    /* ── Update link positions ── */
    const nodeById = {};
    nodes.forEach(n => nodeById[n.id] = n);

    link
      .attr('x1', d => (nodeById[d.source]?.x || cx))
      .attr('y1', d => (nodeById[d.source]?.y || cy))
      .attr('x2', d => (nodeById[d.target]?.x || cx))
      .attr('y2', d => (nodeById[d.target]?.y || cy));

    /* ── Staggered reveal animation ── */
    const maxLvl = Math.max(...nodes.map(n => n.level));
    for (let l = 0; l <= maxLvl; l++) {
      const delay = l * 180;
      nodeG.selectAll('g.node-group')
        .filter(d => d.level === l)
        .selectAll('circle, text')
        .transition()
        .delay(delay)
        .duration(400)
        .attr('opacity', 1);
    }
    link.transition().delay(maxLvl * 180 + 100).duration(500).attr('opacity', 1);

    /* ── Legend ── */
    const legendData = [
      { color: '#fbbf24', label: 'Commodity' },
      { color: '#818cf8', label: 'ETF' },
      { color: '#22c55e', label: 'Positive Impact' },
      { color: '#ef4444', label: 'Negative Impact' },
    ];
    const legend = svg.append('g').attr('transform', `translate(12, ${H - 12 - legendData.length * 20})`);
    legendData.forEach((item, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
      row.append('circle').attr('r', 6).attr('cx', 6).attr('cy', 0).attr('fill', item.color);
      row.append('text').attr('x', 16).attr('dy', '0.35em')
        .attr('font-size', '11px').attr('font-family', 'Inter').attr('fill', '#a1a1aa')
        .text(item.label);
    });
  }
})();
