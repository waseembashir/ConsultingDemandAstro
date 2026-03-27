import { test, expect } from '@playwright/test';

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'blog-listing', path: '/blog' },
  { name: 'blog-post', path: '/blog/marketing-branding-consultant' },
];

for (const page of pages) {
  test(`${page.name} visual regression`, async ({ page: pw }) => {
    await pw.goto(page.path);
    await pw.waitForLoadState('networkidle');
    await expect(pw).toHaveScreenshot(`${page.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
}
