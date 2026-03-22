const puppeteer = require('puppeteer');
const path = require('path');

const USER = '0ssol1620@gmail.com';
const PASS = 'Power3708!';
const POST_TEXT = `Just launched something I've been building 🌌

CommodityNode — a free 3D interactive universe that maps how commodity prices ripple through every industry, company, and ETF.

Oil surges 10%?
→ Airlines drop 12%
→ Oilfield services jump 14%
→ Chemicals squeezed 7%

28 commodities · 81 Signal Reports · 4000+ impact nodes · Zero paywall

commoditynode.com

#investing`;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
    defaultViewport: { width: 430, height: 932 }
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');

  try {
    // STEP 1: Login to Instagram
    console.log('1. Instagram login...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    await page.click('input[name="username"]');
    await new Promise(r => setTimeout(r, 300));
    for (const c of USER) await page.keyboard.type(c, { delay: 50 + Math.random() * 80 });
    
    await new Promise(r => setTimeout(r, 500));
    await page.click('input[name="password"]');
    await new Promise(r => setTimeout(r, 300));
    for (const c of PASS) await page.keyboard.type(c, { delay: 50 + Math.random() * 80 });

    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => { document.querySelector('[aria-label="Log in"]')?.click(); });
    console.log('   Login clicked');

    await new Promise(r => setTimeout(r, 12000));
    console.log('2. URL:', page.url());

    // STEP 2: Go to Threads
    console.log('3. Going to Threads...');
    await page.goto('https://www.threads.net/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 5000));
    console.log('   URL:', page.url());

    // STEP 3: Click Create - find the + icon in bottom nav
    console.log('4. Clicking Create...');
    
    // Dump all aria-labels and clickable elements
    const clickables = await page.evaluate(() => {
      const els = document.querySelectorAll('a, button, div[role="button"], svg, [aria-label]');
      return Array.from(els).map(e => ({
        tag: e.tagName,
        aria: e.getAttribute('aria-label'),
        href: e.getAttribute('href'),
        role: e.getAttribute('role'),
        rect: e.getBoundingClientRect ? { x: e.getBoundingClientRect().x, y: e.getBoundingClientRect().y, w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height } : null
      })).filter(e => e.aria || e.href);
    });
    
    // Log elements near bottom of screen (navigation bar)
    const bottomEls = clickables.filter(e => e.rect && e.rect.y > 800);
    console.log('   Bottom nav elements:', JSON.stringify(bottomEls, null, 2));
    
    // All aria labels
    const arias = clickables.filter(e => e.aria).map(e => e.aria);
    console.log('   All aria-labels:', arias);

    // Try clicking Create by aria-label
    let createClicked = await page.evaluate(() => {
      const el = document.querySelector('[aria-label="Create"]');
      if (el) { 
        el.click(); 
        return { clicked: true, tag: el.tagName, rect: el.getBoundingClientRect() };
      }
      // Try New thread
      const el2 = document.querySelector('[aria-label="New thread"]');
      if (el2) { el2.click(); return { clicked: true, tag: el2.tagName }; }
      // Try the + link/button
      const el3 = document.querySelector('a[href="/create"], a[href="/create/"]');
      if (el3) { el3.click(); return { clicked: true, href: el3.href }; }
      return { clicked: false };
    });
    console.log('   Create click result:', JSON.stringify(createClicked));

    // Wait longer for modal
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: '/tmp/t7-aftercreate.png' });

    // Check for compose modal
    console.log('5. Checking for compose modal...');
    const modalCheck = await page.evaluate(() => {
      // Look for dialog/modal
      const dialogs = document.querySelectorAll('[role="dialog"], [role="presentation"], div[class*="modal"], div[class*="Modal"]');
      const textboxes = document.querySelectorAll('div[role="textbox"], div[contenteditable="true"], textarea, p[data-text="true"]');
      const allDivs = document.querySelectorAll('div');
      const editables = Array.from(allDivs).filter(d => d.contentEditable === 'true' || d.getAttribute('contenteditable') === 'true');
      
      return {
        dialogs: dialogs.length,
        textboxes: textboxes.length,
        editables: editables.length,
        editableInfo: editables.map(e => ({ tag: e.tagName, class: e.className.substring(0, 60), role: e.getAttribute('role') })),
        dialogInfo: Array.from(dialogs).map(d => ({ role: d.getAttribute('role'), class: d.className.substring(0, 60) }))
      };
    });
    console.log('   Modal check:', JSON.stringify(modalCheck, null, 2));

    if (modalCheck.textboxes > 0 || modalCheck.editables.length > 0) {
      console.log('✅ COMPOSE FOUND!');
      
      // Click into the editable
      const textSel = modalCheck.textboxes > 0 ? 'div[role="textbox"]' : 'div[contenteditable="true"]';
      await page.click(textSel);
      await new Promise(r => setTimeout(r, 500));
      await page.keyboard.type(POST_TEXT, { delay: 5 });
      console.log('   Text typed!');

      await page.screenshot({ path: '/tmp/t7-typed.png' });

      // Post
      await new Promise(r => setTimeout(r, 2000));
      const posted = await page.evaluate(() => {
        const btns = document.querySelectorAll('div[role="button"], button');
        for (const b of btns) {
          if (b.textContent.trim() === 'Post') { b.click(); return true; }
        }
        return false;
      });
      console.log('   Posted:', posted);
      await new Promise(r => setTimeout(r, 6000));
      console.log('🎉 DONE!');
    } else {
      console.log('❌ No compose modal found');
      // Try clicking the + icon by coordinates (bottom center)
      console.log('   Trying coordinate click (215, 907)...');
      await page.mouse.click(215, 907); // center of bottom nav + icon
      await new Promise(r => setTimeout(r, 5000));
      await page.screenshot({ path: '/tmp/t7-coordclick.png' });
      
      const afterCoord = await page.evaluate(() => {
        const textboxes = document.querySelectorAll('div[role="textbox"], div[contenteditable="true"]');
        return { textboxes: textboxes.length };
      });
      console.log('   After coord click:', JSON.stringify(afterCoord));
    }

    await page.screenshot({ path: '/tmp/t7-final.png' });

  } catch (err) {
    console.log('❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/t7-error.png' });
  }

  await browser.close();
})();
