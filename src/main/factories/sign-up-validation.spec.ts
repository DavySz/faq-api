import { RequiredFieldsValidationValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { type Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './sign-up-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call Validation composite with all validations', () => {
    makeSignUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldsValidationValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
