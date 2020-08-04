import _ from 'lodash'

import { HttpError, Paginate, Sort, Filter } from '../libs/utils'
import Accounts from '../models/accounts'

export default {
  /**
   * Create an account POST method implementation
   */
  post: async (req, res) => {
    const asset = String(req.body.asset)
    const profileId = Number(req.body.profileId || req.params.profileId)

    /* Validate input */
    if (_.isEmpty(asset) || !_.isFinite(profileId)) {
      throw new HttpError(400, 'Asset or profileId invalid')
    }

    /* Check that user exists */
    /* TODO */

    res.json(await Accounts.create({ asset, profileId }))
  },

  /**
   * List all the accounts. Support `paginate`, `sort` and `filter` query params.
   * Possible filters are: { asset: 'USD' },
   */
  list: async (req, res) => {
    const paginate = req.query.paginate as Paginate
    const sort = req.query.sort as Sort
    const filter = req.query.filter || {} as Filter
    const count = !!req.query.count

    if (req.params.profileId) {
      filter.profileId = req.params.profileId
    }

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
    const accountId = Number(req.params.accountId)
    const profileId = req.params.profileId ? Number(req.params.profileId) : undefined

    res.json(await Accounts.get({ id: accountId, profileId }))
  },

  /**
   * Update specific account entry
   */
  update: async (req, res) => {
    // const patchUpdate = req.method === 'PATCH'
    // const accountId = Number(req.params.accountId)
    // const profileId = req.params.profileId ? Number(req.params.profileId) : undefined

    res.sendStatus(404)
  },

  /**
   * Delete a specific account
   */
  delete: async (req, res) => {
    const accountId = Number(req.params.accountId)
    const profileId = req.params.profileId ? Number(req.params.profileId) : undefined

    res.json(await Accounts.delete({ id: accountId, profileId }))
  },
}