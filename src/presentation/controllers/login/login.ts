import type { HttpRequest, HttpResponse, Controller } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers'
import type { EmailValidator } from '../sign-up/sign-up-protocols'
import { type Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body

      const requiredFields = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(String(email))

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const token = await this.authentication.auth(String(email), String(password))

      if (!token) {
        return unauthorized()
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
