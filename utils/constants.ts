import env from '#start/env'
import { inProduction } from './helpers.js'

export const SCREENSHOT_URL = `https://api.apiflash.com/v1/urltoimage
?access_key=${env.get('FLASH_API_ACCESS_KEY')}
&format=jpeg
&response_type=image
&wait_until=network_idle
&url=`

export const redisConnection = {
  host: env.get('QUEUE_REDIS_HOST'),
  port: env.get('QUEUE_REDIS_PORT'),
  password: inProduction() ? '' : env.get('QUEUE_REDIS_PASSWORD'),
}
