import type { AuthenticationModel, Authentication } from '../../../domain/usecases/authentication'
import type { Nullable } from '../../../presentation/common/types'
import type { HashCompare } from '../../protocols/criptography/hash-compare'
import type { TokenGenerator } from '../../protocols/criptography/token-generator'
import type { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import type { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthenticationRepository implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<Nullable<string>> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepository.load(email)

    if (!account) {
      return null
    }

    const isEqual = await this.hashCompare.compare(password, account.password)

    if (!isEqual) {
      return null
    }

    const accessToken = await this.tokenGenerator.generate(account.id)

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  };
}
