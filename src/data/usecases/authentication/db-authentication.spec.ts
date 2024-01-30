import type { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import type { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeAccount = (): AccountModel => ({
  id: 'any-id',
  name: 'any-name',
  password: 'any-password',
  email: 'any-email@mail.com'
})

describe('BbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    class DbLoadAccountByEmailStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return await Promise.resolve(makeAccount())
      }
    }

    const loadAccountByEmailRepositoryStub = new DbLoadAccountByEmailStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth({
      email: 'any-email@mail.com',
      password: 'any-password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any-email@mail.com')
  })
})
