import { RequiredFieldsValidationValidation } from '../../presentation/helpers/validators/required-fields-validation'
import type { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldsValidationValidation(field))
  }

  return new ValidationComposite(validations)
}
