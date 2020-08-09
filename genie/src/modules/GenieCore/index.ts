// import { v4 as uuid } from 'uuid'
// import { EventEmitter } from '../../libs/events'
//
// import LocksManager, { LockType } from '../LocksManager'
// import RequestsQueue, { LockRequest } from '../RequestsQueue'
//
// /**
//  * No horizontally scalable: we have to acquire locks in one atomic call in order horizontally scale
//  */
// export default class GenieCore {
//   private dispatchSubject = new EventEmitter<void>()
//   private activeRequests = new Map<string, LockRequest>()
//
//   constructor (private locksManager: LocksManager, private requestsQueue: RequestsQueue) {
//     this.dispatchSubject.subscribe(this.dispatch)
//     this.dispatchSubject.emitAsync()
//   }
//
//   /**
//    * The main method of the queue
//    */
//   dispatch = async () => {
//     /* Find a request that is executable */
//     const executableRequest = await this.requestsQueue.find(async (request) => {
//       /* Check the request for being executable */
//       const resourcesAcquirable = await Promise.all(request.resources.map(async (resource) => {
//         /* Resource is something like shared:accounts/13 */
//         const [type, name] = resource.split(':')
//
//         /* TODO check type and name */
//         /* Return true if all the resources are available to get locked */
//         return await this.locksManager.check(name, type as LockType)
//       }))
//
//       return resourcesAcquirable.reduce((result, acquirable) => result && acquirable, true)
//     })
//
//     if (executableRequest !== null) {
//       await Promise.all(executableRequest.resources.map(async (resource) => {
//         const [type, name] = resource.split(':')
//
//         await this.locksManager.acquire(name, type as LockType)
//       }))
//
//       this.activeRequests.set(executableRequest.id, executableRequest)
//     }
//
//     this.dispatchSubject.emitAsync()
//   }
//
//   /**
//    * Interface methods
//    */
//
//   acquire = async (request: Omit<LockRequest, 'id'>) => {
//     const id = uuid()
//
//     await this.requestsQueue.push({ ...request, id })
//   }
//
//   release = async (id: string) => {
//     const request = this.activeRequests.get(id)
//
//     if (request) {
//       await Promise.all(request.resources.map(async (resource) => {
//         const [type, name] = resource.split(':')
//
//         await this.locksManager.release(name, type)
//       }))
//     }
//   }
//
//
//   // handleNewConnection = (socket) => {
//   //   const id = uuid()
//   //
//   //   this.clients.set(id, socket)
//   //   socket.on('data', (chunk) => this.handleSocketMessage(id, chunk))
//   //   socket.on('end', () => this.clients.delete(id))
//   // }
//   //
//   // handleSocketMessage = (id: string, data: string) => {
//   //   this.onMessage.emitParallelAsync({ id, data })
//   // }
//   //
//   // sendMessage = (id: string, data: string) => {
//   //   const socket = this.clients.get(id)
//   //
//   //   if (!socket) {
//   //     throw new Error(`Socket with ${id} is not connected`)
//   //   }
//   //
//   //   socket.write(data)
//   // }
// }
//
