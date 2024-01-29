import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Required Fields Validation', () => {
  it('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      fieldToCompare: 'different-value',
      field: 'any-value'
    })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('should return null if validation success', () => {
    const sut = makeSut()
    const error = sut.validate({
      fieldToCompare: 'any-value',
      field: 'any-value'
    })

    expect(error).toBeNull()
  })
})
