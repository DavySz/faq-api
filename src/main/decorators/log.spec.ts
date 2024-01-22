import type { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { type AccountModel } from '../../domain/models/account'
import { ok, serverError } from '../../presentation/helpers'
import type { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface IMakeSut {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any-stack'
  return serverError(fakeError)
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'email@mail.com',
    password: 'any-password',
    passwordConfirmation: 'any-password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any-valid-id',
  name: 'any-valid-name',
  password: 'any-valid-password',
  email: 'any-valid-mail@mail.com'
})

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    httpRequest: HttpRequest

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      this.httpRequest = httpRequest
      return await Promise.resolve(ok(makeFakeAccount()))
    }
  }

  return new ControllerStub()
}

const makeSut = (): IMakeSut => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    logErrorRepositoryStub,
    controllerStub,
    sut
  }
}

describe('Log Controller Decorator', () => {
  it('should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('should return the same result of controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        Promise.resolve(makeServerError())
      )

    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any-stack')
  })
})
