import { InvalidParamError, MissingParamError } from '../../errors'
import type { HttpRequest, EmailValidator } from '../sign-up/sign-up-protocols'
import { badRequest, serverError } from '../../helpers'
import { LoginController } from './login'
import { type Authentication } from '../../../domain/usecases/authentication'

interface MakeSutModel {
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
  sut: LoginController
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any-mail@mail.com',
    password: 'any-password'
  }
})

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await Promise.resolve('any-token')
    }
  }

  return new AuthenticationStub()
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
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    authenticationStub,
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

    await sut.handle(makeFakeRequest())

    expect(isValidSpy).toHaveBeenCalledWith('any-mail@mail.com')
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())

    expect(authSpy).toHaveBeenCalledWith('any-mail@mail.com', 'any-password')
  })
})
