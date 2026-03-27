import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Blog post full accessibility audit', async ({ page }) => {
  await page.goto('/blog/marketing-branding-consultant');
  await page.waitForLoadState('networkidle');

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  for (const v of results.violations) {
    console.log(`\n=== ${v.id} (${v.impact}) ===`);
    console.log(`  ${v.description}`);
    console.log(`  Help: ${v.helpUrl}`);
    for (const node of v.nodes) {
      console.log(`  ---`);
      console.log(`  Element: ${node.html.slice(0, 200)}`);
      console.log(`  Selector: ${node.target.join(' > ')}`);
      console.log(`  Issue: ${node.failureSummary}`);
    }
  }

  console.log(`\n\nTOTAL: ${results.violations.length} violation types, ${results.violations.reduce((s, v) => s + v.nodes.length, 0)} elements`);
});
