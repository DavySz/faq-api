import { MissingParamError } from '../errors'
import { SignUpController } from './sign-up'

const makeSut = (): SignUpController => {
  return new SignUpController()
}

describe('Sign Up Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'any-mail@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-mail@mail.com',
        passwordConfirmation: 'any-password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no passwordConfirmation is provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-mail@mail.com',
        password: 'any-password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
