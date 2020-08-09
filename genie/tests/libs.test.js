const dotenv = require('dotenv')

dotenv.config()

const storage = require('../dist/libs/storage')

describe('Storage (Genie Redis) API library tests', () => {
  it('should set kv', async () => {
    expect(async () => {
      await storage.default.set('key', 'value')
    }).not.toThrow()
  })

  it('should set & get kv', async () => {
    await storage.default.set('key', 'value')
    const value = await storage.default.get('key')

    expect(value).toBe('value')
  })

  it('should handle lpush/lpop commands', async () => {
    await storage.default.lpush('test', 'value-0')
    await storage.default.lpush('test', 'value-1')

    const value1 = await storage.default.lpop('test')
    const value0 = await storage.default.lpop('test')

    expect(value0).toBe('value-0')
    expect(value1).toBe('value-1')
  })

  it('should handle rpush/rpop commands', async () => {
    await storage.default.rpush('test', 'value-0')
    await storage.default.rpush('test', 'value-1')

    const value1 = await storage.default.rpop('test')
    const value0 = await storage.default.rpop('test')

    expect(value0).toBe('value-0')
    expect(value1).toBe('value-1')
  })

  it('should push/pop properly', async () => {
    await storage.default.rpush('test', 'value-0')
    await storage.default.rpush('test', 'value-1')

    const value0 = await storage.default.lpop('test')
    const value1 = await storage.default.lpop('test')

    expect(value0).toBe('value-0')
    expect(value1).toBe('value-1')
  })
})