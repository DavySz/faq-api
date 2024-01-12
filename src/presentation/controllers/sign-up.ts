import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest } from '../helpers'
import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValid = this.emailValidator.isValid(String(httpRequest.body.email))

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return { body: {}, statusCode: 200 }
  }
}
