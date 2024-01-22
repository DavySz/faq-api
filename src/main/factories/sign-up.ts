import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/database/mongodb/log-error-repository/log'
import { SignUpController } from '../../presentation/controllers/sign-up/sign-up'
import type { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const encrypt = new BcryptAdapter()
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)
  const emailValidator = new EmailValidatorAdapter()
  const logRepository = new LogMongoRepository()
  const signUpController = new SignUpController(emailValidator, dbAddAccount)

  return new LogControllerDecorator(signUpController, logRepository)
}
