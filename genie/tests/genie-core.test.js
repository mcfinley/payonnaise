const dotenv = require('dotenv')

dotenv.config()

const { default: RequestsQueue } = require('../dist/modules/RequestsQueue')
const { default: LocksManager } = require('../dist/modules/LocksManager')
const { default: GenieCore } = require('../dist/modules/GenieCore')

describe('Basic RequestsQueue module tests', () => {
  let manager
  let queue
  let core

  beforeAll(async () => {
    manager = new LocksManager()
    queue = new RequestsQueue()
    core = new GenieCore(manager, queue)
  })

  beforeEach(() => {
    idsToRelease = []
  })

  afterEach(async () => {
    await Promise.all(idsToRelease.map((id) => core.release(id)))
  })

  // it('basically works', async () => {
  //   expect((async () => {
  //     const id = await core.enqeue({ locks: [{ type: 'shared', name: 'test' }] })
  //
  //     core.onAcquired.subcribe(($id) => {
  //       console.log({ $id })
  //     })
  //   })()).resolves.toBe()
  //
  //   // expect((() => {
  //   //   await core.enqeue({ locks: [{ type: 'shared', name: 'test' }] })
  //   // })()).resolves.toBe()
  //
  // })
})
