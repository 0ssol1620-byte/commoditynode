/* ============================================================
   CommodityNode — impact-graph.js
   5-Level Hierarchical Radial Supply Chain Graph
   D3.js v7 | Radial Layout | Drill-down | TradingView-ready
   ============================================================ */

(function () {
  'use strict';

  const container = document.getElementById('impact-graph');
  if (!container) return;

  if (typeof d3 === 'undefined') {
    container.innerHTML = '<p style="color:var(--text2);text-align:center;padding:40px">Loading chart...</p>';
    return;
  }

  const rawData = window.COMMODITY_DATA;
  if (!rawData) return;

  /* ── Backward-compat: old flat nodes/links format ── */
  let data;
  if (rawData.levels) {
    data = rawData;
  } else if (rawData.nodes && rawData.links) {
    /* Convert legacy format → 5-level */
    const commodity = rawData.nodes.find(n => n.type === 'commodity') || rawData.nodes[0];
    const rest = rawData.nodes.filter(n => n !== commodity);
    data = {
      commodity: { id: commodity.id, label: commodity.label, price: commodity.price || '', change: commodity.change || '' },
      levels: [{ nodes: rest.map(n => ({ ...n, parentId: commodity.id })) }]
    };
  } else {
    return;
  }

  /* ── Palette ── */
  const COLORS = {
    levels:    ['#fbbf24','#818cf8','#34d399','#f472b6','#fb923c','#22d3ee'],
    positive:  '#22c55e',
    negative:  '#ef4444',
    neutral:   '#52525b',
    linkPos:   '#22c55e',
    linkNeg:   '#ef4444',
    linkNeu:   '#52525b',
    bg:        'rgba(13,13,20,0.0)',
  };

  const LEVEL_RADII = [0, 110, 200, 290, 380, 470];

  /* ── Dimensions ── */
  const W  = container.clientWidth  || 860;
  const H  = Math.max(600, Math.min(window.innerHeight * 0.65, 720));
  const CX = W / 2;
  const CY = H / 2;

  container.style.height  = H + 'px';
  container.style.position = 'relative';

  /* ── Build flat node/link arrays ── */
  function buildGraph(commodityData) {
    const nodes = [];
    const links = [];

    /* Level 0 – commodity center */
    nodes.push({
      id:        commodityData.commodity.id,
      label:     commodityData.commodity.label,
      type:      'commodity',
      level:     0,
      impact:    0,
      marketCap: '',
      sector:    'Commodity',
      price:     commodityData.commodity.price,
      change:    commodityData.commodity.change,
      x: CX, y: CY,
    });

    /* Levels 1-5 */
    (commodityData.levels || []).forEach((lvl, li) => {
      const levelIndex = li + 1;
      const levelNodes = (lvl.nodes || []);
      const radius     = LEVEL_RADII[levelIndex] || (110 + levelIndex * 90);
      const count      = levelNodes.length;

      levelNodes.forEach((n, ni) => {
        const angle = (2 * Math.PI * ni / count) - Math.PI / 2;
        nodes.push({
          ...n,
          level:     levelIndex,
          x:         CX + radius * Math.cos(angle),
          y:         CY + radius * Math.sin(angle),
          _angle:    angle,
          _radius:   radius,
        });

        /* Link to parent or commodity */
        const srcId = n.parentId || commodityData.commodity.id;
        links.push({
          source: srcId,
          target: n.id,
          impact: n.impact || 0,
          correlation: n.correlation || 0,
        });
      });
    });

    return { nodes, links };
  }

  let { nodes, links } = buildGraph(data);

  /* ── State ── */
  let expandedNode   = null;
  let showLabels     = true;
  let filterMode     = 'all'; // 'all' | 'positive' | 'negative'
  let visibleLevels  = new Set([0, 1, 2, 3, 4, 5]);

  /* ── Tooltip ── */
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position:absolute; pointer-events:none; opacity:0; z-index:99;
    background:rgba(10,10,18,0.88); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,0.12); border-radius:12px;
    padding:12px 16px; min-width:180px; font-size:13px; line-height:1.7;
    color:#f0f0f5; box-shadow:0 8px 32px rgba(0,0,0,0.6);
    transition:opacity 0.15s;
  `;
  container.appendChild(tooltip);

  function showTooltip(event, d) {
    const sign = d.impact >= 0 ? '+' : '';
    const impactColor = d.impact > 0 ? COLORS.positive : (d.impact < 0 ? COLORS.negative : '#a1a1aa');
    const corr = d.correlation != null ? d.correlation.toFixed(2) : '—';
    tooltip.innerHTML = `
      <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#fff">${d.label}</div>
      ${d.impact ? `<div>Impact: <span style="color:${impactColor};font-weight:600">${sign}${d.impact}%</span></div>` : ''}
      ${d.correlation != null ? `<div>Correlation: <span style="color:#a78bfa">${corr}</span></div>` : ''}
      ${d.sector ? `<div>Sector: <span style="color:#94a3b8">${d.sector}</span></div>` : ''}
      ${d.marketCap ? `<div>Market Cap: <span style="color:#67e8f9">$${d.marketCap}</span></div>` : ''}
      ${d.price ? `<div>Price: <span style="color:#fbbf24">${d.price}</span></div>` : ''}
    `;
    tooltip.style.opacity = '1';
    const rect = container.getBoundingClientRect();
    let tx = event.clientX - rect.left + 14;
    let ty = event.clientY - rect.top  - 10;
    if (tx + 210 > W) tx -= 220;
    tooltip.style.left = tx + 'px';
    tooltip.style.top  = ty + 'px';
  }

  function hideTooltip() {
    tooltip.style.opacity = '0';
  }

  /* ── SVG ── */
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', H)
    .style('display', 'block')
    .attr('aria-label', 'Supply chain impact graph');

  const defs = svg.append('defs');

  /* Glow filter */
  const glow = defs.append('filter').attr('id', 'glow-sc').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
  const feMerge = glow.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'blur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  /* Radial gradient per level */
  COLORS.levels.forEach((c, i) => {
    const rg = defs.append('radialGradient').attr('id', `lg-l${i}`).attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    rg.append('stop').attr('offset', '0%').attr('stop-color', c).attr('stop-opacity', 1);
    rg.append('stop').attr('offset', '100%').attr('stop-color', c).attr('stop-opacity', 0.5);
  });

  /* ── Zoom ── */
  const zoomG = svg.append('g').attr('class', 'zoom-group');
  const zoom = d3.zoom().scaleExtent([0.3, 4])
    .on('zoom', e => zoomG.attr('transform', e.transform));
  svg.call(zoom);

  /* ── Level ring guides (faint) ── */
  const ringG = zoomG.append('g').attr('class', 'rings');
  LEVEL_RADII.slice(1).forEach((r, i) => {
    ringG.append('circle')
      .attr('cx', CX).attr('cy', CY).attr('r', r)
      .attr('fill', 'none')
      .attr('stroke', `rgba(255,255,255,0.04)`)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4');
  });

  /* ── Links ── */
  const linkG = zoomG.append('g').attr('class', 'links');

  /* ── Nodes ── */
  const nodeG = zoomG.append('g').attr('class', 'nodes');

  /* ── Helper: node radius by impact/marketCap ── */
  function nodeRadius(d) {
    if (d.level === 0) return 26;
    const base = 8;
    const mag  = Math.min(Math.abs(d.impact || 0), 25);
    return base + mag * 0.4;
  }

  /* ── Helper: link width by correlation ── */
  function linkWidth(d) {
    return Math.max(0.5, Math.abs(d.correlation || 0) * 8);
  }

  /* ── Helper: link color by impact ── */
  function linkColor(d) {
    if (d.impact > 0.5) return COLORS.linkPos;
    if (d.impact < -0.5) return COLORS.linkNeg;
    return COLORS.linkNeu;
  }

  /* ── Helper: node fill ── */
  function nodeFill(d) {
    if (d.level === 0) return `url(#lg-l0)`;
    if (d.type === 'etf') return `url(#lg-l${Math.min(d.level, 5)})`;
    if (d.impact > 0) return COLORS.positive;
    if (d.impact < 0) return COLORS.negative;
    return COLORS.neutral;
  }

  /* ── Helper: visible nodes/links ── */
  function visibleNodes() {
    return nodes.filter(n => {
      if (!visibleLevels.has(n.level)) return false;
      if (filterMode === 'positive' && n.level > 0 && n.impact <= 0) return false;
      if (filterMode === 'negative' && n.level > 0 && n.impact >= 0) return false;
      return true;
    });
  }

  function visibleLinks() {
    const vnIds = new Set(visibleNodes().map(n => n.id));
    return links.filter(l => vnIds.has(l.source) && vnIds.has(l.target));
  }

  /* ── Draw / Redraw ── */
  function draw(animate) {
    const vNodes = visibleNodes();
    const vLinks = visibleLinks();

    /* Links */
    const linkSel = linkG.selectAll('line.sc-link').data(vLinks, d => d.source + '_' + d.target);
    linkSel.exit().transition().duration(200).attr('opacity', 0).remove();
    const linkEnter = linkSel.enter().append('line').attr('class', 'sc-link').attr('opacity', 0);

    const allLinks = linkEnter.merge(linkSel);

    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

    allLinks
      .attr('stroke', d => linkColor(d))
      .attr('stroke-opacity', 0.55)
      .attr('stroke-linecap', 'round');

    /* Position links */
    function positionLink(sel) {
      sel
        .attr('x1', d => { const s = nodeById[d.source]; return s ? s.x : CX; })
        .attr('y1', d => { const s = nodeById[d.source]; return s ? s.y : CY; })
        .attr('x2', d => { const t = nodeById[d.target]; return t ? t.x : CX; })
        .attr('y2', d => { const t = nodeById[d.target]; return t ? t.y : CY; });
    }

    if (animate) {
      allLinks
        .call(positionLink)
        .transition().duration(400)
        .attr('opacity', 1)
        .attr('stroke-width', d => linkWidth(d));
    } else {
      allLinks
        .call(positionLink)
        .attr('opacity', 1)
        .attr('stroke-width', d => linkWidth(d));
    }

    /* Nodes */
    const nodeSel = nodeG.selectAll('g.sc-node').data(vNodes, d => d.id);
    nodeSel.exit().transition().duration(200).attr('opacity', 0).remove();

    const nodeEnter = nodeSel.enter().append('g').attr('class', 'sc-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .attr('opacity', 0)
      .style('cursor', 'pointer');

    /* Circle */
    nodeEnter.append('circle')
      .attr('r', d => nodeRadius(d))
      .attr('fill', d => nodeFill(d))
      .attr('stroke', d => d.level === 0 ? '#fbbf24' : 'rgba(255,255,255,0.18)')
      .attr('stroke-width', d => d.level === 0 ? 2.5 : 1)
      .attr('filter', d => d.level === 0 ? 'url(#glow-sc)' : null);

    /* Label */
    nodeEnter.append('text')
      .attr('class', 'sc-label')
      .attr('text-anchor', 'middle')
      .attr('dy', d => nodeRadius(d) + 12)
      .attr('font-size', d => d.level === 0 ? '11px' : '9px')
      .attr('fill', '#e2e8f0')
      .attr('pointer-events', 'none')
      .text(d => d.label.length > 18 ? d.label.substring(0, 17) + '…' : d.label);

    /* Impact badge on nodes (level 0 only) */
    nodeEnter.filter(d => d.level === 0).append('text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-size', '10px').attr('font-weight', '700')
      .attr('fill', '#1a1a2e').attr('pointer-events', 'none')
      .text(d => d.change || '');

    /* Merge */
    const allNodes = nodeEnter.merge(nodeSel);

    /* Update positions */
    allNodes.select('circle')
      .attr('r', d => nodeRadius(d))
      .attr('fill', d => nodeFill(d));

    allNodes.select('text.sc-label')
      .attr('visibility', showLabels ? 'visible' : 'hidden');

    /* Animate staggered by level */
    if (animate) {
      allNodes.transition()
        .delay(d => d.level * 200)
        .duration(450)
        .attr('opacity', 1)
        .attr('transform', d => `translate(${d.x},${d.y})`);
    } else {
      allNodes.attr('opacity', 1).attr('transform', d => `translate(${d.x},${d.y})`);
    }

    /* Events */
    allNodes
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).select('circle')
          .transition().duration(120)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2.5);
        showTooltip(event, d);
      })
      .on('mousemove', (event, d) => showTooltip(event, d))
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget).select('circle')
          .transition().duration(120)
          .attr('stroke', d.level === 0 ? '#fbbf24' : 'rgba(255,255,255,0.18)')
          .attr('stroke-width', d.level === 0 ? 2.5 : 1);
        hideTooltip();
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        handleDrillDown(d);
      });
  }

  /* ── Drill-down: click node to highlight its children ── */
  function handleDrillDown(d) {
    if (d.level === 0) {
      // Reset: show all
      expandedNode = null;
      nodes.forEach(n => { n._dimmed = false; });
    } else {
      if (expandedNode === d.id) {
        expandedNode = null;
        nodes.forEach(n => { n._dimmed = false; });
      } else {
        expandedNode = d.id;
        const childIds = new Set(links.filter(l => l.source === d.id).map(l => l.target));
        childIds.add(d.id);
        // also keep ancestors visible
        let current = d.id;
        while (true) {
          const parentLink = links.find(l => l.target === current);
          if (!parentLink) break;
          childIds.add(parentLink.source);
          current = parentLink.source;
        }
        nodes.forEach(n => { n._dimmed = !childIds.has(n.id); });
      }
    }

    nodeG.selectAll('g.sc-node')
      .transition().duration(300)
      .attr('opacity', d => d._dimmed ? 0.15 : 1);

    linkG.selectAll('line.sc-link')
      .transition().duration(300)
      .attr('opacity', d => {
        const src = nodes.find(n => n.id === d.source);
        const tgt = nodes.find(n => n.id === d.target);
        if (!src || !tgt) return 0.1;
        return (src._dimmed || tgt._dimmed) ? 0.06 : 0.7;
      });
  }

  /* ── Legend ── */
  function buildLegend() {
    const leg = document.createElement('div');
    leg.style.cssText = `
      display:flex; flex-wrap:wrap; gap:12px 20px; margin-top:12px;
      padding:10px 14px; background:rgba(255,255,255,0.03);
      border:1px solid rgba(255,255,255,0.06); border-radius:10px;
      font-size:11px; color:#94a3b8;
    `;

    const items = [
      { color: COLORS.levels[0], label: 'Commodity (Center)' },
      { color: COLORS.levels[1], label: 'Level 1: ETFs / Producers' },
      { color: COLORS.levels[2], label: 'Level 2: Processing / Royalty' },
      { color: COLORS.levels[3], label: 'Level 3: Equipment / Services' },
      { color: COLORS.levels[4], label: 'Level 4: Consumer Industries' },
      { color: COLORS.levels[5], label: 'Level 5: Macro / End Consumers' },
      { color: COLORS.positive,  label: '▲ Positive Impact' },
      { color: COLORS.negative,  label: '▼ Negative Impact' },
      { color: COLORS.neutral,   label: '● Neutral' },
    ];

    items.forEach(item => {
      const span = document.createElement('span');
      span.innerHTML = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color};margin-right:5px;vertical-align:middle;"></span>${item.label}`;
      leg.appendChild(span);
    });

    container.parentNode.insertBefore(leg, container.nextSibling);
  }

  /* ── Controls: Zoom + Labels + Filter ── */
  function buildControls() {
    const ctrl = document.createElement('div');
    ctrl.style.cssText = `
      position:absolute; top:12px; right:12px; display:flex; flex-direction:column;
      gap:5px; z-index:10;
    `;

    const btnStyle = `
      width:32px; height:32px; background:rgba(13,13,20,0.88);
      border:1px solid rgba(255,255,255,0.1); border-radius:7px;
      color:#f0f0f5; cursor:pointer; font-size:14px;
      display:flex; align-items:center; justify-content:center;
      transition:border-color 0.2s, background 0.2s;
    `;

    ctrl.innerHTML = `
      <button id="sc-zoom-in"   title="Zoom in"       style="${btnStyle}">+</button>
      <button id="sc-zoom-out"  title="Zoom out"      style="${btnStyle}">−</button>
      <button id="sc-zoom-fit"  title="Reset view"    style="${btnStyle}">⟳</button>
      <button id="sc-labels"    title="Toggle labels" style="${btnStyle}">🏷</button>
      <button id="sc-filter-p"  title="Show positive" style="${btnStyle};color:#22c55e">▲</button>
      <button id="sc-filter-n"  title="Show negative" style="${btnStyle};color:#ef4444">▼</button>
      <button id="sc-filter-a"  title="Show all"      style="${btnStyle}">⊕</button>
    `;

    container.appendChild(ctrl);

    document.getElementById('sc-zoom-in') .addEventListener('click', () => svg.transition().call(zoom.scaleBy, 1.35));
    document.getElementById('sc-zoom-out').addEventListener('click', () => svg.transition().call(zoom.scaleBy, 0.74));
    document.getElementById('sc-zoom-fit').addEventListener('click', () => svg.transition().call(zoom.transform, d3.zoomIdentity));

    document.getElementById('sc-labels').addEventListener('click', () => {
      showLabels = !showLabels;
      nodeG.selectAll('text.sc-label').attr('visibility', showLabels ? 'visible' : 'hidden');
    });

    document.getElementById('sc-filter-p').addEventListener('click', () => { filterMode = 'positive'; draw(false); });
    document.getElementById('sc-filter-n').addEventListener('click', () => { filterMode = 'negative'; draw(false); });
    document.getElementById('sc-filter-a').addEventListener('click', () => { filterMode = 'all';      draw(false); });
  }

  /* ── Init ── */
  buildControls();
  draw(true);
  buildLegend();

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    const newW = container.clientWidth;
    svg.attr('width', newW);
  });

})();
