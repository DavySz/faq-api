import { type Nullable } from '../../common/types'
import { MissingParamError } from '../../errors'
import { type Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Nullable<Error> {
        return null
      }
    }

    const validationStub = new ValidationStub()

    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any-value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
