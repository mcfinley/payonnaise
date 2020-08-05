const app = require('../dist')

const supertest = require('supertest')
const request = supertest(app)

describe('Profiles Tests', () => {
  it('creates a profile', async () => {
    const res = await request.post('/api/v1/profiles').send({})

    expect(res.status).toBe(200)
  })

  it('retrieves a profile', async () => {
    const res1 = await request.post('/api/v1/profiles').send({})

    expect(res1.status).toBe(200)

    const id = res1.body[0].id

    const res2 = await request.get(`/api/v1/profiles/${id}`)

    expect(res2.status).toBe(200)
    expect(res2.body.id).toBe(id)
  })

  it('retrieves all profiles', async () => {
    const res1 = await request.post('/api/v1/profiles').send({})

    expect(res1.status).toBe(200)

    const id = res1.body[0].id
    const res2 = await request.get(`/api/v1/profiles`)

    expect(res2.status).toBe(200)
    expect(Array.isArray(res2.body)).toBe(true)
    expect(res2.body.filter((entry) => entry.id === id).length > 0).toBe(true)
  })

  it('deletes a profile', async () => {
    const res1 = await request.post('/api/v1/profiles').send({})

    expect(res1.status).toBe(200)

    const id = res1.body[0].id
    const res2 = await request.get(`/api/v1/profiles`)

    expect(res2.status).toBe(200)
    expect(Array.isArray(res2.body)).toBe(true)
    expect(res2.body.filter((entry) => entry.id === id).length > 0).toBe(true)

    const res3 = await request.delete(`/api/v1/profiles/${id}`)
    expect(res3.status).toBe(200)

    const res4 = await request.get(`/api/v1/profiles`)

    expect(res4.status).toBe(200)
    expect(Array.isArray(res4.body)).toBe(true)
    expect(res4.body.filter((entry) => entry.id === id).length > 0).toBe(false)
  })
})

