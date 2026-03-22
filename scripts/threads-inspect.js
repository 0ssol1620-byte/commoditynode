const puppeteer = require('puppeteer');

const USER = '0ssol1620@gmail.com';
const PASS = 'Power3708!';

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
    // Login
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
    await page.click('input[name="username"]');
    for (const c of USER) await page.keyboard.type(c, { delay: 60 + Math.random() * 60 });
    await page.click('input[name="password"]');
    for (const c of PASS) await page.keyboard.type(c, { delay: 60 + Math.random() * 60 });
    await new Promise(r => setTimeout(r, 800));
    await page.evaluate(() => document.querySelector('[aria-label="Log in"]').click());
    await new Promise(r => setTimeout(r, 12000));

    // Go to Threads
    await page.goto('https://www.threads.net/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 5000));

    // Click Create via parent element
    await page.evaluate(() => {
      const svg = document.querySelector('svg[aria-label="Create"]');
      if (svg) {
        let el = svg;
        while (el && el.tagName !== 'A' && el.tagName !== 'BUTTON') el = el.parentElement;
        if (el) el.click();
        else svg.parentElement.click();
      }
    });
    await new Promise(r => setTimeout(r, 6000));

    // Dump dialog HTML structure
    const dialogHTML = await page.evaluate(() => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      return Array.from(dialogs).map(d => ({
        innerHTML: d.innerHTML.substring(0, 3000),
        ariaLabel: d.getAttribute('aria-label'),
        class: d.className.substring(0, 100)
      }));
    });
    
    console.log('=== DIALOGS FOUND:', dialogHTML.length);
    dialogHTML.forEach((d, i) => {
      console.log(`\n--- Dialog ${i} ---`);
      console.log('aria-label:', d.ariaLabel);
      console.log('class:', d.class);
      console.log('HTML:', d.innerHTML.substring(0, 2000));
    });

    // Also check all contenteditable and p[data-text]
    const editables = await page.evaluate(() => {
      const all = document.querySelectorAll('[contenteditable], p[data-text], [data-lexical-editor], [data-placeholder]');
      return Array.from(all).map(e => ({
        tag: e.tagName,
        role: e.getAttribute('role'),
        ce: e.getAttribute('contenteditable'),
        dt: e.getAttribute('data-text'),
        dl: e.getAttribute('data-lexical-editor'),
        dp: e.getAttribute('data-placeholder'),
        class: e.className.substring(0, 80),
        text: e.textContent.substring(0, 50)
      }));
    });
    console.log('\n=== EDITABLES:', JSON.stringify(editables, null, 2));

    await page.screenshot({ path: '/tmp/inspect-dialog.png' });

  } catch (err) {
    console.log('Error:', err.message);
    await page.screenshot({ path: '/tmp/inspect-error.png' });
  }

  await browser.close();
})();
