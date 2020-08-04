import db from '../libs/database'
import { Paginate, Sort, Filter } from '../libs/utils'

export type Account = {
  id: number
  profileId: number
  asset: string
  createdAt: Date
}

export default {
  /**
   * Create an account
   */
  create: async ({ asset, profileId }: { asset: string, profileId: number }) => {
    return await db('accounts').insert({ asset, profileId }).returning('*')
  },

  /**
   * List all accounts with sorting/pagination and filtering
   */
  list: async ({ paginate, sort, filter, count }: { paginate?: Paginate, sort?: Sort, filter?: Filter, count: boolean }) => {
    let query = (count ? db.count('id') : db.select('*'))
      .from('accounts').where({ deleted: false })

    if (count) {
      if (sort || paginate) {
        throw new Error('Sort/paginate and count should not go together')
      }
    }

    if (filter) {
      if (filter.asset) {
        query = query.andWhere({ asset: filter.asset })
      }

      if (filter.profileId) {
        query = query.andWhere({ profileId: filter.profileId })
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
   * Get a specific account
   */
  get: async (query: { id: number, profileId?: number }) => {
    return await db.select('*').from('accounts').where({ ...query, deleted: false })
  },

  /**
   * Get balance for a specific account
   */
  getBalance: async ({ id }: { id: number }) => {
    const fromTransfers = await db.select(['amount']).from('transfers').where({ fromAccountId: id })
    const toTransfers = await db.select(['amount']).from('transfers').where({ toAccountId: id })

    const amountSentFrom = fromTransfers.reduce((acc, { amount }) => acc + amount, 0)
    const amountSentTo = toTransfers.reduce((acc, { amount }) => acc + amount, 0)

    return amountSentTo - amountSentFrom
  },

  /**
   * Update a specific account
   */
  update: async (query: { id: number, profileId?: number }, body: Partial<Omit<Account, 'id' | 'createdAt'>>) => {
    /* We actually should not be able to update that. */
  },

  /**
   * Delete a specific account
   */
  delete: async (query: { id: number, profileId?: number }) => {
    /* TODO remove transfers ? */
    return await db('accounts').where(query).update({ deleted: true })
  },
}