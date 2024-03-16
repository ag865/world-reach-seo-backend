import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class InvalidUserTypeException extends Exception {
  constructor(
    public field = 'email',
    message = 'You are not allowed to use this service.',
    status = 403,
    code = 'E_FORBIDDEN_ACCESS'
  ) {
    super(message, { code, status })
  }

  public async handle(error: this, { response }: HttpContext) {
    response.status(error.status).json({
      errors: [{ message: error.message, field: error.field }],
    })
  }
}
