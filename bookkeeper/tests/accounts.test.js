const app = require('../dist')
const db = require('../dist/libs/database')

const supertest = require('supertest')
const request = supertest(app)

describe('Accounts Tests', () => {
  let profiles = []
  let accounts = []
  let removedAccounts = []
  beforeAll(async () => {
    await Promise.all(new Array(10).fill(0).map(async (_, index) => {
      profiles[index] = (await db.default('profiles').insert({}).returning('*'))[0]
    }))
    await Promise.all(new Array(20).fill(0).map(async (_, index) => {
      accounts[index] = (await db.default('accounts').insert({ asset: `test-asset/${Math.random().toString()}`, profileId: profiles[Math.floor(index / 2)].id }).returning('*'))[0]
    }))
    await Promise.all(new Array(5).fill(0).map(async (_, index) => {
      removedAccounts[index] = (await db.default('accounts').insert({ asset: `test-asset/${Math.random().toString()}`, profileId: profiles[Math.floor(index / 2)].id, deleted: true }).returning('*'))[0]
    }))
  })

  afterAll(async () => {
    await Promise.all(profiles.map(async ({ id }) => {
      await db.default.delete().from('accounts').where({ profileId: id})
      await db.default.delete().from('profiles').where({ id })
    }))
  })

  describe('Create Account Tests', () => {
    it('has created test stub profiles successfully', async () => {
      expect(profiles.length > 0).toBe(true)
      expect(typeof profiles[0].id).toBe('number')
    })

    it('creates the account correctly', async () => {
      const res1 = await request.post('/api/v1/accounts').send({ asset: 'test/USD', profileId: profiles[0].id })

      expect(res1.status).toBe(200)
      expect(res1.body[0].profileId).toBe(profiles[0].id)
    })

    it('does not create an account when asset or profileid are not provided', async () => {
      const res1 = await request.post('/api/v1/accounts').send({ profileId: profiles[0].id })
      const res2 = await request.post('/api/v1/accounts').send({ asset: 'test/USD' })

      expect(res1.status).toBe(400)
      expect(res2.status).toBe(400)
    })

    it('does not create an account for non existing profile', async () => {
      const res1 = await request.post('/api/v1/accounts').send({ asset: 'test/USD', profileId: profiles[0].id * 100 })

      expect(res1.status).toBe(400)
    })

    it('does create an account by profile url', async () => {
      const res1 = await request.post(`/api/v1/profiles/${profiles[0].id}/accounts`).send({ asset: 'test/USD' })

      expect(res1.status).toBe(200)
      expect(res1.body[0].profileId).toBe(profiles[0].id)
    })
  })

  describe('List Accounts Tests', () => {
    it('lists accounts', async () => {
      const res1 = await request.get('/api/v1/accounts')

      expect(res1.status).toBe(200)
      expect(res1.body.length >= 20).toBe(true)
    })

    it('lists accounts by profile', async () => {
      const res1 = await request.get(`/api/v1/profiles/${profiles[0].id}/accounts`)

      expect(res1.status).toBe(200)
      expect(res1.body.length >= 2).toBe(true)
      expect(res1.body.filter(({ id }) => id === accounts[0].id).length > 0).toBe(true)
      expect(res1.body.filter(({ id }) => id === accounts[1].id).length > 0).toBe(true)
      expect(res1.body.filter(({ id }) => id === accounts[2].id).length === 0).toBe(true)
    })

    it('lists accounts by profile query', async () => {
      const res1 = await request.get(`/api/v1/accounts?filter[profileId]=${profiles[0].id}`)

      expect(res1.status).toBe(200)
      expect(res1.body.length >= 2).toBe(true)
      expect(res1.body.filter(({ id }) => id === accounts[0].id).length > 0).toBe(true)
      expect(res1.body.filter(({ id }) => id === accounts[1].id).length > 0).toBe(true)
      expect(res1.body.filter(({ id }) => id === accounts[2].id).length === 0).toBe(true)
    })

    it('lists accounts by asset', async () => {
      const res1 = await request.get(`/api/v1/accounts?filter[asset]=nope`)

      expect(res1.status).toBe(200)
      expect(res1.body.length === 0).toBe(true)
    })

    it('paginates accounts', async () => {
      const res1 = await request.get(`/api/v1/accounts?paginate[page]=0&paginate[pageSize]=10`)

      expect(res1.status).toBe(200)
      expect(res1.body.length === 10).toBe(true)
    })

    it('paginates accounts and filters', async () => {
      const res1 = await request.get(`/api/v1/accounts?paginate[page]=0&paginate[pageSize]=1&filter[profileId]=${profiles[0].id}`)

      expect(res1.status).toBe(200)
      expect(res1.body.length === 1).toBe(true)
    })

    it('does not work with invalid pagination', async () => {
      const res1 = await request.get(`/api/v1/accounts?paginate[pageSize]=10`)

      expect(res1.status).toBe(400)
    })

    it('sorts accounts', async () => {
      const res1 = await request.get(`/api/v1/accounts?sort[column]=id&sort[direction]=desc`)

      expect(res1.status).toBe(200)

      res1.body.forEach((item, index) => {
        if (index > 0) {
          expect(res1.body[index - 1].id > item.id).toBe(true)
        }
      })
    })

    it('sorts accounts', async () => {
      const res1 = await request.get(`/api/v1/accounts?sort[column]=id&sort[direction]=asc`)

      expect(res1.status).toBe(200)

      res1.body.forEach((item, index) => {
        if (index > 0) {
          expect(res1.body[index - 1].id < item.id).toBe(true)
        }
      })
    })
  })

  describe('Get Account Tests', () => {
    it('retrieves an account', async () => {
      const res1 = await request.get(`/api/v1/accounts/${accounts[0].id}`)

      expect(res1.status).toBe(200)
      expect(res1.body.id).toBe(accounts[0].id)
    })

    it('does not retrieve non existing account', async () => {
      const res1 = await request.get(`/api/v1/accounts/${accounts[0].id + 3000}`)

      expect(res1.status).toBe(404)
    })

    it('does retrieve an account by correct profile id link', async () => {
      const res1 = await request.get(`/api/v1/profiles/${accounts[0].profileId}/accounts/${accounts[0].id}`)

      expect(res1.status).toBe(200)
      expect(res1.body.id).toBe(accounts[0].id)
    })

    it('does not retrieve an account by incorrect profile id link', async () => {
      const res1 = await request.get(`/api/v1/profiles/${accounts[0].profileId + 1}/accounts/${accounts[0].id}`)

      expect(res1.status).toBe(404)
    })
  })

  describe('Delete Account Test', () => {
    it('removes the account', async () => {
      const res1 = await request.delete(`/api/v1/accounts/${accounts[0].id}`)

      expect(res1.status).toBe(200)
    })

    it('does not remove non existing the account', async () => {
      const res1 = await request.delete(`/api/v1/accounts/${accounts[1].id + 3000}`)

      expect(res1.status).toBe(404)
    })

    it('removes the account by profile link', async () => {
      const res1 = await request.delete(`/api/v1/profiles/${profiles[1].id}/accounts/${accounts[2].id}`)

      expect(res1.status).toBe(200)
    })

    it('does not remove the account by incorrect profile link', async () => {
      const res1 = await request.delete(`/api/v1/profiles/${profiles[5].id}/accounts/${accounts[3].id}`)

      expect(res1.status).toBe(404)
    })

    it('does not retrieve removed account', async () => {
      const res1 = await request.get(`/api/v1/accounts/${removedAccounts[0].id}`)

      expect(res1.status).toBe(404)
    })

    it('does not list removed account', async () => {
      const res1 = await request.get(`/api/v1/accounts`)

      expect(res1.status).toBe(200)
      expect(res1.body.filter(({ id }) => id === removedAccounts[0].id).length).toBe(0)
    })
  })
})

