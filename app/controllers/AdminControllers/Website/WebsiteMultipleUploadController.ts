import { addWebsites } from '#services/WebsiteServices'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'
import xlsx from 'xlsx'

const validator = vine.compile(
  vine.object({
    file: vine.file({
      extnames: ['xlsx'],
    }),
  })
)

export default class WebsiteMultipleUploadsController {
  async handle({ request, response }: HttpContext) {
    let { file } = await request.validateUsing(validator)

    const fileName = `${cuid()}-${file.clientName}`

    await file.move(app.makePath('uploads'), { name: fileName })

    const workbook = xlsx.readFile(app.makePath('uploads', fileName))

    let workbook_sheet = workbook.SheetNames

    let data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[workbook_sheet[0]])

    const res = await addWebsites(data)

    return response.status(200).json({ msg: 'Websites imported successfully', res })
  }
}
