const connect = require('./integration-stub')

const createServer = () => {
  let incomingMessages = []
  let connection = connect((data) => incomingMessages.push(JSON.parse(data)))

  return {
    push: (message) => connection.write(JSON.stringify(message)),
    end: () => connection.end(),
    pull: () => new Promise((resolve) => {
      let k = setInterval(() => {
        if (incomingMessages.length > 0) {
          clearInterval(k)
          resolve(incomingMessages.shift())
        }
      }, 200)
    })
  }
}

describe('Integration tests / index', () => {
  const server = createServer()

  // it('should connect using stub', async () => {
  //   server.push({ command: 'hello' })
  //   const response = await server.pull()
  //
  //   expect(response.command).toBe('error')
  // })
  //
  // it('should accept request and release commands', async () => {
  //   server.push({ command: 'request', payload: { locks: [{ type: 'shared', name: 'test-0' }] } })
  //
  //   const response = await server.pull()
  //   expect(response.command).toBe('queued')
  //   expect((await server.pull()).command).toBe('acquired')
  //
  //   server.push({ command: 'release', payload: response.payload })
  //
  //   expect((await server.pull()).command).toBe('released')
  // })
  //
  // it('should accept request and release commands with exclusive lock', async () => {
  //   server.push({ command: 'request', payload: { locks: [{ type: 'exclusive', name: 'test-1' }] } })
  //
  //   const response = await server.pull()
  //   expect(response.command).toBe('queued')
  //   expect((await server.pull()).command).toBe('acquired')
  //
  //   server.push({ command: 'release', payload: response.payload })
  //
  //   expect((await server.pull()).command).toBe('released')
  // })
  //
  // it('should accept request and release commands with exclusive locks in correct order', async () => {
  //   let ids = []
  //
  //   /* Push first request */
  //   {
  //     server.push({ command: 'request', payload: { locks: [{ type: 'exclusive', name: 'test-2' }] } })
  //     const response = await server.pull()
  //     expect(response.command).toBe('queued')
  //     ids.push(response.payload)
  //     /* It should acquire immediately */
  //     expect((await server.pull()).command).toBe('acquired')
  //   }
  //
  //   /* Push second request */
  //   {
  //     server.push({ command: 'request', payload: { locks: [{ type: 'exclusive', name: 'test-2' }] } })
  //     const response = await server.pull()
  //     expect(response.command).toBe('queued')
  //     ids.push(response.payload)
  //   }
  //
  //   /* Relese first request (it should be still acquired) */
  //   {
  //     server.push({ command: 'release', payload: ids[0] })
  //     expect((await server.pull()).command).toBe('released')
  //     expect((await server.pull()).command).toBe('acquired')
  //   }
  //
  //   {
  //     server.push({ command: 'release', payload: ids[1] })
  //     expect((await server.pull()).command).toBe('released')
  //   }
  // })
  //
  // it('should accept few requests and handle them proparly', async () => {
  //   let ids = []
  //
  //   {
  //     server.push({ command: 'request', payload: { locks: [{ type: 'exclusive', name: 'test-3' }] }})
  //     const response = await server.pull()
  //     expect(response.command).toBe('queued')
  //     ids.push(response.payload)
  //     expect((await server.pull()).command).toBe('acquired')
  //   }
  //
  //   {
  //     server.push({ command: 'request', payload: { locks: [{ type: 'shared', name: 'test-3' }] }})
  //     const response = await server.pull()
  //     expect(response.command).toBe('queued')
  //     ids.push(response.payload)
  //     // expect((await server.pull()).command).toBe('acquired')
  //   }
  //
  //   {
  //     server.push({ command: 'request', payload: { locks: [{ type: 'shared', name: 'test-3' }] }})
  //     const response = await server.pull()
  //     expect(response.command).toBe('queued')
  //     ids.push(response.payload)
  //   }
  //
  //   {
  //     server.push({ command: 'release', payload: ids[0] })
  //     expect((await server.pull()).command).toBe('released')
  //     expect((await server.pull()).command).toBe('acquired')
  //     expect((await server.pull()).command).toBe('acquired')
  //   }
  //
  //   {
  //     server.push({ command: 'release', payload: ids[1] })
  //     expect((await server.pull()).command).toBe('released')
  //     server.push({ command: 'release', payload: ids[2] })
  //     expect((await server.pull()).command).toBe('released')
  //   }
  // })

  it('should execute cascade requests', async () => {
    jest.setTimeout(30000)
    let ids = []

    {
      server.push({ command: 'request', payload: { locks: [{ type: 'exclusive', name: 'mixed-1' }, { type: 'exclusive', name: 'mixed-2' }] }})
      const response = await server.pull()
      expect(response.command).toBe('queued')
      ids.push(response.payload)
      expect((await server.pull()).command).toBe('acquired')
    }

    // {
    //   server.push({ command: 'request', payload: { locks: [{ type: 'exclusive', name: 'mixed-2' }, { type: 'exclusive', name: 'mixed-3' }] }})
    //   const response = await server.pull()
    //   expect(response.command).toBe('queued')
    //   ids.push(response.payload)
    // }
    //
    // {
    //   server.push({ command: 'request', payload: { locks: [{ type: 'exclusive', name: 'mixed-3' }, { type: 'exclusive', name: 'mixed-4' }] }})
    //   const response = await server.pull()
    //   expect(response.command).toBe('queued')
    //   ids.push(response.payload)
    //   expect((await server.pull()).command).toBe('acquired')
    // }

    {
      server.push({ command: 'release', payload: ids[0] })
      expect((await server.pull()).command).toBe('released')
      // expect((await server.pull()).command).toBe('acquired')
    }
    //
    // {
    //   server.push({ command: 'release', payload: ids[1] })
    //   expect((await server.pull()).command).toBe('released')
    // }
    //
    // {
    //   server.push({ command: 'release', payload: ids[2] })
    //   expect((await server.pull()).command).toBe('released')
    // }
  })
})

