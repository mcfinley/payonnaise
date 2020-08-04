import express from 'express'
import _ from 'lodash'

import { routeHandler } from '../libs/utils'
import accounts from '../services/accounts'

const router = express.Router()

/**
 * Browse all accounts
 */
router.get('/', routeHandler(async (req, res) => {
  const { paginate, filter, sort } = req.query

  res.json(await accounts.all(req.query.paginate, req.query.filter, req.query.sort, !!req.query.count))
}))

export default router