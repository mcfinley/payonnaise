import db from '../libs/database'
import { Paginate, Sort, Filter } from '../libs/utils'

export type Transfer = {
  id: number
  amount: number
  fromAccountId: number
  toAccountId: number
  createdAt: Date
}

export default {
  /**
   * Create a transfer
   */
  create: async (body: { amount: number, fromAccountId: number, toAccountId: number}) => {
    return await db('transfers').insert(body).returning('*')
  },

  /**
   * List all transfers with sorting/pagination
   */
  list: async ({ paginate, sort, filter, count }: { paginate?: Paginate, sort?: Sort, filter?: Filter, count: boolean }) => {
    let query = (count ? db.count('id') : db.select('*'))
      .from('transfers').where(db.raw('TRUE'))

    if (count) {
      if (sort || paginate) {
        throw new Error('Sort/paginate cannot be used with count')
      }
    }

    if (filter) {
      if (filter.accountId) {
        query = query.andWhere(() => (
          db.where({ fromAccountId: filter.accountId }).orWhere({ toAccountId: filter.accountId })
        ))
      }
    }

    if (sort) {
      query = query.orderBy(sort.column, sort.direction)
    }

    if (paginate) {
      query = query.offset(paginate.page * paginate.pageSize).limit(paginate.pageSize)
    }

    return await query
  },

  /**
   * Get a specific profile
   */
  // get: async (id: number) => {
  //   return await db.select('*').from('profiles').where({ id })
  // },

  /**
   * Update a specific profile
   */
  // update: async (id: number) => {
  //   /* There is actually nothing to update so just resovle */
  // },

  /**
   * Delete a specific profile + delete all the accounts for it
   */
  // delete: async (id: number) => {
  //   await db.transaction(async (t) => {
  //     await db.delete().from('accounts').where({ profileId: id })
  //     await db.delete().from('profiles').where({ id })
  //   })
  // },
}