import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import type { Validation } from '../sign-up/sign-up-protocols'
import type { Authentication, Controller, HttpRequest, HttpResponse } from './login-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({
        password: String(password),
        email: String(email)
      })

      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
