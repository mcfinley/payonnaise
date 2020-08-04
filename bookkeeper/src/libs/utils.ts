import _ from 'lodash'

/**
 * An error that when thrown is being parsed
 * correctly by express error middleware
 *
 * Use like `throw new HttpError(404, 'Not Found')`
 */
export class HttpError extends Error {
  statusCode: number
  body: any
  constructor (statusCode, body?, ...args) {
    super(...args)

    this.statusCode = statusCode
    this.body = body
  }
}

/**
 * A wrapper for express route handle that allows
 * to directly throw errors. These errors will be
 * finely processed by middleware (see index.ts).
 */
export const routeHandler = (f) => (req, res, next) => {
  try {
    Promise.resolve(f(req, res)).catch((err) => next(err))
  } catch (e) {
    next(e)
  }
}

/**
 * Paginate/Filter/Sort types
 */
export type Paginate = { page: number, pageSize: number }
export type Sort = { column: string, direction: 'asc' | 'desc' }
export type Filter = { [k: string]: any }

/**
 * Add a `defined` helper to lodash
 */
_.mixin({
  defined: (object) => _.omitBy(object, _.isUndefined),
})

// declare global {
//   interface LoDashStatic {
//     defined: any
//   }
// }

declare module "lodash" {
  interface LoDashStatic {
    defined: any
  }
    // interface LoDashExplicitWrapper<TValue> {
    //     swap(index1: number, index2: number): LoDashExplicitWrapper<TValue>;
    // }
}