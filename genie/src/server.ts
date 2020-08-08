import * as net from 'net'
import { v4 as uuid } from 'uuid'
import { EventEmitter } from './libs/events'

type Options = {
  port: number
}

export default class Server {
  server = net.createServer()
  clients = new Map<string, net.Socket>()

  onMessage = new EventEmitter<{ id: string, data: string }>()

  constructor (private options: Options) {
    this.server.listen(this.options.port)
    this.server.on('connection', this.handleNewConnection)
  }

  handleNewConnection = (socket) => {
    const id = uuid()

    this.clients.set(id, socket)
    socket.on('data', (chunk) => this.handleSocketMessage(id, chunk))
    socket.on('end', () => this.clients.delete(id))
  }

  handleSocketMessage = (id: string, data: string) => {
    this.onMessage.emitParallelAsync({ id, data })
  }

  sendMessage = (id: string, data: string) => {
    const socket = this.clients.get(id)

    if (!socket) {
      throw new Error(`Socket with ${id} is not connected`)
    }

    socket.write(data)
  }
}

