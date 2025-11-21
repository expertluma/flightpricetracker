import { chromium } from 'playwright'

let browser = null

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch()
  }
  return browser
}

export async function checkFlightPrices(googleFlightsUrl) {
  const browserInstance = await getBrowser()
  const context = await browserInstance.createBrowserContext()
  const page = await context.newPage()

  try {
    await page.goto(googleFlightsUrl, { waitUntil: 'networkidle' })
    
    await page.waitForTimeout(2000)

    const priceText = await page.evaluate(() => {
      const priceElement = document.querySelector('[aria-label*="price"], [aria-label*="from"], .gws-flights-results__price, [data-is-airfare]')
      if (!priceElement) return null
      
      const text = priceElement.textContent || priceElement.innerText
      const matches = text.match(/\$?[\d,]+/)
      return matches ? matches[0] : null
    })

    if (!priceText) {
      console.error('Could not find price on page:', googleFlightsUrl)
      return null
    }

    const price = parseInt(priceText.replace(/[$,]/g, ''))
    return price
  } catch (error) {
    console.error('Error scraping flight price:', error)
    return null
  } finally {
    await context.close()
  }
}

export async function closeBrowser() {
  if (browser) {
    await browser.close()
    browser = null
  }
}
