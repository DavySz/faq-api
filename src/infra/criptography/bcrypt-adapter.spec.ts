import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => {
    return await Promise.resolve('hashed-value')
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter()
}

describe('Bcrypt Adapter', () => {
  it('should calls Bcrypt with correct values', async () => {
    const sut = makeSut()

    const salt = 12
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })

  it('should return an hashed value on success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any-value')
    expect(hash).toBe('hashed-value')
  })

  it('should throws if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => { throw new Error() })

    const promise = sut.encrypt('any-value')
    await expect(promise).rejects.toThrow()
  })
})
