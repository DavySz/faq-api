import { badRequest, ok, serverError } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import type { Controller, HttpRequest, HttpResponse } from '../../protocols'
import type { AddAccount, AddAccountModel, EmailValidator } from './sign-up-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, name, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(String(email))

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const accountModel: AddAccountModel = {
        email, name, password
      }

      const account = await this.addAccount.add(accountModel)

      return ok(account)
    } catch {
      return serverError()
    }
  }
}
