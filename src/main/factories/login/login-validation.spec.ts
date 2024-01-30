import { EmailValidation, RequiredFieldsValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import type { Validation } from '../../../presentation/protocols'
import type { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  it('should call Validation composite with all validations', () => {
    makeLoginValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email']) {
      validations.push(new RequiredFieldsValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
