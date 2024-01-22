import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { LoginController } from './login'

interface MakeSutModel {
  sut: LoginController
}

const makeSut = (): MakeSutModel => {
  const sut = new LoginController()
  return {
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
})
