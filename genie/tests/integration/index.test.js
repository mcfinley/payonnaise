const connect = require('./integration-stub')

const createServer = () => {
  let incomingMessages = []
  let connection = connect((data) => incomingMessages.push(JSON.parse(data)))

  return {
    push: (message) => connection.write(JSON.stringify(message)),
    end: () => connection.end(),
    pull: () => new Promise((resolve) => {
      let t = setInterval(() => {
        if (incomingMessages.length > 0) {
          clearInterval(k)
          resolve(incomingMessages.shift())
        }
      }, 200)
    })
  }
}


describe('Integration tests', () => {
  it('should connect using stub', async () => {
    const server = createServer()

    server.push({ command: 'hello' })
    const response = await server.pull()

    expect(response.command).toBe('error')
  })

})

