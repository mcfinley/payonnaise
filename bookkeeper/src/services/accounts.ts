import db from '../libs/database'

export default {
  all: async (paginate, filter, sort, count: boolean) => {
    console.log(paginate)
    let query = db.select(count ? ['id'] : '*').from('accounts').where(db.raw('TRUE'))

    if (filter) {
      if (filter.asset) {
        query = query.andWhere({ asset: filter.asset })
      }
    }

    if (sort) {
      if (count) {
        throw new Error('count and sort should not go together')
      }

      query = query.orderBy(sort.column, sort.order)
    }

    if (paginate) {
      if (count) {
        throw new Error('count and paginate should not go together')
      }

      query = query.offset(paginate.page * paginate.pageSize).limit(paginate.pageSize)
    // (  query as any).paginate(paginate)
    }

    if (count) {
      return await query.then((entries) => entries.length)
    } else {
      return await query
    }
  },
}