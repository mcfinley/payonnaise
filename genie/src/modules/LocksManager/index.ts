import storage from '../../libs/storage'

/**
 * Typings for this module
 */
type LockType = 'exclusive' | 'shared'

/**
 * Locks manager module. Used to check and acquire locks. Is not designed
 * to work in horizontally scalable manner.
 */
export default class LocksManager {
  /**
   * Checks the resource for being locked
   */
  check = async (resource: string, type: LockType) => {
    const data = await storage.get(`locks-${resource}`)

    if (data === 'exclusive') {
      return false
    }

    if (type === 'exclusive') {
      return data === null
    }

    return true
  }

  /**
   * Acquire lock (if it's not acquired already)
   */
  acquire = async (resource: string, type: LockType) => {
    await storage.set(`locks-${resource}`, type)
  }
}
