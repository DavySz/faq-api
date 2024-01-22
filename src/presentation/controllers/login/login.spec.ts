import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { type EmailValidator } from '../sign-up/sign-up-protocols'
import { LoginController } from './login'

interface MakeSutModel {
  emailValidatorStub: EmailValidator
  sut: LoginController
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): MakeSutModel => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return {
    emailValidatorStub,
    sut
  }
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        password: 'any-password'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        email: 'any-mail@mail.com'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle({
      body: {
        email: 'any-mail@mail.com',
        password: 'any-password'
      }
    })

    expect(isValidSpy).toHaveBeenCalledWith('any-mail@mail.com')
  })
})
