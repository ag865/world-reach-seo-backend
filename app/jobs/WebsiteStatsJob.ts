import { WebsiteServices } from '#services/index'
import { Queue, Worker } from 'bullmq'
import { redisConnection } from '../../utils/constants.js'
import { inProduction } from '../../utils/helpers.js'

const WebsiteStatsJob = async () => {
  if (inProduction()) {
    const statsQueue = new Queue('wesbite-stats', { connection: redisConnection })
    const websites = await WebsiteServices.getAllWebsites()
    for (var i = 0; i < websites.length; i++) {
      statsQueue.add(`website-stats-${websites[i].id}-${i + 1}`, websites[i])
    }
  }
}

new Worker(
  'wesbite-stats',
  async (job) => {
    const website = job.data
    await WebsiteServices.updateWebsiteStats(website)
  },
  { connection: redisConnection }
)

export default WebsiteStatsJob
