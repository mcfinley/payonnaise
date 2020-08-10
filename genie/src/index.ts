import dotenv from 'dotenv'

dotenv.config()

import LocksManager from './modules/LocksManager'
import RequestsQueue from './modules/RequestsQueue'
import TcpServer from './modules/TcpServer'

import GenieCore from './modules/GenieCore'

const locksManager = new LocksManager()
const requestsQueue = new RequestsQueue()
const core = new GenieCore(locksManager, requestsQueue)

const server = new TcpServer()


// ;(async () => {
//   core.onAcquired.subscribe((id) => {
//     console.log('acquired:', id)
//     setTimeout(() => {
//       core.release(id)
//     }, 2000)
//   })
//
//   core.onReleased.subscribe((id) => {
//     console.log('released:', id)
//   })
//
//   console.log('Queued exclusive:test2', await core.enqeue({ locks: [{ type: 'shared', name: 't2' }, { type: 'exclusive', name: 't3' }] }))
//   console.log('Queued exclusive:test2, exclusive:test3', await core.enqeue({ locks: [{ type: 'shared', name: 't2' }, { type: 'exclusive', name: 't3' }] }))
//   console.log('Queued exclusive:test3', await core.enqeue({ locks: [{ type: 'exclusive', name: 't3' }] }))
//   console.log('Queued exclusive:test4', await core.enqeue({ locks: [{ type: 'exclusive', name: 't4' }] }))
//   // console.log('Queued shared:test2', await core.enqeue({ locks: [{ type: 'shared', name: 'test2' }] }))
//   // console.log('Queued exclusive:test3', await core.enqeue({ locks: [{ type: 'exclusive', name: 'test3' }] }))
// })()

