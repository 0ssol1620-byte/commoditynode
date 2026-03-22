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
    // STEP 1: Instagram Login
    console.log('1. Instagram login page...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    // Type username
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    await page.click('input[name="username"]');
    await new Promise(r => setTimeout(r, 300));
    for (const c of USER) await page.keyboard.type(c, { delay: 50 + Math.random() * 80 });
    
    // Type password
    await new Promise(r => setTimeout(r, 500));
    await page.click('input[name="password"]');
    await new Promise(r => setTimeout(r, 300));
    for (const c of PASS) await page.keyboard.type(c, { delay: 50 + Math.random() * 80 });

    await new Promise(r => setTimeout(r, 1000));

    // Click Log in - using aria-label selector
    console.log('2. Clicking Log in...');
    const clicked = await page.evaluate(() => {
      // Try aria-label first
      let btn = document.querySelector('[aria-label="Log in"]');
      if (btn) { btn.click(); return 'aria-label'; }
      // Try button text
      const allBtns = document.querySelectorAll('button, div[role="button"]');
      for (const b of allBtns) {
        if (b.textContent.trim() === 'Log in') { b.click(); return 'text-match'; }
      }
      // Try submit
      btn = document.querySelector('button[type="submit"]');
      if (btn) { btn.click(); return 'submit'; }
      return 'none';
    });
    console.log('   Clicked via:', clicked);

    await new Promise(r => setTimeout(r, 12000));
    console.log('3. After login URL:', page.url());
    await page.screenshot({ path: '/tmp/t6-afterlogin.png' });

    // STEP 2: Handle onetap - navigate directly to the next URL
    if (page.url().includes('onetap')) {
      console.log('4. On onetap, extracting redirect...');
      const nextParam = await page.evaluate(() => {
        const url = new URL(window.location.href);
        return url.searchParams.get('next');
      });
      if (nextParam) {
        console.log('   Navigating to:', nextParam.substring(0, 80) + '...');
        await page.goto(nextParam, { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(r => setTimeout(r, 5000));
        console.log('   After redirect:', page.url());
      }
    }

    // STEP 3: If still not on Threads, go directly
    if (!page.url().includes('threads')) {
      console.log('5. Going to Threads directly...');
      await page.goto('https://www.threads.net/', { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 5000));
    }

    console.log('6. Current URL:', page.url());
    await page.screenshot({ path: '/tmp/t6-threads.png' });

    // Check if logged in
    const isLoggedIn = await page.evaluate(() => {
      const text = document.body.innerText;
      const hasCreate = !!document.querySelector('[aria-label="Create"]');
      const noLoginBtn = !text.startsWith('Log in');
      return { hasCreate, noLoginBtn, first100: text.substring(0, 100) };
    });
    console.log('7. Login check:', JSON.stringify(isLoggedIn));

    if (isLoggedIn.hasCreate) {
      console.log('✅ LOGGED IN! Finding compose...');

      // Click Create
      await page.click('[aria-label="Create"]');
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: '/tmp/t6-compose.png' });

      // Find textbox
      const textBox = await page.$('div[role="textbox"], div[contenteditable="true"], p[data-text="true"]');
      if (textBox) {
        await textBox.click();
        await new Promise(r => setTimeout(r, 500));
        await page.keyboard.type(POST_TEXT, { delay: 5 });
        console.log('   ✅ Text entered!');
        await page.screenshot({ path: '/tmp/t6-typed.png' });

        // Upload image
        const imgPath = path.resolve(__dirname, '../assets/images/screenshot-universe.png');
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.uploadFile(imgPath);
          await new Promise(r => setTimeout(r, 4000));
          console.log('   ✅ Image uploaded!');
        }

        // Click Post
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
        await page.screenshot({ path: '/tmp/t6-final.png' });
        console.log('🎉 DONE! URL:', page.url());
      } else {
        console.log('   ❌ No textbox found');
        const els = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('div, textarea, p')).filter(e => 
            e.getAttribute('contenteditable') || e.getAttribute('role') === 'textbox'
          ).map(e => ({ tag: e.tagName, role: e.getAttribute('role'), ce: e.getAttribute('contenteditable'), class: e.className.substring(0, 50) }));
        });
        console.log('   Editable elements:', JSON.stringify(els));
      }
    } else {
      console.log('❌ Not logged in on Threads');
      console.log('   Page text:', isLoggedIn.first100);
    }

  } catch (err) {
    console.log('❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/t6-error.png' });
  }

  await browser.close();
})();
