import dotenv from 'dotenv'

dotenv.config()

import Server from './server'

const server = new Server({
  port: Number(process.env.GENIE_PORT)
})

server.onMessage.subscribe(({ id, data }) => {
  const { command, payload } = JSON.parse(data)

  // conso
})
