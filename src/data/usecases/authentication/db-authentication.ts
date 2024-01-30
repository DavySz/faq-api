import type { AuthenticationModel, Authentication } from '../../../domain/usecases/authentication'
import type { Nullable } from '../../../presentation/common/types'
import type { HashCompare } from '../../protocols/criptography/hash-compare'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticationRepository implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare
  ) {}

  async auth (authentication: AuthenticationModel): Promise<Nullable<string>> {
    const { email } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)

    if (!account) {
      return null
    }

    await this.hashCompare.compare(authentication.password, account.password)

    return await Promise.resolve('any-string')
  };
}
