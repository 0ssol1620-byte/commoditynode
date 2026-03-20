/* ============================================================
   CommodityNode — main.js
   Animations, interactions, scroll effects
   ============================================================ */

(function () {
  'use strict';

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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    animatedEls.forEach(el => observer.observe(el));
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

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Update
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
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
      drawFrame();
    }

    window.addEventListener('resize', () => { resize(); initNodes(); });
    start();
  }

  /* ---------- Live Ticker ---------- */
  // Live ticker from prices.json
  async function buildTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;

    let tickerData = [];
    try {
      const res = await fetch('/assets/data/prices.json');
      if (res.ok) {
        const prices = await res.json();
        tickerData = Object.values(prices).map(p => ({
          name: p.name,
          price: '$' + (+p.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: (p.change_pct >= 0 ? '+' : '') + p.change_pct + '%',
          up: p.change_pct >= 0,
        }));
      }
    } catch (e) { /* fallback to static */ }

    // Fallback if fetch fails
    if (!tickerData.length) {
      tickerData = [
        { name: 'Crude Oil', price: '$93.99', change: '-2.31%', up: false },
        { name: 'Gold',      price: '$4,996', change: '-0.09%', up: false },
        { name: 'Copper',    price: '$5.73',  change: '+0.02%', up: true  },
        { name: 'Nat. Gas',  price: '$2.94',  change: '-3.17%', up: false },
        { name: 'Silver',    price: '$79.79', change: '+0.33%', up: true  },
        { name: 'Wheat',     price: '$591.8', change: '+0.34%', up: true  },
      ];
    }

    const items = [...tickerData, ...tickerData];
    track.innerHTML = items.map(t => `
      <span class="ticker-item">
        <span class="name">${t.name}</span>
        <span class="price">${t.price}</span>
        <span class="change ${t.up ? 'up' : 'down'}">${t.up ? '▲' : '▼'} ${t.change}</span>
      </span>
    `).join('');
  }

  buildTicker();

  /* ---------- TOC Active Highlight ---------- */
  const tocLinks = document.querySelectorAll('.toc-nav a');
  if (tocLinks.length) {
    const headings = Array.from(
      document.querySelectorAll('.post-content h2, .post-content h3')
    );

    const scrollSpy = () => {
      const scrollY = window.scrollY + 100;
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

  /* ---------- Smooth reveal for first visit ---------- */
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.4s ease';
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

})();
