import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '/Users/edv/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import sharp from 'sharp';

const baseUrl = process.env.CP_QA_BASE_URL || 'http://127.0.0.1:3103';
const root = 'test_reports/cp-display-navigation-v1.3-2026-08-14';
const screenshotRoot = `${root}/screenshots`;
const comparisonRoot = `${root}/comparisons`;
const baselineRoot = 'test_reports/cp-v1.2.2-design-system-release-2026-08-14/screenshots';
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const expectedCategories = ['Hoodie', 'T-Shirts', 'Shirts', 'Outerwear', 'Bottoms', 'Accessories'];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'compact', width: 584, height: 486 },
  { name: 'mobile', width: 390, height: 844 },
];

mkdirSync(screenshotRoot, { recursive: true });
mkdirSync(comparisonRoot, { recursive: true });

async function settle(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
}

async function openMenu(page) {
  const trigger = page.getByRole('button', { name: 'Open navigation' });
  await trigger.focus();
  await trigger.click();
  const dialog = page.locator('#site-menu-overlay');
  await dialog.waitFor({ state: 'visible' });
  await page.waitForTimeout(50);
  return { trigger, dialog };
}

async function verifyMenu(page, viewport) {
  const initialTrigger = page.getByRole('button', { name: 'Open navigation' });
  const target = await initialTrigger.boundingBox();
  const initialContract = await initialTrigger.evaluate(element => ({
    controls: element.getAttribute('aria-controls'),
    expanded: element.getAttribute('aria-expanded'),
  }));

  const { trigger, dialog } = await openMenu(page);
  const categories = (await dialog.locator('.cp-menu-category-item').allInnerTexts())
    .map(category => category.toLowerCase());
  const disabledCount = await dialog.locator('.cp-menu-category-item[aria-disabled="true"]').count();
  const hoodieHref = await dialog.getByRole('link', { name: 'Hoodie' }).getAttribute('href');
  const openState = await page.evaluate(() => ({
    rootLocked: document.documentElement.classList.contains('cp-scroll-locked'),
    bodyLocked: document.body.classList.contains('cp-scroll-locked'),
    backgroundInert: document.querySelector('main > div')?.hasAttribute('inert') || false,
    focusContained: document.querySelector('#site-menu-overlay')?.contains(document.activeElement) || false,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  await page.screenshot({ path: `${screenshotRoot}/${viewport.name}-home-menu.png` });

  await page.keyboard.press('Shift+Tab');
  const reverseTabContained = await dialog.evaluate(element => element.contains(document.activeElement));
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  const escapeFocusReturned = await trigger.evaluate(element => document.activeElement === element);

  const xMenu = await openMenu(page);
  await xMenu.dialog.getByRole('button', { name: 'Close navigation' }).click();
  await xMenu.dialog.waitFor({ state: 'detached' });
  const xFocusReturned = await xMenu.trigger.evaluate(element => document.activeElement === element);

  const outsideMenu = await openMenu(page);
  await outsideMenu.dialog.dispatchEvent('pointerdown', { bubbles: true });
  await outsideMenu.dialog.waitFor({ state: 'detached' });
  const outsideFocusReturned = await outsideMenu.trigger.evaluate(element => document.activeElement === element);

  const navigationMenu = await openMenu(page);
  await navigationMenu.dialog.getByRole('link', { name: 'Home' }).click();
  await navigationMenu.dialog.waitFor({ state: 'detached' });
  const navigationCollapsed = await page.locator('#site-menu-overlay').count() === 0;

  const responsiveMenu = await openMenu(page);
  const crossedWidth = viewport.width >= 1024 ? 900 : 1100;
  await page.setViewportSize({ width: crossedWidth, height: viewport.height });
  await responsiveMenu.dialog.waitFor({ state: 'detached' });
  const responsiveCollapsed = await page.locator('#site-menu-overlay').count() === 0;
  await page.setViewportSize({ width: viewport.width, height: viewport.height });

  return {
    target,
    targetPass: target.width >= 44 && target.height >= 44,
    initialContract,
    categories,
    categoryOrderPass: JSON.stringify(categories) === JSON.stringify(expectedCategories.map(category => category.toLowerCase())),
    disabledCount,
    hoodieHref,
    openState,
    reverseTabContained,
    escapeFocusReturned,
    xFocusReturned,
    outsideFocusReturned,
    navigationCollapsed,
    responsiveCollapsed,
  };
}

async function decodeGallery(page) {
  const assets = page.locator('.cp-media-slide img, .cp-media-slide video');
  const decoded = [];
  for (let index = 0; index < await assets.count(); index += 1) {
    const asset = assets.nth(index);
    await asset.scrollIntoViewIfNeeded();
    decoded.push(await asset.evaluate(async element => {
      if (element instanceof HTMLImageElement) {
        await element.decode().catch(() => {});
        return { type: 'image', ok: element.complete && element.naturalWidth > 0 };
      }
      return { type: 'video', ok: !element.error && element.readyState >= 1 };
    }));
  }
  return decoded;
}

async function verifyGallery(page, viewport) {
  await page.locator('#signature-runway').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const bottomRailCount = await page.locator('.cp-category-rail').count();
  await page.screenshot({ path: `${screenshotRoot}/${viewport.name}-home-one.png` });

  const trigger = page.getByRole('button', { name: /Explore media/i });
  await trigger.focus();
  await trigger.click();
  const dialog = page.locator('#product-media-overlay');
  await dialog.waitFor({ state: 'visible' });
  const indexItems = dialog.locator('.cp-media-index-item');
  const indexCount = await indexItems.count();
  const mediaCount = await dialog.locator('.cp-media-slide').count();
  const productHref = await dialog.getByRole('link', { name: /Product details/i }).getAttribute('href');
  const initialCurrent = await indexItems.nth(0).getAttribute('aria-current');
  const decoded = await decodeGallery(page);
  await indexItems.nth(0).click();
  await page.waitForFunction(() => document.querySelector('.cp-media-header-status .cp-eyebrow')?.textContent?.trim().startsWith('01 /'));
  await page.screenshot({ path: `${screenshotRoot}/${viewport.name}-home-overlay.png` });
  await indexItems.nth(2).click();
  await page.waitForFunction(() => document.querySelector('.cp-media-header-status .cp-eyebrow')?.textContent?.trim().startsWith('03 /'));
  const selectedState = await page.evaluate(() => ({
    counter: document.querySelector('.cp-media-header-status .cp-eyebrow')?.textContent?.trim(),
    activeIndex: document.querySelector('.cp-media-index-item[aria-current="true"]')?.textContent?.trim(),
    scrollLeft: document.querySelector('.cp-media-track')?.scrollLeft,
    label: document.querySelector('.cp-media-index-label')?.textContent?.replace(/\s+/g, ' ').trim(),
    focusContained: document.querySelector('#product-media-overlay')?.contains(document.activeElement) || false,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  await page.screenshot({ path: `${screenshotRoot}/${viewport.name}-home-overlay-selected.png` });

  let touchSwipe = null;
  if (viewport.name === 'mobile') {
    await indexItems.nth(0).click();
    const track = dialog.locator('.cp-media-track');
    const box = await track.boundingBox();
    const before = await track.evaluate(element => element.scrollLeft);
    const session = await page.context().newCDPSession(page);
    const y = box.y + box.height * 0.45;
    const startX = box.x + box.width * 0.82;
    const endX = box.x + box.width * 0.18;
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: startX, y }] });
    for (let step = 1; step <= 6; step += 1) {
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: startX + ((endX - startX) * step) / 6, y }],
      });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(400);
    const after = await track.evaluate(element => element.scrollLeft);
    touchSwipe = { before, after, changed: after > before };
  }

  await page.keyboard.press('Tab');
  const tabContained = await dialog.evaluate(element => element.contains(document.activeElement));
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  const focusReturned = await trigger.evaluate(element => document.activeElement === element);

  const handoff = await trigger.click().then(async () => {
    const productLink = page.getByRole('link', { name: /Product details/i });
    await Promise.all([
      page.waitForURL(/\/products\/carlophillips-signature-hoodie$/),
      productLink.click(),
    ]);
    await settle(page);
    const layout = await page.evaluate(() => {
      const gallery = document.querySelector('.cp-product-gallery-grid');
      const items = [...(gallery?.querySelectorAll(':scope > figure') || [])];
      const title = document.querySelector('.cp-product-detail-title');
      const purchasing = document.querySelector('.cp-purchasing-disabled');
      const style = gallery ? getComputedStyle(gallery) : null;
      return {
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        display: style?.display || null,
        overflowX: style?.overflowX || null,
        scrollSnapType: style?.scrollSnapType || null,
        itemCount: items.length,
        firstItemTop: items[0]?.getBoundingClientRect().top || null,
        secondItemTop: items[1]?.getBoundingClientRect().top || null,
        secondItemOffsetLeft: items[1]?.offsetLeft || null,
        galleryClientWidth: gallery?.clientWidth || null,
        galleryScrollWidth: gallery?.scrollWidth || null,
        galleryHeight: gallery?.getBoundingClientRect().height || null,
        titleTop: title?.getBoundingClientRect().top || null,
        purchasingTop: purchasing?.getBoundingClientRect().top || null,
      };
    });
    await page.screenshot({ path: `${screenshotRoot}/${viewport.name}-pdp-top.png` });
    return {
      url: page.url(),
      heading: await page.locator('h1').first().innerText(),
      purchasingDisabled: await page.getByText(/Purchasing is disabled/i).count() > 0,
      layout,
    };
  });

  return {
    bottomRailCount,
    indexCount,
    mediaCount,
    productHref,
    decoded,
    initialCurrent,
    selectedState,
    touchSwipe,
    tabContained,
    focusReturned,
    handoff,
  };
}

async function createComparison(viewport, state) {
  const baseline = `${baselineRoot}/${viewport}-${state}.png`;
  const candidate = `${screenshotRoot}/${viewport}-${state}.png`;
  if (!existsSync(baseline) || !existsSync(candidate)) return null;
  const [before, after] = await Promise.all([sharp(baseline).png().toBuffer(), sharp(candidate).png().toBuffer()]);
  const [beforeMeta, afterMeta] = await Promise.all([sharp(before).metadata(), sharp(after).metadata()]);
  const width = Math.max(beforeMeta.width, afterMeta.width);
  const height = Math.max(beforeMeta.height, afterMeta.height);
  const background = { r: 0, g: 0, b: 0, alpha: 1 };
  const normalizedBefore = await sharp(before).extend({
    right: width - beforeMeta.width,
    bottom: height - beforeMeta.height,
    background,
  }).png().toBuffer();
  const normalizedAfter = await sharp(after).extend({
    right: width - afterMeta.width,
    bottom: height - afterMeta.height,
    background,
  }).png().toBuffer();
  const output = `${comparisonRoot}/${viewport}-${state}-before-after.png`;
  await sharp({
    create: { width: width * 2, height, channels: 4, background },
  }).composite([
    { input: normalizedBefore, left: 0, top: 0 },
    { input: normalizedAfter, left: width, top: 0 },
  ]).png().toFile(output);
  return output;
}

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--disable-background-networking', '--disable-default-apps', '--no-first-run'],
});
const report = {
  schemaVersion: 'cp.display-navigation-v1.3-browser-qa.v1',
  date: '2026-08-14',
  method: 'headless background Chrome against an explicit local non-commerce fixture',
  baseUrl,
  externalMutation: false,
  viewports: [],
  comparisons: [],
};

try {
  for (const viewport of viewports) {
    console.log(`qa:${viewport.name}:start`);
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      hasTouch: viewport.name === 'mobile',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const requestFailures = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('requestfailed', request => {
      const reason = request.failure()?.errorText || 'unknown';
      if (!reason.includes('ERR_ABORTED')) requestFailures.push(`${reason}: ${request.url()}`);
    });

    const response = await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle(page);
    const homeState = await page.evaluate(() => ({
      meaningfulContent: document.body.innerText.trim().length > 0,
      frameworkOverlay: Boolean(document.querySelector('[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay')),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      animations: [...document.querySelectorAll('.cp-campaign-image, .cp-runway-frame')]
        .map(element => getComputedStyle(element).animationName),
    }));
    await page.screenshot({ path: `${screenshotRoot}/${viewport.name}-home-hero.png` });
    console.log(`qa:${viewport.name}:menu`);
    const menu = await verifyMenu(page, viewport);
    console.log(`qa:${viewport.name}:gallery`);
    const gallery = await verifyGallery(page, viewport);
    console.log(`qa:${viewport.name}:complete`);
    report.viewports.push({
      ...viewport,
      status: response?.status() || 0,
      homeState,
      menu,
      gallery,
      consoleErrors,
      pageErrors,
      requestFailures,
    });
    await context.close();
  }
} finally {
  await browser.close();
}

for (const viewport of ['desktop', 'compact', 'mobile']) {
  for (const state of ['home-hero', 'home-menu', 'home-one', 'home-overlay']) {
    const comparison = await createComparison(viewport, state);
    if (comparison) report.comparisons.push(comparison);
  }
}

report.summary = {
  viewportCount: report.viewports.length,
  screenshots: report.viewports.length * 6,
  comparisons: report.comparisons.length,
  routeHealthPass: report.viewports.every(item => item.status === 200
    && item.homeState.meaningfulContent
    && !item.homeState.frameworkOverlay
    && !item.homeState.horizontalOverflow
    && item.consoleErrors.length === 0
    && item.pageErrors.length === 0
    && item.requestFailures.length === 0),
  reducedMotionPass: report.viewports.every(item => item.homeState.animations.every(name => name === 'none')),
  menuPass: report.viewports.every(item => item.menu.targetPass
    && item.menu.initialContract.controls === 'site-menu-overlay'
    && item.menu.initialContract.expanded === 'false'
    && item.menu.categoryOrderPass
    && item.menu.disabledCount === 5
    && item.menu.hoodieHref === '/products/carlophillips-signature-hoodie'
    && item.menu.openState.rootLocked
    && item.menu.openState.bodyLocked
    && item.menu.openState.backgroundInert
    && item.menu.openState.focusContained
    && !item.menu.openState.overflow
    && item.menu.reverseTabContained
    && item.menu.escapeFocusReturned
    && item.menu.xFocusReturned
    && item.menu.outsideFocusReturned
    && item.menu.navigationCollapsed
    && item.menu.responsiveCollapsed),
  galleryPass: report.viewports.every(item => item.gallery.bottomRailCount === 0
    && item.gallery.indexCount === 12
    && item.gallery.mediaCount === 12
    && item.gallery.productHref === '/products/carlophillips-signature-hoodie'
    && item.gallery.decoded.every(asset => asset.ok)
    && item.gallery.initialCurrent === 'true'
    && item.gallery.selectedState.counter === '03 / 12'
    && item.gallery.selectedState.activeIndex === '03'
    && item.gallery.selectedState.scrollLeft > 0
    && item.gallery.selectedState.focusContained
    && !item.gallery.selectedState.overflow
    && item.gallery.tabContained
    && item.gallery.focusReturned
    && item.gallery.handoff.url.endsWith('/products/carlophillips-signature-hoodie')
    && item.gallery.handoff.purchasingDisabled),
  mobileTouchPass: report.viewports.find(item => item.name === 'mobile')?.gallery.touchSwipe?.changed || false,
  responsivePdpPass: report.viewports.every(item => {
    const layout = item.gallery.handoff.layout;
    if (item.width >= 1024) return layout.display === 'grid';
    return layout.display === 'flex'
      && !layout.horizontalOverflow
      && layout.overflowX === 'auto'
      && layout.scrollSnapType.includes('mandatory')
      && layout.itemCount >= 2
      && layout.galleryScrollWidth > layout.galleryClientWidth
      && layout.galleryClientWidth <= layout.viewportWidth
      && layout.secondItemOffsetLeft >= layout.galleryClientWidth
      && layout.titleTop < layout.viewportHeight * 1.5
      && layout.purchasingTop > layout.titleTop;
  }),
};

writeFileSync(`${root}/browser-verification.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.summary, null, 2));
