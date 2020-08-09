const dotenv = require('dotenv')

dotenv.config()

const { default: LocksManager } = require('../dist/modules/LocksManager')

describe('Basic RequestsQueue module tests', () => {
  let manager = null
  let ids = []
  let counter = 0

  beforeAll(async () => {
    manager = new LocksManager()
  })

  afterAll(async () => {
    await Promise.all(ids.map(async (id) => {
      await manager.release(id)
    }))
  })

  it('can check', async () => {
    const res = await manager.check({ name: `lock-${counter++}`, type: 'shared'})

    expect(res).toBe(true)
  })

  it('can acquire shared lock', async () => {
    expect((async () => {
      ids.push(await manager.acquire({ name: `lock-${counter++}`, type: 'shared' }))
    })()).resolves.toBe()
  })

  it('can acquire exclusive lock', async () => {
    expect((async () => {
      ids.push(await manager.acquire({ name: `lock-${counter++}`, type: 'exclusive' }))
    })()).resolves.toBe()
  })

  it('cannot acquire exclusive lock twice #1', async () => {
    const name = `lock-${counter++}`

    ids.push(await manager.acquire({ name, type: 'exclusive' }))
    const res = await manager.check({ name, type: 'exclusive'})

    expect(res).toBe(false)
  })

  it('cannot acquire exclusive lock twice #2', async () => {
    const name = `lock-${counter++}`
    ids.push(await manager.acquire({ name, type: 'exclusive' }))
    expect((async () => {
      await manager.acquire({ name, type: 'exclusive'})
    })()).rejects.toThrow()
  })

  it('cannot acquire shared lock after exclusive lock', async () => {
    const name = `lock-${counter++}`
    ids.push(await manager.acquire({ name, type: 'exclusive' }))
    expect((async () => {
      await manager.acquire({ name, type: 'shared' })
    })()).rejects.toThrow()
  })

  it('can acquire shared lock few times', async () => {
    const name = `lock-${counter++}`
    ids.push(await manager.acquire({ name, type: 'shared' }))
    expect((async () => {
      ids.push(await manager.acquire({ name, type: 'shared' }))
    })()).resolves.toBe()
  })

  it('can release', async () => {
    const name = `lock-${counter++}`
    const id = await manager.acquire({ name, type: 'exclusive' })

    expect(await manager.check({ name, type: 'shared' })).toBe(false)

    await manager.release(id)

    expect(await manager.check({ name, type: 'shared' })).toBe(true)
  })

  it('cannot release lock by wrong id', async () => {
    expect((async () => {
      await manager.release('some-random-crap')
    })()).rejects.toThrow()
  })
})
