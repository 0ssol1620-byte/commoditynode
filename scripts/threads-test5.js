const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new', // new headless mode, harder to detect
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled', // hide automation
      '--disable-infobars',
      '--window-size=430,932'
    ],
    defaultViewport: { width: 430, height: 932 }
  });

  const page = await browser.newPage();

  // Anti-bot: remove webdriver flag
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    // Fake plugins
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    // Fake languages
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    // Override permissions
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);
  });

  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');

  // Extra headers to look real
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"iOS"'
  });

  try {
    // Step 1: Go to Instagram login directly
    console.log('1. Opening Instagram login...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));

    // Dump the page structure
    console.log('   URL:', page.url());
    const html = await page.content();

    // Find all input elements and their attributes
    const inputInfo = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).map(i => ({
        name: i.name,
        type: i.type,
        aria: i.getAttribute('aria-label'),
        placeholder: i.placeholder,
        auto: i.autocomplete,
        id: i.id
      }));
    });
    console.log('   Inputs:', JSON.stringify(inputInfo, null, 2));

    // Find all buttons
    const btnInfo = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, div[role="button"]');
      return Array.from(btns).map(b => ({
        text: b.textContent.trim().substring(0, 50),
        type: b.type,
        disabled: b.disabled,
        aria: b.getAttribute('aria-label')
      }));
    });
    console.log('   Buttons:', JSON.stringify(btnInfo, null, 2));

    await page.screenshot({ path: '/tmp/threads-t5-login.png' });

    // Step 2: Type credentials with human-like delays
    console.log('2. Entering credentials...');
    
    // Click username field first, wait, then type slowly
    const userSel = 'input[name="username"], input[aria-label="Phone number, username, or email"], input[aria-label*="username"]';
    await page.waitForSelector(userSel, { timeout: 10000 });
    const userInput = await page.$(userSel);
    await userInput.click();
    await new Promise(r => setTimeout(r, 500));

    // Type like a human - varying delays
    for (const char of '0ssol1620@gmail.com') {
      await page.keyboard.type(char, { delay: 50 + Math.random() * 100 });
    }
    console.log('   Username typed');

    await new Promise(r => setTimeout(r, 800));

    // Tab to password or click it
    const passSel = 'input[name="password"], input[aria-label="Password"], input[type="password"]';
    const passInput = await page.$(passSel);
    await passInput.click();
    await new Promise(r => setTimeout(r, 500));

    for (const char of 'Power3708!') {
      await page.keyboard.type(char, { delay: 50 + Math.random() * 80 });
    }
    console.log('   Password typed');

    await page.screenshot({ path: '/tmp/threads-t5-filled.png' });

    // Step 3: Click login with a slight delay
    await new Promise(r => setTimeout(r, 1000));
    console.log('3. Clicking login...');
    
    // Find the login button more carefully
    const loginBtn = await page.evaluate(() => {
      const btns = document.querySelectorAll('button[type="submit"], button');
      for (const b of btns) {
        const text = b.textContent.trim().toLowerCase();
        if (text === 'log in' || text === '로그인' || text === 'login') {
          return { found: true, text: b.textContent.trim() };
        }
      }
      return { found: false };
    });
    console.log('   Login button:', JSON.stringify(loginBtn));

    if (loginBtn.found) {
      await page.evaluate(() => {
        const btns = document.querySelectorAll('button[type="submit"], button');
        for (const b of btns) {
          const text = b.textContent.trim().toLowerCase();
          if (text === 'log in' || text === '로그인' || text === 'login') {
            b.click();
            break;
          }
        }
      });
    }

    // Wait for navigation
    await new Promise(r => setTimeout(r, 10000));
    console.log('4. After login URL:', page.url());
    await page.screenshot({ path: '/tmp/threads-t5-afterlogin.png' });

    // Step 4: Handle onetap
    if (page.url().includes('onetap')) {
      console.log('5. Onetap page detected...');
      // Try direct navigation instead of clicking
      const nextUrl = new URL(page.url()).searchParams.get('next');
      if (nextUrl) {
        console.log('   Navigating to next URL...');
        await page.goto(decodeURIComponent(nextUrl), { waitUntil: 'networkidle2', timeout: 20000 });
        await new Promise(r => setTimeout(r, 5000));
        console.log('   After redirect:', page.url());
      }
    }

    // Step 5: Check final state
    console.log('6. Final URL:', page.url());
    await page.screenshot({ path: '/tmp/threads-t5-final.png' });

    if (page.url().includes('threads')) {
      console.log('✅ ON THREADS! Checking login state...');
      const loggedIn = await page.evaluate(() => {
        return !document.body.innerText.includes('Log in') || 
               document.querySelector('div[role="textbox"]') !== null ||
               document.querySelector('a[href*="create"]') !== null;
      });
      console.log('   Logged in:', loggedIn);
    }

    const cookies = await page.cookies();
    console.log('   Cookies:', cookies.filter(c => c.domain.includes('threads') || c.domain.includes('instagram')).map(c => c.name).join(', '));

  } catch (err) {
    console.log('❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/threads-t5-error.png' });
  }

  await browser.close();
})();
