const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

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

// CHANGE THIS to your screenshot file path
const IMAGE_PATH = path.join(__dirname, 'screenshot.png');

(async () => {
  console.log('🚀 Starting Threads auto-post...');

  const browser = await puppeteer.launch({
    headless: false, // shows browser window so you can see what's happening
    defaultViewport: { width: 430, height: 932 },
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');

  try {
    // STEP 1: Instagram Login
    console.log('1. Instagram login...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    await page.click('input[name="username"]');
    for (const c of USER) await page.keyboard.type(c, { delay: 60 + Math.random() * 80 });
    await new Promise(r => setTimeout(r, 500));
    await page.click('input[name="password"]');
    for (const c of PASS) await page.keyboard.type(c, { delay: 60 + Math.random() * 80 });
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(() => document.querySelector('[aria-label="Log in"]').click());

    console.log('   Waiting for login...');
    await new Promise(r => setTimeout(r, 12000));
    console.log('   URL:', page.url());

    // Handle "Save login info" if it appears
    if (page.url().includes('onetap')) {
      console.log('   Handling save info prompt...');
      await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
          if (b.textContent.includes('Save') || b.textContent.includes('Not now')) {
            b.click(); break;
          }
        }
      });
      await new Promise(r => setTimeout(r, 5000));
    }

    // STEP 2: Go to Threads
    console.log('2. Going to Threads...');
    await page.goto('https://www.threads.net/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 5000));
    console.log('   Threads URL:', page.url());

    // STEP 3: Find and click Create button
    console.log('3. Clicking Create...');

    // Dump aria-labels to find exact Create button position
    const createInfo = await page.evaluate(() => {
      // Find element with aria-label "Create"
      const el = document.querySelector('[aria-label="Create"]');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      // Go up to find clickable parent
      let clickable = el;
      while (clickable && !['A', 'BUTTON'].includes(clickable.tagName)) {
        clickable = clickable.parentElement;
      }
      const crect = clickable ? clickable.getBoundingClientRect() : rect;
      return {
        svgX: rect.x, svgY: rect.y, svgW: rect.width, svgH: rect.height,
        parentTag: clickable ? clickable.tagName : 'none',
        parentX: crect.x, parentY: crect.y
      };
    });
    console.log('   Create button info:', JSON.stringify(createInfo));

    if (createInfo) {
      // Click center of the SVG
      const cx = createInfo.svgX + createInfo.svgW / 2;
      const cy = createInfo.svgY + createInfo.svgH / 2;
      console.log(`   Clicking at (${cx}, ${cy})`);
      await page.mouse.click(cx, cy);
    } else {
      // Fallback: go to /create URL
      await page.goto('https://www.threads.net/create', { waitUntil: 'networkidle2', timeout: 10000 });
    }

    await new Promise(r => setTimeout(r, 5000));
    console.log('   After click URL:', page.url());

    // STEP 4: Find the compose textbox
    console.log('4. Finding compose textbox...');

    // Threads uses Lexical editor - look for specific attributes
    const editorInfo = await page.evaluate(() => {
      const selectors = [
        'div[role="textbox"]',
        'div[contenteditable="true"]',
        'p[data-text="true"]',
        'div[data-lexical-editor="true"]',
        '[data-editor]',
        'div[spellcheck="true"]',
        'div.notranslate'
      ];
      for (const sel of selectors) {
        const els = document.querySelectorAll(sel);
        if (els.length > 0) {
          return {
            selector: sel,
            count: els.length,
            tag: els[0].tagName,
            class: els[0].className.substring(0, 100),
            rect: els[0].getBoundingClientRect()
          };
        }
      }
      // Last resort - find any editable
      const all = document.querySelectorAll('*');
      for (const el of all) {
        if (el.contentEditable === 'true') {
          return {
            selector: 'contentEditable',
            tag: el.tagName,
            class: el.className.substring(0, 100),
            rect: el.getBoundingClientRect()
          };
        }
      }
      return null;
    });
    console.log('   Editor info:', JSON.stringify(editorInfo));

    if (editorInfo) {
      console.log('✅ Found editor!');
      const sel = editorInfo.selector === 'contentEditable' 
        ? `${editorInfo.tag}[contenteditable="true"]`
        : editorInfo.selector;

      await page.click(sel);
      await new Promise(r => setTimeout(r, 500));
      await page.keyboard.type(POST_TEXT, { delay: 8 });
      console.log('   Text entered!');

      // Upload image if file exists
      if (fs.existsSync(IMAGE_PATH)) {
        console.log('5. Uploading image...');
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          await fileInput.uploadFile(IMAGE_PATH);
          await new Promise(r => setTimeout(r, 5000));
          console.log('   Image uploaded!');
        }
      }

      // Click Post button
      console.log('6. Posting...');
      await new Promise(r => setTimeout(r, 2000));
      const posted = await page.evaluate(() => {
        const btns = document.querySelectorAll('div[role="button"], button');
        for (const b of btns) {
          const text = b.textContent.trim();
          if (text === 'Post' || text === '게시') {
            b.click();
            return text;
          }
        }
        return null;
      });
      console.log('   Post clicked:', posted);

      await new Promise(r => setTimeout(r, 8000));
      console.log('🎉 DONE! Check Threads!');
    } else {
      console.log('❌ No editor found - browser window is open, try manually');
      await new Promise(r => setTimeout(r, 30000)); // keep open 30s for manual intervention
    }

  } catch (err) {
    console.log('❌ Error:', err.message);
    await new Promise(r => setTimeout(r, 15000)); // keep browser open on error
  }

  await browser.close();
})();
