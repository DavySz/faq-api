import type { Nullable } from '../../common/types'
import { MissingParamError } from '../../errors'
import type { Validation } from '../../protocols/validation'

export class RequiredFieldsValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Nullable<Error> {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }

    return null
  }
}
