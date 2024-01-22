import type { HttpRequest, HttpResponse, Controller } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!httpRequest.body.password) {
      return await Promise.resolve(badRequest(new MissingParamError('password')))
    }

    return await Promise.resolve({
      body: {},
      statusCode: 200
    })
  }
}
