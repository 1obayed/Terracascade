import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  // Automated tests do not request public OSM tiles. The local country layer and scientific overlays still render.
  await page.route('https://tile.openstreetmap.org/**', (route) => route.abort());
});
test('observation, forecast, evidence and local watch journey', async ({ page }) => {
  await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'Earth Pulse.' })).toBeVisible();
  await page.getByRole('button', { name: 'Select checkpoint 1, 2026-08-19' }).click();
  await expect(page.locator('.map-metric')).toContainText('-4.0');
  await page.getByRole('button', { name: 'Inspect source & evidence' }).click();
  await expect(page.getByRole('dialog')).toContainText('ILLUSTRATIVE · NOT VERIFIED');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /ANTICIPATE/ }).click();
  await page.getByRole('button', { name: '+90D', exact: true }).click();
  await expect(page.locator('.map-metric')).toContainText('-85.8');
  await page.getByRole('button', { name: 'Watch this place', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Watchlist 1' })).toBeVisible();
  await page.getByRole('button', { name: 'Ask Terra', exact: true }).click();
  await page.getByRole('button', { name: 'Why is this forecast uncertain?', exact: true }).click();
  await expect(page.locator('.ask-answer')).toContainText('not a calibrated confidence interval');
});
test('scenario controls, reset and no horizontal overflow', async ({ page }) => {
  await page.goto('/scenarios');
  const baseline = await page.locator('.map-metric strong').textContent();
  await page.getByRole('slider', { name: 'Trend acceleration', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('.map-metric strong')).not.toHaveText(baseline!);
  await page.getByRole('button', { name: 'Reset scenario', exact: true }).click();
  await expect(page.locator('.map-metric strong')).toHaveText(baseline!);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
});
test('core accessibility and editorial routes', async ({ page }) => {
  for (const route of ['/', '/methodology', '/sources', '/about']) {
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test('simulated AI preview applies scenarios and exposes evidence', async ({ page }) => {
  await page.goto('/forecast');
  const panel = page.locator('.ai-preview-panel');
  await expect(panel).toContainText('AI preview · simulated responses');
  await expect(panel).toContainText('No AI model is connected');
  const baseline = await page.locator('.map-metric strong').textContent();
  await panel.getByRole('button', { name: 'Explore a faster trend', exact: true }).click();
  await panel.getByRole('button', { name: 'Apply suggested scenario', exact: true }).click();
  await expect(page.locator('.map-metric strong')).not.toHaveText(baseline!);
  await expect(panel.getByRole('button', { name: 'Matches current settings' })).toBeDisabled();
  await panel.getByRole('button', { name: 'Continue the current trend', exact: true }).click();
  await panel.getByRole('button', { name: 'Apply suggested scenario', exact: true }).click();
  await expect(page.locator('.map-metric strong')).toHaveText(baseline!);
  await panel.locator('.answer-sources button').first().click();
  await expect(page.getByRole('dialog')).toContainText('ILLUSTRATIVE');
  await page.keyboard.press('Escape');
  await panel.getByRole('button', { name: 'Explore with Ask Terra' }).click();
  await expect(page.getByRole('dialog')).toContainText('AI preview · simulated responses');
});
