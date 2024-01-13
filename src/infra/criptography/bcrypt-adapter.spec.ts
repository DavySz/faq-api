import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
describe('Bcrypt Adapter', () => {
  it('should calls Bcrypt with correct values', async () => {
    const sut = new BcryptAdapter()

    const salt = 12
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })
})
