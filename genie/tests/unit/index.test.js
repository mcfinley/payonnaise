// const app = require('../dist')
// const db = require('../dist/libs/database')
//
// const supertest = require('supertest')
// const request = supertest(app)

it('Testing to see if Jest works', () => {
  expect(1).toBe(1)
})
//
// it('Test to check health of db', async () => {
//   const res = await request.get('/health')
//
//   if (res.status !== 200) {
//     console.log('Healthcehck did not return 200. Maybe DB is down?')
//   }
//
//   expect(res.status).toBe(200)
// })
//
// it('Test to check if we are using prod db', async () => {
//   const users = await db.default.query(`SELECT * FROM users LIMIT 100`)
//
//   if (users.length > 0) {
//     console.log(`There are ${users.length} users in this database. Are we using the prod db?`)
//   }
//
//   expect(1).toBe(1)
// })
