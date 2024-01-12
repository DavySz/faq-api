import { MissingParamError } from '../errors'
import { badRequest } from '../helpers'
import { type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    return badRequest(new MissingParamError('email'))
  }
}
