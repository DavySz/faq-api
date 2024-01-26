import type { AddAccountModel, AddAccount, EmailValidator, AccountModel, HttpRequest, Validation } from './sign-up-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers'
import type { Nullable } from '../../common/types'
import { SignUpController } from './sign-up'

interface SutModel {
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
  sut: SignUpController
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    password: 'any-password',
    email: 'any-mail@mail.com',
    passwordConfirmation: 'any-password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any-valid-id',
  name: 'any-valid-name',
  password: 'any-valid-password',
  email: 'any-valid-mail@mail.com'
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Nullable<Error> {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutModel => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
  return {
    emailValidatorStub,
    validationStub,
    addAccountStub,
    sut
  }
}

describe('Sign Up Controller', () => {
  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should call EmailValidator.isValid with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any-mail@mail.com')
  })

  it('should return 500 if EmailValidator.isValid throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should return 500 if AddAccount.add throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => { reject(new Error()) })
      })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('should call AddAccount.add with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith({
      email: 'any-mail@mail.com',
      password: 'any-password',
      name: 'any-name'
    })
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('should call Validation.validate with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation.validate return an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any-field'))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any-field')))
  })
})
