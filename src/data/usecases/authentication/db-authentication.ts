import type { AuthenticationModel, Authentication } from '../../../domain/usecases/authentication'
import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email } = authentication
    await this.loadAccountByEmailRepository.load(email)

    return await Promise.resolve('any-string')
  };
}
