import { type Nullable } from '../../presentation/common/types'

export interface AuthenticationModel {
  password: string
  email: string
}

export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<Nullable<string>>
}
