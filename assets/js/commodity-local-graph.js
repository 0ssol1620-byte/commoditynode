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
    var isMobile = (container.clientWidth || window.innerWidth) <= 720 || window.innerWidth <= 720;

    function syncContainerHeight() {
      if (!sectionEl) return;
      var nextHeight = Math.ceil(sectionEl.getBoundingClientRect().height || sectionEl.offsetHeight || 0);
      if (!nextHeight) return;
      container.style.minHeight = nextHeight + 'px';
      container.style.height = nextHeight + 'px';
    }

    function syncCardMode() {
      if (!sectionEl) return;
      sectionEl.classList.toggle('is-mobile', !!isMobile);
      sectionEl.classList.toggle('is-desktop', !isMobile);
    }

    function cleanDisplayTitle(value) {
      return String(value || '')
        .replace(/\s*\([^)]*\)\s*/g, ' ')
        .replace(/\s*price impact\s*/i, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    var graphDisplayTitle = cleanDisplayTitle((graph.pageMeta && graph.pageMeta.shortTitle) || (graph.pageMeta && graph.pageMeta.title) || (rawData.commodity && rawData.commodity.label) || graph.commodityId);

    container.classList.add('cn-local-graph-mount');
    container.innerHTML = [
      '<section class="cn-local-graph-section">',
      '  <div class="cn-local-graph-header">',
      '    <div class="cn-local-graph-intro">',
      '      <span class="cn-local-graph-eyebrow">Knowledge graph</span>',
      '      <h2>Local Knowledge Map</h2>',
      '      <p>Obsidian-inspired neighborhood view for ' + escapeHtml(graphDisplayTitle || 'this hub') + '. Follow the immediate relationships, inspect connected entities, and branch into linked reports without leaving the page.</p>',
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
      '      <div class="cn-local-graph-hint">' + (isMobile ? 'Tap a node to focus • Drag to explore • Pinch to zoom' : 'Drag to explore • Scroll to zoom • Double-click a linked note to open it') + '</div>',
      '    </div>',
      '    <section class="cn-local-graph-panel" aria-live="polite"></section>',
      '  </div>',
      '  <div class="cn-local-graph-legend">',
      '    <span><i class="market"></i>Commodity & market nodes</span>',
      '    <span><i class="company"></i>Company exposure</span>',
      '    <span><i class="macro"></i>Macro / policy / region</span>',
      '    <span><i class="research"></i>Reports & themes</span>',
      '    <span class="cn-local-graph-legend-meta">Click a node to focus the network · Double-click linked notes to open</span>',
      '  </div>',
      '</section>'
    ].join('');

    var sectionEl = container.querySelector('.cn-local-graph-section');
    var canvasWrap = sectionEl.querySelector('.cn-local-graph-canvas-wrap');
    var canvas = sectionEl.querySelector('.cn-local-graph-canvas');
    var panel = sectionEl.querySelector('.cn-local-graph-panel');
    var searchInput = sectionEl.querySelector('input[type="search"]');
    var filterButtons = Array.prototype.slice.call(sectionEl.querySelectorAll('[data-filter]'));

    syncCardMode();

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

      if (isMobile && !searchTerm) {
        var centerId = graph.commodityId;
        var scoreNode = function (node) {
          var base = node.id === centerId ? 999 : 0;
          var impact = typeof node.impact === 'number' ? Math.abs(node.impact) : 0;
          var degree = node.degree || 0;
          var levelBonus = node.level === 1 ? 12 : node.level === 2 ? 7 : node.level === 3 ? 3 : 0;
          var researchPenalty = node.group === 'research' ? -1 : 0;
          return base + degree * 3 + impact * 1.2 + levelBonus + researchPenalty;
        };

        var compactLimit = filterMode === 'all' ? 14 : filterMode === 'research' ? 8 : filterMode === 'company' ? 10 : 9;
        var compactNodes = visibleNodes
          .slice()
          .sort(function (a, b) { return scoreNode(b) - scoreNode(a); })
          .slice(0, compactLimit);

        var compactSet = new Set(compactNodes.map(function (node) { return node.id; }));
        compactSet.add(centerId);

        visibleLinks.forEach(function (link) {
          var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          var targetId = typeof link.target === 'object' ? link.target.id : link.target;
          if (sourceId === centerId || targetId === centerId) {
            compactSet.add(sourceId);
            compactSet.add(targetId);
          }
        });

        visibleNodes = visibleNodes.filter(function (node) { return compactSet.has(node.id); });
        visibleLinks = visibleLinks.filter(function (link) {
          var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          var targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return compactSet.has(sourceId) && compactSet.has(targetId);
        });
        visibleSet = compactSet;
      }

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
      }).slice(0, isMobile ? 6 : 8);
    }

    function directConnections(nodeId) {
      return allLinks.filter(function (link) {
        var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        var targetId = typeof link.target === 'object' ? link.target.id : link.target;
        return sourceId === nodeId || targetId === nodeId;
      }).map(function (link) {
        var sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        var targetId = typeof link.target === 'object' ? link.target.id : link.target;
        var counterpartId = sourceId === nodeId ? targetId : sourceId;
        var counterpart = allNodes.find(function (node) { return node.id === counterpartId; });
        return {
          link: link,
          node: counterpart,
          counterpartId: counterpartId,
          isIncoming: targetId === nodeId,
          isOutgoing: sourceId === nodeId
        };
      }).filter(function (item) {
        return !!item.node;
      }).sort(function (a, b) {
        var aWeight = Number((a.link && a.link.weight) || 0) + Number((a.node && a.node.degree) || 0);
        var bWeight = Number((b.link && b.link.weight) || 0) + Number((b.node && b.node.degree) || 0);
        return bWeight - aWeight;
      });
    }

    function relationTone(relation) {
      if (relation === 'report') return 'research';
      if (relation === 'theme') return 'macro';
      if (relation === 'substitute') return 'company';
      return 'market';
    }

    function relationVerb(item) {
      if (!item) return 'connected to';
      var relation = item.link && item.link.relation;
      if (relation === 'report') return item.isOutgoing ? 'documented in' : 'documents';
      if (relation === 'theme') return item.isOutgoing ? 'framed by' : 'frames';
      if (relation === 'substitute') return 'compared with';
      return item.isOutgoing ? 'connects to' : 'is linked from';
    }

    function focusPath(node) {
      if (!node) return null;
      if (node.id === graph.commodityId) {
        return {
          title: 'Hub anchor',
          description: 'This is the center of the local map. Every visible branch radiates from this commodity context.'
        };
      }

      var connections = directConnections(node.id);
      var primary = connections.find(function (item) { return item.counterpartId === graph.commodityId; }) || connections[0];
      if (!primary || !primary.node) return null;

      return {
        title: cleanDisplayTitle(graphDisplayTitle || selectedNode().label) + ' → ' + cleanDisplayTitle(node.label),
        description: cleanDisplayTitle(node.label) + ' ' + relationVerb(primary) + ' ' + cleanDisplayTitle(primary.node.label) + (primary.link && primary.link.relationLabel ? ' via ' + primary.link.relationLabel.toLowerCase() : '.')
      };
    }

    function nodeInsight(node, related) {
      var count = related.length;
      var strongest = related[0];
      if (node.id === graph.commodityId) {
        return 'Use this hub as the anchor. It currently fans out into ' + count + ' direct branches across markets, companies, macro drivers, and research notes.';
      }
      if (node.type === 'report') {
        return 'This report node is narrative context. Use it when you need the freshest explanation behind the price move, then jump back to the hub for live market state.';
      }
      if (node.type === 'theme') {
        return 'This theme node groups the structural narrative around the commodity so you can move from a one-day move to the bigger regime story.';
      }
      if (node.type === 'substitute') {
        return 'This companion market is best used as a cross-check when the selected commodity move may spill into adjacent chains.';
      }
      if (node.group === 'company') {
        return cleanDisplayTitle(node.label) + ' is an exposure node. Compare it against the hub and nearby companies to see whether the move is upstream, downstream, or margin-sensitive.';
      }
      if (node.group === 'macro') {
        return cleanDisplayTitle(node.label) + ' is a macro driver. Use it to interpret whether this neighborhood is being pushed by policy, region, FX, or broader risk repricing.';
      }
      return strongest
        ? cleanDisplayTitle(node.label) + ' currently sits closest to ' + cleanDisplayTitle(strongest.label) + ' inside this filtered neighborhood.'
        : cleanDisplayTitle(node.label) + ' is currently isolated inside this filtered neighborhood.';
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
      var direct = directConnections(node.id).slice(0, isMobile ? 4 : 5);
      var actions = findLinkedResources(node);
      var path = focusPath(node);
      var insight = nodeInsight(node, related);
      panel.innerHTML = [
        '<div class="cn-local-graph-panel-top">',
        '  <div class="cn-local-graph-panel-kicker">Selected context</div>',
        '  <span class="cn-local-graph-node-pill ' + escapeHtml(node.group) + '">' + escapeHtml(typeLabel) + '</span>',
        '  <h3>' + escapeHtml(node.label) + '</h3>',
        '  <p>' + escapeHtml(node.note || node.relationLabel || defaultDescription(node, graph.pageMeta, graph.commodityId)) + '</p>',
        '</div>',
        insight ? '  <div class="cn-local-graph-insight"><span>What this view means</span><p>' + escapeHtml(insight) + '</p></div>' : '',
        path ? '  <div class="cn-local-graph-path"><span>Current path</span><strong>' + escapeHtml(path.title) + '</strong><p>' + escapeHtml(path.description) + '</p></div>' : '',
        '  <div class="cn-local-graph-metrics">' + metrics.join('') + '</div>',
        actions.length ? '  <div class="cn-local-graph-actions">' + actions.map(function (action) {
          return '<a class="' + (action.tone === 'primary' ? 'primary' : 'secondary') + '" href="' + escapeAttribute(action.url) + '">' + escapeHtml(action.label) + '</a>';
        }).join('') + '</div>' : '',
        '  <div class="cn-local-graph-relations">',
        '    <div class="cn-local-graph-neighbors-head">Relationship cues</div>',
        direct.length ? direct.map(function (item) {
          var relationLabel = item.link && item.link.relationLabel ? item.link.relationLabel : 'Linked context';
          var relationMeta = [relationVerb(item), typeLabelMap[item.node.type] || item.node.type || 'Node'];
          if (typeof item.link.correlation === 'number') relationMeta.push('corr ' + item.link.correlation.toFixed(2));
          return '<div class="cn-local-graph-relation-row"><i class="' + escapeHtml(relationTone(item.link && item.link.relation)) + '"></i><div><strong>' + escapeHtml(item.node.label) + '</strong><small>' + escapeHtml(relationLabel) + ' · ' + escapeHtml(relationMeta.join(' · ')) + '</small></div></div>';
        }).join('') : '<div class="cn-local-graph-empty">No direct relationship details are available in the current filtered view.</div>',
        '  </div>',
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
      requestAnimationFrame(syncContainerHeight);
    }

    var visibleGraph = buildVisibleGraph();
    var width = Math.max(280, Math.floor(canvasWrap.clientWidth || canvas.clientWidth || container.clientWidth || window.innerWidth - 32));
    var height = isMobile
      ? Math.max(460, Math.min(620, Math.round(width * 1.16)))
      : Math.max(480, Math.min(760, window.innerHeight * 0.7));

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
      if (node.id === graph.commodityId) return isMobile ? 13 : 16;
      var degreeBoost = Math.min(isMobile ? 4 : 6, (node.degree || 0) * (isMobile ? 0.5 : 0.7));
      var impactBoost = typeof node.impact === 'number' ? Math.min(isMobile ? 2.8 : 4.5, Math.abs(node.impact) * (isMobile ? 0.12 : 0.16)) : 0;
      return (isMobile ? 5.2 : 6.6) + degreeBoost + impactBoost;
    }

    function truncateLabel(label, maxLength) {
      var text = String(label || '');
      return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
    }

    function computeMobileLabelIds(nodes, links) {
      var focusId = hoveredId || selectedId || graph.commodityId;
      var keep = new Set([graph.commodityId]);
      if (focusId) keep.add(focusId);

      var focusNeighbors = neighborSetFor(focusId, links);
      var primaryNeighbors = nodes.filter(function (node) {
        if (node.id === graph.commodityId || node.id === focusId) return false;
        if (!focusNeighbors.has(node.id)) return false;
        if (node.group === 'research' && node.id !== focusId) return false;
        return node.level <= 1;
      }).sort(function (a, b) {
        var aScore = (a.degree || 0) + (typeof a.impact === 'number' ? Math.abs(a.impact) : 0) + (a.level === 1 ? 5 : 0);
        var bScore = (b.degree || 0) + (typeof b.impact === 'number' ? Math.abs(b.impact) : 0) + (b.level === 1 ? 5 : 0);
        return bScore - aScore;
      });

      primaryNeighbors.slice(0, focusId === graph.commodityId ? 2 : 1).forEach(function (node) {
        keep.add(node.id);
      });

      if (focusId !== graph.commodityId) {
        nodes.filter(function (node) {
          return node.id !== graph.commodityId && node.id !== focusId && focusNeighbors.has(node.id) && node.level <= 1;
        }).sort(function (a, b) {
          return (b.degree || 0) - (a.degree || 0);
        }).slice(0, 1).forEach(function (node) {
          keep.add(node.id);
        });
      }

      return keep;
    }

    function computeDesktopLabelIds(nodes, links) {
      var focusId = hoveredId || selectedId || graph.commodityId;
      var keep = new Set([graph.commodityId]);
      if (focusId) keep.add(focusId);

      nodes.slice().sort(function (a, b) {
        var aScore = (a.degree || 0) * 2 + (typeof a.impact === 'number' ? Math.abs(a.impact) : 0) + (a.level === 1 ? 8 : 0);
        var bScore = (b.degree || 0) * 2 + (typeof b.impact === 'number' ? Math.abs(b.impact) : 0) + (b.level === 1 ? 8 : 0);
        return bScore - aScore;
      }).slice(0, 18).forEach(function (node) {
        keep.add(node.id);
      });

      neighborSetFor(focusId, links).forEach(function (nodeId) {
        keep.add(nodeId);
      });

      return keep;
    }

    function refreshLabelText() {
      if (!labelSelection) return;
      var mobileLabelIds = isMobile ? computeMobileLabelIds(visibleGraph.nodes, visibleGraph.links) : null;
      var desktopLabelIds = !isMobile ? computeDesktopLabelIds(visibleGraph.nodes, visibleGraph.links) : null;
      labelSelection.text(function (d) {
        if (isMobile && mobileLabelIds && !mobileLabelIds.has(d.id)) return '';
        if (!isMobile && desktopLabelIds && !desktopLabelIds.has(d.id)) return '';
        return truncateLabel(d.label, d.id === graph.commodityId ? (isMobile ? 12 : 26) : (isMobile ? 9 : 20));
      });
    }

    function relayout() {
      visibleGraph = buildVisibleGraph();
      if (selectedId && !visibleGraph.visibleSet.has(selectedId)) selectedId = graph.commodityId;

      width = Math.max(280, Math.floor(canvasWrap.clientWidth || canvas.clientWidth || container.clientWidth || window.innerWidth - 32));
      isMobile = width <= 720 || window.innerWidth <= 720;
      syncCardMode();
      height = isMobile
        ? Math.max(460, Math.min(620, Math.round(width * 1.16)))
        : Math.max(480, Math.min(760, window.innerHeight * 0.7));
      svg.attr('viewBox', '0 0 ' + width + ' ' + height);

      if (simulation) simulation.stop();

      var nodes = visibleGraph.nodes.map(function (node) { return Object.assign({}, node); });
      var links = visibleGraph.links.map(function (link) { return Object.assign({}, link); });

      simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(function (d) { return d.id; }).distance(function (d) {
          if (isMobile) {
            return d.relation === 'report' ? 96 : d.relation === 'theme' ? 108 : 76 + Math.max(0, (d.weight || 1) * 8);
          }
          return d.relation === 'report' ? 106 : d.relation === 'theme' ? 118 : 82 + Math.max(0, (d.weight || 1) * 10);
        }).strength(function (d) {
          return d.relation === 'report' ? 0.56 : 0.34;
        }))
        .force('charge', d3.forceManyBody().strength(function (d) {
          if (isMobile) return d.id === graph.commodityId ? -360 : -136;
          return d.id === graph.commodityId ? -460 : -188;
        }))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(function (d) { return nodeRadius(d) + (isMobile ? 16 : 18); }).iterations(isMobile ? 3 : 2))
        .force('x', d3.forceX(function (d) {
          if (d.id === graph.commodityId) return width / 2;
          if (d.group === 'research') return width * 0.78;
          if (d.group === 'macro') return width * 0.22;
          if (d.group === 'company') return width * 0.62;
          return width * 0.38;
        }).strength(isMobile ? 0.04 : 0.035))
        .force('y', d3.forceY(function (d) {
          if (d.id === graph.commodityId) return height / 2;
          if (d.group === 'research') return height * 0.72;
          if (d.group === 'macro') return height * 0.3;
          return height * 0.52;
        }).strength(isMobile ? 0.04 : 0.03))
        .force('radial', d3.forceRadial(function (d) {
          if (d.id === graph.commodityId) return 0;
          if (d.group === 'research') return Math.min(width, height) * (isMobile ? 0.29 : 0.2);
          if (d.group === 'macro') return Math.min(width, height) * (isMobile ? 0.26 : 0.19);
          return Math.min(width, height) * (isMobile ? 0.2 : 0.14);
        }, width / 2, height / 2).strength(isMobile ? 0.06 : 0.055));

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
        .attr('dy', function (d) { return nodeRadius(d) + (isMobile ? 12 : 16); });
      refreshLabelText();

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
      requestAnimationFrame(syncContainerHeight);
    }

    function updateHighlight() {
      if (!nodeSelection || !linkSelection || !labelSelection) return;
      var focusId = hoveredId || selectedId;
      var visibleLinks = visibleGraph.links;
      var related = focusId ? neighborSetFor(focusId, visibleLinks) : new Set();

      nodeSelection
        .attr('stroke', function (d) {
          if (d.id === selectedId) return '#f8fafc';
          if (focusId && related.has(d.id)) return 'rgba(226,232,240,0.42)';
          return 'rgba(248,250,252,0.14)';
        })
        .attr('stroke-width', function (d) { return d.id === selectedId ? 3 : (focusId && related.has(d.id) ? 1.5 : 1); })
        .attr('opacity', function (d) {
          if (!focusId) return 1;
          return related.has(d.id) ? 1 : 0.22;
        });

      labelSelection
        .attr('opacity', function (d) {
          if (!focusId) return isMobile ? (d.id === graph.commodityId ? 1 : 0.3) : 0.9;
          if (!related.has(d.id)) return isMobile ? 0 : 0.14;
          if (!isMobile) return 1;
          return (d.id === graph.commodityId || d.id === selectedId || d.level <= 1) ? 1 : 0.58;
        })
        .attr('font-weight', function (d) { return d.id === selectedId ? 700 : 500; });
      refreshLabelText();

      linkSelection
        .attr('stroke', function (d) {
          var sourceId = typeof d.source === 'object' ? d.source.id : d.source;
          var targetId = typeof d.target === 'object' ? d.target.id : d.target;
          var connected = focusId && (sourceId === focusId || targetId === focusId);
          if (connected && d.relation === 'report') return 'rgba(110,231,183,0.92)';
          if (connected && d.relation === 'theme') return 'rgba(196,181,253,0.9)';
          if (connected && d.relation === 'substitute') return 'rgba(251,191,36,0.88)';
          if (connected) return 'rgba(125,211,252,0.92)';
          return 'rgba(148,163,184,0.22)';
        })
        .attr('opacity', function (d) {
          if (!focusId) return 0.32;
          var sourceId = typeof d.source === 'object' ? d.source.id : d.source;
          var targetId = typeof d.target === 'object' ? d.target.id : d.target;
          return sourceId === focusId || targetId === focusId ? 0.95 : 0.08;
        })
        .attr('stroke-width', function (d) {
          var sourceId = typeof d.source === 'object' ? d.source.id : d.source;
          var targetId = typeof d.target === 'object' ? d.target.id : d.target;
          var connected = focusId && (sourceId === focusId || targetId === focusId);
          return connected ? 2.6 + Math.min(1.6, (d.weight || 1) * 0.5) : 1 + Math.min(1.4, (d.weight || 1) * 0.4);
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
      resizeObserver.observe(sectionEl);
    } else {
      window.addEventListener('resize', relayout);
    }

    relayout();
    requestAnimationFrame(syncContainerHeight);
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