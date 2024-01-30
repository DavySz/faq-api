import type { AccountModel } from '../../../domain/models/account'
import type { Nullable } from '../../../presentation/common/types'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<Nullable<AccountModel>>
}
