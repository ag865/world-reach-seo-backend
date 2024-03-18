import ForbiddenAccessException from '#exceptions/Auth/ForbiddenAccessException'
import NotFoundException from '#exceptions/NotFoundException'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class IsAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (!ctx.auth.user?.isAdmin) {
      throw new ForbiddenAccessException()
    }

    if (!ctx.auth.user?.isActive) {
      throw new NotFoundException('email', 'Account is not active')
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
