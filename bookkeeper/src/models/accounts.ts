import db from '../libs/database'
import { Paginate, Sort, Filter } from '../libs/utils'

export type Account = {
  id: number
  ownerId: number
  asset: string
  createdAt: Date
}

export default {
  /**
   * Create an account
   */
  create: async ({ asset, ownerId }: { asset: string, ownerId: number }) => {
    return await db('accounts').insert({ asset, ownerId }).returning('*')
  },
  /**
   * List all accounts with sorting/pagination and filtering
   */
  list: async ({ paginate, sort, filter, count }: { paginate?: Paginate, sort?: Sort, filter?: Filter, count: boolean }) => {
    let query = (count ? db.count('id') : db.select('*'))
      .from('accounts').where(db.raw('TRUE'))

    /**
     * Filter accounts (only by asset for now)
     */
    if (filter) {
      if (filter.asset) {
        query = query.andWhere({ asset: filter.asset })
      }
    }

    /**
     * Sort accounts
     */
    if (sort) {
      if (count) {
        throw new Error('count and sort should not go together')
      }

      query = query.orderBy(sort.column, sort.direction)
    }

    /**
     * Paginate accounts
     */
    if (paginate) {
      if (count) {
        throw new Error('count and paginate should not go together')
      }

      query = query.offset(paginate.page * paginate.pageSize).limit(paginate.pageSize)
    }

    return await query
  },
}