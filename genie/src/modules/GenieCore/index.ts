import { v4 as uuid } from 'uuid'
import { EventEmitter } from '../../libs/events'
import logger from '../../libs/logger'

import LocksManager, { LockType } from '../LocksManager'
import RequestsQueue, { LockRequest } from '../RequestsQueue'

/**
 * Genie Core
 */
export default class GenieCore {
  private dispatchSubject = new EventEmitter<void>()
  private acquiredLocks = new Map<string, string[]>()

  public onAcquired = new EventEmitter<string>()
  public onReleased = new EventEmitter<string>()

  constructor (private locksManager: LocksManager, private requestsQueue: RequestsQueue) {
    this.dispatchSubject.subscribe(this.dispatch)
    this.dispatchSubject.emitAsync()
  }

  /**
   * Process the queue
   */
  dispatch = async () => {
    try {
      const acquirableRequest = await this.requestsQueue.find(async (request) => (
        (
          await Promise.all(request.locks.map(async (lock) => (
            await this.locksManager.check(lock)
          )))
        ).reduce((result, acquirable) => result && acquirable, true)
      ))

      if (acquirableRequest !== null) {
        logger.info('Acquiring a request', acquirableRequest)
        const acquiredLocks = await Promise.all(acquirableRequest.locks.map(async (lock) => {
          return await this.locksManager.acquire(lock)
        }))

        this.acquiredLocks.set(acquirableRequest.id, acquiredLocks)
        this.onAcquired.emitSync(acquirableRequest.id)
      }
    } catch (e) {
      logger.error('There was an error while Genie Core was dispatching queue requests', { e })
    }

    setTimeout(() => {
      this.dispatchSubject.emitAsync()
    }, 3000)

  }

  /**
   * Add an item to the queue
   */
  enqeue = async (request: Omit<LockRequest, 'id'>) => {
    const id = uuid()

    await this.requestsQueue.push({ ...request, id })

    return id
  }

  /**
   * Remove the item from the queue
   */
  deqeue = async (id: string) => {
    /* This is unefficient but fine for now */
    await this.requestsQueue.find(async (request) => request.id === id)
  }

  /**
   * Release the request's required locks
   */
  release = async (id: string) => {
    const acquiredLocks = this.acquiredLocks.get(id)

    if (!acquiredLocks) {
      throw new Error(`Request with id ${id} is not active`)
    }

    logger.info('Releasing a request', id, acquiredLocks)

    await Promise.all(acquiredLocks.map(async (id) =>
      await this.locksManager.release(id)
    ))

    this.acquiredLocks.delete(id)
    this.onReleased.emitSync(id)
  }
}
