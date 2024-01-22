import type { HttpRequest, HttpResponse, Controller } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(badRequest(new MissingParamError('email')))
  }
}
