import { HttpContext } from '@adonisjs/core/http'
import puppeteer from 'puppeteer'

export default class ScreenshotController {
  async capture({ request, response }: HttpContext) {
    // Get the URL from the request
    const { url } = request.qs()
    if (!url) {
      return response.badRequest({ error: 'URL is required' })
    }

    try {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })
      const page = await browser.newPage()

      await page.setViewport({ width: 1024, height: 768 })

      await page.goto(url, { waitUntil: 'networkidle2' })

      const screenshot = await page.screenshot({ fullPage: true })
      await browser.close()

      const screenshotBuffer = Buffer.from(screenshot)

      response.header('Content-Type', 'image/png')
      return response.send(screenshotBuffer)
    } catch (error) {
      return response.status(500).send({ error: 'Error capturing screenshot' })
    }
  }
}
