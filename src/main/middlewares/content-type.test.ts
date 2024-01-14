import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  it('should return default content as json', async () => {
    app.get('/test-content-type', (_, res) => {
      return res.send('')
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  it('should return xml content type when forced', async () => {
    app.get('/test-content-type-xml', (_, res) => {
      res.type('xml')
      return res.send('')
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
