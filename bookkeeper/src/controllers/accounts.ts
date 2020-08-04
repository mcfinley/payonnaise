import _ from 'lodash'

import { HttpError, Paginate, Sort, Filter } from '../libs/utils'
import Accounts from '../models/accounts'

export default {
  /**
   * Create an account POST method implementation
   */
  post: async (req, res) => {
    // req.params.userId
    const asset = String(req.body.asset)
    const ownerId = Number(req.body.ownerId)

    /* Validate input */
    if (_.isEmpty(asset) || !_.isFinite(ownerId)) {
      throw new HttpError(400, 'Asset or ownerId invalid')
    }

    /* Check that user exists */
    /* TODO */

    res.json(await Accounts.create({ asset, ownerId }))
  },
  /**
   * List all the accounts. Support `paginate`, `sort` and `filter` query params.
   * Possible filters are: { asset: 'USD' },
   */
  list: async (req, res) => {
    // req.params.userId
    const paginate = req.query.paginate as Paginate
    const sort = req.query.sort as Sort
    const filter = req.query.filter as Filter
    const count = !!req.query.count

    /* Validate the input */
    // if (!_.isObject(paginate) || !_.isObject(sort) || !_.isObject(filter)) {
    //   throw new HttpError(400, 'Paginate, Sort or Filter param invalid')
    // }

    res.json(await Accounts.list({ paginate, sort, filter, count }))
  },
  /**
   * Get on specific entry
   */
  get: async (req, res) => {
    // req.params.userId
    const accountId = Number(req.params.accountId)

    res.json('TODO')
  },
  /**
   *
   */
  update: async (req, res) => {
    // req.params.userId
    const patchUpdate = req.method === 'PATCH'
    const accountId = Number(req.params.accountId)

    res.json('TODO')
  },
  /**
   *
   */
  delete: async (req, res) => {
    // req.params.userId
    const accountId = Number(req.params.accountId)

    res.json('TODO')
  },
}