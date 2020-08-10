import GenieCore from '../GenieCore'
import TcpServer, { Message } from '../TcpServer'

/**
 *
 */
export default class CoreConnector {
  private requestsRelationships = new Map<string, string>() // request id -> client id

  constructor (private core: GenieCore, private server: TcpServer) {
    this.server.onMessage.subscribe(this.handleMessage)
    this.core.onAcquired.subscribe(this.handleAcquired)
    this.core.onReleased.subscribe(this.handleReleased)
  }

  /**
   * Message handling code
   */
  private handleMessage = async ({ id, message: { command, payload } }: { id: string, message: Message }) => {
    switch (command) {
      case 'request':
        const requestId = await this.core.enqeue(payload)
        await this.server.sendMessage(id, { command: 'queued', payload: requestId })
        this.requestsRelationships.set(requestId, id)

        break
      case 'release':
        this.core.release(payload)
        break
      default:
        this.server.sendMessage(id, { command: 'error', payload: `Command ${command} is not supported` })
    }
  }

  private handleAcquired = async (id: string) => {
    const clientId = this.requestsRelationships.get(id)

    if (clientId) {
      this.server.sendMessage(clientId, { command: 'acquired', payload: id })
    }

  }

  private handleReleased = async (id: string) => {

  }
}