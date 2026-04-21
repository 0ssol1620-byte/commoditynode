/* ============================================================
   CommodityNode — main.js
   Animations, interactions, scroll effects
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Page Loader ---------- */
  var _loaderStart = Date.now();
  var _loaderHidden = false;
  function hideLoader() {
    if (_loaderHidden) return;
    _loaderHidden = true;
    var loader = document.getElementById("page-loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(function() { loader.style.display = "none"; }, 300);
    }
  }
  // Wait for page content to be ready (graphs, charts)
  function checkContentReady() {
    var minTime = 300; // show loader at least 0.3s
    var elapsed = Date.now() - _loaderStart;
    // Check if main content areas exist and have rendered
    var graph = document.getElementById('impact-graph');
    var graphHasSvg = graph && graph.querySelector('svg');
    var charts = document.querySelectorAll('.cn-price-chart canvas');
    var isPostPage = !!document.getElementById('post-article');
    // For post pages: wait until graph or chart is rendered (or timeout)
    if (isPostPage && !graphHasSvg && elapsed < 2000) {
      setTimeout(checkContentReady, 200);
      return;
    }
    // Ensure minimum display time
    var remaining = Math.max(0, minTime - elapsed);
    setTimeout(hideLoader, remaining);
  }
  window.addEventListener("load", function() { setTimeout(checkContentReady, 100); });
  // Hard cap at 6s
  setTimeout(hideLoader, 1500);

  /* ---------- Page Transition ---------- */
  const transitionEl = document.getElementById('page-transition');

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('http') || href.startsWith('//') ||
        link.target === '_blank') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      if (transitionEl) {
        transitionEl.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 280);
      } else {
        window.location.href = href;
      }
    });
  });

  window.addEventListener('pageshow', () => {
    if (transitionEl) transitionEl.classList.remove('active');
  });

  /* ---------- Sticky Header ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Nav Toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) nav.classList.remove('open');
    });
  }

  /* ---------- Scroll-Triggered Animations ---------- */
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (animatedEls.length) {
    // Force-show post-content immediately — never hide article body text
    animatedEls.forEach(el => {
      if (el.tagName === 'ARTICLE' || el.classList.contains('post-content') || el.id === 'post-article') {
        el.classList.add('animated');
      }
    });

    const remainingEls = Array.from(animatedEls).filter(el =>
      el.tagName !== 'ARTICLE' && !el.classList.contains('post-content') && el.id !== 'post-article'
    );

    if (remainingEls.length) {
      // Staggered reveal: siblings entering together get incremental delays
      let lastBatchTime = 0;
      let staggerIndex = 0;
      const observer = new IntersectionObserver((entries) => {
        const now = performance.now();
        // Reset stagger if this is a new batch (>200ms since last)
        if (now - lastBatchTime > 200) staggerIndex = 0;
        lastBatchTime = now;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const delay = staggerIndex * 80; // 80ms stagger between siblings
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
            staggerIndex++;
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

      remainingEls.forEach(el => observer.observe(el));

      // Fallback: force-show all animated elements after 2s (mobile in-app browser safety net)
      setTimeout(() => {
        remainingEls.forEach(el => el.classList.add('animated'));
      }, 2000);
    }
  }

  /* ---------- Number Counter ---------- */
  function countUp(el) {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = (target % 1 !== 0) ? 1 : 0;
    const duration = 1800;
    const start = performance.now();

    function step(ts) {
      const progress = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = (target * ease).toFixed(decimals);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          countUp(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => {
      el.dataset.target = el.dataset.count;
      counterObserver.observe(el);
    });
  }

  /* ---------- Hero Impact Constellation ---------- */
  const heroCanvas = document.getElementById('hero-canvas');
  const impactCanvas = document.getElementById('hero-impact-canvas');
  const impactSceneEl = document.getElementById('hero-impact-scene');
  if (heroCanvas || impactCanvas) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fallbackPrices = {
      crude_oil: { name: 'Crude Oil', change_pct: 2.4 },
      natural_gas: { name: 'Natural Gas', change_pct: -1.7 },
      copper: { name: 'Copper', change_pct: 1.1 },
      wheat: { name: 'Wheat', change_pct: -0.9 },
      lithium: { name: 'Lithium', change_pct: -2.2 },
      gold: { name: 'Gold', change_pct: 0.8 },
      uranium: { name: 'Uranium', change_pct: 1.9 },
      coffee: { name: 'Coffee', change_pct: 1.4 }
    };
    const impactLibrary = {
      crude_oil: {
        sectors: [
          { label: 'Integrated Energy', bias: 1, note: 'cash flow expands on stronger realized pricing' },
          { label: 'Airlines', bias: -1, note: 'fuel-sensitive margins compress first' },
          { label: 'Chemicals', bias: -1, note: 'feedstock pressure moves faster than selling-price relief' },
          { label: 'Transport', bias: -0.8, note: 'diesel and logistics costs re-rate quickly' }
        ],
        themes: [
          { label: 'XOM / CVX', bias: 1, note: 'upstream torque improves' },
          { label: 'DAL / UAL', bias: -1, note: 'jet-fuel pressure comes back into focus' },
          { label: 'Refining spread', bias: 0.4, note: 'follow crack-spread durability' },
          { label: 'Inflation pulse', bias: -0.4, note: 'macro repricing risk rises with sustained oil strength' }
        ]
      },
      natural_gas: {
        sectors: [
          { label: 'Gas Producers', bias: 1, note: 'realized price leverage improves' },
          { label: 'Utilities', bias: -1, note: 'fuel procurement costs lift faster than regulated recovery' },
          { label: 'Fertilizers', bias: -0.9, note: 'nitrogen economics tighten' },
          { label: 'LNG Exporters', bias: 0.8, note: 'global spread narratives strengthen' }
        ],
        themes: [
          { label: 'EQT / LNG', bias: 1, note: 'gas-linked torque gets cleaner' },
          { label: 'CF / Utilities', bias: -1, note: 'input-cost pressure returns' },
          { label: 'Power stack', bias: -0.5, note: 'dispatch economics need a refresh' },
          { label: 'Europe supply', bias: 0.4, note: 'watch storage and import sensitivity' }
        ]
      },
      copper: {
        sectors: [
          { label: 'Miners', bias: 1, note: 'operating leverage improves on industrial demand strength' },
          { label: 'Grid / Infra', bias: 0.7, note: 'demand signal supports capex narratives' },
          { label: 'Industrial Cyclicals', bias: 0.5, note: 'macro tone improves if copper leads' },
          { label: 'Fabricators', bias: -0.6, note: 'input-cost squeeze hits converters' }
        ],
        themes: [
          { label: 'FCX / SCCO', bias: 1, note: 'miner beta turns on quickly' },
          { label: 'China demand', bias: 0.8, note: 'growth read-through improves' },
          { label: 'Wire / cable', bias: -0.5, note: 'cost absorption matters' },
          { label: 'EV metals basket', bias: 0.4, note: 'cross-metal momentum can broaden' }
        ]
      },
      gold: {
        sectors: [
          { label: 'Gold Miners', bias: 1, note: 'safe-haven demand supports miner cash flow' },
          { label: 'Risk Assets', bias: -0.5, note: 'defensive rotation often accompanies strong gold tape' },
          { label: 'Royalty Names', bias: 0.8, note: 'high-margin exposure benefits' },
          { label: 'Rates-sensitive Growth', bias: -0.4, note: 'risk appetite can cool when gold leads' }
        ],
        themes: [
          { label: 'NEM / GOLD', bias: 1, note: 'beta improves with bullion' },
          { label: 'Real yields', bias: -0.7, note: 'watch rate path and policy tone' },
          { label: 'Hedging demand', bias: 0.5, note: 'portfolio defense narrative strengthens' },
          { label: 'Silver sympathy', bias: 0.3, note: 'precious-metal complex can broaden' }
        ]
      },
      wheat: {
        sectors: [
          { label: 'Grain Traders', bias: 1, note: 'volatility and merchandising opportunity improve' },
          { label: 'Food Producers', bias: -1, note: 'input-cost pressure moves into packaged food' },
          { label: 'Livestock', bias: -0.8, note: 'feed costs rebuild quickly' },
          { label: 'Farm Inputs', bias: 0.4, note: 'planting economics may improve' }
        ],
        themes: [
          { label: 'ADM / BG', bias: 1, note: 'grain handling urgency improves' },
          { label: 'Staples margins', bias: -1, note: 'watch pass-through timing' },
          { label: 'Feed channel', bias: -0.7, note: 'protein complex feels it next' },
          { label: 'Weather risk', bias: 0.5, note: 'follow supply narrative, not just tape' }
        ]
      },
      lithium: {
        sectors: [
          { label: 'Lithium Producers', bias: 1, note: 'pricing power stabilizes upstream names' },
          { label: 'Battery Buyers', bias: -0.8, note: 'cost relief disappears on renewed tightness' },
          { label: 'EV Supply Chain', bias: -0.5, note: 'downstream margin assumptions need refresh' },
          { label: 'Materials Traders', bias: 0.4, note: 'inventory narratives re-open' }
        ],
        themes: [
          { label: 'ALB / SQM', bias: 1, note: 'upstream sensitivity rises sharply' },
          { label: 'TSLA cost stack', bias: -0.7, note: 'battery economics get tighter' },
          { label: 'Cathode makers', bias: -0.5, note: 'watch pricing pass-through' },
          { label: 'China inventory', bias: 0.4, note: 'follow destocking vs rebound risk' }
        ]
      },
      uranium: {
        sectors: [
          { label: 'Uranium Miners', bias: 1, note: 'supply scarcity narratives get stronger' },
          { label: 'Nuclear Utilities', bias: 0.6, note: 'procurement urgency returns' },
          { label: 'Clean Power Themes', bias: 0.4, note: 'nuclear optionality improves' },
          { label: 'Merchant Buyers', bias: -0.3, note: 'term contracting pressure rises' }
        ],
        themes: [
          { label: 'CCJ / UUUU', bias: 1, note: 'equity torque remains high' },
          { label: 'SMR supply chain', bias: 0.5, note: 'nuclear appetite broadens' },
          { label: 'Term contracting', bias: 0.7, note: 'follow utility restocking urgency' },
          { label: 'Political risk', bias: -0.2, note: 'policy and permitting still matter' }
        ]
      },
      coffee: {
        sectors: [
          { label: 'Coffee Producers', bias: 1, note: 'scarcity premium supports growers and traders' },
          { label: 'Roasters', bias: -1, note: 'input inflation pressures branded margins' },
          { label: 'Restaurants', bias: -0.5, note: 'beverage cost relief disappears' },
          { label: 'Consumer Staples', bias: -0.4, note: 'packaging and mix need re-checks' }
        ],
        themes: [
          { label: 'SBUX margin', bias: -0.8, note: 'coffee procurement comes back into focus' },
          { label: 'Brazil crop', bias: 0.5, note: 'weather still sets the tone' },
          { label: 'Arabica spread', bias: 0.4, note: 'quality tightness can extend' },
          { label: 'Consumer pass-through', bias: -0.4, note: 'pricing power matters more than traffic' }
        ]
      }
    };
    const defaultImpact = {
      sectors: [
        { label: 'Upstream', bias: 1, note: 'producers usually win first' },
        { label: 'Downstream Buyers', bias: -1, note: 'input costs or relief translate quickly' },
        { label: 'Sector Basket', bias: 0.5, note: 'cross-asset sentiment can broaden' },
        { label: 'Macro Spillover', bias: -0.4, note: 'watch inflation and risk appetite' }
      ],
      themes: [
        { label: 'Watchlist names', bias: 1, note: 're-rank the most exposed names' },
        { label: 'Margin pressure', bias: -1, note: 'input sensitivity matters most' },
        { label: 'Scenario path', bias: 0.3, note: 'test persistence, not just direction' },
        { label: 'Risk transfer', bias: -0.2, note: 'second-order effects show up next' }
      ]
    };

    const bgCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
    const impactCtx = impactCanvas ? impactCanvas.getContext('2d') : null;
    const impactTooltip = document.getElementById('hero-impact-tooltip');
    const impactTitle = document.getElementById('hero-impact-title');
    const impactChange = document.getElementById('hero-impact-change');
    const impactSummary = document.getElementById('hero-impact-summary');
    const impactPositive = document.getElementById('hero-impact-positive');
    const impactNegative = document.getElementById('hero-impact-negative');
    const impactWatch = document.getElementById('hero-impact-watch');
    const impactCenterLabel = document.getElementById('hero-impact-center-label');
    const impactCenterSubcopy = document.getElementById('hero-impact-center-subcopy');

    let backgroundStars = [];
    let movers = [];
    let activeScene = null;
    let activeIndex = 0;
    let sceneNodes = [];
    let hoveredNode = null;
    let animationFrame = null;
    let rotationTimer = null;
    let pageVisible = !document.hidden;
    let isMobileViewport = window.innerWidth <= 768;
    let heroPointer = { x: 0, y: 0, active: false };

    function sentimentColor(sentiment, alpha) {
      if (sentiment > 0.15) return 'rgba(16,185,129,' + alpha + ')';
      if (sentiment < -0.15) return 'rgba(244,63,94,' + alpha + ')';
      return 'rgba(251,191,36,' + alpha + ')';
    }

    function formatPct(value) {
      if (typeof value !== 'number' || Number.isNaN(value)) return '—';
      return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
    }

    function titleFromKey(key, entry) {
      return (entry && entry.name) || key.replace(/_/g, ' ').replace(/\b\w/g, function (m) { return m.toUpperCase(); });
    }

    function deriveNodes(list, direction, radius, multiplier) {
      return list.map(function (item, idx) {
        var sentiment = (item.bias || 0) * direction;
        return {
          id: item.label + '-' + idx,
          label: item.label,
          note: item.note,
          sentiment: sentiment,
          radius: radius,
          size: (item.size || 1) * multiplier,
          angle: (Math.PI * 2 * idx) / Math.max(list.length, 1),
          layerOffset: idx * 0.6
        };
      });
    }

    function buildSceneData(key, entry) {
      var library = impactLibrary[key] || defaultImpact;
      var change = entry && typeof entry.change_pct === 'number' ? entry.change_pct : 0;
      var direction = change >= 0 ? 1 : -1;
      var sectors = deriveNodes(library.sectors, direction, 0.34, 8);
      var themes = deriveNodes(library.themes, direction, 0.6, 6.4);
      var sortedSectors = sectors.slice().sort(function (a, b) { return b.sentiment - a.sentiment; });
      var positives = sortedSectors.filter(function (item) { return item.sentiment > 0.15; }).slice(0, 2).map(function (item) { return item.label; });
      var negatives = sortedSectors.slice().sort(function (a, b) { return a.sentiment - b.sentiment; }).filter(function (item) { return item.sentiment < -0.15; }).slice(0, 2).map(function (item) { return item.label; });
      var watch = themes.filter(function (item) { return Math.abs(item.sentiment) <= 0.15; }).slice(0, 1).map(function (item) { return item.label; });
      var summary = (change >= 0 ? titleFromKey(key, entry) + ' is rising' : titleFromKey(key, entry) + ' is falling')
        + '. First-order translation hits ' + (positives[0] || 'upstream winners')
        + ' versus ' + (negatives[0] || 'downstream pressure')
        + ', while second-order themes decide whether the move spreads or fades.';
      return {
        key: key,
        title: titleFromKey(key, entry),
        change: change,
        direction: direction,
        sectors: sectors,
        themes: themes,
        positives: positives,
        negatives: negatives,
        watch: watch,
        summary: summary
      };
    }

    function updateImpactCopy(scene) {
      if (!scene) return;
      activeScene = scene;
      if (impactTitle) impactTitle.textContent = scene.title;
      if (impactChange) {
        impactChange.textContent = formatPct(scene.change);
        impactChange.classList.toggle('is-negative', scene.change < 0);
      }
      if (impactSummary) impactSummary.textContent = scene.summary;
      if (impactPositive) impactPositive.textContent = scene.positives.length ? scene.positives.join(' · ') : 'No clear beneficiary cluster';
      if (impactNegative) impactNegative.textContent = scene.negatives.length ? scene.negatives.join(' · ') : 'No clear pressure cluster';
      if (impactWatch) impactWatch.textContent = scene.watch.length ? scene.watch.join(' · ') : 'Cross-asset follow-through';
      if (impactCenterLabel) impactCenterLabel.textContent = scene.title;
      if (impactCenterSubcopy) {
        impactCenterSubcopy.textContent = (scene.change >= 0 ? 'Upstream leverage + downstream pressure' : 'Cost relief + upstream stress') + ' · ' + formatPct(scene.change);
      }
    }

    function resizeCanvas(canvasEl, context) {
      if (!canvasEl || !context) return { width: 0, height: 0 };
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var width = Math.max(1, Math.floor(canvasEl.offsetWidth));
      var height = Math.max(1, Math.floor(canvasEl.offsetHeight));
      if (canvasEl.width !== Math.floor(width * dpr) || canvasEl.height !== Math.floor(height * dpr)) {
        canvasEl.width = Math.floor(width * dpr);
        canvasEl.height = Math.floor(height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width: width, height: height };
    }

    function initBackgroundStars(width, height) {
      backgroundStars = Array.from({ length: 42 }, function (_, index) {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.7 + Math.random() * 2.8,
          depth: 0.4 + Math.random() * 1.1,
          phase: Math.random() * Math.PI * 2,
          drift: 0.2 + Math.random() * 0.55,
          color: index % 5 === 0 ? 'rgba(168,85,247,0.95)' : (index % 3 === 0 ? 'rgba(16,185,129,0.95)' : 'rgba(34,211,238,0.95)')
        };
      });
    }

    function drawBackground(now) {
      if (!heroCanvas || !bgCtx || !pageVisible || prefersReducedMotion || isMobileViewport) return;
      var size = resizeCanvas(heroCanvas, bgCtx);
      var width = size.width;
      var height = size.height;
      if (!backgroundStars.length) initBackgroundStars(width, height);
      bgCtx.clearRect(0, 0, width, height);

      var ambient = bgCtx.createRadialGradient(width * 0.54, height * 0.38, 18, width * 0.54, height * 0.38, Math.max(width, height) * 0.66);
      ambient.addColorStop(0, 'rgba(34,211,238,0.18)');
      ambient.addColorStop(0.35, 'rgba(34,211,238,0.05)');
      ambient.addColorStop(1, 'rgba(2,6,23,0)');
      bgCtx.fillStyle = ambient;
      bgCtx.fillRect(0, 0, width, height);

      var pointerX = heroPointer.active ? (heroPointer.x / Math.max(width, 1) - 0.5) * 24 : 0;
      var pointerY = heroPointer.active ? (heroPointer.y / Math.max(height, 1) - 0.5) * 20 : 0;
      var cx = width * 0.62 + pointerX;
      var cy = height * 0.44 + pointerY;
      var ring1 = Math.min(width, height) * 0.17;
      var ring2 = ring1 * 1.72;
      var rotation = now * 0.00022;
      var pulse = 1 + Math.sin(now * 0.0015) * 0.05;

      [ring1, ring2].forEach(function (ring, idx) {
        bgCtx.beginPath();
        bgCtx.arc(cx, cy, ring * pulse, 0, Math.PI * 2);
        bgCtx.strokeStyle = idx === 0 ? 'rgba(34,211,238,0.18)' : 'rgba(168,85,247,0.14)';
        bgCtx.lineWidth = idx === 0 ? 1.1 : 0.9;
        bgCtx.setLineDash(idx === 0 ? [] : [8, 10]);
        bgCtx.stroke();
      });
      bgCtx.setLineDash([]);

      backgroundStars.forEach(function (star) {
        var x = star.x + Math.sin(now * 0.00018 * star.drift + star.phase) * 16 * star.depth;
        var y = star.y + Math.cos(now * 0.00016 * star.drift + star.phase) * 11 * star.depth;
        var glow = star.size * (1 + Math.sin(now * 0.001 + star.phase) * 0.25);
        var grad = bgCtx.createRadialGradient(x, y, 0, x, y, glow * 4.8);
        grad.addColorStop(0, star.color.replace('0.95', '0.18'));
        grad.addColorStop(1, 'rgba(2,6,23,0)');
        bgCtx.fillStyle = grad;
        bgCtx.beginPath();
        bgCtx.arc(x, y, glow * 4.8, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.fillStyle = star.color;
        bgCtx.beginPath();
        bgCtx.arc(x, y, glow, 0, Math.PI * 2);
        bgCtx.fill();
      });

      if (!activeScene) return;
      var allNodes = activeScene.sectors.concat(activeScene.themes);
      allNodes.forEach(function (node, index) {
        var angle = node.angle + rotation * (node.radius < 0.5 ? 1 : -0.75);
        var radius = (node.radius < 0.5 ? ring1 : ring2) * (0.96 + Math.sin(now * 0.001 + node.layerOffset) * 0.02);
        var x = cx + Math.cos(angle) * radius;
        var y = cy + Math.sin(angle) * radius * 0.72;
        var color = sentimentColor(node.sentiment, 0.96);
        bgCtx.beginPath();
        bgCtx.moveTo(cx, cy);
        bgCtx.lineTo(x, y);
        bgCtx.strokeStyle = sentimentColor(node.sentiment, node.radius < 0.5 ? 0.24 : 0.14);
        bgCtx.lineWidth = node.radius < 0.5 ? 1 : 0.8;
        bgCtx.stroke();

        var glow = node.size + (index % 2 === 0 ? 1.4 : 0.6);
        var g = bgCtx.createRadialGradient(x, y, 0, x, y, glow * 4.5);
        g.addColorStop(0, color.replace(/0\.96\)/, '0.16)'));
        g.addColorStop(1, 'rgba(2,6,23,0)');
        bgCtx.fillStyle = g;
        bgCtx.beginPath();
        bgCtx.arc(x, y, glow * 4.5, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.fillStyle = color;
        bgCtx.beginPath();
        bgCtx.arc(x, y, glow, 0, Math.PI * 2);
        bgCtx.fill();
      });

      var coreGlow = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, ring1 * 0.95);
      coreGlow.addColorStop(0, 'rgba(34,211,238,0.18)');
      coreGlow.addColorStop(0.6, 'rgba(34,211,238,0.03)');
      coreGlow.addColorStop(1, 'rgba(2,6,23,0)');
      bgCtx.fillStyle = coreGlow;
      bgCtx.beginPath();
      bgCtx.arc(cx, cy, ring1 * 0.95, 0, Math.PI * 2);
      bgCtx.fill();
    }

    function drawImpactScene(now) {
      if (!impactCanvas || !impactCtx || !activeScene) return;
      var size = resizeCanvas(impactCanvas, impactCtx);
      var width = size.width;
      var height = size.height;
      impactCtx.clearRect(0, 0, width, height);
      sceneNodes = [];

      var cx = width * 0.5;
      var cy = height * 0.52;
      var ring1 = Math.min(width, height) * 0.24;
      var ring2 = Math.min(width, height) * 0.4;
      var rotationA = prefersReducedMotion ? 0 : now * 0.0004;
      var rotationB = prefersReducedMotion ? 0 : -now * 0.00026;

      [ring1, ring2].forEach(function (ring, idx) {
        impactCtx.beginPath();
        impactCtx.arc(cx, cy, ring, 0, Math.PI * 2);
        impactCtx.strokeStyle = idx === 0 ? 'rgba(34,211,238,0.16)' : 'rgba(148,163,184,0.12)';
        impactCtx.lineWidth = 1;
        impactCtx.setLineDash(idx === 0 ? [] : [6, 8]);
        impactCtx.stroke();
      });
      impactCtx.setLineDash([]);

      var field = activeScene.sectors.concat(activeScene.themes);
      field.forEach(function (node) {
        var rotation = node.radius < 0.5 ? rotationA : rotationB;
        var ring = node.radius < 0.5 ? ring1 : ring2;
        var x = cx + Math.cos(node.angle + rotation) * ring;
        var y = cy + Math.sin(node.angle + rotation) * ring * 0.78;
        var sizeBase = (node.radius < 0.5 ? 5.4 : 4.4) + node.size * 0.25;
        var color = sentimentColor(node.sentiment, 0.96);
        sceneNodes.push({ x: x, y: y, label: node.label, note: node.note, sentiment: node.sentiment, size: sizeBase });

        impactCtx.beginPath();
        impactCtx.moveTo(cx, cy);
        impactCtx.lineTo(x, y);
        impactCtx.strokeStyle = sentimentColor(node.sentiment, node.radius < 0.5 ? 0.26 : 0.14);
        impactCtx.lineWidth = node.radius < 0.5 ? 1.2 : 0.85;
        impactCtx.stroke();

        var glow = impactCtx.createRadialGradient(x, y, 0, x, y, sizeBase * 4.6);
        glow.addColorStop(0, color.replace(/0\.96\)/, '0.2)'));
        glow.addColorStop(1, 'rgba(2,6,23,0)');
        impactCtx.fillStyle = glow;
        impactCtx.beginPath();
        impactCtx.arc(x, y, sizeBase * 4.6, 0, Math.PI * 2);
        impactCtx.fill();

        impactCtx.fillStyle = color;
        impactCtx.beginPath();
        impactCtx.arc(x, y, sizeBase, 0, Math.PI * 2);
        impactCtx.fill();
      });

      if (hoveredNode) {
        impactCtx.beginPath();
        impactCtx.arc(hoveredNode.x, hoveredNode.y, hoveredNode.size + 6, 0, Math.PI * 2);
        impactCtx.strokeStyle = 'rgba(255,255,255,0.3)';
        impactCtx.lineWidth = 1;
        impactCtx.stroke();
      }

      var core = impactCtx.createRadialGradient(cx, cy, 0, cx, cy, ring1 * 0.65);
      core.addColorStop(0, activeScene.change >= 0 ? 'rgba(34,211,238,0.25)' : 'rgba(244,63,94,0.22)');
      core.addColorStop(0.5, 'rgba(34,211,238,0.06)');
      core.addColorStop(1, 'rgba(2,6,23,0)');
      impactCtx.fillStyle = core;
      impactCtx.beginPath();
      impactCtx.arc(cx, cy, ring1 * 0.65, 0, Math.PI * 2);
      impactCtx.fill();
    }

    function renderFrame(now) {
      if (!pageVisible) return;
      drawBackground(now);
      drawImpactScene(now || performance.now());
      if (!prefersReducedMotion) animationFrame = window.requestAnimationFrame(renderFrame);
    }

    function renderStatic() {
      drawBackground(performance.now());
      drawImpactScene(performance.now());
    }

    function syncShockRailSelection(key) {
      document.querySelectorAll('#hero-shock-rail .hero-shock-pill').forEach(function (pill) {
        pill.classList.toggle('is-active', pill.getAttribute('data-commodity') === key);
      });
    }

    function setActiveSceneByIndex(index) {
      if (!movers.length) return;
      activeIndex = (index + movers.length) % movers.length;
      var pair = movers[activeIndex];
      updateImpactCopy(buildSceneData(pair[0], pair[1]));
      syncShockRailSelection(pair[0]);
      renderStatic();
    }

    function startRotation() {
      if (prefersReducedMotion || movers.length < 2) return;
      window.clearInterval(rotationTimer);
      rotationTimer = window.setInterval(function () {
        if (hoveredNode) return;
        setActiveSceneByIndex(activeIndex + 1);
      }, 4400);
    }

    function handlePointer(clientX, clientY) {
      if (!impactSceneEl || !sceneNodes.length) return;
      var rect = impactSceneEl.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      var nearest = null;
      var nearestDistance = Infinity;
      sceneNodes.forEach(function (node) {
        var dx = node.x - x;
        var dy = node.y - y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = node;
        }
      });
      hoveredNode = nearestDistance <= 26 ? nearest : null;
      if (impactTooltip) {
        if (hoveredNode) {
          impactTooltip.hidden = false;
          impactTooltip.innerHTML = '<strong>' + hoveredNode.label + '</strong><br>' + hoveredNode.note;
          impactTooltip.style.left = hoveredNode.x + 'px';
          impactTooltip.style.top = hoveredNode.y + 'px';
        } else {
          impactTooltip.hidden = true;
        }
      }
      renderStatic();
    }

    function syncHeroPointer(clientX, clientY) {
      if (!heroCanvas) return;
      var rect = heroCanvas.getBoundingClientRect();
      heroPointer.x = clientX - rect.left;
      heroPointer.y = clientY - rect.top;
      heroPointer.active = heroPointer.x >= 0 && heroPointer.x <= rect.width && heroPointer.y >= 0 && heroPointer.y <= rect.height;
    }

    function loadHeroData(prices) {
      movers = Object.entries(prices)
        .filter(function (entry) { return entry[1] && typeof entry[1].change_pct === 'number' && !Number.isNaN(entry[1].change_pct); })
        .sort(function (a, b) { return Math.abs(b[1].change_pct) - Math.abs(a[1].change_pct); })
        .slice(0, 5);
      if (!movers.length) movers = Object.entries(fallbackPrices);
      setActiveSceneByIndex(0);
      window.setTimeout(function () {
        if (activeScene) syncShockRailSelection(activeScene.key);
      }, 180);
      startRotation();
      if (prefersReducedMotion) {
        renderStatic();
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    }

    if (impactSceneEl) {
      impactSceneEl.addEventListener('mousemove', function (event) {
        handlePointer(event.clientX, event.clientY);
      }, { passive: true });
      impactSceneEl.addEventListener('mouseleave', function () {
        hoveredNode = null;
        if (impactTooltip) impactTooltip.hidden = true;
        renderStatic();
      });
      impactSceneEl.addEventListener('click', function () {
        if (movers.length > 1) setActiveSceneByIndex(activeIndex + 1);
      });
    }

    document.addEventListener('click', function (event) {
      var pill = event.target.closest('#hero-shock-rail .hero-shock-pill');
      if (!pill) return;
      var key = pill.getAttribute('data-commodity');
      if (!key) return;
      var foundIndex = movers.findIndex(function (entry) { return entry[0] === key; });
      if (foundIndex >= 0) {
        event.preventDefault();
        setActiveSceneByIndex(foundIndex);
      }
    });

    window.addEventListener('mousemove', function (event) {
      syncHeroPointer(event.clientX, event.clientY);
    }, { passive: true });
    window.addEventListener('touchmove', function (event) {
      if (!event.touches || !event.touches[0]) return;
      syncHeroPointer(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('mouseleave', function () {
      heroPointer.active = false;
    });
    window.addEventListener('resize', function () {
      isMobileViewport = window.innerWidth <= 768;
      backgroundStars = [];
      renderStatic();
    });
    document.addEventListener('visibilitychange', function () {
      pageVisible = !document.hidden;
      if (pageVisible) {
        renderStatic();
        if (!prefersReducedMotion && !animationFrame) animationFrame = window.requestAnimationFrame(renderFrame);
      } else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    });

    fetch('/assets/data/prices.json')
      .then(function (response) { return response.json(); })
      .then(loadHeroData)
      .catch(function () { loadHeroData(fallbackPrices); });
  }

  /* ---------- Live Ticker ---------- */
  // Live ticker — reads from already-rendered price cards (no extra fetch)
  function buildTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    let tickerData = [];

    // Read from price-grid cards already on page (Jekyll-rendered)
    document.querySelectorAll('.price-card').forEach(card => {
      const name   = card.querySelector('.price-name')?.textContent?.trim();
      const price  = card.querySelector('.price-value')?.textContent?.trim();
      const change = card.querySelector('.price-change')?.textContent?.trim();
      const up     = card.classList.contains('up');
      if (name && price) tickerData.push({ name, price, change: change || '', up });
    });

    // Fallback: fetch prices.json for non-home pages
    if (!tickerData.length) {
      fetch('/assets/data/prices.json').then(r => r.json()).then(prices => {
        const fmt = (p, u) => (u && u.toLowerCase().includes('cents')) ? p + '¢' : '$' + p;
        const tickerKeys = ['crude_oil','gold','copper','natural_gas','silver','wheat','corn','palladium','uranium','coffee'];
        tickerData = tickerKeys.filter(k => prices[k]).map(k => {
          const c = prices[k];
          const up = c.change_pct >= 0;
          const sign = up ? '+' : '';
          return { name: c.name, price: fmt(c.price, c.unit), change: sign + c.change_pct + '%', up };
        });
        const items2 = [...tickerData, ...tickerData];
        track.innerHTML = items2.map(t => `
          <span class="ticker-item">
            <span class="name">${t.name}</span>
            <span class="price">${t.price}</span>
            <span class="change ${t.up ? 'up' : 'down'}">${t.up ? '▲' : '▼'} ${t.change}</span>
          </span>
        `).join('');
        // Scale ticker duration by item count (base: 10 items = 40s)
        const dur = Math.max(30, tickerData.length * 4);
        track.style.animationDuration = dur + 's';
      }).catch(() => {});
      return; // early return, ticker will be built async
    }

    const items = [...tickerData, ...tickerData];
    track.innerHTML = items.map(t => `
      <span class="ticker-item">
        <span class="name">${t.name}</span>
        <span class="price">${t.price}</span>
        <span class="change ${t.up ? 'up' : 'down'}">${t.up ? '▲' : '▼'} ${t.change}</span>
      </span>
    `).join('');
    // Scale ticker duration by item count (base: 10 items = 40s)
    const duration = Math.max(30, tickerData.length * 4);
    track.style.animationDuration = duration + 's';
  }

  // Build after DOM is ready so price-grid cards exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTicker);
  } else {
    buildTicker();
  }

  /* ---------- TOC Active Highlight ---------- */
  const tocLinks = document.querySelectorAll('.toc-nav a');
  if (tocLinks.length) {
    const headings = Array.from(
      document.querySelectorAll('.post-content h2, .post-content h3')
    );

    const scrollSpy = () => {
      const headerH = (document.querySelector('.site-header')?.offsetHeight || 96) + 16; const scrollY = window.scrollY + headerH;
      let current = '';
      headings.forEach(h => {
        if (h.offsetTop <= scrollY) current = h.id;
      });
      tocLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
      });
    };

    window.addEventListener('scroll', scrollSpy, { passive: true });
    scrollSpy();
  }

  /* ---------- Post TOC Generator ---------- */
  function buildTOC() {
    const content = document.querySelector('.post-content');
    const tocNav  = document.querySelector('.toc-nav');
    if (!content || !tocNav) return;

    const headings = content.querySelectorAll('h2, h3');
    if (!headings.length) return;

    headings.forEach((h, i) => {
      if (!h.id) h.id = 'heading-' + i;
    });

    tocNav.innerHTML = Array.from(headings).map(h => {
      const indent = h.tagName === 'H3' ? ' style="padding-left:24px"' : '';
      return `<li><a href="#${h.id}"${indent}>${h.textContent}</a></li>`;
    }).join('');
  }

  buildTOC();

  /* ---------- Clickable Post Cards ---------- */
  document.querySelectorAll('.post-card').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return;
      var link = card.querySelector('.post-card-title a');
      if (link) link.click();
    });
  });

  /* ---------- Micro-interactions on Cards ---------- */
  document.querySelectorAll('.post-card, .feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- Button ripple effect ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        width:60px;height:60px;
        background:rgba(255,255,255,0.25);
        transform:scale(0);
        animation:ripple 0.6s linear;
        left:${e.clientX - rect.left - 30}px;
        top:${e.clientY - rect.top - 30}px;
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow  = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Add ripple keyframe
  if (!document.getElementById('ripple-style')) {
    const s = document.createElement('style');
    s.id = 'ripple-style';
    s.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0;}}';
    document.head.appendChild(s);
  }


  /* ---------- Discoverable Post Grids ---------- */
  function initDiscoverablePosts(root) {
    const grid = root.querySelector('.posts-grid--paginated');
    if (!grid) return;
    const pagination = root.querySelector('.posts-pagination');
    const chips = root.querySelectorAll('.filter-chip[data-filter]');
    const directionChips = root.querySelectorAll('[data-direction-filter]');
    const searchInput = root.querySelector('input[type="search"]');
    const searchClear = root.querySelector('#archive-search-clear');
    const searchStatus = root.querySelector('#archive-search-status');
    const queryChips = root.querySelectorAll('[data-query-chip]');
    const sortSelect = root.querySelector('[data-sort-select]');
    const recencySelect = root.querySelector('[data-recency-select]');
    const cards = Array.from(grid.querySelectorAll('[data-post-card]'));
    if (!cards.length) return;

    const pageSize = parseInt(grid.dataset.pageSize || '6', 10);
    let currentFilter = 'all';
    let currentDirection = 'all';
    let currentPage = 1;
    let currentSearch = '';
    let currentSort = 'latest';
    let currentRecency = 'all';
    try {
      const params = new URLSearchParams(window.location.search);
      currentSearch = (params.get('q') || '').trim().toLowerCase();
      currentFilter = (params.get('filter') || 'all').trim().toLowerCase() || 'all';
      currentDirection = (params.get('direction') || 'all').trim().toLowerCase() || 'all';
      currentSort = (params.get('sort') || 'latest').trim().toLowerCase() || 'latest';
      currentRecency = (params.get('window') || 'all').trim().toLowerCase() || 'all';
      if (searchInput && currentSearch) searchInput.value = params.get('q') || '';
      if (sortSelect) sortSelect.value = currentSort;
      if (recencySelect) recencySelect.value = currentRecency;
    } catch (_) {}

    const filterMatchers = {
      all: () => true,
      energy: tags => /energy|oil|crude|gas|uranium/.test(tags),
      metals: tags => /metal|gold|silver|copper|steel|aluminum|palladium|iron-ore/.test(tags),
      agriculture: tags => /agriculture|wheat|corn|coffee|lumber|food/.test(tags),
      battery: tags => /battery|lithium|ev|uranium|clean-energy/.test(tags)
    };

    function syncUrl() {
      try {
        const url = new URL(window.location.href);
        if (currentSearch) url.searchParams.set('q', currentSearch);
        else url.searchParams.delete('q');
        if (currentFilter && currentFilter !== 'all') url.searchParams.set('filter', currentFilter);
        else url.searchParams.delete('filter');
        if (currentDirection && currentDirection !== 'all') url.searchParams.set('direction', currentDirection);
        else url.searchParams.delete('direction');
        if (currentSort && currentSort !== 'latest') url.searchParams.set('sort', currentSort);
        else url.searchParams.delete('sort');
        if (currentRecency && currentRecency !== 'all') url.searchParams.set('window', currentRecency);
        else url.searchParams.delete('window');
        window.history.replaceState({}, '', url.toString());
      } catch (_) {}
    }

    function getVisibleCards() {
      const nowTs = Math.floor(Date.now() / 1000);
      const visible = cards.filter(card => {
        const haystack = (card.dataset.filterTags || '').toLowerCase();
        const searchHaystack = (card.dataset.searchText || card.textContent || '').toLowerCase();
        const direction = (card.dataset.direction || 'neutral').toLowerCase();
        const postDate = parseInt(card.dataset.postDate || '0', 10);
        const matchesFilter = (filterMatchers[currentFilter] || filterMatchers.all)(haystack);
        const matchesSearch = !currentSearch || haystack.includes(currentSearch) || searchHaystack.includes(currentSearch);
        const matchesDirection = currentDirection === 'all' || direction === currentDirection;
        const matchesRecency = currentRecency === 'all' || (postDate && (nowTs - postDate) <= parseInt(currentRecency, 10) * 86400);
        return matchesFilter && matchesSearch && matchesDirection && matchesRecency;
      });
      return visible.sort((a, b) => {
        const aDate = parseInt(a.dataset.postDate || '0', 10);
        const bDate = parseInt(b.dataset.postDate || '0', 10);
        const aTitle = (a.dataset.postTitle || '').toLowerCase();
        const bTitle = (b.dataset.postTitle || '').toLowerCase();
        if (currentSort === 'oldest') return aDate - bDate;
        if (currentSort === 'title_asc') return aTitle.localeCompare(bTitle);
        return bDate - aDate;
      });
    }

    function renderPagination(totalPages, totalItems) {
      if (!pagination) return;
      if (totalItems === 0) {
        pagination.innerHTML = '<p class="pagination-empty">No reports match this filter yet.</p>';
        return;
      }
      if (totalPages <= 1) {
        pagination.innerHTML = `<p class="pagination-status">Showing ${totalItems} report${totalItems === 1 ? '' : 's'}.</p>`;
        return;
      }
      let html = `<button type="button" class="pagination-btn" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button type="button" class="pagination-btn ${i === currentPage ? 'is-active' : ''}" data-page="${i}">${i}</button>`;
      }
      html += `<button type="button" class="pagination-btn" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
      html += `<span class="pagination-status">Page ${currentPage} of ${totalPages}</span>`;
      pagination.innerHTML = html;
    }

    function render() {
      const visibleCards = getVisibleCards();
      const totalPages = Math.max(1, Math.ceil(visibleCards.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      cards.forEach(card => {
        card.hidden = true;
        card.classList.remove('is-visible-page');
      });

      visibleCards.slice(start, end).forEach(card => {
        card.hidden = false;
        card.classList.add('is-visible-page');
      });

      chips.forEach(btn => btn.classList.toggle('is-active', (btn.dataset.filter || 'all') === currentFilter));
      directionChips.forEach(btn => btn.classList.toggle('is-active', (btn.dataset.directionFilter || 'all') === currentDirection));
      queryChips.forEach(chip => chip.classList.toggle('is-active', (chip.dataset.queryChip || '').toLowerCase() === currentSearch));
      if (searchStatus) {
        const filterLabel = currentFilter === 'all' ? 'all sectors' : currentFilter;
        const directionLabel = currentDirection === 'all' ? 'all signals' : currentDirection;
        const recencyLabel = currentRecency === 'all' ? 'all time' : `last ${currentRecency}d`;
        searchStatus.textContent = currentSearch
          ? `Showing ${visibleCards.length} report${visibleCards.length === 1 ? '' : 's'} for “${currentSearch}” in ${filterLabel} · ${directionLabel} · ${recencyLabel}.`
          : `Showing ${visibleCards.length} report${visibleCards.length === 1 ? '' : 's'} in ${filterLabel} · ${directionLabel} · ${recencyLabel}.`;
      }
      if (searchClear) searchClear.hidden = !currentSearch;

      renderPagination(totalPages, visibleCards.length);
      syncUrl();
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        currentFilter = chip.dataset.filter || 'all';
        currentPage = 1;
        render();
      });
    });

    directionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        currentDirection = chip.dataset.directionFilter || 'all';
        currentPage = 1;
        render();
      });
    });

    searchInput?.addEventListener('input', () => {
      currentSearch = (searchInput.value || '').trim().toLowerCase();
      currentPage = 1;
      render();
    });

    searchClear?.addEventListener('click', () => {
      currentSearch = '';
      currentPage = 1;
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      render();
    });

    queryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        currentSearch = (chip.dataset.queryChip || '').trim().toLowerCase();
        currentPage = 1;
        if (searchInput) searchInput.value = chip.dataset.queryChip || '';
        render();
      });
    });

    sortSelect?.addEventListener('change', () => {
      currentSort = (sortSelect.value || 'latest').trim().toLowerCase();
      currentPage = 1;
      render();
    });

    recencySelect?.addEventListener('change', () => {
      currentRecency = (recencySelect.value || 'all').trim().toLowerCase();
      currentPage = 1;
      render();
    });

    pagination?.addEventListener('click', e => {
      const btn = e.target.closest('[data-page]');
      if (!btn) return;
      currentPage = parseInt(btn.dataset.page || '1', 10);
      render();
      const top = grid.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    });

    render();
  }

  document.querySelectorAll('.section, .archive-section').forEach(initDiscoverablePosts);

  const PROFILE_KEY = 'cn_profile_v1';

  function uniqueList(values) {
    return Array.from(new Set((values || []).map(v => String(v || '').trim()).filter(Boolean)));
  }

  function normalizeProfile(raw) {
    raw = raw || {};
    return {
      role: String(raw.role || '').trim(),
      commodities: uniqueList(raw.commodities),
      watchlist: uniqueList(raw.watchlist),
      events: uniqueList(raw.events),
      workflow: String(raw.workflow || '').trim(),
      updatedAt: raw.updatedAt || null
    };
  }

  function getProfile() {
    try {
      return normalizeProfile(JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'));
    } catch (err) {
      return normalizeProfile({});
    }
  }

  function saveProfile(next) {
    const profile = normalizeProfile({ ...getProfile(), ...(next || {}), updatedAt: new Date().toISOString() });
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch (err) {}
    document.dispatchEvent(new CustomEvent('cn:profile-updated', { detail: profile }));
    return profile;
  }

  function addProfileItems(field, values) {
    const profile = getProfile();
    profile[field] = uniqueList([...(profile[field] || []), ...(values || [])]);
    return saveProfile(profile);
  }

  function titleize(value) {
    return String(value || '')
      .split(/[-_]/g)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function formatRelativeProfileTime(isoString) {
    if (!isoString) return 'Not saved yet';
    var date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return 'Saved recently';
    var diffMs = Date.now() - date.getTime();
    if (diffMs < 60 * 1000) return 'Updated just now';
    if (diffMs < 60 * 60 * 1000) return 'Updated ' + Math.max(1, Math.round(diffMs / (60 * 1000))) + 'm ago';
    if (diffMs < 24 * 60 * 60 * 1000) return 'Updated ' + Math.max(1, Math.round(diffMs / (60 * 60 * 1000))) + 'h ago';
    return 'Updated ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getEventPlaybookHref(eventKey) {
    var map = {
      opec: '/before-opec-oil-playbook/',
      wasde: '/before-wasde-grains-playbook/',
      fed: '/before-fed-metals-playbook/'
    };
    return map[String(eventKey || '').toLowerCase()] || '';
  }

  function normalizePathname(path) {
    var value = String(path || '/').split('?')[0].split('#')[0] || '/';
    if (value.length > 1 && value.endsWith('/')) return value.slice(0, -1);
    return value || '/';
  }

  function selectProfileAction(candidates, disallowedHrefs) {
    var blocked = (disallowedHrefs || []).map(normalizePathname);
    var currentPath = typeof window !== 'undefined' ? normalizePathname(window.location.pathname || '/') : '/';
    for (var i = 0; i < (candidates || []).length; i += 1) {
      var candidate = candidates[i];
      if (!candidate || !candidate.href) continue;
      var candidatePath = normalizePathname(candidate.href);
      if (candidatePath === currentPath) continue;
      if (blocked.indexOf(candidatePath) !== -1) continue;
      return candidate;
    }
    var genericFallbacks = [
      { href: '/start/', label: 'Build my workflow' },
      { href: '/simulator/', label: 'Run simulator with my watchlist' },
      { href: '/pricing/', label: 'See Free vs Pro' },
      { href: '/reports/', label: 'Open live reports' }
    ];
    for (var j = 0; j < genericFallbacks.length; j += 1) {
      var fallback = genericFallbacks[j];
      var fallbackPath = normalizePathname(fallback.href);
      if (fallbackPath === currentPath) continue;
      if (blocked.indexOf(fallbackPath) !== -1) continue;
      return fallback;
    }
    return { href: '/start/', label: 'Build my workflow' };
  }

  function buildProfileRecommendations(profile) {
    profile = profile || getProfile();
    var firstCommodity = profile.commodities[0] || '';
    var firstEvent = profile.events[0] || '';
    var firstCommodityHref = firstCommodity ? '/commodities/' + firstCommodity.replace(/_/g, '-').replace(/\s+/g, '-').toLowerCase() + '/' : '/start/';
    var firstEventHref = getEventPlaybookHref(firstEvent);
    var roleHrefMap = {
      investor: '/for-self-directed-investors/',
      analyst: '/for-equity-analysts/',
      operator: '/for-operators-and-procurement/'
    };
    var roleHref = roleHrefMap[String(profile.role || '').toLowerCase()] || '/start/';
    var hasSaved = !!(profile.role || profile.commodities.length || profile.watchlist.length || profile.events.length);
    var primaryAction = selectProfileAction([
      firstCommodity ? { href: firstCommodityHref, label: 'Open ' + titleize(firstCommodity) + ' hub' } : null,
      firstEventHref ? { href: firstEventHref, label: 'Open ' + titleize(firstEvent) + ' playbook' } : null,
      profile.watchlist.length ? { href: '/simulator/', label: 'Run simulator with my watchlist' } : null,
      profile.role ? { href: roleHref, label: 'Continue my workflow' } : null,
      { href: '/start/', label: 'Build my workflow' },
      { href: '/pricing/', label: 'See Free vs Pro' }
    ]);
    var secondaryAction = selectProfileAction([
      profile.watchlist.length ? { href: '/simulator/', label: 'Run simulator with my watchlist' } : null,
      firstEventHref ? { href: firstEventHref, label: 'Open ' + titleize(firstEvent) + ' playbook' } : null,
      firstCommodity ? { href: firstCommodityHref, label: 'Open ' + titleize(firstCommodity) + ' hub' } : null,
      { href: '/pricing/', label: 'See Free vs Pro' },
      { href: '/start/', label: 'Build my workflow' }
    ], [primaryAction.href]);
    var nextStep = 'Save a role, commodity, and watchlist once, then return to the live setup that matters.';

    if (firstCommodity && profile.watchlist.length) {
      nextStep = 'You already have a saved workflow. Re-open the live hub, then verify the scenario against your saved watchlist before the market reprices.';
    } else if (firstCommodity && profile.events.length) {
      nextStep = 'You have both a tracked commodity and event playbook saved. The fastest route now is hub first, then the relevant event workflow.';
    } else if (firstCommodity) {
      nextStep = 'You have a tracked commodity saved. Next step: add watchlist names so simulator relevance becomes personal instead of generic.';
    } else if (profile.role) {
      nextStep = 'Role saved. Next step: save 2–3 commodities so CommodityNode can route you into the right live setups faster.';
    }

    return {
      hasSaved: hasSaved,
      primaryHref: primaryAction.href,
      primaryLabel: primaryAction.label,
      secondaryHref: secondaryAction.href,
      secondaryLabel: secondaryAction.label,
      nextStep: nextStep,
      updatedText: formatRelativeProfileTime(profile.updatedAt),
      commodityCount: profile.commodities.length,
      watchlistCount: profile.watchlist.length,
      eventCount: profile.events.length
    };
  }

  window.CNTrack = function(eventName, props) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, Object.assign({
      page_path: window.location.pathname,
      page_title: document.title
    }, props || {}));
  };

  window.CNProfile = {
    get: getProfile,
    save: saveProfile,
    addCommodity: value => addProfileItems('commodities', [value]),
    addWatchlist: values => addProfileItems('watchlist', Array.isArray(values) ? values : [values]),
    addEvent: value => addProfileItems('events', [value])
  };

  function renderProfileSurfaces(profile) {
    profile = profile || getProfile();
    var recommendation = buildProfileRecommendations(profile);
    document.querySelectorAll('[data-profile-empty]').forEach(function(el) {
      el.style.display = recommendation.hasSaved ? 'none' : '';
    });
    document.querySelectorAll('[data-profile-has-saved]').forEach(function(el) {
      el.style.display = recommendation.hasSaved ? '' : 'none';
    });
    document.querySelectorAll('[data-profile-role]').forEach(function(el) {
      el.textContent = profile.role ? titleize(profile.role) : 'Not set yet';
    });
    document.querySelectorAll('[data-profile-commodities]').forEach(function(el) {
      el.textContent = profile.commodities.length ? profile.commodities.map(titleize).join(', ') : 'No tracked commodities yet';
    });
    document.querySelectorAll('[data-profile-watchlist]').forEach(function(el) {
      el.textContent = profile.watchlist.length ? profile.watchlist.join(', ') : 'No saved watchlist names yet';
    });
    document.querySelectorAll('[data-profile-events]').forEach(function(el) {
      el.textContent = profile.events.length ? profile.events.map(titleize).join(', ') : 'No event playbooks saved yet';
    });
    document.querySelectorAll('[data-profile-commodity-count]').forEach(function(el) {
      el.textContent = String(recommendation.commodityCount);
    });
    document.querySelectorAll('[data-profile-watchlist-count]').forEach(function(el) {
      el.textContent = String(recommendation.watchlistCount);
    });
    document.querySelectorAll('[data-profile-event-count]').forEach(function(el) {
      el.textContent = String(recommendation.eventCount);
    });
    document.querySelectorAll('[data-profile-updated]').forEach(function(el) {
      el.textContent = recommendation.updatedText;
    });
    document.querySelectorAll('[data-profile-next-step]').forEach(function(el) {
      el.textContent = recommendation.nextStep;
    });
    document.querySelectorAll('[data-profile-primary-link]').forEach(function(el) {
      el.setAttribute('href', recommendation.primaryHref);
      var existingPrimaryCta = el.getAttribute('data-cta') || '';
      if (!existingPrimaryCta || existingPrimaryCta === 'home_build_workflow' || existingPrimaryCta === 'profile_personalized_primary') {
        el.setAttribute('data-cta', 'profile_personalized_primary');
      }
    });
    document.querySelectorAll('[data-profile-primary-label]').forEach(function(el) {
      el.textContent = recommendation.primaryLabel;
    });
    document.querySelectorAll('[data-profile-secondary-link]').forEach(function(el) {
      el.setAttribute('href', recommendation.secondaryHref);
      var existingSecondaryCta = el.getAttribute('data-cta') || '';
      if (!existingSecondaryCta || existingSecondaryCta === 'home_compare_free_pro' || existingSecondaryCta === 'profile_personalized_secondary') {
        el.setAttribute('data-cta', 'profile_personalized_secondary');
      }
    });
    document.querySelectorAll('[data-profile-secondary-label]').forEach(function(el) {
      el.textContent = recommendation.secondaryLabel;
    });
    document.querySelectorAll('[data-profile-summary]').forEach(function(el) {
      if (recommendation.hasSaved) {
        var bits = [];
        if (profile.role) bits.push(titleize(profile.role));
        if (profile.commodities.length) bits.push(profile.commodities.length + ' commodity workflows saved');
        if (profile.watchlist.length) bits.push(profile.watchlist.length + ' watchlist names');
        if (profile.events.length) bits.push(profile.events.length + ' event playbooks');
        el.textContent = bits.join(' · ');
      } else {
        el.textContent = 'Build your workflow once, then use CommodityNode as a faster daily decision surface.';
      }
    });
  }

  function parseCsvData(value) {
    return String(value || '').split(',').map(v => v.trim()).filter(Boolean);
  }

  document.addEventListener('click', function(event) {
    const saveCommodity = event.target.closest('[data-save-commodity]');
    if (saveCommodity) {
      const value = saveCommodity.getAttribute('data-save-commodity');
      if (value) {
        window.CNProfile.addCommodity(value);
      }
    }

    const saveWatchlist = event.target.closest('[data-save-watchlist]');
    if (saveWatchlist) {
      const values = parseCsvData(saveWatchlist.getAttribute('data-save-watchlist'));
      if (values.length) {
        window.CNProfile.addWatchlist(values);
      }
    }

    const saveEvent = event.target.closest('[data-save-event]');
    if (saveEvent) {
      const value = saveEvent.getAttribute('data-save-event');
      if (value) {
        window.CNProfile.addEvent(value);
      }
    }

    const saveRole = event.target.closest('[data-save-role]');
    if (saveRole) {
      const value = saveRole.getAttribute('data-save-role');
      if (value) {
        window.CNProfile.save({ role: value });
      }
    }

    const personalizedCta = event.target.closest('[data-profile-primary-link], [data-profile-secondary-link]');
    if (personalizedCta && window.CNTrack) {
      const profile = getProfile();
      window.CNTrack('profile_personalized_cta_click', {
        slot: personalizedCta.hasAttribute('data-profile-primary-link') ? 'primary' : 'secondary',
        target_path: personalizedCta.getAttribute('href') || '',
        role: profile.role || '',
        saved_commodities_count: (profile.commodities || []).length,
        saved_watchlist_count: (profile.watchlist || []).length,
        saved_events_count: (profile.events || []).length
      });
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    renderProfileSurfaces(getProfile());
  });
  document.addEventListener('cn:profile-updated', function(event) {
    renderProfileSurfaces(event.detail || getProfile());
  });

  document.addEventListener('click', function(event) {
    const target = event.target.closest('[data-cta]');
    if (!target || typeof window.gtag !== 'function') return;
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: target.getAttribute('data-cta'),
      page_path: window.location.pathname
    });
  });

  /* ---------- Smooth reveal for first visit ---------- */
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.2s ease';
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      document.documentElement.style.opacity = '1';
    });
  });

  // Trigger if already loaded
  if (document.readyState !== 'loading') {
    requestAnimationFrame(() => {
      document.documentElement.style.opacity = '1';
    });
  }


  /* ---------- Scroll-to-Top Button ---------- */
  (function() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });
    btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#22d3ee'; btn.style.transform = 'translateY(-2px)'; });
    btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'rgba(34,211,238,0.3)'; btn.style.transform = ''; });
  })();

})();

/* ---------- Populate Signal Prices from Chart Data ---------- */
async function populateSignals() {
  try {
    const r = await fetch('/assets/data/chart-data.json');
    const data = await r.json();
    const map = { oil: 'CL=F', gold: 'GC=F', copper: 'HG=F', natgas: 'NG=F' };
    Object.entries(map).forEach(([key, sym]) => {
      const entry = data[sym];
      if (!entry) return;
      // Data structure: entry['1M'].candles or entry['3M'].candles
      const period = entry['1M'] || entry['3M'] || entry['1Y'];
      const candles = period && period.candles;
      if (!candles || candles.length < 2) return;
      const price = candles[candles.length - 1].c;
      const prev  = candles[candles.length - 2].c;
      const pct   = ((price - prev) / prev * 100).toFixed(2);
      const up    = parseFloat(pct) > 0;
      const dirEl   = document.getElementById('signal-' + key + '-dir');
      const priceEl = document.getElementById('signal-' + key + '-price');
      if (dirEl) {
        dirEl.textContent = (up ? '▲ ' : '▼ ') + Math.abs(pct) + '%';
        dirEl.style.color = up ? '#22c55e' : '#ef4444';
      }
      if (priceEl) {
        priceEl.textContent = '$' + (price >= 1000 ? price.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}) : price.toFixed(price < 10 ? 3 : 2));
      }
    });
    // Hero WTI
    const wti = data['CL=F'];
    const wtiPeriod = wti && (wti['1M'] || wti['3M']);
    const wtiCandles = wtiPeriod && wtiPeriod.candles;
    if (wtiCandles && wtiCandles.length > 1) {
      const last = wtiCandles[wtiCandles.length-1].c;
      const prev = wtiCandles[wtiCandles.length-2].c;
      const pct  = ((last - prev) / prev * 100).toFixed(2);
      const el = document.getElementById('hero-wti-change');
      if (el) {
        el.textContent = (parseFloat(pct) > 0 ? '+' : '') + pct + '%';
        el.style.color = parseFloat(pct) > 0 ? '#22c55e' : '#ef4444';
        el.className = 'value ' + (parseFloat(pct) > 0 ? 'positive' : 'negative');
      }
    }
  } catch(e) { console.warn('signals:', e); }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', populateSignals);
else populateSignals();
