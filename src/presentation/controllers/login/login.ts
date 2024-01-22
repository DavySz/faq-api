import type { HttpRequest, HttpResponse, Controller } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers'
import type { EmailValidator } from '../sign-up/sign-up-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return await Promise.resolve(badRequest(new MissingParamError('email')))
      }

      if (!password) {
        return await Promise.resolve(badRequest(new MissingParamError('password')))
      }

      const isValid = this.emailValidator.isValid(String(email))

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return await Promise.resolve({
        body: {},
        statusCode: 200
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
