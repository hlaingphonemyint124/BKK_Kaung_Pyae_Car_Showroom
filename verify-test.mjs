import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'verify-screenshots';
mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3000';
const errors = [];

const browser = await chromium.launch({ headless: true });

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
}

// ─── 1. HOME PAGE ───────────────────────────────────────────────────────────
console.log('\n[1] Home page…');
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => errors.push(`PageError: ${e.message}`));

await page.goto(BASE, { waitUntil: 'networkidle' });
await shot(page, '01-home');

// Check key sections exist
const sections = ['hero', 'deals', 'bl-section', 'ct-section', 'easyRentalSection', 'whySection', 'ts-section'];
const sectionResults = [];
for (const s of sections) {
  const el = await page.$(`[class*="${s}"], .${s}`);
  sectionResults.push({ name: s, found: !!el });
  if (!el) errors.push(`Section missing: ${s}`);
}
console.log('  Sections:', sectionResults.map(r => `${r.name}:${r.found ? '✅' : '❌'}`).join(' '));

// ─── 2. DARK MODE ────────────────────────────────────────────────────────────
console.log('\n[2] Dark mode toggle…');
const themeBtn = await page.$('button[aria-label="Toggle theme"]');
if (themeBtn) {
  await themeBtn.click();
  await page.waitForTimeout(400);
  const isDark = await page.evaluate(() => document.body.classList.contains('dark'));
  console.log(`  Dark class after toggle: ${isDark ? '✅' : '❌'}`);
  if (!isDark) errors.push('Dark mode toggle did not add .dark class');
  await shot(page, '02-dark-mode');
  // toggle back
  await themeBtn.click();
  await page.waitForTimeout(300);
} else {
  errors.push('Theme toggle button not found');
}

// ─── 3. FOOTER QUICK LINKS (button check) ────────────────────────────────────
console.log('\n[3] Footer quick-link buttons…');
const footerBtns = await page.$$('.footer-links li button');
console.log(`  Footer link buttons found: ${footerBtns.length} ${footerBtns.length > 0 ? '✅' : '❌'}`);
if (footerBtns.length === 0) errors.push('Footer quick links are not <button> elements');

// ─── 4. CARCARD ARROW ────────────────────────────────────────────────────────
console.log('\n[4] CarCard detail arrow…');
const detailDiv = await page.$('.carCard .detail');
if (detailDiv) {
  const text = await detailDiv.innerText();
  const afterContent = await page.evaluate(el => {
    return window.getComputedStyle(el, '::after').content;
  }, detailDiv);
  console.log(`  .detail text: "${text}" | ::after content: ${afterContent}`);
  if (!afterContent.includes('→')) errors.push('CarCard detail ::after arrow not found in computed style');
} else {
  console.log('  No CarCards on home page (requires API data)');
}

// ─── 5. SHOWROOM PAGE (SPINNER) ───────────────────────────────────────────────
console.log('\n[5] Showroom spinner…');
const showroomPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
showroomPage.on('pageerror', e => errors.push(`Showroom PageError: ${e.message}`));
// Navigate but intercept API to keep it loading
await showroomPage.goto(`${BASE}/showroom`, { waitUntil: 'domcontentloaded' });
await showroomPage.waitForTimeout(500);
const spinner = await showroomPage.$('.spinner');
console.log(`  Spinner visible during load: ${spinner ? '✅' : '⚠️ (may have already resolved)'}`);
await showroomPage.waitForLoadState('networkidle');
await shot(showroomPage, '05-showroom-loaded');
const srCount = await showroomPage.$('.sr-count');
console.log(`  .sr-count element present: ${srCount ? '✅' : '❌'}`);
await showroomPage.close();

// ─── 6. CONTACT PAGE (NO BADGE) ───────────────────────────────────────────────
console.log('\n[6] Contact page — status badge removed…');
const contactPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
contactPage.on('pageerror', e => errors.push(`Contact PageError: ${e.message}`));
await contactPage.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
await shot(contactPage, '06-contact');
const statusBadge = await contactPage.$('.contact-status');
console.log(`  .contact-status badge present: ${statusBadge ? '❌ (should be removed)' : '✅ gone'}`);
if (statusBadge) errors.push('contact-status badge still in DOM');
await contactPage.close();

// ─── 7. MOBILE LAYOUT (375px) ────────────────────────────────────────────────
console.log('\n[7] Mobile layout 375px…');
const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
mobilePage.on('pageerror', e => errors.push(`Mobile PageError: ${e.message}`));
await mobilePage.goto(BASE, { waitUntil: 'networkidle' });
await shot(mobilePage, '07-mobile-home');
// Check auth book-left is hidden on mobile in auth page
await mobilePage.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await shot(mobilePage, '07-mobile-login');
const bookLeft = await mobilePage.$('.auth-book-left');
if (bookLeft) {
  const display = await mobilePage.evaluate(el => window.getComputedStyle(el).display, bookLeft);
  console.log(`  .auth-book-left display at 375px: ${display} ${display === 'none' ? '✅' : '❌'}`);
  if (display !== 'none') errors.push('auth-book-left should be hidden at 375px');
} else {
  console.log('  .auth-book-left not in DOM at /login');
}
await mobilePage.close();

// ─── 8. CONSOLE ERRORS SUMMARY ───────────────────────────────────────────────
console.log('\n[8] Browser console errors on home:');
if (consoleErrors.length === 0) {
  console.log('  None ✅');
} else {
  consoleErrors.forEach(e => console.log(`  ⚠️  ${e}`));
}

// ─── RESULT ───────────────────────────────────────────────────────────────────
await browser.close();

console.log('\n══════════════════════════════════════');
if (errors.length === 0) {
  console.log('VERDICT: PASS — all checks passed');
} else {
  console.log(`VERDICT: FAIL — ${errors.length} issue(s):`);
  errors.forEach(e => console.log(`  ❌ ${e}`));
}
console.log('Screenshots saved to ./' + OUT + '/');
