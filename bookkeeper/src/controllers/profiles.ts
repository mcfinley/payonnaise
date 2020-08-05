import _ from 'lodash'

import { HttpError, Paginate, Sort, Filter } from '../libs/utils'
import Profiles from '../models/profiles'

export default {
  /**
   * Create a profile
   */
  post: async (req, res) => {
    res.json(await Profiles.create())
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

    res.json(await Profiles.list({ paginate, sort, filter, count }))
  },

  /**
   * Get on specific profile entry
   */
  get: async (req, res) => {
    const profileId = Number(req.params.profileId)

    if (!_.isFinite(profileId)) {
      throw new HttpError(400, 'Invalid ID')
    }

    res.json(await Profiles.get(profileId))
  },

  /**
   * Delete a profile entry
   */
  delete: async (req, res) => {
    const profileId = Number(req.params.profileId)

    if (!_.isFinite(profileId)) {
      throw new HttpError(400, 'Invalid ID')
    }

    if (0 === await Profiles.delete(profileId)) {
      throw new HttpError(404, 'Profile not found')
    }

    res.sendStatus(200)
  },
}