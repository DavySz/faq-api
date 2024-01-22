import { DbAddAccount } from './db-add-account'
import type { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'

interface IMakeSut {
  addAccountRepositoryStub: AddAccountRepository
  encrypterStub: Encrypter
  sut: DbAddAccount
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid-id',
  name: 'valid-name',
  email: 'valid-email',
  password: 'hashed-password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid-name',
  email: 'valid-email',
  password: 'valid-password'
})

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed-password') })
    }
  }

  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountRepositoryStub()
}

const makeSut = (): IMakeSut => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    addAccountRepositoryStub,
    encrypterStub,
    sut
  }
}

describe('DbAddAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeFakeAccountData())
    expect(encryptSpy).toHaveBeenCalledWith('valid-password')
  })

  it('should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        Promise.reject(new Error())
      )

    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid-name',
      email: 'valid-email',
      password: 'hashed-password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        Promise.reject(new Error())
      )

    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
