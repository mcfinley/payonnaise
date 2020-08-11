import logger from '../../libs/logger'

import GenieCore from '../GenieCore'
import TcpServer, { Message } from '../TcpServer'

/**
 * Core connector module handles TCP server messages and Genie Core interface
 * to compose them into one
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
    logger.info('incoming command', { id, command, payload })
    try {
      switch (command) {
        case 'request':
          const requestId = await this.core.enqeue(payload)
          this.requestsRelationships.set(requestId, id)
          await this.server.sendMessage(id, { command: 'queued', payload: requestId })
          break
        case 'release':
          this.core.release(payload)
          break
        default:
          this.server.sendMessage(id, { command: 'error', payload: `Command ${command} is not supported` })
      }
    } catch (e) {
      logger.error('There was an error while CoreConnector was processing command', { id, command, payload, e })
    }
  }

  private handleAcquired = async (id: string) => {
    try {
      const clientId = this.requestsRelationships.get(id)

      this.server.sendMessage(clientId as string, { command: 'acquired', payload: { id } })
    } catch (e) {
      logger.error('Failed at handleAcquired', { e })
    }
  }

  private handleReleased = async (id: string) => {
    try {
      const clientId = this.requestsRelationships.get(id)

      this.server.sendMessage(clientId as string, { command: 'released', payload: { id } })
    } catch (e) {
      logger.error('Failed at handleReleased', { e })
    }
  }
}