/* ============================================================
   CommodityNode — impact-graph.js
   D3.js v7 Interactive Force-Directed Graph
   Drag, Zoom, Hover Tooltips, Animated Entry
   ============================================================ */

(function () {
  'use strict';

  const container = document.getElementById('impact-graph');
  if (!container) return;
  if (typeof d3 === 'undefined') {
    container.innerHTML = '<p style="color:var(--text2);text-align:center;padding:40px">Loading chart...</p>';
    return;
  }

  const data = window.COMMODITY_DATA;
  if (!data || !data.nodes || !data.links) return;

  /* ---------- Colours ---------- */
  const palette = {
    commodity: '#fbbf24',
    positive:  '#10b981',
    negative:  '#f43f5e',
    neutral:   '#22d3ee',
    industry:  '#a855f7',
  };

  /* ---------- Size ---------- */
  const W = container.clientWidth || 800;
  const H = Math.max(480, Math.min(window.innerHeight * 0.55, 600));

  container.style.height = H + 'px';

  /* ---------- Tooltip ---------- */
  const tooltip = document.createElement('div');
  tooltip.className = 'graph-tooltip';
  container.appendChild(tooltip);

  /* ---------- SVG Setup ---------- */
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', H)
    .style('display', 'block');

  // Arrow markers
  const defs = svg.append('defs');

  ['positive', 'negative', 'neutral'].forEach(type => {
    const color = palette[type];
    defs.append('marker')
      .attr('id', 'arrow-' + type)
      .attr('viewBox', '0 -4 10 8')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L10,0L0,4')
      .attr('fill', color)
      .attr('opacity', 0.7);
  });

  // Glow filter
  const filter = defs.append('filter').attr('id', 'glow');
  filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
  const merge = filter.append('feMerge');
  merge.append('feMergeNode').attr('in', 'blur');
  merge.append('feMergeNode').attr('in', 'SourceGraphic');

  /* ---------- Zoom / Pan ---------- */
  const zoomG = svg.append('g').attr('class', 'zoom-group');

  const zoom = d3.zoom()
    .scaleExtent([0.4, 3])
    .on('zoom', e => zoomG.attr('transform', e.transform));

  svg.call(zoom);

  // Zoom controls
  const zoomBtns = document.createElement('div');
  zoomBtns.innerHTML = `
    <div style="position:absolute;top:12px;right:12px;display:flex;flex-direction:column;gap:4px;z-index:5;">
      <button id="zoom-in"  title="Zoom in"  style="width:30px;height:30px;background:rgba(13,13,20,0.85);border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:#f0f0f5;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:border-color 0.2s;">+</button>
      <button id="zoom-out" title="Zoom out" style="width:30px;height:30px;background:rgba(13,13,20,0.85);border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:#f0f0f5;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:border-color 0.2s;">−</button>
      <button id="zoom-fit" title="Reset"    style="width:30px;height:30px;background:rgba(13,13,20,0.85);border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:#f0f0f5;cursor:pointer;font-size:0.7rem;display:flex;align-items:center;justify-content:center;transition:border-color 0.2s;">⟳</button>
    </div>`;
  container.style.position = 'relative';
  container.appendChild(zoomBtns);

  document.getElementById('zoom-in') .addEventListener('click', () => svg.transition().call(zoom.scaleBy, 1.3));
  document.getElementById('zoom-out').addEventListener('click', () => svg.transition().call(zoom.scaleBy, 0.77));
  document.getElementById('zoom-fit').addEventListener('click', () => svg.transition().call(zoom.transform, d3.zoomIdentity));

  /* ---------- Links ---------- */
  const link = zoomG.append('g').attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('stroke-width', 1.5)
    .attr('stroke', d => {
      const target = data.nodes.find(n => n.id === (d.target.id || d.target));
      if (!target) return 'rgba(255,255,255,0.1)';
      return target.type === 'positive' ? palette.positive :
             target.type === 'negative' ? palette.negative :
             'rgba(255,255,255,0.15)';
    })
    .attr('stroke-opacity', 0.5)
    .attr('marker-end', d => {
      const target = data.nodes.find(n => n.id === (d.target.id || d.target));
      if (!target) return 'url(#arrow-neutral)';
      return target.type === 'positive' ? 'url(#arrow-positive)' :
             target.type === 'negative' ? 'url(#arrow-negative)' :
             'url(#arrow-neutral)';
    });

  /* ---------- Node Groups ---------- */
  const nodeGroup = zoomG.append('g').attr('class', 'nodes');

  const drag = d3.drag()
    .on('start', (e, d) => {
      if (!e.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x; d.fy = d.y;
    })
    .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on('end', (e, d) => {
      if (!e.active) sim.alphaTarget(0);
      d.fx = null; d.fy = null;
    });

  const nodeEl = nodeGroup.selectAll('g')
    .data(data.nodes)
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'grab')
    .call(drag)
    .on('mouseenter', function (e, d) {
      const impact = d.impact
        ? `<span class="tt-impact" style="color:${d.impact > 0 ? '#10b981' : '#f43f5e'}">${d.impact > 0 ? '+' : ''}${d.impact}%</span>`
        : '';
      const hint = d.type === 'commodity' ? '' : `<div class="tt-hint">Drag to reposition</div>`;
      tooltip.innerHTML = `<div class="tt-name">${d.label}</div>${impact}${hint}`;
      tooltip.classList.add('visible');
      d3.select(this).select('circle').attr('filter', 'url(#glow)');
    })
    .on('mousemove', e => {
      const rect = container.getBoundingClientRect();
      let left = e.clientX - rect.left + 14;
      let top  = e.clientY - rect.top  - 10;
      if (left + 190 > rect.width) left = e.clientX - rect.left - 190;
      tooltip.style.left = left + 'px';
      tooltip.style.top  = top  + 'px';
    })
    .on('mouseleave', function () {
      tooltip.classList.remove('visible');
      d3.select(this).select('circle').attr('filter', null);
    });

  // Circle per node
  nodeEl.append('circle')
    .attr('r', d => d.type === 'commodity' ? 22 : 16)
    .attr('fill', d => palette[d.type] || palette.neutral)
    .attr('fill-opacity', 0.15)
    .attr('stroke', d => palette[d.type] || palette.neutral)
    .attr('stroke-width', 2)
    .attr('opacity', 0)
    .transition().duration(800).delay((_, i) => i * 50)
    .attr('opacity', 1);

  // Pulsing ring for commodity node
  nodeEl.filter(d => d.type === 'commodity')
    .append('circle')
    .attr('class', 'pulse-ring')
    .attr('r', 22)
    .attr('fill', 'none')
    .attr('stroke', palette.commodity)
    .attr('stroke-width', 1)
    .attr('opacity', 0.5);

  // Labels
  nodeEl.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', d => d.type === 'commodity' ? 38 : 30)
    .attr('fill', '#e4e4e7')
    .attr('font-size', '11px')
    .attr('font-family', 'Inter, sans-serif')
    .attr('font-weight', d => d.type === 'commodity' ? 700 : 500)
    .attr('opacity', 0)
    .text(d => d.label)
    .transition().duration(800).delay((_, i) => i * 50 + 200)
    .attr('opacity', 1);

  // Impact value inside node
  nodeEl.filter(d => d.impact != null)
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '4px')
    .attr('fill', d => d.impact > 0 ? palette.positive : palette.negative)
    .attr('font-size', '10px')
    .attr('font-weight', 700)
    .attr('font-family', "'JetBrains Mono', monospace")
    .attr('pointer-events', 'none')
    .attr('opacity', 0)
    .text(d => (d.impact > 0 ? '+' : '') + d.impact + '%')
    .transition().duration(800).delay((_, i) => i * 50 + 400)
    .attr('opacity', 1);

  // Commodity icon
  nodeEl.filter(d => d.type === 'commodity')
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '5px')
    .attr('font-size', '14px')
    .attr('pointer-events', 'none')
    .text('⛽');

  /* ---------- Simulation ---------- */
  const sim = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(120).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-280))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(36))
    .force('x', d3.forceX(W / 2).strength(0.04))
    .force('y', d3.forceY(H / 2).strength(0.04))
    .on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      nodeEl.attr('transform', d => `translate(${d.x},${d.y})`);
    });

  /* ---------- Pulse ring animation ---------- */
  function animatePulse() {
    svg.selectAll('.pulse-ring')
      .transition().duration(1800).ease(d3.easeSinInOut)
      .attr('r', 36).attr('opacity', 0)
      .transition().duration(0)
      .attr('r', 22).attr('opacity', 0.5)
      .on('end', animatePulse);
  }
  animatePulse();

  /* ---------- Responsive resize ---------- */
  const ro = new ResizeObserver(() => {
    const newW = container.clientWidth;
    sim.force('center', d3.forceCenter(newW / 2, H / 2))
       .force('x', d3.forceX(newW / 2).strength(0.04));
    sim.alpha(0.3).restart();
  });
  ro.observe(container);

})();
