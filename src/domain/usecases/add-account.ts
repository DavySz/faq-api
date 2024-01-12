import { type AccountModel } from '../models'

export interface AddAccountModel {
  password: string
  email: string
  name: string
}

export interface AddAccount {
  add: (account: AddAccountModel) => AccountModel
}
