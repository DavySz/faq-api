import { MissingParamError } from '../../errors'
import { RequiredFieldsValidation } from './required-fields-validation'

describe('Required Fields Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidation('field')
    const error = sut.validate({
      name: 'any-name'
    })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return null if validation success', () => {
    const sut = new RequiredFieldsValidation('field')
    const error = sut.validate({
      field: 'any-name'
    })

    expect(error).toBeNull()
  })
})
