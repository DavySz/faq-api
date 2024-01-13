import { type Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface IMakeSut {
  encrypterStub: Encrypter
  sut: DbAddAccount
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed-password') })
    }
  }

  return new EncrypterStub()
}

const makeSut = (): IMakeSut => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    encrypterStub,
    sut
  }
}

describe('DbAddAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid-password')
  })

  it('should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        Promise.reject(new Error())
      )

    const accountData = {
      name: 'valid-name',
      email: 'valid-email',
      password: 'valid-password'
    }

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
