import { InvalidParamError } from '../../errors'
import type { EmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from './email-validation'

interface SutModel {
  emailValidatorStub: EmailValidator
  sut: EmailValidation
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutModel => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    emailValidatorStub,
    sut
  }
}

describe('Sign Up Controller', () => {
  it('should call EmailValidator.isValid with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'any-mail@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any-mail@mail.com')
  })

  it('should throw if EmailValidator.isValid throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(sut.validate).toThrow()
  })

  it('should return an error if EmailValidator return false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'any-mail' })
    expect(error).toEqual(new InvalidParamError('email'))
  })
})
