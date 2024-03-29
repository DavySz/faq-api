/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/sign-up'

export default (router: Router): void => {
  router.post('/sign-up', adaptRoute(makeSignUpController()))
}
