import type { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import type { AddAccountModel } from '../../../../domain/usecases/add-account'
import type { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import type { WithId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)

    const { _id, ...accountWithoutMongoId } = await accountCollection
      .findOne({ _id: result.insertedId }) as WithId<Document>

    const account: AccountModel = {
      ...accountWithoutMongoId,
      id: _id.toHexString()
    } as unknown as AccountModel

    return account
  }
}
