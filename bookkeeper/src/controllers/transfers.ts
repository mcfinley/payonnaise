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

    res.json(await Transfers.list({ paginate, sort, filter, count }))
  },
}