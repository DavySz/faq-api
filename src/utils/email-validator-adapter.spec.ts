import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  it('should return false if validator return false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid-email@mail.com')
    expect(isValid).toBe(false)
  })
  it('should return true if validator return true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid-email@mail.com')
    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', () => {
    const sut = makeSut()
    const validatorSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any-email@mail.com')
    expect(validatorSpy).toHaveBeenCalledWith('any-email@mail.com')
  })
})
