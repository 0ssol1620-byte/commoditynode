/* ============================================================
   CommodityNode — Clerk Auth System
   Sign in/up, Trading Note blur, Report metering
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Constants ---------- */
  var FREE_REPORTS_PER_MONTH = 3;
  var ADMIN_EMAILS = ['0ssol1620@gmail.com'];

  function isAdmin(user) {
    if (!user) return false;
    var emails = user.emailAddresses || [];
    for (var i = 0; i < emails.length; i++) {
      if (ADMIN_EMAILS.indexOf(emails[i].emailAddress) >= 0) return true;
    }
    return false;
  }
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
    if (wrap) {
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

    // 모바일 nav 안 버튼
    var navWrap = document.getElementById('clerk-auth-nav');
    if (navWrap) {
      navWrap.innerHTML =
        '<button class="clerk-btn clerk-btn-primary" id="clerk-signup-nav">Sign Up Free</button>' +
        '<button class="clerk-btn clerk-btn-ghost" id="clerk-signin-nav">Sign In</button>';
      document.getElementById('clerk-signup-nav').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.openSignUp();
      });
      document.getElementById('clerk-signin-nav').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.openSignIn();
      });
    }

    // 모바일 아바타 영역 비우기
    var mobileWrap = document.getElementById('clerk-auth-area-mobile');
    if (mobileWrap) mobileWrap.innerHTML = '';
  }

  function buildUserMenu(user) {
    var avatar = user.imageUrl || '';
    var name = user.firstName || user.username || 'User';
    var initial = name.charAt(0).toUpperCase();
    var avatarHtml = avatar
      ? '<img class="clerk-avatar" src="' + avatar + '" alt="' + name + '" />'
      : '<div class="clerk-avatar clerk-avatar-fallback">' + initial + '</div>';

    // 데스크탑 헤더
    var wrap = document.getElementById('clerk-auth-area');
    if (wrap) {
      wrap.innerHTML =
        '<div class="clerk-user-menu">' +
          '<div class="clerk-meter-badge" id="clerk-meter-badge"></div>' +
          '<div class="clerk-avatar-wrap" id="clerk-avatar-wrap" title="Account settings" style="cursor:pointer;">' +
            avatarHtml +
          '</div>' +
          '<button class="clerk-btn clerk-btn-ghost clerk-btn-sm" id="clerk-signout">Sign Out</button>' +
        '</div>';
      document.getElementById('clerk-avatar-wrap').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.openUserProfile();
      });
      document.getElementById('clerk-signout').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.signOut().then(function () { location.reload(); });
      });
    }

    // 모바일 햄버거 옆 아바타
    var mobileWrap = document.getElementById('clerk-auth-area-mobile');
    if (mobileWrap) {
      mobileWrap.innerHTML =
        '<div class="clerk-avatar-wrap" id="clerk-avatar-wrap-mobile" title="Account settings" style="cursor:pointer;">' +
          avatarHtml +
        '</div>';
      document.getElementById('clerk-avatar-wrap-mobile').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.openUserProfile();
      });
    }

    // 모바일 nav 안
    var navWrap = document.getElementById('clerk-auth-nav');
    if (navWrap) {
      navWrap.innerHTML =
        '<div class="clerk-meter-badge" id="clerk-meter-badge-nav"></div>' +
        '<div class="clerk-user-info">' +
          avatarHtml +
          '<span>' + name + '</span>' +
        '</div>' +
        '<button class="clerk-btn clerk-btn-ghost" id="clerk-signout-nav">Sign Out</button>';
      document.getElementById('clerk-signout-nav').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.signOut().then(function () { location.reload(); });
      });
    }
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
        '<div class="trading-note-overlay">' +
          '<div class="tno-inner">' +
            '<div class="tno-social-proof">Pro members made <strong>3 calls this week</strong> based on this signal.</div>' +
            '<h4 style="color:#e2e8f0;font-size:1.1rem;margin-bottom:8px">Trading Note</h4>' +
            '<p style="color:#94a3b8;font-size:0.88rem">Entry levels, position sizing, and risk management guidance — available to Pro members.</p>' +
            '<button class="clerk-btn clerk-btn-primary tno-btn" onclick="if(window.Clerk)window.Clerk.openSignUp()">' +
              'Read Trading Note — Pro $19/mo' +
            '</button>' +
            '<p class="tno-small">Cancel anytime · Most members recover cost in first week</p>' +
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

  function showMeterBanner(used, total) {
    if (used < 2) return;
    var existing = document.getElementById('meter-upgrade-banner');
    if (existing) return;
    var pct = Math.round((used / total) * 100);
    var isLast = used >= total;
    var banner = document.createElement('div');
    banner.id = 'meter-upgrade-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9000;'
      + 'background:' + (isLast ? 'rgba(239,68,68,0.95)' : 'rgba(13,13,24,0.97)') + ';'
      + 'border-top:1px solid ' + (isLast ? 'rgba(239,68,68,0.5)' : 'rgba(34,211,238,0.2)') + ';'
      + 'padding:14px 24px;display:flex;align-items:center;gap:20px;backdrop-filter:blur(12px);flex-wrap:wrap;';
    var msg = isLast
      ? 'You\'ve used all ' + total + ' free reports this month.'
      : 'You\'ve used ' + used + ' of ' + total + ' free reports this month.';
    banner.innerHTML = '<div style="flex:1;min-width:200px">'
      + '<div style="font-size:0.85rem;font-weight:700;color:#e2e8f0;margin-bottom:6px">' + msg + '</div>'
      + '<div style="background:rgba(255,255,255,0.1);border-radius:4px;height:4px;width:200px">'
      + '<div style="background:' + (isLast ? '#ef4444' : '#22d3ee') + ';width:' + pct + '%;height:100%;border-radius:4px;transition:width 0.5s"></div>'
      + '</div></div>'
      + '<div style="font-size:0.78rem;color:#94a3b8">Most Pro members recover $19 in a single informed trade.</div>'
      + '<button onclick="if(window.Clerk)window.Clerk.openSignUp()" style="padding:10px 20px;background:linear-gradient(135deg,#22d3ee,#a855f7);border:none;border-radius:8px;color:#050508;font-weight:800;font-size:0.88rem;cursor:pointer;white-space:nowrap;flex-shrink:0">Unlock Pro — $19/mo</button>'
      + '<button onclick="document.getElementById(\'meter-upgrade-banner\').remove()" style="background:none;border:none;color:#64748b;cursor:pointer;font-size:1.2rem;padding:4px">\u00d7</button>';
    document.body.appendChild(banner);
  }

  function updateMeterBadge(meter) {
    var text = meter.count + '/' + FREE_REPORTS_PER_MONTH + ' free';
    var title = meter.count + ' of ' + FREE_REPORTS_PER_MONTH + ' free reports used this month';
    ['clerk-meter-badge', 'clerk-meter-badge-nav'].forEach(function(id) {
      var badge = document.getElementById(id);
      if (!badge) return;
      badge.textContent = text;
      badge.title = title;
      if (meter.count >= FREE_REPORTS_PER_MONTH) badge.classList.add('cn-meter-full');
    });
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

    // 로고 클릭시 모달 유지 — 페이지 이동 막고 홈으로 navigate
    var logo = document.querySelector('a.logo');
    if (logo) {
      logo.addEventListener('click', function (e) {
        var modal = document.querySelector('.cl-modalBackdrop, .cl-modal, [data-clerk-modal]');
        if (modal) {
          e.preventDefault();
          window.Clerk.closeSignIn && window.Clerk.closeSignIn();
          window.Clerk.closeSignUp && window.Clerk.closeSignUp();
          window.location.href = logo.href;
        }
      });
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

      function renderAuth() {
        var user = window.Clerk.user;
        if (user) {
          buildUserMenu(user);
          var meter = getMeter();
          if (isPostPage()) {
            var isNewView = !sessionStorage.getItem('cn_viewed_' + location.pathname);
            if (isNewView) {
              meter = incrementMeter();
              sessionStorage.setItem('cn_viewed_' + location.pathname, '1');
            }
            if (meter.count > FREE_REPORTS_PER_MONTH && !isAdmin(user)) {
              blurTradingNote('meter');
            }
          }
          // 모든 페이지에서 뱃지 표시
          updateMeterBadge(meter);
          // 미터 배너 (2개 이상 사용 시)
          if (!isAdmin(user)) {
            showMeterBanner(meter.count, FREE_REPORTS_PER_MONTH);
          }
        } else {
          buildAuthButtons();
          if (isPostPage()) {
            blurTradingNote('login');
          }
        }
      }

      // 초기 렌더
      renderAuth();

      // 세션 변경 이벤트 감지 (로그인/로그아웃 즉시 반영)
      window.Clerk.addListener(function (resources) {
        renderAuth();
      });

    }).catch(function (err) {
      console.warn('[CommodityNode] Clerk load error:', err);
      var authArea = document.getElementById('clerk-auth-area');
      if (authArea) authArea.style.display = 'none';
    });
  }

  // Wait for DOM + Clerk script load
  function waitForClerk(cb, tries) {
    tries = tries || 0;
    if (window.Clerk && window.Clerk.load) { cb(); return; }
    if (tries > 40) { cb(); return; } // 4초 타임아웃
    setTimeout(function () { waitForClerk(cb, tries + 1); }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { waitForClerk(init); });
  } else {
    waitForClerk(init);
  }
})();
