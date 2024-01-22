import type { HttpRequest, HttpResponse, Controller } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import type { EmailValidator } from '../sign-up/sign-up-protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!httpRequest.body.password) {
      return await Promise.resolve(badRequest(new MissingParamError('password')))
    }

    const isValid = this.emailValidator.isValid(String(httpRequest.body.email))

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return await Promise.resolve({
      body: {},
      statusCode: 200
    })
  }
}
