import type { Nullable } from '../../../presentation/common/types'
import type {
  HashCompare,
  Encrypter,
  Authentication,
  AuthenticationModel,
  UpdateAccessTokenRepository,
  LoadAccountByEmailRepository
} from './db-authentication-protocols'

export class DbAuthenticationRepository implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
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

    const accessToken = await this.encrypter.encrypt(account.id)

    await this.updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  };
}
