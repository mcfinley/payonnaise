import * as net from 'net'
import { v4 as uuid } from 'uuid'
import logger from '../../libs/logger'
import { EventEmitter } from '../../libs/events'
import { parse, stringify } from '../../libs/utils'

export type Message<T = any> = { command: string, payload?: T }

/**
 * This module creates a TCP server to accept JSON commands and send out JSON responses
 */
export default class TcpServer {
  private server = net.createServer()
  private clients = new Map<string, net.Socket>()

  public onMessage = new EventEmitter<{ id: string, message: Message}>()

  constructor () {
    if (process.env.NODE_ENV !== 'test') {
      this.server.listen(process.env.GENIE_PORT)
    }

    this.server.on('connection', this.handleNewConnection)
    this.server.on('error', this.handleError)
  }

  private handleNewConnection = (socket: net.Socket) => {
    const id = uuid()

    this.clients.set(id, socket)
    socket.on('data', (data) => this.handleSocketMessage(id, data))
    socket.on('end', () => this.clients.delete(id))
  }

  private handleSocketMessage = async (id: string, data: Buffer) => {
    this.onMessage.emitSync({
      id, message: await parse(data.toString() || 'null').catch((err) => null) as Message
    })
  }

  private handleError = async (e: any) => {
    logger.error('There was an error while running TCP server', { e })
    throw new Error(e)
  }

  /**
   * Public interface - send a message to specific client. Can throw
   */
  public sendMessage = async (id: string, message: Message) => {
    const socket = this.clients.get(id)

    if (!socket) {
      throw new Error(`Socket with ${id} is not connected`)
    }

    const data = await stringify(message)

    await new Promise((resolve, reject) =>
      socket.write(data, (err) => err ? reject(err) : resolve())
    )
  }
}

