import type { AccountModel } from '../models/account'

export interface AddAccountModel {
  password: string
  email: string
  name: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
