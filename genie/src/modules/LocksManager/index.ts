import _ from 'lodash'
import { v4 as uuid } from 'uuid'

import logger from '../../libs/logger'
import storage from '../../libs/storage'
import { parse, stringify } from '../../libs/utils'

/**
 * Typings for this module
 */
export type LockType = 'exclusive' | 'shared'
export type Lock = { id: string, name: string, type: LockType }
export type LockConfig = { id: string, type: LockType }

/**
 * Locks manager module. Used to check and acquire locks.
 */
export default class LocksManager {
  private get = async (name: string) =>
    await parse(await storage.get(`locks-${name}`) ?? '[]') as LockConfig[]

  private set = async (name: string, config: LockConfig[]) =>
    await storage.set(`locks-${name}`, await stringify(config))

  private activeLocks = new Map<string, string>()

  /**
   * Checks whether the lock is executable. Can throw
   */
  check = async (lock: Omit<Lock, 'id'>) => {
    const config = await this.get(lock.name)

    logger.info({ lock, config }, 'checking lock')

    if (config.length > 0 && config[0].type === 'exclusive') {
      return false
    }

    if (lock.type === 'exclusive') {
      return config.length === 0
    }

    return true
  }

  /**
   * Acquire lock (can throw)
   */
  acquire = async (lock: Omit<Lock, 'id'>) => {
    if (!await this.check(lock)) {
      throw new Error('This lock cannot be acquired now.')
    }

    logger.info({ lock }, 'acquiring lock')

    const config = await this.get(lock.name)
    const id = uuid()

    await this.set(lock.name, config.concat({ id, type: lock.type }))
    this.activeLocks.set(id, lock.name)

    return id
  }

  /**
   * Release lock (can throw)
   */
  release = async (id: string) => {
    const lockName = this.activeLocks.get(id)

    if (!lockName) {
      throw new Error(`Lock ${id} is not acquired.`)
    }

    const config = await this.get(lockName)
    const lockConfig = _.find(config, (item) => item.id === id)

    logger.info({ id, lockConfig }, 'releasing lock')

    if (lockConfig === null) {
      throw new Error(`Lock ${id} is not acquired.`)
    }

    await this.set(lockName, config.filter((item) => item.id !== id))
    this.activeLocks.delete(id)
  }
}
