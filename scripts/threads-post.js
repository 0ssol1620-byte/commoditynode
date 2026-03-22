/**
 * CommodityNode — Threads Auto-Poster via Puppeteer
 * Usage: THREADS_USER=xxx THREADS_PASS=xxx node threads-post.js "Post text" [image_path]
 */
const puppeteer = require('puppeteer');
const path = require('path');

const THREADS_USER = process.env.THREADS_USER;
const THREADS_PASS = process.env.THREADS_PASS;
const postText = process.argv[2];
const imagePath = process.argv[3] || null;

if (!THREADS_USER || !THREADS_PASS || !postText) {
  console.log('Usage: THREADS_USER=xxx THREADS_PASS=xxx node threads-post.js "text" [image_path]');
  process.exit(1);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // set to true after testing
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=430,932'],
    defaultViewport: { width: 430, height: 932 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36');

  try {
    console.log('1. Opening Threads login...');
    await page.goto('https://www.threads.net/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // Check if already logged in
    const url = page.url();
    if (url.includes('/login')) {
      console.log('2. Logging in...');
      // Find username input
      const usernameInput = await page.$('input[name="username"], input[type="text"]');
      if (usernameInput) {
        await usernameInput.click({ clickCount: 3 });
        await usernameInput.type(THREADS_USER, { delay: 50 });
      }
      
      const passwordInput = await page.$('input[name="password"], input[type="password"]');
      if (passwordInput) {
        await passwordInput.click({ clickCount: 3 });
        await passwordInput.type(THREADS_PASS, { delay: 50 });
      }

      // Click login button
      const loginBtn = await page.$('button[type="submit"], div[role="button"]');
      if (loginBtn) await loginBtn.click();
      
      await new Promise(r => setTimeout(r, 5000));
      console.log('   Login attempted, current URL:', page.url());
    } else {
      console.log('2. Already logged in');
    }

    // Check for 2FA or challenges
    const currentUrl = page.url();
    if (currentUrl.includes('challenge') || currentUrl.includes('checkpoint')) {
      console.log('⚠️  2FA/Challenge detected. Please complete manually.');
      console.log('   Waiting 60 seconds for manual intervention...');
      await new Promise(r => setTimeout(r, 60000));
    }

    console.log('3. Navigating to compose...');
    // Click the compose/new post button
    await page.goto('https://www.threads.net', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));

    // Look for the compose button (+ icon or "New thread" area)
    // Threads has a compose area or a + button
    const composeSelectors = [
      '[aria-label="Create"]',
      '[aria-label="New thread"]', 
      'div[role="button"] svg',
      'a[href="/create"]',
    ];

    let composed = false;
    for (const sel of composeSelectors) {
      const el = await page.$(sel);
      if (el) {
        await el.click();
        composed = true;
        console.log('   Found compose button:', sel);
        break;
      }
    }

    if (!composed) {
      console.log('   Trying to find compose area by text...');
      const elements = await page.$$('div[role="textbox"], textarea');
      if (elements.length > 0) {
        await elements[0].click();
        composed = true;
      }
    }

    await new Promise(r => setTimeout(r, 2000));

    console.log('4. Typing post...');
    // Find the text input area
    const textBox = await page.$('div[role="textbox"], textarea, div[contenteditable="true"]');
    if (textBox) {
      await textBox.click();
      await textBox.type(postText, { delay: 20 });
      console.log('   Text entered');
    } else {
      console.log('   ❌ Could not find text input');
    }

    // Upload image if provided
    if (imagePath) {
      console.log('5. Uploading image...');
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) {
        await fileInput.uploadFile(path.resolve(imagePath));
        await new Promise(r => setTimeout(r, 3000));
        console.log('   Image uploaded');
      } else {
        // Try clicking the image/attachment button first
        const attachBtn = await page.$('[aria-label="Attach media"], [aria-label="Add photos"]');
        if (attachBtn) {
          await attachBtn.click();
          await new Promise(r => setTimeout(r, 1000));
          const fi = await page.$('input[type="file"]');
          if (fi) {
            await fi.uploadFile(path.resolve(imagePath));
            await new Promise(r => setTimeout(r, 3000));
            console.log('   Image uploaded via attach button');
          }
        } else {
          console.log('   ⚠️  No image upload option found');
        }
      }
    }

    console.log('6. Posting...');
    // Find and click the Post button
    const postSelectors = [
      'div[role="button"]:has-text("Post")',
      'button:has-text("Post")',
      '[aria-label="Post"]',
    ];

    let posted = false;
    // Try by text content
    const buttons = await page.$$('div[role="button"], button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.trim() === 'Post') {
        await btn.click();
        posted = true;
        console.log('   Post button clicked!');
        break;
      }
    }

    if (!posted) {
      console.log('   ⚠️  Could not find Post button. Taking screenshot...');
      await page.screenshot({ path: '/tmp/threads-debug.png' });
      console.log('   Debug screenshot saved to /tmp/threads-debug.png');
    }

    await new Promise(r => setTimeout(r, 5000));
    console.log('✅ Done! Current URL:', page.url());
    await page.screenshot({ path: '/tmp/threads-result.png' });

  } catch (err) {
    console.log('❌ Error:', err.message);
    await page.screenshot({ path: '/tmp/threads-error.png' });
  }

  await browser.close();
})();
