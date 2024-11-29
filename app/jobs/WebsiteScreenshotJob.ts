import { WebsiteServices } from '#services/index'

const WebsiteScreenshotJob = async () => {
  const websites = await WebsiteServices.getWebsitesForScreenshots()
}

export default WebsiteScreenshotJob
