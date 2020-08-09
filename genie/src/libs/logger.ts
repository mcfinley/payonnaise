import pino from 'pino'

const logger = process.env.NODE_ENV === 'test'
  ? { info: console.log, error: console.error }
  : pino()

export default logger