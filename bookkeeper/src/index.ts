import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import db from './libs/database'
import logger from './libs/logger'
import { routeHandler } from './libs/utils'

// import accounts from './routes/accounts'
// import users from './routes/users'\
import api from './routes'

const app = express()

app.use(bodyParser.json())

/**
 * Log every request
 */
app.use((req, res, next) => {
  logger.info({ headers: req.headers, url: req.url, body: req.body, query: req.query }, 'Incoming request')
  next()
})

/**
 * Just disable CORS for everything (no whitelist for now).
 * As soon as we deploy to prod and know domain this can be
 * updated.
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'authorization, origin, content-type, accept')

  next()
})

app.get('/health', routeHandler((req, res) => {
  db.raw(`SELECT 1+1 as test`).then((data) => {
    res.sendStatus(200)
  }).catch((err) => {
    res.sendStatus(500)
  })
}))

/**
 * Main API route handler attach
 */
app.use('/api/v1', api)

/**
 * Simple error middleware
 */
app.use((err, req, res, next) => {
  if (!!err.statusCode) {
    logger.error({ err }, 'Error')
    res.status(err.statusCode).json(err.body || null)
  } else {
    logger.error({ err }, 'Error')
    res.status(500).send(err.toString())
  }
})

/**
 * Don't run the server in tet env
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.BOOKKEEPER_PORT, () => {
    console.log(`Listening at ${process.env.BOOKKEEPER_PORT}`)
  })
}

export = app