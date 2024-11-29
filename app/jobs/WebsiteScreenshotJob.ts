import { S3Service, WebsiteServices } from '#services/index'
import { Queue, Worker } from 'bullmq'
import { redisConnection } from '../../utils/constants.js'

const WebsiteScreenshotJob = async () => {
  const screenshotsQueue = new Queue('wesbite-screenshot', { connection: redisConnection })
  const websites = await WebsiteServices.getWebsitesForScreenshots()
  for (var i = 0; i < websites.length; i++) {
    screenshotsQueue.add(`website-screenshot-${i + 1}`, {
      id: websites[i].id,
      domain: websites[i].domain,
    })
  }
}

new Worker(
  'wesbite-screenshot',
  async (job) => {
    const { id, domain } = job.data
    const screenshotUrl = await S3Service.uploadWebsiteScreenshot(domain)
    await WebsiteServices.updateWebsite(id, screenshotUrl)
  },
  { connection: redisConnection }
)

export default WebsiteScreenshotJob
