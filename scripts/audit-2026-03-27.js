const puppeteer = require('/home/phillip/.npm-global/lib/node_modules/puppeteer');

const CHROME_PATH = '/home/phillip/.cache/puppeteer/chrome/linux-146.0.7680.153/chrome-linux64/chrome';

const PAGES = [
  'https://commoditynode.com/',
  'https://commoditynode.com/commodities/',
  'https://commoditynode.com/commodities/crude-oil/',
  'https://commoditynode.com/commodities/gold/',
  'https://commoditynode.com/commodities/gallium/',
  'https://commoditynode.com/commodities/phosphate/',
  'https://commoditynode.com/industries/',
  'https://commoditynode.com/reports/',
  'https://commoditynode.com/about/',
  'https://commoditynode.com/terms/',
  'https://commoditynode.com/lithium-surplus-deficit-pivot/',
  'https://commoditynode.com/ai-data-centers-commodity-demand/',
  'https://commoditynode.com/gallium-china-semiconductor-chokepoint/',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

async function auditPage(browser, url, viewport) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height });
  
  const issues = [];
  const consoleErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  let statusCode = 0;
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    statusCode = response ? response.status() : 0;
  } catch (e) {
    issues.push(`LOAD_FAIL: ${e.message}`);
    await page.close();
    return { url, viewport: viewport.name, statusCode, issues, consoleErrors };
  }

  if (statusCode !== 200) {
    issues.push(`HTTP_${statusCode}`);
  }

  // Check broken internal links
  const links = await page.$$eval('a[href]', anchors =>
    anchors
      .map(a => a.getAttribute('href'))
      .filter(h => h && (h.startsWith('/') || h.startsWith('https://commoditynode.com')))
  );
  
  // Check for overflow-x on mobile
  if (viewport.name === 'mobile') {
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    if (hasOverflow) {
      const overflowAmount = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });
      issues.push(`MOBILE_OVERFLOW_X: ${overflowAmount}px`);
    }
  }

  // Check newsletter form exists
  const hasNewsletter = await page.evaluate(() => {
    const forms = document.querySelectorAll('form');
    for (const f of forms) {
      if (f.innerHTML.toLowerCase().includes('email') || f.innerHTML.toLowerCase().includes('newsletter') || f.innerHTML.toLowerCase().includes('subscribe')) {
        return true;
      }
    }
    // Also check for newsletter section
    const el = document.querySelector('.newsletter, #newsletter, [class*="newsletter"], [class*="subscribe"]');
    return !!el;
  });
  if (!hasNewsletter) {
    issues.push('NO_NEWSLETTER_FORM');
  }

  // Check graph control sidebar overlap (for commodity pages)
  if (url.includes('/commodities/') && url !== 'https://commoditynode.com/commodities/') {
    const sidebarOverlap = await page.evaluate(() => {
      const sidebar = document.querySelector('.chart-controls, .sidebar, [class*="control"], [class*="sidebar"]');
      const chart = document.querySelector('.chart, canvas, [class*="chart"], svg.recharts-surface');
      if (!sidebar || !chart) return false;
      const sRect = sidebar.getBoundingClientRect();
      const cRect = chart.getBoundingClientRect();
      // Check overlap
      return !(sRect.right < cRect.left || sRect.left > cRect.right || sRect.bottom < cRect.top || sRect.top > cRect.bottom);
    });
    if (sidebarOverlap) {
      issues.push('SIDEBAR_CHART_OVERLAP');
    }
  }

  // Check price banner for commodity pages
  if (url.includes('/commodities/') && url !== 'https://commoditynode.com/commodities/') {
    const priceBanner = await page.evaluate(() => {
      const body = document.body.innerText;
      const hasPriceData = /\$[\d,.]+/.test(body) || /price/i.test(body);
      const hasNoDataMsg = /no publicly traded/i.test(body) || /not publicly traded/i.test(body) || /no standard market/i.test(body);
      return { hasPriceData, hasNoDataMsg };
    });
    if (!priceBanner.hasPriceData && !priceBanner.hasNoDataMsg) {
      issues.push('NO_PRICE_BANNER_OR_MESSAGE');
    }
  }

  if (consoleErrors.length > 0) {
    issues.push(`CONSOLE_ERRORS: ${consoleErrors.length}`);
  }

  await page.close();
  return { url, viewport: viewport.name, statusCode, issues, links, consoleErrors };
}

async function checkBrokenLinks(browser, allLinks) {
  const unique = [...new Set(allLinks)];
  const broken = [];
  
  for (const link of unique) {
    const fullUrl = link.startsWith('/') ? `https://commoditynode.com${link}` : link;
    try {
      const page = await browser.newPage();
      const resp = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp ? resp.status() : 0;
      if (status >= 400) {
        broken.push({ url: fullUrl, status });
      }
      await page.close();
    } catch (e) {
      broken.push({ url: fullUrl, status: 'TIMEOUT/ERROR' });
    }
  }
  return broken;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const results = [];
  const allInternalLinks = [];

  for (const url of PAGES) {
    for (const vp of VIEWPORTS) {
      const result = await auditPage(browser, url, vp);
      results.push(result);
      if (result.links) allInternalLinks.push(...result.links);
      const status = result.issues.length === 0 ? '✅' : '⚠️';
      console.log(`${status} ${vp.name.padEnd(8)} ${url} [${result.statusCode}] ${result.issues.join(', ')}`);
    }
  }

  // Check broken links (sample up to 50)
  const uniqueLinks = [...new Set(allInternalLinks)].slice(0, 50);
  console.log(`\n--- Checking ${uniqueLinks.length} unique internal links ---`);
  const broken = await checkBrokenLinks(browser, uniqueLinks);
  if (broken.length > 0) {
    console.log('\n❌ BROKEN LINKS:');
    broken.forEach(b => console.log(`  ${b.status} → ${b.url}`));
  } else {
    console.log('✅ No broken internal links found');
  }

  // Summary
  const issuePages = results.filter(r => r.issues.length > 0);
  console.log(`\n--- SUMMARY ---`);
  console.log(`Total checks: ${results.length}`);
  console.log(`Pages with issues: ${issuePages.length}`);
  if (issuePages.length > 0) {
    console.log('\nISSUES:');
    issuePages.forEach(r => {
      console.log(`  ${r.viewport.padEnd(8)} ${r.url}`);
      r.issues.forEach(i => console.log(`    → ${i}`));
    });
  }

  await browser.close();
  console.log('\n--- AUDIT COMPLETE ---');
})();
