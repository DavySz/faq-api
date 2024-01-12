import { MissingParamError } from '../errors'
import { badRequest } from '../helpers'
import { type Controller, type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return { body: {}, statusCode: 200 }
  }
}
