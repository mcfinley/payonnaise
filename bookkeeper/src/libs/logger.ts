import pino from 'pino'
import _ from 'lodash'

const logger = process.env.NODE_ENV === 'test'
  ? { info : _.noop, error: _.noop }
  : pino()

export default logger