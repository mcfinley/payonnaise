const dotenv = require('dotenv')

dotenv.config()

const { default: RequestsQueue } = require('../dist/modules/RequestsQueue')

describe('Basic RequestsQueue module tests', () => {
  let queue
  beforeAll(async () => {
    queue = new RequestsQueue()
    /* Clean the queue */
    while (await queue.shift() !== null) {}
  })

  it('return no result when shifting from empty queue', async () => {
    const item = await queue.shift()

    expect(item).toBe(null)
  })

  it('return something that was put into it', async () => {
    await queue.push('test')
    const item = await queue.shift()

    expect(item).toBe('test')
  })

  it('match the order of pushing', async () => {
    await queue.push('test-0')
    await queue.push('test-1')
    const item = await queue.shift()

    expect(item).toBe('test-0')
  })
})

describe('Search RequestsQueue module tests', () => {
  let queue
  beforeAll(async () => {
    queue = new RequestsQueue()
  })

  beforeEach(async () => {
    /* Clean the queue */
    while (await queue.shift() !== null) {}
  })

  it('should support search #1', async () => {
    await queue.push(10)
    await queue.push(20)
    await queue.push(30)
    const item = await queue.find((value) => value === 20)

    expect(item).toBe(20)
    expect(await queue.shift()).toBe(10)
    expect(await queue.shift()).toBe(30)
    expect(await queue.shift()).toBe(null)
  })

  it('should support search #2', async () => {
    await queue.push({ test: '12t' })
    await queue.push({ test: '13t' })
    await queue.push({ test: '14t', foo: 'bar' })
    const item = await queue.find((value) => value.test.startsWith('14'))

    expect(item.foo).toBe('bar')
    expect((await queue.shift()).test).toBe('12t')
    expect((await queue.shift()).test).toBe('13t')
    expect(await queue.shift()).toBe(null)
  })
})

