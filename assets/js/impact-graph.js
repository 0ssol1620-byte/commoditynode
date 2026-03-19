/* ================================================================
   CommodityNode — Supply Chain Impact Graph v5 (Premium)
   D3 v7 force simulation — curved links, gradient nodes, auto-fit
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

    const TYPE_COLOR = {
      commodity: '#fbbf24',
      etf:       '#818cf8',
      positive:  '#22c55e',
      negative:  '#ef4444',
      producer:  '#f59e0b',
      processor: '#06b6d4',
      default:   '#94a3b8',
    };

    /* ── Build flat arrays ── */
    const nodes = [];
    const links = [];
    const centerNode = {
      id: commodity?.id || 'center',
      label: commodity?.label || 'Commodity',
      type: 'commodity', level: 0,
      impact: null, correlation: null, sector: null,
    };
    nodes.push(centerNode);

    levels.forEach((lvl, li) => {
      (lvl.nodes || []).forEach(n => {
        nodes.push({ ...n, level: li + 1 });
        links.push({
          source: n.parentId || centerNode.id,
          target: n.id,
          correlation: n.correlation || 0.5,
          impact: n.impact || 0,
        });
      });
    });

    /* ── Dimensions ── */
    const isMobile = window.innerWidth < 768;
    const W = container.clientWidth || 900;
    const H = isMobile ? 420 : 540;
    container.style.height = H + 'px';
    container.innerHTML = '';

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%').attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('overflow', 'hidden');

    /* ── Defs: gradients + glow ── */
    const defs = svg.append('defs');

    // Glow filter
    const glow = defs.append('filter').attr('id', 'cn-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Node gradients per type
    Object.entries(TYPE_COLOR).forEach(([type, color]) => {
      const grad = defs.append('radialGradient')
        .attr('id', `grad-${type}`)
        .attr('cx', '35%').attr('cy', '35%').attr('r', '65%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', lighten(color, 0.5));
      grad.append('stop').attr('offset', '100%').attr('stop-color', color);
    });

    function lighten(hex, amt) {
      const c = parseInt(hex.slice(1), 16);
      const r = Math.min(255, (c >> 16) + Math.round(255 * amt));
      const g = Math.min(255, ((c >> 8) & 0xff) + Math.round(255 * amt));
      const b = Math.min(255, (c & 0xff) + Math.round(255 * amt));
      return `rgb(${r},${g},${b})`;
    }

    // Arrow markers
    ['positive','negative','neutral'].forEach(type => {
      const color = type === 'positive' ? '#22c55e' : type === 'negative' ? '#ef4444' : '#52525b';
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20).attr('refY', 0)
        .attr('markerWidth', 5).attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', color).attr('opacity', 0.8);
    });

    /* ── Zoom group ── */
    const g = svg.append('g').attr('class', 'cn-zoom');
    const zoom = d3.zoom().scaleExtent([0.3, 4]).on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoom).on('dblclick.zoom', null);

    /* ── Node radius by level ── */
    function nodeR(d) {
      if (d.level === 0) return 28;
      if (d.level === 1) return 20;
      if (d.level === 2) return 15;
      if (d.level === 3) return 12;
      return 10;
    }

    /* ── Force simulation ── */
    const maxLevel = Math.max(...nodes.map(n => n.level));
    const ringR = isMobile ? 80 : 110;

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
        const src = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
        const tgt = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
        const maxLvl = Math.max(src?.level || 0, tgt?.level || 0);
        return ringR * (0.8 + maxLvl * 0.15);
      }).strength(0.7))
      .force('charge', d3.forceManyBody().strength(d => d.level === 0 ? -600 : -250))
      .force('collide', d3.forceCollide(d => nodeR(d) + 28))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.08))
      .force('radial', d3.forceRadial(d => d.level * ringR, W / 2, H / 2).strength(0.6))
      .stop();

    // Run sim headlessly
    const ticks = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));
    for (let i = 0; i < Math.min(ticks, 300); i++) sim.tick();

    /* ── Links (curved) ── */
    const linkG = g.append('g').attr('class', 'cn-links');
    const linkEls = linkG.selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', d => d.impact > 0 ? 'rgba(34,197,94,0.45)' : d.impact < 0 ? 'rgba(239,68,68,0.45)' : 'rgba(100,100,130,0.25)')
      .attr('stroke-width', d => Math.max(1, Math.min(3.5, Math.abs(d.correlation || 0.3) * 3.5)))
      .attr('stroke-linecap', 'round')
      .attr('marker-end', d => d.impact > 0 ? 'url(#arrow-positive)' : d.impact < 0 ? 'url(#arrow-negative)' : 'url(#arrow-neutral)')
      .attr('opacity', 0)
      .attr('d', linkPath);

    function linkPath(d) {
      const sx = d.source.x, sy = d.source.y;
      const tx = d.target.x, ty = d.target.y;
      const mx = (sx + tx) / 2;
      const my = (sy + ty) / 2;
      // Slight curve via quadratic bezier
      const dx = tx - sx, dy = ty - sy;
      const perp = Math.sqrt(dx*dx + dy*dy);
      const cx = mx + (-dy / perp) * 20;
      const cy = my + (dx / perp) * 20;
      return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
    }

    /* ── Nodes ── */
    const nodeG = g.append('g').attr('class', 'cn-nodes');
    const nodeEl = nodeG.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'cn-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'grab');

    // Outer glow ring for center
    nodeEl.filter(d => d.level === 0).append('circle')
      .attr('r', d => nodeR(d) + 8)
      .attr('fill', 'none')
      .attr('stroke', TYPE_COLOR.commodity)
      .attr('stroke-width', 1)
      .attr('opacity', 0.3)
      .attr('stroke-dasharray', '4,4');

    // Main circle with gradient
    nodeEl.append('circle')
      .attr('r', nodeR)
      .attr('fill', d => `url(#grad-${d.type || 'default'})`)
      .attr('stroke', d => TYPE_COLOR[d.type] || TYPE_COLOR.default)
      .attr('stroke-width', d => d.level === 0 ? 2.5 : 1.5)
      .attr('filter', d => d.level === 0 ? 'url(#cn-glow)' : null)
      .attr('opacity', 0);

    // Impact % inside circle
    nodeEl.filter(d => d.level <= 2 && d.impact != null)
      .append('text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', d => d.level === 0 ? '10px' : '8px')
      .attr('font-weight', '800')
      .attr('fill', '#050508')
      .attr('pointer-events', 'none').attr('opacity', 0)
      .text(d => d.impact != null ? (d.impact > 0 ? '+' : '') + d.impact + '%' : '');

    // Labels — smart abbreviation
    function abbreviate(label, maxLen) {
      if (!label || label.length <= maxLen) return label;
      const m = label.match(/\(([A-Z0-9\-\.=]+)\)$/);
      if (m) {
        const ticker = m[1];
        const words = label.replace(/\s*\([^)]+\)$/, '').split(' ');
        for (let n = words.length; n >= 1; n--) {
          const s = words.slice(0, n).join(' ') + ' (' + ticker + ')';
          if (s.length <= maxLen) return s;
        }
        return '(' + ticker + ')';
      }
      return label.slice(0, maxLen - 1) + '\u2026';
    }

    const maxLen = isMobile ? 12 : 16;
    nodeEl.append('text')
      .attr('class', 'cn-node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', d => (nodeR(d) + 14) + 'px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', d => d.level === 0 ? '12px' : d.level <= 2 ? '10px' : '9px')
      .attr('font-weight', d => d.level <= 1 ? '700' : '500')
      .attr('fill', '#e4e4e7')
      .attr('stroke', '#0a0a12').attr('stroke-width', '3.5')
      .attr('paint-order', 'stroke')
      .attr('pointer-events', 'none').attr('opacity', 0)
      .text(d => abbreviate(d.label, maxLen));

    /* ── Tooltip ── */
    const tooltip = d3.select(container).append('div')
      .attr('class', 'cn-graph-tooltip').style('display', 'none');

    nodeEl
      .on('mouseenter', function(event, d) {
        d3.select(this).select('circle').transition().duration(120)
          .attr('r', nodeR(d) * 1.2);
        const lines = [`<strong>${d.label}</strong>`];
        if (d.impact != null) {
          const s = d.impact > 0 ? '+' : '';
          const c = d.impact > 0 ? '#22c55e' : '#ef4444';
          lines.push(`<span style="color:${c};font-weight:700">Impact: ${s}${d.impact}%</span>`);
        }
        if (d.correlation) lines.push(`Correlation: ${(+d.correlation).toFixed(2)}`);
        if (d.sector)      lines.push(`Sector: ${d.sector}`);
        if (d.marketCap)   lines.push(`Market Cap: $${d.marketCap}`);
        tooltip.style('display', 'block').html(lines.join('<br>'));
      })
      .on('mousemove', function(event) {
        const rect = container.getBoundingClientRect();
        tooltip.style('left', (event.clientX - rect.left + 14) + 'px')
               .style('top',  (event.clientY - rect.top - 10) + 'px');
      })
      .on('mouseleave', function(event, d) {
        d3.select(this).select('circle').transition().duration(120).attr('r', nodeR(d));
        tooltip.style('display', 'none');
      });

    // Touch support
    nodeEl.on('touchstart', function(event, d) {
      event.preventDefault();
      const touch = event.touches[0];
      const rect = container.getBoundingClientRect();
      const lines = [`<strong>${d.label}</strong>`];
      if (d.impact != null) {
        const s = d.impact > 0 ? '+' : '';
        const c = d.impact > 0 ? '#22c55e' : '#ef4444';
        lines.push(`<span style="color:${c};font-weight:700">Impact: ${s}${d.impact}%</span>`);
      }
      tooltip.style('display', 'block').html(lines.join('<br>'))
        .style('left', (touch.clientX - rect.left + 14) + 'px')
        .style('top',  (touch.clientY - rect.top - 10) + 'px');
      setTimeout(() => tooltip.style('display', 'none'), 2500);
    }, { passive: false });

    // Drag
    nodeEl.call(d3.drag()
      .on('start', function(event, d) {
        d3.select(this).style('cursor', 'grabbing');
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', function(event, d) {
        d.fx = event.x; d.fy = event.y;
        d3.select(this).attr('transform', `translate(${d.x},${d.y})`);
        linkEls.attr('d', linkPath);
      })
      .on('end', function(event, d) {
        d3.select(this).style('cursor', 'grab');
        // Keep position after drag
      })
    );

    /* ── Staggered reveal ── */
    for (let l = 0; l <= maxLevel; l++) {
      const delay = l * 140;
      nodeG.selectAll('g.cn-node').filter(d => d.level === l)
        .selectAll('circle, text')
        .transition().delay(delay).duration(350).attr('opacity', 1);
    }
    linkEls.transition().delay(maxLevel * 140 + 80).duration(450).attr('opacity', 1);

    /* ── Legend ── */
    const legendData = [
      { color: '#fbbf24', label: 'Commodity' },
      { color: '#818cf8', label: 'ETF' },
      { color: '#22c55e', label: 'Positive' },
      { color: '#ef4444', label: 'Negative' },
    ];
    const leg = svg.append('g').attr('transform', `translate(14, ${H - 14 - legendData.length * 22})`);
    legendData.forEach((item, i) => {
      const row = leg.append('g').attr('transform', `translate(0,${i * 22})`);
      row.append('circle').attr('r', 6).attr('cx', 6).attr('fill', item.color).attr('opacity', 0.9);
      row.append('text').attr('x', 16).attr('dy', '0.35em')
        .attr('font-size', '11px').attr('font-family', 'Inter, sans-serif').attr('fill', '#9494a8')
        .text(item.label);
    });

    // Hint text
    const hint = svg.append('text')
      .attr('x', W - 12).attr('y', H - 10)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px').attr('font-family', 'Inter').attr('fill', '#52525b')
      .text('Scroll to zoom · Drag nodes');

    /* ── Auto-fit after settle ── */
    setTimeout(() => {
      const bounds = g.node().getBBox();
      if (!bounds.width || !bounds.height) return;
      const scale = Math.min(0.9, Math.min(W / bounds.width, H / bounds.height) * 0.85);
      const tx = (W - bounds.width * scale) / 2 - bounds.x * scale;
      const ty = (H - bounds.height * scale) / 2 - bounds.y * scale;
      svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }, maxLevel * 140 + 600);
  }
})();
