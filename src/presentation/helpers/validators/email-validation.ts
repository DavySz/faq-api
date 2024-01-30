import type { EmailValidator } from '../../protocols/email-validator'
import type { Nullable } from '../../common/types'
import { InvalidParamError } from '../../errors'
import type { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Nullable<Error> {
    const isValid = this.emailValidator.isValid(String(input[this.fieldName]))

    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }

    return null
  }
}
