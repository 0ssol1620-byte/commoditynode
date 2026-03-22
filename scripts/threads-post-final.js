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
    
    await page.evaluate(() => { document.querySelector('[aria-label="Log in"]').click(); });
    await new Promise(r => setTimeout(r, 12000));
    console.log('   URL:', page.url());

    // STEP 2: Go to Threads
    console.log('2. Threads...');
    await page.goto('https://www.threads.net/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 5000));

    // STEP 3: Click Create by coordinate (center of the + icon at bottom nav)
    console.log('3. Clicking Create (coordinate)...');
    // Create SVG is at x:203, y:895, size 24x24 → center at (215, 907)
    await page.mouse.click(215, 907);
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: '/tmp/tf-aftercreate.png' });

    // Check for compose modal / textbox
    const check1 = await page.evaluate(() => {
      const tbs = document.querySelectorAll('div[role="textbox"], div[contenteditable="true"]');
      return { count: tbs.length };
    });
    console.log('   Textboxes after click:', check1.count);

    if (check1.count === 0) {
      // Maybe we need to click the parent <a> or <div> of the SVG
      console.log('   Trying parent element click...');
      await page.evaluate(() => {
        const svg = document.querySelector('svg[aria-label="Create"]');
        if (svg) {
          // Click the parent elements up the tree
          let el = svg.parentElement;
          for (let i = 0; i < 5; i++) {
            if (el) { el.click(); el = el.parentElement; }
          }
        }
      });
      await new Promise(r => setTimeout(r, 5000));
      await page.screenshot({ path: '/tmp/tf-parentclick.png' });

      const check2 = await page.evaluate(() => {
        const tbs = document.querySelectorAll('div[role="textbox"], div[contenteditable="true"]');
        const dialogs = document.querySelectorAll('[role="dialog"]');
        return { textboxes: tbs.length, dialogs: dialogs.length };
      });
      console.log('   After parent click:', JSON.stringify(check2));
    }

    // Try typing in whatever textbox exists
    const textbox = await page.$('div[role="textbox"], div[contenteditable="true"]');
    if (textbox) {
      console.log('4. ✅ Found textbox! Typing...');
      await textbox.click();
      await new Promise(r => setTimeout(r, 500));
      await page.keyboard.type(POST_TEXT, { delay: 5 });
      console.log('   Text entered!');
      await page.screenshot({ path: '/tmp/tf-typed.png' });

      // Upload image
      console.log('5. Uploading image...');
      const imgPath = path.resolve(__dirname, '../assets/images/screenshot-universe.png');
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.uploadFile(imgPath);
        await new Promise(r => setTimeout(r, 5000));
        console.log('   Image uploaded');
      } else {
        console.log('   No file input, skipping image');
      }

      // Click Post
      console.log('6. Clicking Post...');
      await new Promise(r => setTimeout(r, 2000));
      const posted = await page.evaluate(() => {
        const btns = document.querySelectorAll('div[role="button"], button');
        for (const b of btns) {
          const text = b.textContent.trim();
          if (text === 'Post' || text === '게시') { b.click(); return text; }
        }
        return false;
      });
      console.log('   Post result:', posted);

      await new Promise(r => setTimeout(r, 8000));
      console.log('🎉 DONE! URL:', page.url());
      await page.screenshot({ path: '/tmp/tf-final.png' });
    } else {
      console.log('4. ❌ Still no textbox');
      // Save cookies for reuse
      const cookies = await page.cookies();
      require('fs').writeFileSync('/tmp/threads-cookies.json', JSON.stringify(cookies));
      console.log('   Cookies saved for reuse');
    }

  } catch (err) {
    console.log('❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/tf-error.png' });
  }

  await browser.close();
})();
