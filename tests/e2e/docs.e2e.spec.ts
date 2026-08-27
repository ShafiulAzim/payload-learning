import { expect, test } from '@playwright/test'

test.describe('Payload documentation', () => {
  test('serves public documentation and follows Payload navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/docs')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Payload CMS in this project' }),
    ).toBeVisible()
    await page.getByRole('link', { name: 'Local API', exact: true }).filter({ visible: true }).click()
    await expect(page).toHaveURL('http://localhost:3000/docs/operations/local-api')
    await expect(page.getByText('overrideAccess: true', { exact: false }).first()).toBeVisible()
  })

  test('returns 404 for an unknown documentation slug', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/docs/not-in-the-manifest')

    expect(response?.status()).toBe(404)
  })

  test('exposes documentation navigation on a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000/docs/collections/properties')

    await page.getByText('Browse documentation', { exact: true }).click()
    await expect(page.getByRole('link', { name: 'Bookings', exact: true }).first()).toBeVisible()
  })
})
