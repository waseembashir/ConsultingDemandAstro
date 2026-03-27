import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Blog listing page — QA suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');
  });

  // ──────────────────── SEO & Meta ────────────────────

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Insights.*Analysis.*ConsultingDemand/);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /consulting landscape/);
  });

  test('has Open Graph meta tags', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /ConsultingDemand/);

    const ogDesc = page.locator('meta[property="og:description"]');
    await expect(ogDesc).toHaveAttribute('content', /.+/);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');

    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute('content', /\/blog/);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /.+/);
  });

  test('has Twitter Card meta tags', async ({ page }) => {
    const card = page.locator('meta[name="twitter:card"]');
    await expect(card).toHaveAttribute('content', 'summary_large_image');

    const title = page.locator('meta[name="twitter:title"]');
    await expect(title).toHaveAttribute('content', /ConsultingDemand/);
  });

  test('has canonical URL pointing to /blog', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /\/blog/);
  });

  test('has JSON-LD structured data', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const content = await jsonLd.textContent();
    const data = JSON.parse(content!);
    expect(data['@type']).toBe('CollectionPage');
    expect(data.mainEntity.numberOfItems).toBeGreaterThan(0);
  });

  // ──────────────────── Structure & Semantics ────────────────────

  test('has exactly one H1 in main content', async ({ page }) => {
    const h1s = page.locator('main h1');
    await expect(h1s).toHaveCount(1);
  });

  test('H1 text does not have merged words', async ({ page }) => {
    const h1Text = await page.locator('main h1').textContent();
    expect(h1Text).not.toMatch(/consulting\s{0}industry/i);
    expect(h1Text).toMatch(/consulting/i);
    expect(h1Text).toMatch(/industry/i);
  });

  test('blog posts are wrapped in <article> elements', async ({ page }) => {
    const articles = page.locator('article.post-card-wrapper');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('all post cards have a category data attribute', async ({ page }) => {
    const articles = page.locator('article[data-category]');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);

    // Every article should have a non-empty category
    for (let i = 0; i < count; i++) {
      const cat = await articles.nth(i).getAttribute('data-category');
      expect(cat).toBeTruthy();
    }
  });

  test('post dates use <time> elements with datetime', async ({ page }) => {
    const times = page.locator('article time[datetime]');
    const count = await times.count();
    expect(count).toBeGreaterThan(0);

    // Verify datetime is a valid ISO date
    const dt = await times.first().getAttribute('datetime');
    expect(dt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('heading hierarchy is correct (h1 then h2s)', async ({ page }) => {
    const headings = await page.locator('main :is(h1, h2, h3, h4, h5, h6)').evaluateAll(
      els => els.map(el => el.tagName.toLowerCase())
    );
    expect(headings[0]).toBe('h1');
    // No h3+ should appear before an h2
    const firstNonH1 = headings.find(h => h !== 'h1');
    if (firstNonH1) {
      expect(firstNonH1).toBe('h2');
    }
  });

  // ──────────────────── Navigation & Links ────────────────────

  test('all blog post links return 200', async ({ page, request }) => {
    const links = await page.locator('a[href^="/blog/"]').evaluateAll(
      els => [...new Set(els.map(el => el.getAttribute('href')))]
    );
    expect(links.length).toBeGreaterThan(0);

    // Check a sample of links (first 5) for performance
    const sample = links.slice(0, 5);
    for (const href of sample) {
      const res = await request.get(href!);
      expect(res.status(), `${href} should return 200`).toBe(200);
    }
  });

  test('no empty or hash-only links', async ({ page }) => {
    const emptyLinks = await page.locator('a[href=""], a[href="#"]').count();
    expect(emptyLinks).toBe(0);
  });

  // ──────────────────── Images ────────────────────

  test('all images have alt attributes', async ({ page }) => {
    const imgsWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imgsWithoutAlt).toBe(0);
  });

  test('logo images have loading attribute', async ({ page }) => {
    const logos = page.locator('img.logo-img');
    const count = await logos.count();
    for (let i = 0; i < count; i++) {
      const loading = await logos.nth(i).getAttribute('loading');
      expect(loading).toBeTruthy();
    }
  });

  // ──────────────────── Category Filter ────────────────────

  test('category filter buttons are present', async ({ page }) => {
    const buttons = page.locator('.filter-btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // First button should be active
    await expect(buttons.first()).toHaveClass(/active/);
    await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true');
  });

  test('clicking a category filter hides non-matching posts', async ({ page }) => {
    const allCards = page.locator('.grid-item');
    const totalBefore = await allCards.count();
    expect(totalBefore).toBeGreaterThan(0);

    // Click a specific category (not "All Topics")
    const strategyBtn = page.locator('.filter-btn', { hasText: 'Strategy' });
    await strategyBtn.click();

    // Some posts should now be hidden
    const visibleCards = page.locator('.grid-item:not([style*="display: none"])');
    const visibleCount = await visibleCards.count();
    expect(visibleCount).toBeGreaterThan(0);
    expect(visibleCount).toBeLessThan(totalBefore);

    // All visible cards should have the matching category
    for (let i = 0; i < visibleCount; i++) {
      const cat = await visibleCards.nth(i).locator('[data-category]').getAttribute('data-category');
      expect(cat).toBe('Strategy');
    }
  });

  test('clicking "All Topics" shows all posts again', async ({ page }) => {
    // First filter to a category
    await page.locator('.filter-btn', { hasText: 'Strategy' }).click();

    // Then click "All Topics"
    await page.locator('.filter-btn', { hasText: 'All Topics' }).click();

    const hiddenCards = await page.locator('.grid-item[style*="display: none"]').count();
    expect(hiddenCards).toBe(0);
  });

  // ──────────────────── Accessibility (axe-core) ────────────────────

  test('passes axe-core accessibility audit (critical + serious)', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const serious = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (serious.length > 0) {
      console.log(
        'Serious a11y violations:',
        JSON.stringify(
          serious.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.map(n => n.html.slice(0, 120)),
          })),
          null,
          2
        )
      );
    }

    expect(serious).toEqual([]);
  });

  // ──────────────────── Visual Layout ────────────────────

  test('post cards are not all crammed into one row', async ({ page }) => {
    const cards = page.locator('.grid-item');
    const count = await cards.count();
    expect(count).toBeGreaterThan(3);

    // Cards should span multiple rows — check that not all share the same Y position
    const yPositions = new Set<number>();
    for (let i = 0; i < Math.min(count, 8); i++) {
      const box = await cards.nth(i).boundingBox();
      if (box) yPositions.add(Math.round(box.y));
    }
    expect(yPositions.size, 'Cards should span multiple rows, not a single horizontal line').toBeGreaterThan(1);
  });

  test('post cards have reasonable minimum width', async ({ page }) => {
    const firstCard = page.locator('.post-card').first();
    const box = await firstCard.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(200);
  });

  // ──────────────────── Page Performance Basics ────────────────────

  test('page loads in under 5 seconds', async ({ page }) => {
    // Warm the server with a preflight request
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    // Measure a second navigation (avoids cold-start penalty in dev)
    const start = Date.now();
    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/blog');
    await page.waitForLoadState('domcontentloaded');

    expect(errors).toEqual([]);
  });

  // ──────────────────── Footer ────────────────────

  test('footer is present', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
