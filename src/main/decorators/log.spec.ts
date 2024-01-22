import type { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface IMakeSut {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    httpRequest: HttpRequest

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      this.httpRequest = httpRequest

      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any-name',
          email: 'email@mail.com',
          password: 'any-password'
        }
      }

      return await Promise.resolve(httpResponse)
    }
  }

  return new ControllerStub()
}

const makeSut = (): IMakeSut => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    controllerStub,
    sut
  }
}

describe('Log Controller Decorator', () => {
  it('should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest: HttpRequest = {
      body: {
        name: 'any-name',
        email: 'email@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
