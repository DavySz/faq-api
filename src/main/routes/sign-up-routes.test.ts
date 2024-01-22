import request from 'supertest'
import app from '../config/app'

import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper'

describe('Sign Up Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  it('should return an account on success', async () => {
    await request(app)
      .post('/api/sign-up')
      .send({
        name: 'john',
        email: 'john.doe@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
