import dotenv from 'dotenv'

dotenv.config()

import LocksManager from './modules/LocksManager'
import RequestsQueue from './modules/RequestsQueue'
import TcpServer from './modules/TcpServer'
import GenieCore from './modules/GenieCore'
import CoreConnector from './modules/CoreConnector'

const locksManager = new LocksManager()
const requestsQueue = new RequestsQueue()
const core = new GenieCore(locksManager, requestsQueue)
const server = new TcpServer()
const connector = new CoreConnector(core, server)

export default server