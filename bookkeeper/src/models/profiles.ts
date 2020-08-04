import db from '../libs/database'
import { Paginate, Sort, Filter } from '../libs/utils'

export type Profile = {
  id: number
  createdAt: Date
}

export default {
  /**
   * Create a profile
   */
  create: async () => {
    return await db('profiles').insert({}).returning('*')
  },

  /**
   * List all profiles with sorting/pagination
   */
  list: async ({ paginate, sort, filter, count }: { paginate?: Paginate, sort?: Sort, filter?: Filter, count: boolean }) => {
    let query = (count ? db.count('id') : db.select('*'))
      .from('profiles').where(db.raw('TRUE'))

    if (count) {
      if (sort || paginate) {
        throw new Error('Sort/paginate cannot be used with count')
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
  get: async (id: number) => {
    return await db.select('*').from('profiles').where({ id })
  },

  /**
   * Update a specific profile
   */
  update: async (id: number) => {
    /* There is actually nothing to update so just resovle */
  },

  /**
   * Delete a specific profile + delete all the accounts for it
   */
  delete: async (id: number) => {
    await db.transaction(async (t) => {
      await db.delete().from('accounts').where({ profileId: id })
      await db.delete().from('profiles').where({ id })
    })
  },
}