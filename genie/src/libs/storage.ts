import redis from 'redis'
import logger from './logger'

const client = redis.createClient({
  host: process.env.GENIE_REDIS_HOST,
  port: process.env.GENIE_REDIS_PORT,
})

client.on('error', (error) => {
  logger.error(error)
})


export default {
  /**
   * Basic get and set operations
   */
  get: <E = Error>(key: string) => new Promise<string>((resolve, reject) =>
    client.get(key, (error: E, data: string) => error ? reject(error) : resolve(data))
  ),

  set: <E = Error>(key: string, data: string) => new Promise<void>((resolve, reject) =>
    client.set(key, data, (error: E) => error ? reject(error) : resolve())
  ),

  /**
   * Queue operations
   */
  lpush: <E = Error>(name: string, data: string) => new Promise<void>((resolve, reject) =>
    client.lpush(name, data, (error: E) => error ? reject(error) : resolve())
  ),
  rpush: <E = Error>(name: string, data: string) => new Promise<void>((resolve, reject) =>
    client.rpush(name, data, (error: E) => error ? reject(error) : resolve())
  ),
  lpop: <E = Error>(name: string) => new Promise<string>((resolve, reject) =>
    client.lpop(name, (error: E, data: string) => error ? reject(error) : resolve(data))
  ),
  rpop: <E = Error>(name: string) => new Promise<string>((resolve, reject) =>
    client.rpop(name, (error: E, data: string) => error ? reject(error) : resolve(data))
  ),
}
