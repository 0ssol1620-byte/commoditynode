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

    safeArray(meta.companies).forEach(function (item) {
      var ticker = String(item && item.label || '').trim();
      if (!ticker) return;
      var matchedNode = nodes.find(function (node) {
        if (node.group !== 'company') return false;
        var label = String(node.label || '');
        return label === ticker || label.indexOf('(' + ticker + ')') !== -1 || label.indexOf(ticker + ' ') === 0;
      });

      if (matchedNode) {
        if (!matchedNode.url && item.url) matchedNode.url = item.url;
        if (!matchedNode.note) matchedNode.note = 'Representative company exposure linked from the hub metadata.';
        if (!matchedNode.relationLabel) matchedNode.relationLabel = 'Representative company';
        return;
      }

      var companyId = 'company-' + slugify(ticker);
      addNode({
        id: companyId,
        label: ticker,
        type: 'producer',
        group: 'company',
        level: 1,
        url: item.url || '',
        relationLabel: 'Representative company',
        note: 'Representative public company linked from the hub metadata.'
      });
      addLink(commodity.id, companyId, {
        relation: 'company',
        relationLabel: 'Representative company tied to this commodity hub',
        weight: 1.35
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
    var orbitGroupFocus = 'all';
    var resizeObserver = null;
    var refreshVisualization = function () {};
    var universeApi = null;
    var isMobile = (container.clientWidth || window.innerWidth) <= 720 || window.innerWidth <= 720;

    function refreshViewportMode() {
      isMobile = (container.clientWidth || window.innerWidth) <= 720 || window.innerWidth <= 720;
    }

    function syncContainerHeight() {
      if (!sectionEl) return;
      var nextHeight = Math.ceil(sectionEl.getBoundingClientRect().height || sectionEl.offsetHeight || 0);
      if (!nextHeight) return;
      container.style.minHeight = nextHeight + 'px';
      container.style.height = nextHeight + 'px';
    }

    function syncPanelHeight() {
      refreshViewportMode();
      if (!panel) return;
      if (isMobile) {
        panel.style.maxHeight = 'none';
        panel.style.overflowY = 'visible';
        return;
      }
      var targetHeight = 0;
      if (canvasWrap) {
        targetHeight = Math.ceil(canvasWrap.getBoundingClientRect().height || canvasWrap.offsetHeight || 0);
      }
      if (!targetHeight) {
        panel.style.maxHeight = 'none';
        panel.style.overflowY = 'visible';
        return;
      }
      panel.style.maxHeight = targetHeight + 'px';
      panel.style.overflowY = 'auto';
    }

    function syncCardMode() {
      refreshViewportMode();
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
      '      <span class="cn-local-graph-eyebrow">3D knowledge graph</span>',
      '      <h2>Local Universe View</h2>',
      '      <p>Cinematic 3D hub universe for ' + escapeHtml(graphDisplayTitle || 'this hub') + '. Orbit through the immediate relationships, focus key entities, and branch into linked reports from a premium market-intelligence view.</p>',
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
      '    <span class="cn-local-graph-legend-meta">Tap or click a node to focus the 3D hub · Drag to orbit · Scroll or pinch to zoom</span>',
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
      refreshVisualization();
      if (universeApi && typeof universeApi.focusSatelliteNode === 'function') universeApi.focusSatelliteNode(nodeId);
      if (typeof updateHighlight === 'function') updateHighlight();
    }

    function focusMatchedNodes() {
      return allNodes.filter(function (node) {
        if (node.id === graph.commodityId) return false;
        return orbitGroupFocus === 'all' || node.group === orbitGroupFocus;
      }).sort(function (a, b) {
        return ((b.degree || 0) + (typeof b.impact === 'number' ? Math.abs(b.impact) : 0)) - ((a.degree || 0) + (typeof a.impact === 'number' ? Math.abs(a.impact) : 0));
      });
    }

    function cycleFocusNode(step) {
      var matches = focusMatchedNodes();
      if (!matches.length) return;
      var currentIndex = matches.findIndex(function (node) { return node.id === selectedId; });
      var nextIndex = currentIndex === -1 ? 0 : (currentIndex + step + matches.length) % matches.length;
      pickNode(matches[nextIndex].id);
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
        function score(node) {
          var degree = (node.degree || 0) * 2;
          var impact = typeof node.impact === 'number' ? Math.abs(node.impact) : 0;
          var researchBoost = node.group === 'research' ? 18 : 0;
          var companyBoost = node.group === 'company' ? 10 : 0;
          var themeBoost = node.type === 'theme' ? 12 : 0;
          var reportBoost = node.type === 'report' ? 8 : 0;
          return degree + impact + researchBoost + companyBoost + themeBoost + reportBoost;
        }
        return score(b) - score(a);
      }).slice(0, isMobile ? 8 : 12);
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
      var direct = directConnections(node.id).slice(0, isMobile ? 5 : 7);
      var actions = findLinkedResources(node);
      var path = focusPath(node);
      var insight = nodeInsight(node, related);
      var orbitMatches = focusMatchedNodes();
      panel.innerHTML = [
        '<div class="cn-local-graph-panel-top">',
        '  <div class="cn-local-graph-panel-kicker">Selected context</div>',
        '  <span class="cn-local-graph-node-pill ' + escapeHtml(node.group) + '">' + escapeHtml(typeLabel) + '</span>',
        '  <h3>' + escapeHtml(node.label) + '</h3>',
        '  <p>' + escapeHtml(node.note || node.relationLabel || defaultDescription(node, graph.pageMeta, graph.commodityId)) + '</p>',
        '</div>',
        '  <div class="cn-local-graph-insight"><span>Orbit focus</span><p>' + escapeHtml('Type: ' + (orbitGroupFocus === 'all' ? 'all satellites' : orbitGroupFocus) + ' · ' + orbitMatches.length + ' nodes in current orbit set.') + '</p></div>',
        insight ? '  <div class="cn-local-graph-insight"><span>What this view means</span><p>' + escapeHtml(insight) + '</p></div>' : '',
        path ? '  <div class="cn-local-graph-path"><span>Current path</span><strong>' + escapeHtml(path.title) + '</strong><p>' + escapeHtml(path.description) + '</p></div>' : '',
        '  <div class="cn-local-graph-actions cn-local-graph-orbit-nav"><button type="button" class="secondary" data-orbit-nav="prev">◀ Previous in orbit</button><button type="button" class="secondary" data-orbit-nav="next">Next in orbit ▶</button></div>',
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
      Array.prototype.slice.call(panel.querySelectorAll('[data-orbit-nav]')).forEach(function (button) {
        button.addEventListener('click', function () {
          cycleFocusNode(button.getAttribute('data-orbit-nav') === 'prev' ? -1 : 1);
        });
      });
      requestAnimationFrame(function () {
        syncPanelHeight();
        syncContainerHeight();
      });
    }

    function inferUniverseCategory() {
      var sector = String((graph.pageMeta && graph.pageMeta.sector) || '').toLowerCase();
      var title = String(graphDisplayTitle || '').toLowerCase();
      if (/precious|gold|silver|platinum|palladium|rhodium|iridium/.test(sector + ' ' + title)) return 'precious';
      if (/energy|oil|gas|uranium|coal|lng|diesel|jet fuel|hydrogen/.test(sector + ' ' + title)) return 'energy';
      if (/agri|agriculture|wheat|corn|soy|cattle|cotton|coffee|cocoa|sugar|rice|oats|potash|phosphate|water/.test(sector + ' ' + title)) return 'agriculture';
      return 'industrial';
    }

    function universeColorForCategory(category) {
      return {
        energy: '#ef4444',
        precious: '#fbbf24',
        industrial: '#22d3ee',
        agriculture: '#22c55e'
      }[category] || '#22d3ee';
    }

    function buildHubUniverseData() {
      var category = inferUniverseCategory();
      var quotas = isMobile
        ? { market: 4, company: 6, macro: 4, research: 2 }
        : { market: 6, company: 10, macro: 6, research: 4 };
      var totalLimit = Object.keys(quotas).reduce(function (sum, key) { return sum + quotas[key]; }, 0);

      function nodeScore(node) {
        var levelScore = node.level === 1 ? 100 : node.level === 2 ? 65 : 35;
        var impactScore = typeof node.impact === 'number' ? Math.abs(node.impact) * 4 : 0;
        var degreeScore = (node.degree || 0) * 6;
        var urlBonus = node.url ? 8 : 0;
        var reportThemeBonus = node.group === 'research'
          ? (node.type === 'theme' ? 26 : node.type === 'report' ? 18 : 12)
          : 0;
        var companyBonus = node.group === 'company' ? 14 : 0;
        return levelScore + impactScore + degreeScore + urlBonus + reportThemeBonus + companyBonus;
      }

      var candidates = allNodes.filter(function (node) {
        return node.id !== graph.commodityId;
      });

      var selected = [];
      var selectedIds = new Set();

      ['market', 'company', 'macro', 'research'].forEach(function (groupKey) {
        candidates
          .filter(function (node) { return node.group === groupKey; })
          .sort(function (a, b) { return nodeScore(b) - nodeScore(a); })
          .slice(0, quotas[groupKey] || 0)
          .forEach(function (node) {
            if (selectedIds.has(node.id)) return;
            selected.push(node);
            selectedIds.add(node.id);
          });
      });

      candidates
        .slice()
        .sort(function (a, b) { return nodeScore(b) - nodeScore(a); })
        .forEach(function (node) {
          if (selected.length >= totalLimit) return;
          if (selectedIds.has(node.id)) return;
          selected.push(node);
          selectedIds.add(node.id);
        });

      return [{
        id: graph.commodityId,
        name: graphDisplayTitle || (graph.pageMeta && graph.pageMeta.shortTitle) || 'Commodity hub',
        symbol: (graph.pageMeta && graph.pageMeta.symbol) || '',
        category: category,
        size: isMobile ? 14 : 15,
        color: universeColorForCategory(category),
        link: (graph.pageMeta && graph.pageMeta.url) || '',
        nodes: selected.map(function (node) {
          return {
            id: node.id,
            name: node.label,
            type: node.type || 'market',
            group: node.group,
            level: node.level,
            impact: node.impact,
            correlation: node.correlation,
            sector: node.sector,
            relationLabel: node.relationLabel,
            note: node.note,
            url: node.url || ''
          };
        })
      }];
    }

    function mountSharedUniverse() {
      if (!window.CommodityUniverse3D || typeof window.CommodityUniverse3D.mount !== 'function') return false;

      var universeData = buildHubUniverseData();
      var category = inferUniverseCategory();
      var categoryLabel = {
        energy: 'Energy orbit',
        precious: 'Precious orbit',
        industrial: 'Industrial orbit',
        agriculture: 'Agriculture orbit'
      }[category] || 'Hub orbit';

      container.classList.add('cn-local-graph-mount');
      container.innerHTML = [
        '<section class="cn-local-graph-section">',
        '  <div class="cn-local-graph-header">',
        '    <div class="cn-local-graph-intro">',
        '      <span class="cn-local-graph-eyebrow">Signature 3D universe</span>',
        '      <h2>Local Universe View</h2>',
        '      <p>This hub now uses the same 3D universe renderer as the homepage — reduced to ' + escapeHtml(graphDisplayTitle || 'this commodity') + ' and its highest-signal satellites.</p>',
        '    </div>',
        '  </div>',
        '  <div class="cn-local-graph-body">',
        '    <div class="cn-local-graph-canvas-wrap universe-container">',
        '      <div class="universe-stage-toolbar">',
        '        <div class="universe-controls">',
        '          <div class="universe-control-group universe-orbit-group">',
        '            <span class="universe-control-label">Type orbit</span>',
        '            <div class="universe-orbit-grid">',
        '              <button class="universe-orbit-filter is-active" data-orbit-group="all">All</button>',
        '              <button class="universe-orbit-filter" data-orbit-group="company">Companies</button>',
        '              <button class="universe-orbit-filter" data-orbit-group="research">Themes & reports</button>',
        '              <button class="universe-orbit-filter" data-orbit-group="macro">Macro</button>',
        '              <button class="universe-orbit-filter" data-orbit-group="market">Markets</button>',
        '            </div>',
        '          </div>',
        '          <div class="universe-control-group universe-search-group">',
        '            <span class="universe-control-label">Search</span>',
        '            <div class="universe-search-row">',
        '              <input type="text" class="universe-search" placeholder="Search satellites, companies, drivers…" aria-label="Search local universe">',
        '              <button class="universe-reset-btn" type="button">Reset viewpoint</button>',
        '            </div>',
        '          </div>',
        '        </div>',
        '      </div>',
        '      <div class="universe-frame cn-local-universe-frame">',
        '        <div class="universe-frame-grid"></div>',
        '        <div class="universe-stage-caption universe-stage-caption-top">Homepage 3D renderer · scoped to this commodity hub</div>',
        '        <div id="universe-canvas" class="universe-canvas"></div>',
        '        <div id="universe-tooltip" class="universe-tooltip"></div>',
        '        <div class="universe-orbit-info universe-orbit-info-left">',
        '          <span class="universe-orbit-label">Core star</span>',
        '          <strong>' + escapeHtml(graphDisplayTitle || 'Commodity hub') + '</strong>',
        '          <small>The center node is the current raw material. Satellites are the highest-signal linked exposures and macro drivers from this hub.</small>',
        '        </div>',
        '        <div class="universe-orbit-info universe-orbit-info-right">',
        '          <span class="universe-orbit-label">Interaction</span>',
        '          <strong>Anchored camera · manual inspection</strong>',
        '          <small>Pick a type to isolate that orbit. Motion pauses so you can drag the scene yourself and choose the exact satellite you want.</small>',
        '        </div>',
        '      </div>',
        '      <div id="universe-hint" class="universe-hint universe-hint-inline">Type filters isolate orbit groups · satellites pause when filtered · drag to inspect and tap to open details</div>',
        '    </div>',
        '    <section class="cn-local-graph-panel" aria-live="polite"></section>',
        '  </div>',
        '  <div class="cn-local-graph-legend">',
        '    <span><i class="market"></i>Commodity & market satellites</span>',
        '    <span><i class="company"></i>Company satellites</span>',
        '    <span><i class="macro"></i>Macro / policy satellites</span>',
        '    <span class="cn-local-graph-legend-meta">Same renderer as the homepage universe · scoped to the current hub only</span>',
        '  </div>',
        '</section>'
      ].join('');

      sectionEl = container.querySelector('.cn-local-graph-section');
      canvasWrap = container.querySelector('.cn-local-graph-canvas-wrap');
      canvas = container.querySelector('#universe-canvas');
      panel = container.querySelector('.cn-local-graph-panel');
      searchInput = container.querySelector('.universe-search');
      filterButtons = [];

      syncCardMode();
      updatePanel();

      universeApi = window.CommodityUniverse3D.mount({
        container: canvas,
        root: canvasWrap,
        tooltip: container.querySelector('#universe-tooltip'),
        hint: container.querySelector('#universe-hint'),
        searchInput: searchInput,
        resetButton: container.querySelector('.universe-reset-btn'),
        data: universeData,
        centerPrimary: true,
        autoRotate: false,
        enableRotate: true,
        minDistance: 160,
        maxDistance: 420,
        initialCameraPosition: { x: 0, y: 46, z: 260 },
        initialTarget: { x: 0, y: -42, z: 0 },
        defaultHintText: 'Type filters isolate orbit groups · satellites pause when filtered · drag to inspect and tap satellites',
        zoomHintText: function (commodityData) {
          return '✦ ' + commodityData.name + ' — hub anchored. Drag to inspect the visible satellites.';
        },
        getSatelliteFocusState: function () {
          return {
            group: orbitGroupFocus,
            level: 'all',
            selectedId: selectedId,
            freezeSatellites: orbitGroupFocus !== 'all'
          };
        },
        onCommoditySelect: function () {
          pickNode(graph.commodityId);
        },
        onCommodityNavigate: function () {
          return false;
        },
        onSatelliteSelect: function (satelliteData) {
          if (satelliteData && satelliteData.id) pickNode(satelliteData.id);
          return !!(satelliteData && satelliteData.url);
        }
      });

      Array.prototype.slice.call(container.querySelectorAll('[data-orbit-group]')).forEach(function (button) {
        button.addEventListener('click', function () {
          orbitGroupFocus = button.getAttribute('data-orbit-group') || 'all';
          Array.prototype.slice.call(container.querySelectorAll('[data-orbit-group]')).forEach(function (candidate) {
            candidate.classList.toggle('is-active', candidate === button);
          });
          var matches = focusMatchedNodes();
          if (matches.length && !matches.some(function (node) { return node.id === selectedId; })) selectedId = matches[0].id;
          updatePanel();
        });
      });

      var swipeStart = null;
      canvasWrap.addEventListener('touchstart', function (event) {
        if (!event.touches || event.touches.length !== 1) return;
        swipeStart = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          at: Date.now()
        };
      }, { passive: true });

      canvasWrap.addEventListener('touchend', function (event) {
        if (!swipeStart || !event.changedTouches || event.changedTouches.length !== 1) return;
        var dx = event.changedTouches[0].clientX - swipeStart.x;
        var dy = event.changedTouches[0].clientY - swipeStart.y;
        var elapsed = Date.now() - swipeStart.at;
        swipeStart = null;
        if (orbitGroupFocus === 'all') return;
        if (elapsed > 420) return;
        if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        cycleFocusNode(dx < 0 ? 1 : -1);
      }, { passive: true });

      requestAnimationFrame(syncPanelHeight);
      requestAnimationFrame(syncContainerHeight);
      return true;
    }

    function initThreeUniverse() {
      if (typeof THREE === 'undefined') return false;

      var scene;
      var camera;
      var renderer;
      var controls;
      var composer = null;
      var useBloom = false;
      var sceneRoot;
      var starField;
      var sceneObjects = [];
      var interactiveNodes = [];
      var nodePositions = {};
      var raycaster = new THREE.Raycaster();
      var pointer = new THREE.Vector2();

      function sourceId(link) {
        return typeof link.source === 'object' ? link.source.id : link.source;
      }

      function targetId(link) {
        return typeof link.target === 'object' ? link.target.id : link.target;
      }

      function colorForGroup(group) {
        return colorByGroup[group] || '#94a3b8';
      }

      function truncate3DLabel(label, maxLength) {
        var text = String(label || '');
        return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
      }

      function makeLabelSprite(text, colorHex, scaleX, scaleY, fontPx) {
        var canvasEl = document.createElement('canvas');
        canvasEl.width = 512;
        canvasEl.height = 128;
        var ctx = canvasEl.getContext('2d');
        ctx.font = '700 ' + (fontPx || 34) + 'px DM Sans, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(2,6,14,0.92)';
        ctx.lineWidth = 10;
        ctx.strokeText(text, canvasEl.width / 2, canvasEl.height / 2);
        ctx.fillStyle = colorHex || '#e7f1fb';
        ctx.fillText(text, canvasEl.width / 2, canvasEl.height / 2);
        var texture = new THREE.CanvasTexture(canvasEl);
        var material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.98 });
        var sprite = new THREE.Sprite(material);
        sprite.scale.set(scaleX || 92, scaleY || 22, 1);
        return sprite;
      }

      function buildVisibleGraph3D() {
        var nodes = allNodes.filter(passesFilter);
        var visibleSet = new Set(nodes.map(function (node) { return node.id; }));
        var links = allLinks.filter(function (link) {
          return visibleSet.has(sourceId(link)) && visibleSet.has(targetId(link));
        });
        return { nodes: nodes, links: links, visibleSet: visibleSet };
      }

      function nodeVisualSize(node) {
        if (node.id === graph.commodityId) return isMobile ? 18 : 22;
        if (node.id === selectedId) return isMobile ? 11 : 13;
        if (node.level >= 2) return isMobile ? 6.4 : 7.8;
        if (node.group === 'company') return isMobile ? 8.2 : 9.2;
        if (node.group === 'macro') return isMobile ? 7.6 : 8.6;
        if (node.group === 'research') return isMobile ? 7.2 : 8.2;
        return isMobile ? 8 : 9;
      }

      function labelShouldShow(node) {
        if (node.id === graph.commodityId || node.id === selectedId) return true;
        if (isMobile) return node.level <= 1;
        return node.level <= 1 || node.degree >= 3;
      }

      function buildSceneOnce() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x03060c);
        scene.fog = new THREE.FogExp2(0x050912, 0.001);

        camera = new THREE.PerspectiveCamera(54, 1, 1, 4000);
        camera.position.set(0, isMobile ? 12 : -14, isMobile ? 320 : 440);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.24;
        canvas.innerHTML = '';
        canvas.appendChild(renderer.domElement);

        if (typeof THREE.EffectComposer !== 'undefined' && typeof THREE.RenderPass !== 'undefined' && typeof THREE.UnrealBloomPass !== 'undefined') {
          composer = new THREE.EffectComposer(renderer);
          composer.addPass(new THREE.RenderPass(scene, camera));
          var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(1, 1), isMobile ? 1.0 : 1.18, 0.76, 0.2);
          composer.addPass(bloomPass);
          useBloom = true;
        }

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.autoRotate = true;
        controls.autoRotateSpeed = isMobile ? 0.24 : 0.3;
        controls.minDistance = isMobile ? 180 : 220;
        controls.maxDistance = isMobile ? 520 : 780;
        controls.maxPolarAngle = Math.PI * 0.72;
        controls.minPolarAngle = Math.PI * 0.26;

        scene.add(new THREE.AmbientLight(0x1f2937, 0.74));
        var fillLight = new THREE.PointLight(0x67e8f9, 1.08, 900, 2);
        fillLight.position.set(140, 140, 210);
        scene.add(fillLight);
        var rimLight = new THREE.PointLight(0xa855f7, 0.68, 820, 2);
        rimLight.position.set(-180, -120, 220);
        scene.add(rimLight);

        var starCount = isMobile ? 900 : 1800;
        var starPositions = new Float32Array(starCount * 3);
        for (var i = 0; i < starCount; i++) {
          var radius = 640 + Math.random() * 880;
          var theta = Math.random() * Math.PI * 2;
          var phi = Math.acos(2 * Math.random() - 1);
          starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          starPositions[i * 3 + 2] = radius * Math.cos(phi);
        }
        var starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        var starMat = new THREE.PointsMaterial({ color: 0xe6eefc, size: isMobile ? 1.5 : 1.2, transparent: true, opacity: 0.68, depthWrite: false });
        starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);

        sceneRoot = new THREE.Group();
        scene.add(sceneRoot);

        renderer.domElement.addEventListener('pointerdown', function (event) {
          var bounds = renderer.domElement.getBoundingClientRect();
          pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          var hits = raycaster.intersectObjects(interactiveNodes, false);
          if (hits.length && hits[0].object && hits[0].object.userData && hits[0].object.userData.nodeId) {
            pickNode(hits[0].object.userData.nodeId);
          }
        });

        (function animate() {
          window.requestAnimationFrame(animate);
          if (sceneRoot) sceneRoot.rotation.y += isMobile ? 0.0008 : 0.00055;
          if (starField) starField.rotation.y += 0.00015;
          if (controls) controls.update();
          if (useBloom && composer) composer.render();
          else if (renderer) renderer.render(scene, camera);
        })();
      }

      function clearSceneRoot() {
        sceneObjects.forEach(function (obj) {
          if (obj.parent) obj.parent.remove(obj);
          if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(function (m) { if (m && m.dispose) m.dispose(); });
            else if (obj.material.dispose) obj.material.dispose();
          }
          if (obj.material && obj.material.map && obj.material.map.dispose) obj.material.map.dispose();
        });
        sceneObjects = [];
        interactiveNodes = [];
        nodePositions = {};
      }

      function computeNodePositions(visibleGraph) {
        var centerId = graph.commodityId;
        nodePositions[centerId] = new THREE.Vector3(0, 0, 0);

        var firstRing = visibleGraph.nodes.filter(function (node) { return node.id !== centerId && node.level <= 1; });
        var grouped = ['market', 'company', 'macro', 'research'].map(function (groupKey) {
          return {
            key: groupKey,
            nodes: firstRing.filter(function (node) { return node.group === groupKey; })
          };
        });

        grouped.forEach(function (bucket, bucketIndex) {
          bucket.nodes.forEach(function (node, index) {
            var radius = (isMobile ? 92 : 138) + bucketIndex * (isMobile ? 18 : 24);
            var angle = -Math.PI * 0.72 + bucketIndex * (Math.PI / 1.7) + (index / Math.max(1, bucket.nodes.length)) * (Math.PI / 2.1);
            nodePositions[node.id] = new THREE.Vector3(
              Math.cos(angle) * radius,
              Math.sin(index * 1.2 + bucketIndex) * (isMobile ? 26 : 40),
              Math.sin(angle) * radius * 0.84
            );
          });
        });

        visibleGraph.nodes.filter(function (node) { return node.level >= 2; }).forEach(function (node, index) {
          var parentLink = visibleGraph.links.find(function (link) { return targetId(link) === node.id; }) || visibleGraph.links.find(function (link) { return sourceId(link) === node.id; });
          var parentId = parentLink ? (targetId(parentLink) === node.id ? sourceId(parentLink) : targetId(parentLink)) : centerId;
          var parentPos = nodePositions[parentId] || new THREE.Vector3();
          var angle = (index / Math.max(1, visibleGraph.nodes.length)) * Math.PI * 2;
          var offset = new THREE.Vector3(Math.cos(angle) * (isMobile ? 38 : 52), Math.sin(angle * 1.7) * (isMobile ? 16 : 24), Math.sin(angle) * (isMobile ? 34 : 48));
          nodePositions[node.id] = parentPos.clone().add(offset);
        });
      }

      function addLinkVisual(link) {
        var start = nodePositions[sourceId(link)];
        var end = nodePositions[targetId(link)];
        if (!start || !end) return;
        var connected = selectedId && (sourceId(link) === selectedId || targetId(link) === selectedId);
        var line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([start, end]),
          new THREE.LineBasicMaterial({
            color: new THREE.Color(connected ? colorForGroup(relationTone(link.relation)) : '#607089'),
            transparent: true,
            opacity: connected ? 0.86 : 0.18,
            depthWrite: false
          })
        );
        sceneRoot.add(line);
        sceneObjects.push(line);
      }

      function addNodeVisual(node) {
        var pos = nodePositions[node.id] || new THREE.Vector3();
        var radius = nodeVisualSize(node);
        var colorHex = colorForGroup(node.group);
        var relatedSet = selectedId ? neighborSetFor(selectedId, allLinks) : new Set();
        var dimmed = selectedId && node.id !== selectedId && node.id !== graph.commodityId && !relatedSet.has(node.id);

        var sphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius, isMobile ? 28 : 36, isMobile ? 28 : 36),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(colorHex),
            emissive: new THREE.Color(colorHex),
            emissiveIntensity: node.id === selectedId ? 1.15 : node.id === graph.commodityId ? 0.88 : 0.44,
            metalness: 0.22,
            roughness: 0.24,
            transparent: true,
            opacity: dimmed ? 0.36 : 0.98
          })
        );
        sphere.position.copy(pos);
        sphere.userData.nodeId = node.id;
        sceneRoot.add(sphere);
        sceneObjects.push(sphere);
        interactiveNodes.push(sphere);

        var glow = new THREE.Sprite(new THREE.SpriteMaterial({ color: new THREE.Color(colorHex), transparent: true, opacity: dimmed ? 0.08 : (node.id === selectedId ? 0.42 : 0.2), depthWrite: false }));
        glow.scale.set(radius * 6.8, radius * 6.8, 1);
        glow.position.copy(pos);
        sceneRoot.add(glow);
        sceneObjects.push(glow);

        if (labelShouldShow(node)) {
          var label = makeLabelSprite(truncate3DLabel(node.label, node.id === graph.commodityId ? 18 : 16), node.id === selectedId || node.id === graph.commodityId ? '#f8fbff' : '#dce9f6', node.id === graph.commodityId ? 118 : 88, node.id === graph.commodityId ? 28 : 20, node.id === graph.commodityId ? 40 : 28);
          label.position.copy(pos.clone().add(new THREE.Vector3(0, radius + (isMobile ? 16 : 20), 0)));
          sceneRoot.add(label);
          sceneObjects.push(label);
        }
      }

      function renderThreeUniverse() {
        if (!scene) buildSceneOnce();

        var visibleGraph = buildVisibleGraph3D();
        if (selectedId && !visibleGraph.visibleSet.has(selectedId)) selectedId = graph.commodityId;

        var width = Math.max(320, Math.floor(canvasWrap.clientWidth || canvas.clientWidth || container.clientWidth || window.innerWidth - 32));
        isMobile = width <= 720 || window.innerWidth <= 720;
        syncCardMode();
        var height = isMobile ? Math.max(560, Math.min(760, Math.round(width * 1.18))) : Math.max(680, Math.min(900, Math.round(window.innerHeight * 0.82)));

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        if (composer && composer.setSize) composer.setSize(width, height);

        clearSceneRoot();
        computeNodePositions(visibleGraph);
        visibleGraph.links.forEach(addLinkVisual);
        visibleGraph.nodes.forEach(addNodeVisual);
        updatePanel();
        requestAnimationFrame(syncContainerHeight);
      }

      refreshVisualization = renderThreeUniverse;

      searchInput.addEventListener('input', function () {
        searchTerm = String(searchInput.value || '').trim().toLowerCase();
        renderThreeUniverse();
      });

      filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          filterMode = button.getAttribute('data-filter') || 'all';
          filterButtons.forEach(function (candidate) {
            candidate.classList.toggle('is-active', candidate === button);
          });
          renderThreeUniverse();
        });
      });

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(function () {
          renderThreeUniverse();
        });
        resizeObserver.observe(canvasWrap);
        resizeObserver.observe(sectionEl);
      } else {
        window.addEventListener('resize', renderThreeUniverse);
      }

      renderThreeUniverse();
      return true;
    }

    if (mountSharedUniverse()) {
      return;
    }

    if (initThreeUniverse()) {
      return;
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

    var waitingForGraphLibrary = typeof window.THREE === 'undefined' && typeof window.d3 === 'undefined';
    var waitingForSharedUniverse = typeof window.THREE !== 'undefined'
      && typeof window.CommodityUniverse3D === 'undefined'
      && typeof window.d3 === 'undefined';

    if (waitingForGraphLibrary || waitingForSharedUniverse) {
      if (bootAttempts < 40) {
        setTimeout(boot, waitingForSharedUniverse ? 120 : 80);
        return;
      }
      containers.forEach(function (container) {
        if (!container.dataset.cnGraphReady) renderFallback(container, window.COMMODITY_PAGE_META || {});
      });
      return;
    }

    containers.forEach(function (container) {
      var canUpgradeToSharedUniverse = !!(window.CommodityUniverse3D && typeof window.CommodityUniverse3D.mount === 'function');
      var currentEyebrow = container.querySelector('.cn-local-graph-eyebrow');
      if (canUpgradeToSharedUniverse && container.dataset.cnGraphReady === '1' && currentEyebrow && currentEyebrow.textContent !== 'Signature 3D universe') {
        container.dataset.cnGraphReady = '';
        container.innerHTML = '';
      }
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