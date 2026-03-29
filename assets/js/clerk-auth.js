/* ============================================================
   CommodityNode — Clerk Auth System
   Sign in/up, Trading Note blur, Report metering
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Constants ---------- */
  var FREE_REPORTS_PER_MONTH = 3;
  var METER_KEY = 'cn_meter';
  var PRO_LINK = '#'; // Paddle payment link placeholder

  /* ---------- Helpers ---------- */
  function currentMonth() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function getMeter() {
    try {
      var raw = localStorage.getItem(METER_KEY);
      if (!raw) return { month: currentMonth(), count: 0 };
      var m = JSON.parse(raw);
      if (m.month !== currentMonth()) return { month: currentMonth(), count: 0 };
      return m;
    } catch (e) {
      return { month: currentMonth(), count: 0 };
    }
  }

  function setMeter(meter) {
    try { localStorage.setItem(METER_KEY, JSON.stringify(meter)); } catch (e) { /* noop */ }
  }

  function incrementMeter() {
    var m = getMeter();
    m.count += 1;
    setMeter(m);
    return m;
  }

  /* ---------- DOM Builders ---------- */

  function buildAuthButtons() {
    var wrap = document.getElementById('clerk-auth-area');
    if (!wrap) return;

    wrap.innerHTML =
      '<button class="clerk-btn clerk-btn-ghost" id="clerk-signin">Sign In</button>' +
      '<button class="clerk-btn clerk-btn-primary" id="clerk-signup">Sign Up Free</button>';

    document.getElementById('clerk-signin').addEventListener('click', function () {
      if (window.Clerk) window.Clerk.openSignIn();
    });
    document.getElementById('clerk-signup').addEventListener('click', function () {
      if (window.Clerk) window.Clerk.openSignUp();
    });
  }

  function buildUserMenu(user) {
    var wrap = document.getElementById('clerk-auth-area');
    if (!wrap) return;

    var avatar = user.imageUrl || '';
    var name = user.firstName || user.username || 'User';

    wrap.innerHTML =
      '<div class="clerk-user-menu">' +
        '<div class="clerk-meter-badge" id="clerk-meter-badge"></div>' +
        '<div class="clerk-avatar-wrap" id="clerk-avatar-wrap">' +
          (avatar
            ? '<img class="clerk-avatar" src="' + avatar + '" alt="' + name + '" />'
            : '<div class="clerk-avatar clerk-avatar-fallback">' + name.charAt(0).toUpperCase() + '</div>') +
        '</div>' +
        '<button class="clerk-btn clerk-btn-ghost clerk-btn-sm" id="clerk-signout">Sign Out</button>' +
      '</div>';

    document.getElementById('clerk-signout').addEventListener('click', function () {
      if (window.Clerk) window.Clerk.signOut().then(function () { location.reload(); });
    });
  }

  /* ---------- Trading Note Blur ---------- */

  function findTradingNoteSection() {
    // Strategy: find an h2/h3 that contains "Trading Note" and blur everything after it
    var headings = document.querySelectorAll('.post-content h2, .post-content h3');
    for (var i = 0; i < headings.length; i++) {
      if (/trading\s*note/i.test(headings[i].textContent)) {
        return headings[i];
      }
    }
    // Also check by ID
    return document.getElementById('trading-note');
  }

  function collectSectionElements(heading) {
    // Collect heading + all siblings until next same-level heading or end
    var elements = [heading];
    var level = heading.tagName; // H2 or H3
    var sibling = heading.nextElementSibling;
    while (sibling) {
      if (sibling.tagName === level || (level === 'H2' && sibling.tagName === 'H2') || (level === 'H3' && sibling.tagName === 'H2')) {
        break;
      }
      elements.push(sibling);
      sibling = sibling.nextElementSibling;
    }
    return elements;
  }

  function blurTradingNote(reason) {
    var heading = findTradingNoteSection();
    if (!heading) return;

    var elements = collectSectionElements(heading);
    if (!elements.length) return;

    // Wrap in a container
    var wrapper = document.createElement('div');
    wrapper.className = 'cn-blur-wrapper';
    heading.parentNode.insertBefore(wrapper, heading);

    var blurInner = document.createElement('div');
    blurInner.className = 'cn-blur-content';
    elements.forEach(function (el) { blurInner.appendChild(el); });
    wrapper.appendChild(blurInner);

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'cn-blur-overlay';

    var icon = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>';

    if (reason === 'login') {
      overlay.innerHTML =
        '<div class="cn-blur-cta">' +
          icon +
          '<h3>Sign up to read the Trading Note</h3>' +
          '<p>Create a free account to access trading insights and analysis.</p>' +
          '<div class="cn-blur-cta-buttons">' +
            '<button class="clerk-btn clerk-btn-primary" id="blur-signup">Sign Up Free</button>' +
            '<button class="clerk-btn clerk-btn-ghost" id="blur-signin">Already have an account? Sign In</button>' +
          '</div>' +
        '</div>';
    } else {
      overlay.innerHTML =
        '<div class="cn-blur-cta">' +
          icon +
          '<h3>Upgrade to Pro</h3>' +
          '<p>You\'ve used all ' + FREE_REPORTS_PER_MONTH + ' free reports this month.<br>Unlock unlimited access to Trading Notes.</p>' +
          '<p class="cn-blur-price">Free trial for 1 month → then $19/mo</p>' +
          '<div class="cn-blur-cta-buttons">' +
            '<a class="clerk-btn clerk-btn-primary" href="' + PRO_LINK + '" id="blur-upgrade">Start Free Trial</a>' +
          '</div>' +
        '</div>';
    }

    wrapper.appendChild(overlay);

    // Bind buttons
    setTimeout(function () {
      var signupBtn = document.getElementById('blur-signup');
      var signinBtn = document.getElementById('blur-signin');
      if (signupBtn) signupBtn.addEventListener('click', function () { if (window.Clerk) window.Clerk.openSignUp(); });
      if (signinBtn) signinBtn.addEventListener('click', function () { if (window.Clerk) window.Clerk.openSignIn(); });
    }, 0);
  }

  function updateMeterBadge(meter) {
    var badge = document.getElementById('clerk-meter-badge');
    if (!badge) return;
    badge.textContent = meter.count + '/' + FREE_REPORTS_PER_MONTH + ' free';
    badge.title = meter.count + ' of ' + FREE_REPORTS_PER_MONTH + ' free reports used this month';
    if (meter.count >= FREE_REPORTS_PER_MONTH) {
      badge.classList.add('cn-meter-full');
    }
  }

  /* ---------- Main Init ---------- */

  function isPostPage() {
    return !!document.querySelector('.post-content');
  }

  function init() {
    // Wait for Clerk to be available
    if (!window.Clerk) {
      // Clerk script failed to load — graceful fallback, show content as-is
      var authArea = document.getElementById('clerk-auth-area');
      if (authArea) authArea.style.display = 'none';
      return;
    }

    window.Clerk.load({
      appearance: {
        baseTheme: undefined,
        variables: {
          colorPrimary: '#22d3ee',
          colorBackground: '#0d0d14',
          colorText: '#f0f0f5',
          colorTextSecondary: '#9494a8',
          colorInputBackground: '#13131e',
          colorInputText: '#f0f0f5',
          borderRadius: '8px'
        },
        elements: {
          card: { backgroundColor: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)' },
          headerTitle: { color: '#f0f0f5' },
          headerSubtitle: { color: '#9494a8' },
          formButtonPrimary: { backgroundColor: '#22d3ee', color: '#050508' },
          footerActionLink: { color: '#22d3ee' },
          modalBackdrop: { backgroundColor: 'rgba(5,5,8,0.85)' }
        }
      }
    }).then(function () {
      var user = window.Clerk.user;

      if (user) {
        // Logged in
        buildUserMenu(user);

        if (isPostPage()) {
          // Metering
          var meter = getMeter();
          var isNewView = !sessionStorage.getItem('cn_viewed_' + location.pathname);
          if (isNewView) {
            meter = incrementMeter();
            sessionStorage.setItem('cn_viewed_' + location.pathname, '1');
          }
          updateMeterBadge(meter);

          // If over limit, blur
          if (meter.count > FREE_REPORTS_PER_MONTH) {
            blurTradingNote('meter');
          }
        }
      } else {
        // Not logged in
        buildAuthButtons();

        if (isPostPage()) {
          blurTradingNote('login');
        }
      }
    }).catch(function (err) {
      console.warn('[CommodityNode] Clerk load error:', err);
      // Graceful fallback
      var authArea = document.getElementById('clerk-auth-area');
      if (authArea) authArea.style.display = 'none';
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
