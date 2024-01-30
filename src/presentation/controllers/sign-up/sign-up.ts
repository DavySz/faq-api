import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import type { Controller, HttpRequest, HttpResponse } from '../../protocols'
import type { AddAccount, AddAccountModel, Validation } from './sign-up-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { email, name, password } = httpRequest.body
      const accountModel: AddAccountModel = {
        email, name, password
      }

      const account = await this.addAccount.add(accountModel)

      return ok(account)
    } catch (error: unknown) {
      return serverError(error as Error)
    }
  }
}
