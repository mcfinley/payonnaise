import _ from 'lodash'

import { HttpError, Paginate, Sort, Filter } from '../libs/utils'
import Profiles from '../models/profiles'
import Accounts from '../models/accounts'

export default {
  /**
   * Create an account POST method implementation
   */
  post: async (req, res) => {
    const asset = !!req.body.asset ? String(req.body.asset) : null
    const profileId = Number(req.body.profileId || req.params.profileId)

    /* Validate input */
    if (asset === null || !_.isFinite(profileId)) {
      throw new HttpError(400, 'Asset or profileId invalid')
    }

    /* Check profile for existance */
    const profile = await Profiles.get(profileId)

    if (!profile) {
        throw new HttpError(400, 'Profile does not exist')
    }

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

    if (paginate) {
      if (!_.isObject(paginate) || !_.isFinite(Number(paginate.page)) || !_.isFinite(Number(paginate.pageSize))) {
        throw new HttpError(400, 'Invalid pagination')
      }
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
    const account = await Accounts.get(_.defined({ id: accountId, profileId: profileId }))

    if (!account) {
      throw new HttpError(404, 'Account not found')
    }

    res.json(account)
  },

  /**
   * Get a specific account's balance
   */
  getBalance: async (req, res) => {
    const accountId = Number(req.params.accountId)

    res.json(await Accounts.getBalance({ id: accountId }))
  },

  /**
   * Delete a specific account
   */
  delete: async (req, res) => {
    const accountId = Number(req.params.accountId)
    const profileId = req.params.profileId ? Number(req.params.profileId) : undefined

    if (!_.isFinite(accountId)) {
      throw new HttpError(400, 'Invalid ID')
    }

    if (!_.isUndefined(profileId) && !_.isFinite(profileId)) {
      throw new HttpError(400, 'Invalid profile ID')
    }

    if (0 === await Accounts.delete(_.defined({ id: accountId, profileId }))) {
      throw new HttpError(404, 'Account not found')
    }

    res.sendStatus(200)
  },
}