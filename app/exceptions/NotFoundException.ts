import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class NotFoundException extends Exception {
  constructor(
    public field = 'email',
    message = 'Record doest not exist',
    status = 404,
    code = 'E_ROW_NOT_FOUND'
  ) {
    super(message, { code, status })
  }

  public async handle(error: this, { response }: HttpContext) {
    response.status(error.status).json({
      errors: [{ message: error.message, field: error.field }],
    })
  }
}
