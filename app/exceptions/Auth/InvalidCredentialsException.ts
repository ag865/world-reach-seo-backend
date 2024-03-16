import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class InvalidCredentialsException extends Exception {
  constructor(
    public field = 'email',
    message = 'Invalid user credentials',
    status = 401,
    code = 'E_UNAUTHORIZED'
  ) {
    super(message, { code, status })
  }

  public async handle(error: this, { response }: HttpContext) {
    response.status(error.status).json({
      errors: [{ message: error.message, field: error.field }],
    })
  }
}
