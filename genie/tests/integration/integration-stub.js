const server = require('../../dist/index').default

module.exports = (onWrite) => {
  let doWrite = null
  let doEnd = null

  server.handleNewConnection({
    on: (event, listener) => {
      if (event === 'data') {
        doWrite = listener
      } else if (event === 'end') {
        doEnd = listener
      }
    },
    write: onWrite
  })

  return {
    write: doWrite, end: doEnd
  }
}