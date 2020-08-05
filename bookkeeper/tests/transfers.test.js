const app = require('../dist')
const db = require('../dist/libs/database')

const supertest = require('supertest')
const request = supertest(app)

describe('Transfers Tests', () => {
  let profiles = []
  let accounts = []
  beforeAll(async () => {
    await Promise.all(new Array(10).fill(0).map(async (_, index) => {
      profiles[index] = (await db.default('profiles').insert({}).returning('*'))[0]
    }))
    await Promise.all(new Array(20).fill(0).map(async (_, index) => {
      accounts[index] = (await db.default('accounts').insert({ asset: `test-asset/${Math.random().toString()}`, profileId: profiles[Math.floor(index / 2)].id }).returning('*'))[0]
    }))
  })

  afterAll(async () => {
    await Promise.all(profiles.map(async ({ id }) => {
      await db.default.delete().from('accounts').where({ profileId: id})
      await db.default.delete().from('profiles').where({ id })
    }))
  })

  it('creates a transfer', async () => {
    const res = await request.post('/api/v1/transfers').send({ amount: 10, fromAccountId: accounts[0].id, toAccountId: accounts[1].id })

    expect(res.status).toBe(200)
  })

  it('retrieves a transfer', async () => {
    const res1 = await request.post('/api/v1/transfers').send({ amount: 10, fromAccountId: accounts[0].id, toAccountId: accounts[1].id })

    expect(res1.status).toBe(200)

    const res2 = await request.get('/api/v1/transfers')

    expect(res2.status).toBe(200)
    expect(res2.body.filter(({ id }) => res1.body[0].id === id).length > 0).toBe(true)
  })
})

