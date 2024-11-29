import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import drive from '@adonisjs/drive/services/main'
import axios from 'axios'
import fs from 'fs/promises'
import { SCREENSHOT_URL } from '../../utils/constants.js'

const uploadAvatar = async (avatar: MultipartFile) => {
  //Creating file name and path
  const fileName = `${cuid()}.${avatar.clientName}`
  const filePath = `uploads/${fileName}`

  //uploading image to local storage
  await avatar.move(app.makePath('uploads'), { name: fileName })

  //creating image  content
  const bufferArray = await fs.readFile(filePath)
  const fileContent = new Uint8Array(bufferArray)

  //uploading image content to s31
  await drive.use('s3').put(fileName, fileContent)

  //removing file from local storage
  await fs.unlink(filePath)

  //getting public url of uploaded image from s3
  const publicUrl = await drive.use('s3').getUrl(fileName)
  return publicUrl
}

const uploadWebsiteScreenshot = async (domain: string) => {
  try {
    //Getting the screenshot from api
    const SITE_SCREENSHOT_URL = `${SCREENSHOT_URL}https://${domain}`
    const imageResponse = await axios.get(SITE_SCREENSHOT_URL, { responseType: 'stream' })

    if (imageResponse.status !== 200) {
      return ''
    }

    //Creating file name and path
    const fileName = `${cuid()}.jpg`
    const filePath = app.makePath('uploads', fileName)

    //uploading image to local storage
    await fs.writeFile(filePath, imageResponse.data)

    //creating image  content
    const bufferArray = await fs.readFile(filePath)
    const fileContent = new Uint8Array(bufferArray)

    //uploading image content to s3
    await drive.use('s3').put(fileName, fileContent)

    //removing file from local storage
    await fs.unlink(filePath)

    //getting public url of uploaded image from s3
    const publicUrl = await drive.use('s3').getUrl(fileName)
    return publicUrl
  } catch (e: any) {
    return ''
  }
}

export { uploadAvatar, uploadWebsiteScreenshot }
