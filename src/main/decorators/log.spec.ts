import type { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  it('should call controller handle', async () => {
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

    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const sut = new LogControllerDecorator(controllerStub)
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
