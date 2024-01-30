import { type Nullable } from '../../common/types'
import { MissingParamError } from '../../errors'
import { type Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutModel {
  validationStubs: Validation[]
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
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    validationStubs,
    sut
  }
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any-value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new Error())

    jest.spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    const error = sut.validate({ field: 'any-value' })
    expect(error).toEqual(new Error())
  })

  it('should return null if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any-value' })
    expect(error).toBeNull()
  })
})
