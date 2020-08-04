// import { Pool } fro/m 'pg'
import knex from 'knex'
import logger from './logger'

// const pool = new Pool({
//   user: process.env.ACCOUNTS_LEDGER_USER,
//   host: process.env.ACCOUNTS_LEDGER_HOST,
//   database: process.env.ACCOUNTS_LEDGER_DB,
//   password: process.env.ACCOUNTS_LEDGER_PASSWORD,
//   port: Number(process.env.ACCOUNTS_LEDGER_PORT),
// })

// export const escape = sqlstring.escape

// pool.on('error', (err, client) => {
//   logger.error('Unexpected error on idle client', err)
// })

// knex.prototype.paginate = function ({ page, pageSize }: { page: number, pageSize: number }) {
//   return this.limit(pageSize).offset(page * pageSize)
// }

export default knex({
  client: 'pg',
  connection: {
    user: process.env.ACCOUNTS_LEDGER_USER,
    host: process.env.ACCOUNTS_LEDGER_HOST,
    database: process.env.ACCOUNTS_LEDGER_DB,
    password: process.env.ACCOUNTS_LEDGER_PASSWORD,
    port: Number(process.env.ACCOUNTS_LEDGER_PORT),
  },
  pool: { min: 0, max: 7 },
  debug: true,
  log: {
    warn: (message) => logger.info({}, message),
    error: (message) => logger.error({}, message),
    deprecate: (message) => logger.info({}, message),
    debug: (message) => logger.info({}, message),
  }
})