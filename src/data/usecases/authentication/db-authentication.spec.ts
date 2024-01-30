import { DbAuthenticationRepository } from './db-authentication'
import type {
  AccountModel,
  AuthenticationModel,
  HashCompare, LoadAccountByEmailRepository,
  TokenGenerator, UpdateAccessTokenRepository
} from './db-authentication-protocols'

interface SutModel {
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
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

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, token: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

const makeSut = (): SutModel => {
  const hashCompareStub = makeHashCompare()
  const tokenGeneratorStub = makeTokenGenerator()
  const loadAccountByEmailStub = makeLoadAccountByEmail()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()

  const sut = new DbAuthenticationRepository(
    loadAccountByEmailStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    updateAccessTokenRepositoryStub,
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

  it('should throw TokenGenerator throws', async () => {
    const { tokenGeneratorStub, sut } = makeSut()

    jest.spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow(new Error())
  })

  it('should return accessToken on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any-token')
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('any-id', 'any-token')
  })

  it('should throw UpdateAccessTokenRepository throws', async () => {
    const { updateAccessTokenRepositoryStub, sut } = makeSut()

    jest.spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const error = sut.auth(makeFakeAuthentication())

    await expect(error).rejects.toThrow(new Error())
  })
})
