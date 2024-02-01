import bcrypt from 'bcrypt'
import type { Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, 12)
    return hash
  }
}
