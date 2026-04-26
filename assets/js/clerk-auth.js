/* ============================================================
   CommodityNode — Clerk Auth System
   Sign in/up, Research Note blur, Report metering, Pro gating
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Constants ---------- */
  var FREE_REPORTS_PER_MONTH = 3;
  var ADMIN_EMAIL_HASHES = ['613152878'];

  function hashEmail(email) {
    var input = String(email || '').trim().toLowerCase();
    var h = 2166136261;
    for (var i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return String(h);
  }

  function isAdmin(user) {
    if (!user) return false;
    var meta = user.publicMetadata || {};
    if (meta.role === 'admin' || meta.admin === true || meta.plan === 'admin') return true;
    var emails = user.emailAddresses || [];
    for (var i = 0; i < emails.length; i++) {
      if (ADMIN_EMAIL_HASHES.indexOf(hashEmail(emails[i].emailAddress)) >= 0) return true;
    }
    return false;
  }

  function isPro(user) {
    if (!user) return false;
    if (isAdmin(user)) return true;
    var meta = user.publicMetadata || {};
    return meta.plan === 'pro' || meta.plan === 'enterprise';
  }

  function isEnterprise(user) {
    if (!user) return false;
    if (isAdmin(user)) return true;
    var meta = user.publicMetadata || {};
    return meta.plan === 'enterprise';
  }

  var METER_KEY = 'cn_meter';
  var PRO_LINK = '/pricing/';
  var PRO_MONTHLY_URL = '/pricing/';
  var PRO_ANNUAL_URL = '/pricing/';
  var SIGNUP_STARTED_KEY = 'cn_signup_started';
  var SIGNUP_SOURCE_KEY = 'cn_signup_source';
  var SIGNUP_COMPLETE_KEY = 'cn_signup_complete_tracked';

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


  function track(name, props) {
    if (window.CNTrack) window.CNTrack(name, props);
  }

  function markSignupStart(source) {
    try {
      localStorage.setItem(SIGNUP_STARTED_KEY, '1');
      localStorage.setItem(SIGNUP_SOURCE_KEY, source || 'unknown');
    } catch (e) {}
    track('signup_start', { source: source || 'unknown' });
  }

  function maybeTrackSignupComplete(user) {
    if (!user) return;
    var started = null;
    var source = 'unknown';
    try {
      started = localStorage.getItem(SIGNUP_STARTED_KEY);
      source = localStorage.getItem(SIGNUP_SOURCE_KEY) || 'unknown';
    } catch (e) {}
    if (!started) return;
    var trackedKey = String((user && user.id) || '') + ':' + String((user && user.updatedAt) || '1');
    try {
      if (localStorage.getItem(SIGNUP_COMPLETE_KEY) === trackedKey) return;
      localStorage.setItem(SIGNUP_COMPLETE_KEY, trackedKey);
      localStorage.removeItem(SIGNUP_STARTED_KEY);
      localStorage.removeItem(SIGNUP_SOURCE_KEY);
    } catch (e) {}
    var profile = window.CNProfile && window.CNProfile.get ? window.CNProfile.get() : { commodities: [], watchlist: [], events: [], role: '' };
    track('signup_complete', {
      source: source,
      role: profile.role || '',
      saved_commodities_count: (profile.commodities || []).length,
      saved_watchlist_count: (profile.watchlist || []).length,
      saved_events_count: (profile.events || []).length,
      plan_hint: (user.publicMetadata && user.publicMetadata.plan) || 'free'
    });
  }

  /* ---------- Pro Modal ---------- */

  function showProModal(featureName, description) {
    var existing = document.getElementById('cn-pro-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'cn-pro-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(5,5,8,0.88);backdrop-filter:blur(16px);padding:20px;animation:cnFadeIn 0.2s ease;';

    modal.innerHTML =
      '<style>@keyframes cnFadeIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}</style>'
      + '<div style="background:#0d0d14;border:1px solid rgba(34,211,238,0.2);border-radius:20px;padding:36px 32px;max-width:460px;width:100%;position:relative;box-shadow:0 32px 80px rgba(0,0,0,0.7);">'
        + '<button id="cn-pro-modal-close" style="position:absolute;top:14px;right:16px;background:none;border:none;color:#64748b;cursor:pointer;font-size:1.4rem;line-height:1;padding:4px;">&times;</button>'
        + '<div style="font-size:2rem;margin-bottom:10px;">🔒</div>'
        + '<div style="font-size:0.72rem;font-weight:700;color:#22d3ee;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Pro Feature</div>'
        + '<h3 style="color:#e2e8f0;font-size:1.25rem;font-weight:800;margin-bottom:8px;">' + (featureName || 'Upgrade to Pro') + '</h3>'
        + (description ? '<p style="color:#94a3b8;font-size:0.88rem;margin-bottom:20px;line-height:1.65;">' + description + '</p>' : '<div style="margin-bottom:20px"></div>')
        + '<ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:9px;">'
          + '<li style="color:#cbd5e1;font-size:0.85rem;display:flex;align-items:center;gap:10px;"><span style="color:#22d3ee;font-weight:800;font-size:1rem;">✓</span> Premium research archive</li>'
          + '<li style="color:#cbd5e1;font-size:0.85rem;display:flex;align-items:center;gap:10px;"><span style="color:#22d3ee;font-weight:800;font-size:1rem;">✓</span> Forecast uncertainty ranges</li>'
          + '<li style="color:#cbd5e1;font-size:0.85rem;display:flex;align-items:center;gap:10px;"><span style="color:#22d3ee;font-weight:800;font-size:1rem;">✓</span> Full scenario analytics simulator</li>'
          + '<li style="color:#cbd5e1;font-size:0.85rem;display:flex;align-items:center;gap:10px;"><span style="color:#22d3ee;font-weight:800;font-size:1rem;">✓</span> Company exposure analysis</li>'
          + '<li style="color:#cbd5e1;font-size:0.85rem;display:flex;align-items:center;gap:10px;"><span style="color:#22d3ee;font-weight:800;font-size:1rem;">✓</span> Extended Correlation Lookback (60/90D)</li>'
          + '<li style="color:#cbd5e1;font-size:0.85rem;display:flex;align-items:center;gap:10px;"><span style="color:#22d3ee;font-weight:800;font-size:1rem;">✓</span> All 39 Range Tracker Markets</li>'
        + '</ul>'
        + '<a href="' + PRO_MONTHLY_URL + '"  data-access-source="pro_modal" data-plan="pro" style="display:block;text-align:center;padding:14px 20px;border-radius:10px;background:linear-gradient(135deg,#22d3ee,#a855f7);color:#050508;font-weight:800;font-size:0.95rem;text-decoration:none;margin-bottom:10px;transition:opacity 0.2s;" onmouseover="this.style.opacity=\'0.9\'" onmouseout="this.style.opacity=\'1\'">View Research Access Plans &rarr;</a>'
        + '<button id="cn-pro-modal-later" style="display:block;width:100%;text-align:center;background:none;border:none;color:#64748b;font-size:0.82rem;cursor:pointer;padding:8px;">Maybe later</button>'
      + '</div>';

    document.body.appendChild(modal);

    function closeModal() { modal.remove(); }
    document.getElementById('cn-pro-modal-close').addEventListener('click', closeModal);
    document.getElementById('cn-pro-modal-later').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  }

  window.CNAuth = window.CNAuth || {
    isPro: function () { return isPro(window.Clerk && window.Clerk.user); },
    isEnterprise: function () { return isEnterprise(window.Clerk && window.Clerk.user); },
    showProModal: function (featureName, description) { showProModal(featureName, description); }
  };

  /* ---------- DOM Builders ---------- */

  function buildAuthButtons() {
    var wrap = document.getElementById('clerk-auth-area');
    if (wrap) {
      wrap.innerHTML =
        '<button class="clerk-btn clerk-btn-ghost" id="clerk-signin" data-cta="header_sign_in">Sign In</button>' +
        '<button class="clerk-btn clerk-btn-primary" id="clerk-signup" data-cta="header_start_free">Start Free</button>';
      document.getElementById('clerk-signin').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.openSignIn();
      });
      document.getElementById('clerk-signup').addEventListener('click', function () {
        markSignupStart('header');
        markSignupStart('header_mobile');
        window.location.href = '/start/';
      });
    }

    // 모바일 nav 안 버튼
    var navWrap = document.getElementById('clerk-auth-nav');
    if (navWrap) {
      navWrap.innerHTML =
        '<button class="clerk-btn clerk-btn-primary" id="clerk-signup-nav" data-cta="header_start_free_mobile">Start Free</button>' +
        '<button class="clerk-btn clerk-btn-ghost" id="clerk-signin-nav" data-cta="header_sign_in_mobile">Sign In</button>';
      document.getElementById('clerk-signup-nav').addEventListener('click', function () {
        window.location.href = '/start/';
      });
      document.getElementById('clerk-signin-nav').addEventListener('click', function () {
        if (window.Clerk) window.Clerk.openSignIn();
      });
    }

    // 모바일 아바타 영역 비우기
    var mobileWrap = document.getElementById('clerk-auth-area-mobile');
    if (mobileWrap) mobileWrap.innerHTML = '';
  }

  function shouldShowMeterBadge(user) {
    return !!(user && isPostPage() && !isPro(user) && !isAdmin(user));
  }

  function buildUserMenu(user) {
    var avatar = user.imageUrl || '';
    var name = user.firstName || user.username || 'User';
    var initial = name.charAt(0).toUpperCase();
    var avatarHtml = avatar
      ? '<img class="clerk-avatar" src="' + avatar + '" alt="' + name + '" />'
      : '<div class="clerk-avatar clerk-avatar-fallback">' + initial + '</div>';

    var proBadge = isPro(user) ? '<span style="font-size:0.65rem;font-weight:800;background:linear-gradient(135deg,#22d3ee,#a855f7);color:#050508;padding:2px 7px;border-radius:20px;margin-right:6px;vertical-align:middle;">PRO</span>' : '';
    var meterBadgeHtml = shouldShowMeterBadge(user) ? '<div class="clerk-meter-badge" id="clerk-meter-badge"></div>' : '';
    var meterBadgeNavHtml = shouldShowMeterBadge(user) ? '<div class="clerk-meter-badge" id="clerk-meter-badge-nav"></div>' : '';

    // 데스크탑 헤더
    var wrap = document.getElementById('clerk-auth-area');
    if (wrap) {
      wrap.innerHTML =
        '<div class="clerk-user-menu">' +
          proBadge +
          meterBadgeHtml +
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
        meterBadgeNavHtml +
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

  /* ---------- Research Note Blur ---------- */

  function findTradingNoteSection() {
    var headings = document.querySelectorAll('.post-content h2, .post-content h3');
    for (var i = 0; i < headings.length; i++) {
      if (/trading\s*note|research\s*note/i.test(headings[i].textContent)) {
        return headings[i];
      }
    }
    return document.getElementById('trading-note');
  }

  function collectSectionElements(heading) {
    var elements = [heading];
    var level = heading.tagName;
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
          '<h3>Sign up to read the Research Note</h3>' +
          '<p>Create a free account to access market research context and analysis.</p>' +
          '<div class="cn-blur-cta-buttons">' +
            '<button class="clerk-btn clerk-btn-primary" id="blur-signup">Sign Up Free</button>' +
            '<button class="clerk-btn clerk-btn-ghost" id="blur-signin">Already have an account? Sign In</button>' +
          '</div>' +
        '</div>';
    } else if (reason === 'pro-teaser') {
      // Extract first ~90 chars as teaser
      var teaser = '';
      for (var i = 0; i < elements.length; i++) {
        if (elements[i] === heading) continue;
        var txt = elements[i].textContent.trim();
        if (txt.length > 0) {
          teaser = txt.length > 90 ? txt.substring(0, 90) + '…' : txt;
          break;
        }
      }
      overlay.innerHTML =
        '<div class="trading-note-overlay">' +
          '<div class="tno-inner">' +
            (teaser ? '<p style="color:#cbd5e1;font-size:0.88rem;margin-bottom:14px;font-style:italic;opacity:0.8;border-left:2px solid rgba(34,211,238,0.4);padding-left:12px;">&ldquo;' + teaser + '&rdquo;</p>' : '') +
            '<div class="tno-social-proof">Pro members use this section for deeper research context and exposure review.</div>' +
            '<h4 style="color:#e2e8f0;font-size:1.1rem;margin-bottom:8px">Unlock Full Research Note</h4>' +
            '<p style="color:#94a3b8;font-size:0.88rem">Scenario context, exposure drivers, and monitoring notes — available to Pro members.</p>' +
            '<a href="' + PRO_MONTHLY_URL + '" class="clerk-btn clerk-btn-primary tno-btn " data-access-source="trading_note_paywall" data-plan="pro" style="display:inline-block;text-decoration:none;margin-top:4px;">' +
              'View Research Access Plans &rarr;' +
            '</a>' +
            '<p class="tno-small">30-Day and Annual Research Access options available</p>' +
          '</div>' +
        '</div>';
    } else {
      // 'meter' fallback (kept for safety but no longer triggered)
      overlay.innerHTML =
        '<div class="trading-note-overlay">' +
          '<div class="tno-inner">' +
            '<div class="tno-social-proof">Pro members use this section for deeper research context and exposure review.</div>' +
            '<h4 style="color:#e2e8f0;font-size:1.1rem;margin-bottom:8px">Research Note</h4>' +
            '<p style="color:#94a3b8;font-size:0.88rem">Scenario context, exposure drivers, and monitoring notes — available to Pro members.</p>' +
            '<a href="' + PRO_MONTHLY_URL + '" class="clerk-btn clerk-btn-primary tno-btn " data-access-source="trading_note_paywall" data-plan="pro" style="display:inline-block;text-decoration:none;">' +
              'Read Research Note — View Access Plans' +
            '</a>' +
            '<p class="tno-small">Research access is manually verified before unlock</p>' +
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
      + '<div style="font-size:0.85rem;font-weight:700;color:#e2e8f0;margin-bottom:6px;">' + msg + '</div>'
      + '<div style="background:rgba(255,255,255,0.1);border-radius:4px;height:4px;width:200px">'
      + '<div style="background:' + (isLast ? '#ef4444' : '#22d3ee') + ';width:' + pct + '%;height:100%;border-radius:4px;transition:width 0.5s"></div>'
      + '</div></div>'
      + '<div style="font-size:0.78rem;color:#94a3b8">Pro adds research archive, scenario analytics, and company exposure context.</div>'
      + '<a href="' + PRO_MONTHLY_URL + '"  data-access-source="meter_upgrade_banner" data-plan="pro" style="padding:10px 20px;background:linear-gradient(135deg,#22d3ee,#a855f7);border:none;border-radius:8px;color:#050508;font-weight:800;font-size:0.88rem;cursor:pointer;white-space:nowrap;flex-shrink:0;text-decoration:none;display:inline-block;">View Access Plans</a>'
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
    return document.body && document.body.dataset.pageType === 'signal-report'
      || !!document.querySelector('[data-page-type="signal-report"]');
  }

  function init() {
    if (!window.Clerk) {
      var authArea = document.getElementById('clerk-auth-area');
      if (authArea) authArea.style.display = 'none';
      return;
    }

    // Expose global API early so pages can reference it
    window.CNAuth = {
      isPro: function () { return isPro(window.Clerk && window.Clerk.user); },
      isEnterprise: function () { return isEnterprise(window.Clerk && window.Clerk.user); },
      showProModal: showProModal
    };

    // 로고 클릭시 모달 유지
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
          headerSubtitle: { display: 'none' },
          formButtonPrimary: { backgroundColor: '#22d3ee', color: '#050508' },
          footerActionLink: { color: '#22d3ee' },
          modalBackdrop: { backgroundColor: 'rgba(5,5,8,0.85)' }
        }
      }
    }).then(function () {

      function renderAuth() {
        var user = window.Clerk.user;
        if (user) {
          maybeTrackSignupComplete(user);
          buildUserMenu(user);
          if (isPostPage()) {
            if (!isPro(user) && !isAdmin(user)) {
              // Track meter for free users
              var meter = getMeter();
              var isNewView = !sessionStorage.getItem('cn_viewed_' + location.pathname);
              if (isNewView) {
                meter = incrementMeter();
                sessionStorage.setItem('cn_viewed_' + location.pathname, '1');
              }
              // Blur trading note with Pro teaser
              blurTradingNote('pro-teaser');
              // Show meter badge + banner for free users
              updateMeterBadge(meter);
              showMeterBanner(meter.count, FREE_REPORTS_PER_MONTH);
            }
            // Pro/admin: full access, no blur, no meter
          }
        } else {
          buildAuthButtons();
          if (isPostPage()) {
            blurTradingNote('login');
          }
        }
      }

      // Fire auth-ready event so page scripts can react
      document.dispatchEvent(new CustomEvent('cn:authready'));

      renderAuth();

      window.Clerk.addListener(function () {
        renderAuth();
      });

    }).catch(function (err) {
      console.warn('[CommodityNode] Clerk load error:', err);
      var authArea = document.getElementById('clerk-auth-area');
      if (authArea) authArea.style.display = 'none';
    });
  }

  function waitForClerk(cb, tries) {
    tries = tries || 0;
    if (window.Clerk && window.Clerk.load) { cb(); return; }
    if (tries > 40) { cb(); return; }
    setTimeout(function () { waitForClerk(cb, tries + 1); }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { waitForClerk(init); });
  } else {
    waitForClerk(init);
  }
})();
