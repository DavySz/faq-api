import { type Nullable } from '../../common/types'
import { MissingParamError } from '../../errors'
import { type Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutModel {
  validationStub: Validation
  sut: ValidationComposite
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Nullable<Error> {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutModel => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])

  return {
    validationStub,
    sut
  }
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any-value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
