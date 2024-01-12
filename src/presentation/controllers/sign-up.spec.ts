import { SignUpController } from './sign-up'

describe('Sign Up Controller', () => {
  it('should return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'any-mail@mail.com',
        password: 'any-password',
        passwordConfirmation: 'any-password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
