import { type AuthenticationModel } from '../../../domain/usecases/authentication'
import type { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import type { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthenticationRepository } from './db-authentication'

interface SutModel {
  loadAccountByEmailStub: LoadAccountByEmailRepository
  sut: DbAuthenticationRepository
}

const makeAccount = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  password: 'any-password',
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

const makeSut = (): SutModel => {
  const loadAccountByEmailStub = makeLoadAccountByEmail()
  const sut = new DbAuthenticationRepository(loadAccountByEmailStub)

  return {
    loadAccountByEmailStub,
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
})
