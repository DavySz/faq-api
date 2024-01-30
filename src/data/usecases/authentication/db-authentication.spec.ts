import { type AuthenticationModel } from '../../../domain/usecases/authentication'
import { type HashCompare } from '../../protocols/criptography/hash-compare'
import { type TokenGenerator } from '../../protocols/criptography/token-generator'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import type { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthenticationRepository } from './db-authentication'

interface SutModel {
  loadAccountByEmailStub: LoadAccountByEmailRepository
  tokenGeneratorStub: TokenGenerator
  sut: DbAuthenticationRepository
  hashCompareStub: HashCompare
}

const makeAccount = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  password: 'hashed-password',
  email: 'any-email@mail.com'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any-email@mail.com',
  password: 'any-password'
})

const makeLoadAccountByEmail = (): LoadAccountByEmailRepository => {
  class DbLoadAccountByEmailStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeAccount())
    }
  }

  return new DbLoadAccountByEmailStub()
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashCompareStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return await Promise.resolve('any-token')
    }
  }

  return new TokenGeneratorStub()
}

const makeSut = (): SutModel => {
  const hashCompareStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGenerator()
  const loadAccountByEmailStub = makeLoadAccountByEmail()
  const sut = new DbAuthenticationRepository(
    loadAccountByEmailStub,
    hashCompareStub,
    tokenGeneratorStub
  )

  return {
    loadAccountByEmailStub,
    tokenGeneratorStub,
    hashCompareStub,
    sut
  }
}

describe('BbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { loadAccountByEmailStub, sut } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailStub, 'load')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any-email@mail.com')
  })

  it('should throw LoadAccountByEmailRepository throws', async () => {
    const { loadAccountByEmailStub, sut } = makeSut()

    jest.spyOn(loadAccountByEmailStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow(new Error())
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { loadAccountByEmailStub, sut } = makeSut()

    jest.spyOn(loadAccountByEmailStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null))

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  it('should call HashCompare with correct values', async () => {
    const { hashCompareStub, sut } = makeSut()

    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith('any-password', 'hashed-password')
  })

  it('should throw HashCompare throws', async () => {
    const { hashCompareStub, sut } = makeSut()

    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow(new Error())
  })

  it('should return null if HashCompare returns false', async () => {
    const { hashCompareStub, sut } = makeSut()

    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  it('should call TokenGenerator with correct id', async () => {
    const { tokenGeneratorStub, sut } = makeSut()

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())

    expect(generateSpy).toHaveBeenCalledWith('any-id')
  })
})
