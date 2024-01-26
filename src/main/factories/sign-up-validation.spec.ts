import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { type Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { makeSignUpValidation } from './sign-up-validation'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call Validation composite with all validations', () => {
    makeSignUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldsValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
