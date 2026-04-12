/* CommodityNode — Obsidian-style Local Knowledge Graph
   Interactive local graph for commodity hub pages only.
   Reads existing window.COMMODITY_DATA from the commodity body and
   separate window.COMMODITY_PAGE_META from the commodity layout. */
(function () {
  'use strict';

  var bootAttempts = 0;

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }

  function signedNumber(value) {
    var num = Number(value);
    return (num > 0 ? '+' : '') + num;
  }

  function defaultDescription(node, meta, centerId) {
    if (node.id === centerId) return (meta.description || 'Primary hub node anchoring this local market neighborhood.');
    if (node.type === 'report') return 'Recent editorial note that gives narrative context to the current commodity move.';
    if (node.type === 'theme') return 'Structural theme shared across related commodity hubs and reports.';
    if (node.type === 'substitute') return 'Alternative commodity path worth comparing when second-order effects diverge.';
    return 'Connected entity in the local commodity graph.';
  }

  function normalizeData(raw, meta) {
    if (!raw) return null;

    meta = meta || {};
    var levels = Array.isArray(raw.levels) ? raw.levels : [];
    var commodity = raw.commodity || { id: slugify(meta.shortTitle || meta.title || 'commodity'), label: meta.shortTitle || meta.title || 'Commodity' };

    var nodes = [];
    var links = [];
    var nodeMap = new Map();

    function inferGroup(type) {
      if (type === 'report' || type === 'theme') return 'research';
      if (type === 'producer' || type === 'supplier' || type === 'processor' || type === 'consumer') return 'company';
      if (type === 'macro' || type === 'policy' || type === 'regional' || type === 'fx' || type === 'freight') return 'macro';
      return 'market';
    }

    function addNode(node) {
      if (!node || !node.id) return null;
      var existing = nodeMap.get(node.id);
      if (existing) {
        Object.keys(node).forEach(function (key) {
          if (existing[key] == null || existing[key] === '') existing[key] = node[key];
        });
        return existing;
      }
      var normalized = Object.assign({
        label: node.id,
        type: 'default',
        level: 1,
        group: 'market',
        impact: null,
        correlation: null,
        sector: '',
        url: '',
        relationLabel: '',
        note: ''
      }, node);
      nodeMap.set(normalized.id, normalized);
      nodes.push(normalized);
      return normalized;
    }

    function addLink(source, target, extra) {
      if (!source || !target || source === target) return;
      var id = source + '::' + target;
      if (links.some(function (link) { return link.id === id; })) return;
      links.push(Object.assign({
        id: id,
        source: source,
        target: target,
        weight: 1,
        relation: 'linked',
        relationLabel: 'Linked context',
        impact: null,
        correlation: null
      }, extra || {}));
    }

    addNode({
      id: commodity.id,
      label: commodity.label || meta.shortTitle || 'Commodity',
      type: 'commodity',
      level: 0,
      group: 'market',
      url: meta.url || '',
      sector: meta.sector || '',
      note: meta.description || '',
      relationLabel: 'Current commodity hub'
    });

    levels.forEach(function (level, index) {
      safeArray(level && level.nodes).forEach(function (node) {
        var type = node.type || 'default';
        var parentId = node.parentId || commodity.id;
        addNode({
          id: node.id,
          label: node.label || node.id,
          type: type,
          group: inferGroup(type),
          level: index + 1,
          impact: typeof node.impact === 'number' ? node.impact : null,
          correlation: typeof node.correlation === 'number' ? node.correlation : null,
          sector: node.sector || '',
          relationLabel: node.parentId ? 'Downstream / linked node' : 'Primary local neighbor'
        });
        addLink(parentId, node.id, {
          relation: node.type === 'substitute' ? 'substitute' : 'local',
          relationLabel: node.parentId ? 'Connected through local chain' : 'Primary local connection',
          impact: typeof node.impact === 'number' ? node.impact : null,
          correlation: typeof node.correlation === 'number' ? node.correlation : null,
          weight: 1 + Math.min(2, Math.abs(node.correlation || 0))
        });
      });
    });

    safeArray(meta.substitutes).forEach(function (item) {
      var id = 'companion-' + slugify(item.label);
      addNode({
        id: id,
        label: item.label,
        type: 'substitute',
        group: 'market',
        level: 1,
        url: item.url || '',
        relationLabel: 'Companion commodity hub',
        note: 'Alternative or substitute market to compare against the current commodity.'
      });
      addLink(commodity.id, id, {
        relation: 'substitute',
        relationLabel: 'Compare with substitute or adjacent commodity',
        weight: 1.25
      });
    });

    safeArray(meta.themes).forEach(function (item) {
      var id = 'theme-' + slugify(item.label);
      addNode({
        id: id,
        label: item.label,
        type: 'theme',
        group: 'research',
        level: 1,
        url: item.url || '',
        relationLabel: 'Structural theme',
        note: 'Cross-page theme that frames this commodity in a larger narrative.'
      });
      addLink(commodity.id, id, {
        relation: 'theme',
        relationLabel: 'Theme connected to this commodity',
        weight: 1.1
      });
    });

    safeArray(meta.reports).forEach(function (item, index) {
      var id = 'report-' + slugify(item.title || ('report-' + index));
      addNode({
        id: id,
        label: item.title,
        type: 'report',
        group: 'research',
        level: 1,
        url: item.url || '',
        relationLabel: 'Latest related report',
        note: item.description || '',
        dateLabel: item.date || ''
      });
      addLink(commodity.id, id, {
        relation: 'report',
        relationLabel: 'Published report mentioning this commodity',
        weight: 1.4
      });
    });

    nodes.forEach(function (node) {
      node.degree = links.reduce(function (count, link) {
        var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        var targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return count + (sourceId === node.id || targetId === node.id ? 1 : 0);
      }, 0);
    });

    return {
      nodes: nodes,
      links: links,
      commodityId: commodity.id,
      pageMeta: meta
    };
  }

  function render(container, rawData, pageMeta) {
    var graph = normalizeData(rawData, pageMeta);
    if (!graph) return;
    if (container.dataset.cnGraphReady === '1') return;
    container.dataset.cnGraphReady = '1';

    var allNodes = graph.nodes;
    var allLinks = graph.links;
    var selectedId = graph.commodityId;
    var hoveredId = null;
    var searchTerm = '';
    var filterMode = 'all';
    var resizeObserver = null;

    container.classList.add('cn-local-graph-mount');
    container.innerHTML = [
      '<section class="cn-local-graph-card">',
      '  <div class="cn-local-graph-header">',
      '    <div class="cn-local-graph-intro">',
      '      <span class="cn-local-graph-eyebrow">Knowledge graph</span>',
      '      <h2>Local Node Graph</h2>',
      '      <p>Obsidian-style neighborhood view for ' + escapeHtml(graph.pageMeta.shortTitle || graph.pageMeta.title || 'this hub') + '. Click nodes to inspect relationships, then jump into connected pages and reports.</p>',
      '    </div>',
      '    <div class="cn-local-graph-controls">',
      '      <label class="cn-local-graph-search">',
      '        <span>Search</span>',
      '        <input type="search" placeholder="Search nodes, reports, themes…" aria-label="Search graph nodes">',
      '      </label>',
      '      <div class="cn-local-graph-filters" aria-label="Graph filters">',
      '        <button type="button" data-filter="all" class="is-active">All</button>',
      '        <button type="button" data-filter="market">Markets</button>',
      '        <button type="button" data-filter="company">Companies</button>',
      '        <button type="button" data-filter="macro">Macro</button>',
      '        <button type="button" data-filter="research">Research</button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="cn-local-graph-body">',
      '    <div class="cn-local-graph-canvas-wrap">',
      '      <div class="cn-local-graph-canvas"></div>',
      '      <div class="cn-local-graph-hint">Drag to explore • Scroll to zoom • Double-click a linked note to open it</div>',
      '    </div>',
      '    <aside class="cn-local-graph-panel" aria-live="polite"></aside>',
      '  </div>',
      '  <div class="cn-local-graph-legend">',
      '    <span><i class="market"></i>Commodity & market nodes</span>',
      '    <span><i class="company"></i>Company exposure</span>',
      '    <span><i class="macro"></i>Macro / policy / region</span>',
      '    <span><i class="research"></i>Reports & themes</span>',
      '  </div>',
      '</section>'
    ].join('');

    var card = container.querySelector('.cn-local-graph-card');
    var canvasWrap = card.querySelector('.cn-local-graph-canvas-wrap');
    var canvas = card.querySelector('.cn-local-graph-canvas');
    var panel = card.querySelector('.cn-local-graph-panel');
    var searchInput = card.querySelector('input[type="search"]');
    var filterButtons = Array.prototype.slice.call(card.querySelectorAll('[data-filter]'));

    var colorByGroup = {
      market: '#22d3ee',
      company: '#f59e0b',
      macro: '#a855f7',
      research: '#10b981'
    };

    var typeLabelMap = {
      commodity: 'Commodity',
      substitute: 'Companion commodity',
      producer: 'Producer',
      consumer: 'Consumer',
      supplier: 'Supplier',
      processor: 'Processor',
      etf: 'ETF / fund',
      index: 'Benchmark',
      macro: 'Macro driver',
      policy: 'Policy driver',
      regional: 'Region / supply source',
      fx: 'FX driver',
      freight: 'Freight / logistics',
      report: 'Report',
      theme: 'Theme'
    };

    function passesFilter(node) {
      if (node.id === graph.commodityId) return true;
      var haystack = [node.label, node.sector, node.note, node.type, node.relationLabel, node.dateLabel].join(' ').toLowerCase();
      var matchesFilter = filterMode === 'all' || node.group === filterMode;
      var matchesSearch = !searchTerm || haystack.indexOf(searchTerm) !== -1;
      return matchesFilter && matchesSearch;
    }

    function buildVisibleGraph() {
      var visibleNodes = allNodes.filter(passesFilter);
      var visibleSet = new Set(visibleNodes.map(function (node) { return node.id; }));
      var visibleLinks = allLinks.filter(function (link) {
        var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        var targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return visibleSet.has(sourceId) && visibleSet.has(targetId);
      });
      return { nodes: visibleNodes, links: visibleLinks, visibleSet: visibleSet };
    }

    function neighborSetFor(nodeId, visibleLinks) {
      var related = new Set([nodeId]);
      visibleLinks.forEach(function (link) {
        var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        var targetId = typeof link.target === 'object' ? link.target.id : link.target;
        if (sourceId === nodeId) related.add(targetId);
        if (targetId === nodeId) related.add(sourceId);
      });
      return related;
    }

    function pickNode(nodeId) {
      selectedId = nodeId;
      updatePanel();
      updateHighlight();
    }

    function selectedNode() {
      return allNodes.find(function (node) { return node.id === selectedId; }) || allNodes[0];
    }

    function nodeUrl(node) {
      return node && node.url ? node.url : '';
    }

    function findLinkedResources(node) {
      var results = [];
      if (node.url) results.push({ label: 'Open linked page', url: node.url, tone: 'primary' });
      if (node.id === graph.commodityId) {
        if (graph.pageMeta.url) results.push({ label: 'Open hub page', url: graph.pageMeta.url, tone: 'primary' });
        results.push({ label: 'Open scenario simulator', url: '/simulator/', tone: 'secondary' });
        results.push({ label: 'Browse signal reports', url: '/reports/', tone: 'secondary' });
      } else if (node.type === 'report') {
        results.push({ label: 'Read report', url: node.url, tone: 'primary' });
      } else if (node.type === 'theme') {
        results.push({ label: 'Open theme page', url: node.url, tone: 'primary' });
      } else if (node.type === 'substitute' && node.url) {
        results.push({ label: 'Compare commodity hub', url: node.url, tone: 'primary' });
      }
      return results.filter(function (item, index, arr) {
        return item.url && arr.findIndex(function (candidate) { return candidate.url === item.url; }) === index;
      }).slice(0, 3);
    }

    function connectedNodes(nodeId) {
      var relatedIds = neighborSetFor(nodeId, allLinks);
      relatedIds.delete(nodeId);
      return allNodes.filter(function (node) { return relatedIds.has(node.id); }).sort(function (a, b) {
        return (b.degree || 0) - (a.degree || 0);
      }).slice(0, 8);
    }

    function metricHtml(label, value) {
      return '<div class="cn-local-graph-metric"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
    }

    function updatePanel() {
      var node = selectedNode();
      var typeLabel = typeLabelMap[node.type] || node.type || 'Node';
      var metrics = [
        metricHtml('Node type', typeLabel),
        metricHtml('Connections', String(node.degree || 0))
      ];

      if (typeof node.impact === 'number') metrics.push(metricHtml('Impact score', signedNumber(node.impact)));
      if (typeof node.correlation === 'number') metrics.push(metricHtml('Correlation', node.correlation.toFixed(2)));
      if (node.sector) metrics.push(metricHtml('Sector', node.sector));
      if (node.dateLabel) metrics.push(metricHtml('Date', node.dateLabel));

      var related = connectedNodes(node.id);
      var actions = findLinkedResources(node);
      panel.innerHTML = [
        '<div class="cn-local-graph-panel-top">',
        '  <span class="cn-local-graph-node-pill ' + escapeHtml(node.group) + '">' + escapeHtml(typeLabel) + '</span>',
        '  <h3>' + escapeHtml(node.label) + '</h3>',
        '  <p>' + escapeHtml(node.note || node.relationLabel || defaultDescription(node, graph.pageMeta, graph.commodityId)) + '</p>',
        '</div>',
        '  <div class="cn-local-graph-metrics">' + metrics.join('') + '</div>',
        actions.length ? '  <div class="cn-local-graph-actions">' + actions.map(function (action) {
          return '<a class="' + (action.tone === 'primary' ? 'primary' : 'secondary') + '" href="' + escapeAttribute(action.url) + '">' + escapeHtml(action.label) + '</a>';
        }).join('') + '</div>' : '',
        '  <div class="cn-local-graph-neighbors">',
        '    <div class="cn-local-graph-neighbors-head">Direct connections</div>',
        related.length ? related.map(function (item) {
          return '<button type="button" data-node-jump="' + escapeAttribute(item.id) + '"><span>' + escapeHtml(item.label) + '</span><small>' + escapeHtml(typeLabelMap[item.type] || item.type || 'Node') + '</small></button>';
        }).join('') : '<div class="cn-local-graph-empty">No direct neighbors in the current filtered view.</div>',
        '  </div>'
      ].join('');

      Array.prototype.slice.call(panel.querySelectorAll('[data-node-jump]')).forEach(function (button) {
        button.addEventListener('click', function () {
          pickNode(button.getAttribute('data-node-jump'));
        });
      });
    }

    var visibleGraph = buildVisibleGraph();
    var width = Math.max(540, canvasWrap.clientWidth || 720);
    var height = Math.max(480, Math.min(760, window.innerHeight * 0.7));

    var svg = d3.select(canvas)
      .append('svg')
      .attr('class', 'cn-local-graph-svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    var defs = svg.append('defs');
    Object.keys(colorByGroup).forEach(function (key) {
      var filter = defs.append('filter').attr('id', 'cn-glow-' + key).attr('x', '-80%').attr('y', '-80%').attr('width', '260%').attr('height', '260%');
      filter.append('feGaussianBlur').attr('stdDeviation', 6).attr('result', 'blur');
      var merge = filter.append('feMerge');
      merge.append('feMergeNode').attr('in', 'blur');
      merge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    var root = svg.append('g');
    var background = root.append('g').attr('class', 'cn-local-graph-bg');
    var linksLayer = root.append('g').attr('class', 'cn-local-graph-links');
    var nodesLayer = root.append('g').attr('class', 'cn-local-graph-nodes');
    var labelsLayer = root.append('g').attr('class', 'cn-local-graph-labels');

    for (var gx = 24; gx < width; gx += 32) {
      for (var gy = 24; gy < height; gy += 32) {
        background.append('circle')
          .attr('cx', gx)
          .attr('cy', gy)
          .attr('r', ((gx + gy) % 4 === 0) ? 1.3 : 0.8)
          .attr('fill', 'rgba(148,163,184,0.12)');
      }
    }

    var zoom = d3.zoom().scaleExtent([0.65, 2.4]).on('zoom', function (event) {
      root.attr('transform', event.transform);
    });
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));

    var simulation;
    var linkSelection;
    var nodeSelection;
    var labelSelection;

    function nodeRadius(node) {
      if (node.id === graph.commodityId) return 18;
      var degreeBoost = Math.min(8, (node.degree || 0) * 0.9);
      var impactBoost = typeof node.impact === 'number' ? Math.min(6, Math.abs(node.impact) * 0.25) : 0;
      return 8 + degreeBoost + impactBoost;
    }

    function truncateLabel(label, maxLength) {
      var text = String(label || '');
      return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
    }

    function relayout() {
      visibleGraph = buildVisibleGraph();
      if (selectedId && !visibleGraph.visibleSet.has(selectedId)) selectedId = graph.commodityId;

      width = Math.max(540, canvasWrap.clientWidth || 720);
      height = Math.max(480, Math.min(760, window.innerHeight * 0.7));
      svg.attr('viewBox', '0 0 ' + width + ' ' + height);

      if (simulation) simulation.stop();

      var nodes = visibleGraph.nodes.map(function (node) { return Object.assign({}, node); });
      var links = visibleGraph.links.map(function (link) { return Object.assign({}, link); });

      simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(function (d) { return d.id; }).distance(function (d) {
          return d.relation === 'report' ? 120 : d.relation === 'theme' ? 140 : 96 + Math.max(0, (d.weight || 1) * 12);
        }).strength(function (d) {
          return d.relation === 'report' ? 0.7 : 0.45;
        }))
        .force('charge', d3.forceManyBody().strength(function (d) {
          return d.id === graph.commodityId ? -600 : -280;
        }))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function (d) { return nodeRadius(d) + 24; }).iterations(2))
        .force('radial', d3.forceRadial(function (d) {
          if (d.id === graph.commodityId) return 0;
          if (d.group === 'research') return Math.min(width, height) * 0.22;
          if (d.group === 'macro') return Math.min(width, height) * 0.28;
          return Math.min(width, height) * 0.18;
        }, width / 2, height / 2).strength(0.12));

      linkSelection = linksLayer.selectAll('line').data(links, function (d) { return d.id; });
      linkSelection.exit().remove();
      linkSelection = linkSelection.enter().append('line').merge(linkSelection)
        .attr('class', 'cn-local-graph-link')
        .attr('stroke-width', function (d) { return 1 + Math.min(2.5, d.weight || 1); });

      nodeSelection = nodesLayer.selectAll('circle').data(nodes, function (d) { return d.id; });
      nodeSelection.exit().remove();
      nodeSelection = nodeSelection.enter().append('circle').merge(nodeSelection)
        .attr('class', 'cn-local-graph-node')
        .attr('r', nodeRadius)
        .attr('fill', function (d) { return colorByGroup[d.group] || '#94a3b8'; })
        .attr('filter', function (d) { return 'url(#cn-glow-' + (d.group || 'market') + ')'; })
        .call(d3.drag()
          .on('start', function (event, d) {
            if (!event.active) simulation.alphaTarget(0.18).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', function (event, d) {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', function (event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }))
        .on('mouseenter', function (_, d) {
          hoveredId = d.id;
          updateHighlight();
        })
        .on('mouseleave', function () {
          hoveredId = null;
          updateHighlight();
        })
        .on('click', function (_, d) {
          pickNode(d.id);
        })
        .on('dblclick', function (_, d) {
          var url = nodeUrl(d);
          if (url) window.location.href = url;
        });

      labelSelection = labelsLayer.selectAll('text').data(nodes, function (d) { return d.id; });
      labelSelection.exit().remove();
      labelSelection = labelSelection.enter().append('text').merge(labelSelection)
        .attr('class', 'cn-local-graph-label')
        .attr('text-anchor', 'middle')
        .attr('dy', function (d) { return nodeRadius(d) + 18; })
        .text(function (d) { return truncateLabel(d.label, d.id === graph.commodityId ? 26 : 22); });

      simulation.on('tick', function () {
        linkSelection
          .attr('x1', function (d) { return d.source.x; })
          .attr('y1', function (d) { return d.source.y; })
          .attr('x2', function (d) { return d.target.x; })
          .attr('y2', function (d) { return d.target.y; });

        nodeSelection
          .attr('cx', function (d) { return d.x; })
          .attr('cy', function (d) { return d.y; });

        labelSelection
          .attr('x', function (d) { return d.x; })
          .attr('y', function (d) { return d.y; });
      });

      updateHighlight();
      updatePanel();
    }

    function updateHighlight() {
      if (!nodeSelection || !linkSelection || !labelSelection) return;
      var focusId = hoveredId || selectedId;
      var visibleLinks = visibleGraph.links;
      var related = focusId ? neighborSetFor(focusId, visibleLinks) : new Set();

      nodeSelection
        .attr('stroke', function (d) { return d.id === selectedId ? '#f8fafc' : 'rgba(248,250,252,0.18)'; })
        .attr('stroke-width', function (d) { return d.id === selectedId ? 2.6 : 1.1; })
        .attr('opacity', function (d) {
          if (!focusId) return 1;
          return related.has(d.id) ? 1 : 0.22;
        });

      labelSelection
        .attr('opacity', function (d) {
          if (!focusId) return 0.9;
          return related.has(d.id) ? 1 : 0.14;
        })
        .attr('font-weight', function (d) { return d.id === selectedId ? 700 : 500; });

      linkSelection
        .attr('stroke', function (d) {
          var sourceId = typeof d.source === 'object' ? d.source.id : d.source;
          var targetId = typeof d.target === 'object' ? d.target.id : d.target;
          var connected = focusId && (sourceId === focusId || targetId === focusId);
          if (connected && d.relation === 'report') return 'rgba(16,185,129,0.95)';
          if (connected && d.relation === 'theme') return 'rgba(168,85,247,0.95)';
          if (connected && d.relation === 'substitute') return 'rgba(245,158,11,0.95)';
          if (connected) return 'rgba(34,211,238,0.95)';
          return 'rgba(148,163,184,0.18)';
        })
        .attr('opacity', function (d) {
          if (!focusId) return 0.42;
          var sourceId = typeof d.source === 'object' ? d.source.id : d.source;
          var targetId = typeof d.target === 'object' ? d.target.id : d.target;
          return sourceId === focusId || targetId === focusId ? 1 : 0.12;
        });
    }

    searchInput.addEventListener('input', function () {
      searchTerm = String(searchInput.value || '').trim().toLowerCase();
      relayout();
    });

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterMode = button.getAttribute('data-filter') || 'all';
        filterButtons.forEach(function (candidate) {
          candidate.classList.toggle('is-active', candidate === button);
        });
        relayout();
      });
    });

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(function () {
        relayout();
      });
      resizeObserver.observe(canvasWrap);
    } else {
      window.addEventListener('resize', relayout);
    }

    relayout();
  }

  function renderFallback(container, meta) {
    container.classList.add('cn-local-graph-mount');
    container.innerHTML = [
      '<section class="cn-local-graph-card">',
      '  <div class="cn-local-graph-intro">',
      '    <span class="cn-local-graph-eyebrow">Knowledge graph</span>',
      '    <h2>Local Node Graph</h2>',
      '    <p>Graph rendering is temporarily unavailable, but you can still explore the core linked resources for ' + escapeHtml(meta.shortTitle || meta.title || 'this hub') + '.</p>',
      '  </div>',
      '  <div class="cn-local-graph-actions" style="margin-top:18px;">',
      meta.url ? ('<a class="primary" href="' + escapeAttribute(meta.url) + '">Open hub page</a>') : '',
      '<a class="secondary" href="/reports/">Browse signal reports</a>',
      '<a class="secondary" href="/simulator/">Open scenario simulator</a>',
      '  </div>',
      '</section>'
    ].join('');
  }

  function boot() {
    bootAttempts += 1;
    if (bootAttempts > 80) return;

    if (!window.COMMODITY_GRAPH_DISABLE_LEGACY || !window.COMMODITY_DATA) return;

    var containers = document.querySelectorAll('#impact-graph');
    if (!containers.length) return;

    if (typeof window.d3 === 'undefined') {
      if (bootAttempts < 20) {
        setTimeout(boot, 80);
        return;
      }
      containers.forEach(function (container) {
        if (!container.dataset.cnGraphReady) renderFallback(container, window.COMMODITY_PAGE_META || {});
      });
      return;
    }

    containers.forEach(function (container) {
      render(container, window.COMMODITY_DATA, window.COMMODITY_PAGE_META || {});
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', function () { setTimeout(boot, 150); });
})();