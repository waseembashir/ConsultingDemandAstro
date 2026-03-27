import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Homepage', path: '/' },
  { name: 'Blog listing', path: '/blog' },
  { name: 'Blog post', path: '/blog/marketing-branding-consultant' },
];

for (const page of pages) {
  test(`${page.name} should have no accessibility violations`, async ({ page: pw }) => {
    await pw.goto(page.path);
    await pw.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page: pw })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations = results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    }));

    if (violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(violations, null, 2));
    }

    expect(violations.filter(v => v.impact === 'critical' || v.impact === 'serious')).toEqual([]);
  });
}
