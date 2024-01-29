import { MissingParamError } from '../../errors'
import { RequiredFieldsValidation } from './required-fields-validation'

const makeSut = (): RequiredFieldsValidation => {
  return new RequiredFieldsValidation('field')
}

describe('Required Fields Validation', () => {
  it('should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      name: 'any-name'
    })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return null if validation success', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any-name'
    })

    expect(error).toBeNull()
  })
})
