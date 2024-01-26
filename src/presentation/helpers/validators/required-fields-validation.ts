import type { Nullable } from '../../common/types'
import { MissingParamError } from '../../errors'
import type { Validation } from './validation'

export class RequiredFieldsValidationValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Nullable<Error> {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }

    return null
  }
}
