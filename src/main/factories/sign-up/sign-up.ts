import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/database/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/database/mongodb/log-error-repository/log'
import { SignUpController } from '../../../presentation/controllers/sign-up/sign-up'
import type { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './sign-up-validation'

export const makeSignUpController = (): Controller => {
  const encrypt = new BcryptAdapter()
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)
  const logRepository = new LogMongoRepository()

  const signUpController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation()
  )

  return new LogControllerDecorator(signUpController, logRepository)
}
