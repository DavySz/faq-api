import { type AddAccountModel, type AddAccount } from '../../domain/usecases'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers'
import { type EmailValidator, type Controller, type HttpRequest, type HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  handle (httpRequest: HttpRequest): HttpResponse {
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

      this.addAccount.add(accountModel)

      return { body: {}, statusCode: 200 }
    } catch {
      return serverError()
    }
  }
}
