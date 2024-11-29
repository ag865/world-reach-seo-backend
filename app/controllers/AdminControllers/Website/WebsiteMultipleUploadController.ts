import { addWebsites } from '#services/WebsiteServices'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'
import xlsx from 'xlsx'

const assembleFile = async (fileName: string, totalChunks: number, newFileName: string) => {
  const fileParts = []
  for (let i = 0; i < totalChunks; i++) {
    fileParts.push(`./uploads/${fileName}.part${i}`)
  }
  const assembledFilePath = `./uploads/${newFileName}`

  // Concatenate all file parts into a single file
  const writeStream = fs.createWriteStream(assembledFilePath)
  for (const filePart of fileParts) {
    const readStream = fs.createReadStream(filePart)
    readStream.pipe(writeStream, { end: false })
    await new Promise((resolve) => readStream.on('end', resolve))
  }

  // Remove temporary file parts
  for (const filePart of fileParts) {
    await fs.promises.unlink(filePart)
  }
}

export default class WebsiteMultipleUploadsController {
  async handle({ request, response }: HttpContext) {
    const { chunkData, totalChunks, currentChunkIndex, fileInfo } = request.body()

    // Convert array back to Uint8Array
    const uint8Array = chunkData instanceof Uint8Array ? chunkData : new Uint8Array(chunkData)

    // Convert Uint8Array to Buffer
    const buffer = Buffer.from(uint8Array)

    const filePath = `./uploads/${fileInfo.fileName}.part${currentChunkIndex}`

    // Write chunk data to a temporary file
    await fs.promises.writeFile(filePath, buffer)

    if (currentChunkIndex !== totalChunks - 1)
      return response.status(200).json({ success: true, message: 'Chunk uploaded successfully' })

    const fileName = cuid() + '-' + fileInfo.fileName

    await assembleFile(fileInfo.fileName, totalChunks, fileName)

    const workbook = xlsx.readFile(`./uploads/${fileName}`)

    let workbook_sheet = workbook.SheetNames

    let data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[workbook_sheet[0]])

    data.forEach((row) => {
      if (row.yourDateColumn instanceof Date) {
        row.yourDateColumn = row.yourDateColumn.toLocaleDateString('en-US')
      }
    })

    const res = await addWebsites(data)

    await fs.promises.rm(`./uploads/${fileName}`)

    return response.status(200).json({ msg: 'Websites imported successfully', res })
  }
}
