import request from 'supertest'
import app from '../config/app'

describe('Sign Up Route', () => {
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
