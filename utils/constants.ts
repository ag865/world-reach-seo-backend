import env from '#start/env'

export const SCREENSHOT_URL = `https://api.apiflash.com/v1/urltoimage
?access_key=${env.get('FLASH_API_ACCESS_KEY')}
&format=jpeg
&response_type=image
&wait_until=network_idle
&url=`
