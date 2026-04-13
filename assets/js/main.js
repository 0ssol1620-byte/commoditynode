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

  /* ---------- Hero Canvas Animation ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes, animFrame;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    const NODE_COUNT = 28;
    const CONNECT_DIST = 160;
    const COLORS = ['#22d3ee', '#fbbf24', '#10b981', '#a855f7', '#f43f5e'];

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 2 + Math.random() * 3,
        color: COLORS[i % COLORS.length],
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    let lastTime = performance.now();

    function drawFrame(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1); // delta in seconds, cap at 100ms
      lastTime = now;
      ctx.clearRect(0, 0, W, H);

      // Update (time-based: consistent speed regardless of frame rate)
      nodes.forEach(n => {
        n.x += n.vx * dt * 60; // normalize to ~60fps feel
        n.y += n.vy * dt * 60;
        n.pulse += dt * 1.2; // ~0.02 per frame at 60fps
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = 1 + Math.sin(n.pulse) * 0.3;
        // Glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6 * pulse);
        grd.addColorStop(0, n.color + '55');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = n.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animFrame = requestAnimationFrame(drawFrame);
    }

    function start() {
      resize();
      initNodes();
      if (animFrame) cancelAnimationFrame(animFrame);
      lastTime = performance.now();
      animFrame = requestAnimationFrame(drawFrame);
    }

    window.addEventListener('resize', () => { resize(); initNodes(); });
    start();
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
    const chips = root.querySelectorAll('.filter-chip');
    const searchInput = root.querySelector('input[type="search"]');
    const searchClear = root.querySelector('#archive-search-clear');
    const searchStatus = root.querySelector('#archive-search-status');
    const queryChips = root.querySelectorAll('[data-query-chip]');
    const cards = Array.from(grid.querySelectorAll('[data-post-card]'));
    if (!cards.length) return;

    const pageSize = parseInt(grid.dataset.pageSize || '6', 10);
    let currentFilter = 'all';
    let currentPage = 1;
    let currentSearch = '';
    try {
      const params = new URLSearchParams(window.location.search);
      currentSearch = (params.get('q') || '').trim().toLowerCase();
      currentFilter = (params.get('filter') || 'all').trim().toLowerCase() || 'all';
      if (searchInput && currentSearch) searchInput.value = params.get('q') || '';
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
        window.history.replaceState({}, '', url.toString());
      } catch (_) {}
    }

    function getVisibleCards() {
      return cards.filter(card => {
        const haystack = (card.dataset.filterTags || '').toLowerCase();
        const searchHaystack = (card.dataset.searchText || card.textContent || '').toLowerCase();
        const matchesFilter = (filterMatchers[currentFilter] || filterMatchers.all)(haystack);
        const matchesSearch = !currentSearch || haystack.includes(currentSearch) || searchHaystack.includes(currentSearch);
        return matchesFilter && matchesSearch;
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
      queryChips.forEach(chip => chip.classList.toggle('is-active', (chip.dataset.queryChip || '').toLowerCase() === currentSearch));
      if (searchStatus) {
        const filterLabel = currentFilter === 'all' ? 'all sectors' : currentFilter;
        searchStatus.textContent = currentSearch
          ? `Showing ${visibleCards.length} report${visibleCards.length === 1 ? '' : 's'} for “${currentSearch}” in ${filterLabel}.`
          : `Showing ${visibleCards.length} report${visibleCards.length === 1 ? '' : 's'} in ${filterLabel}.`;
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
