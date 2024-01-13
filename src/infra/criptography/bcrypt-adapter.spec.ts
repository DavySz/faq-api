import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => {
    return await Promise.resolve('hashed-value')
  }
}))

describe('Bcrypt Adapter', () => {
  it('should calls Bcrypt with correct values', async () => {
    const sut = new BcryptAdapter()

    const salt = 12
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })

  it('should return an hashed value on success', async () => {
    const sut = new BcryptAdapter()
    const hash = await sut.encrypt('any-value')
    expect(hash).toBe('hashed-value')
  })
})
