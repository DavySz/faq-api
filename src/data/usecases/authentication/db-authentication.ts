import type { AuthenticationModel, Authentication } from '../../../domain/usecases/authentication'
import type { Nullable } from '../../../presentation/common/types'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticationRepository implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<Nullable<string>> {
    const { email } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)

    if (!account) {
      return null
    }

    return await Promise.resolve('any-string')
  };
}
