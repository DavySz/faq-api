import { MissingParamError } from '../errors'
import { type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    return {
      statusCode: 400,
      body: new MissingParamError('email')
    }
  }
}
