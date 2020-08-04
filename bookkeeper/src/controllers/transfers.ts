import _ from 'lodash'

import { HttpError, Paginate, Sort, Filter } from '../libs/utils'
import Transfers from '../models/transfers'

export default {
  /**
   * Create a transfer POST method implementation
   */
  post: async (req, res) => {
    const amount = Number(req.body.amount)
    const fromAccountId = Number(req.body.fromAccountId)
    const toAccountId = Number(req.body.toAccountId)

    /* Validate input */
    if (!_.isEmpty(amount) || !_.isFinite(fromAccountId) || !_.isFinite(toAccountId)) {
      throw new HttpError(400, 'amount, fromAccountId or toAccountId invalid')
    }

    /* Check that user exists */
    /* TODO */

    res.json(await Transfers.create({ amount, fromAccountId, toAccountId }))
  },

  /**
   * List all the transfers. Support `paginate`, `sort` and `filter` query params.
   * Possible filters are: { asset: 'USD' },
   */
  list: async (req, res) => {
    const paginate = req.query.paginate as Paginate
    const sort = req.query.sort as Sort
    const filter = req.query.filter || {} as Filter
    const count = !!req.query.count

    if (req.params.accountId) {
      filter.accountId = req.params.accountId
    }

    /* Validate the input */
    // if (!_.isObject(paginate) || !_.isObject(sort) || !_.isObject(filter)) {
    //   throw new HttpError(400, 'Paginate, Sort or Filter param invalid')
    // }

    res.json(await Transfers.list({ paginate, sort, filter, count }))
  },
  //
  // /**
  //  * Get on specific entry
  //  */
  // get: async (req, res) => {
  //   const accountId = Number(req.params.accountId)
  //   const profileId = req.params.profileId ? Number(req.params.profileId) : undefined
  //
  //   res.json(await Accounts.get({ id: accountId, profileId }))
  // },
  //
  // /**
  //  * Update specific account entry
  //  */
  // update: async (req, res) => {
  //   // const patchUpdate = req.method === 'PATCH'
  //   // const accountId = Number(req.params.accountId)
  //   // const profileId = req.params.profileId ? Number(req.params.profileId) : undefined
  //
  //   res.sendStatus(404)
  // },
  //
  // /**
  //  * Delete a specific account
  //  */
  // delete: async (req, res) => {
  //   const accountId = Number(req.params.accountId)
  //   const profileId = req.params.profileId ? Number(req.params.profileId) : undefined
  //
  //   res.json(await Accounts.delete({ id: accountId, profileId }))
  // },
}