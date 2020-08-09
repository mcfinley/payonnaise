import storage from '../../libs/storage'

/**
 * Lock Request type
 */
export type LockRequest = {
  id: string
  transactionName?: string
  resources: string[]
  queueTimeout?: number
  transactionTimeout?: number
  priority?: number
}

/**
 * Requests Queue Module. Provides an access to requests queue, being kept in redis
 * supports "search" for a specific request with removal
 */
export default class RequestsQueue {
  private QUEUE_NAME = `requests-queueue`

  /* Add an item to the end of the queue */
  push = async (request: LockRequest) => {
    await storage.rpush(this.QUEUE_NAME, JSON.stringify(request))
  }

  /* Add an item to the top of the queue */
  unshift = async (request: LockRequest) => {
    await storage.lpush(this.QUEUE_NAME, JSON.stringify(request))
  }

  /* Take the first item from queue */
  shift = async (): Promise<LockRequest | null> => {
    return JSON.parse(await storage.lpop(this.QUEUE_NAME) || 'null')
  }

  /**
   * An iterator for reqeusts to find that one first that is executable
   */
  find = async (predicate: (item: LockRequest) => Promise<boolean>) => {
    let item: LockRequest | null = null
    let predicateSucceeded: boolean = false
    let poppedItems: LockRequest[] = []

    while (!predicateSucceeded) {
      item = await this.shift()

      if (item === null) {
        break
      }

      predicateSucceeded = await predicate(item)

      if (!predicateSucceeded) {
        poppedItems.push(item)
      }
    }

    /* Insert popped items back */
    poppedItems.reverse().forEach(($item) => {
      this.unshift($item)
    })

    return item
  }
}

