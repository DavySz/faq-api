import { type Express, Router } from 'express'
import fg from 'fast-glob'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)

  const paths = fg.sync('**/src/main/routes/**routes.ts')

  for (const path of paths) {
    (await import(`../../../${path}`)).default(router)
  }
}
