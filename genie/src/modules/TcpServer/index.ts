import * as net from 'net'
import { v4 as uuid } from 'uuid'
import { EventEmitter } from '../../libs/events'

export default class TcpServer {
  server = net.createServer()
  clients = new Map<string, net.Socket>()

  onMessage = new EventEmitter<{ id: string, data: string }>()

  constructor () {
    this.server.listen(process.env.GENIE_PORT)
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

