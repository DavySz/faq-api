import bcrypt from 'bcrypt'
import type { Encrypter } from '../../data/protocols/encrypter'

export class BcryptAdapter implements Encrypter {
  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 12)
    return hash
  }
}
