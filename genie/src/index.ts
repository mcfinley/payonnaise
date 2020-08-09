import dotenv from 'dotenv'

dotenv.config()

import LocksManager from './modules/LocksManager'
import RequestsQueue from './modules/RequestsQueue'

const locksManager = new LocksManager()
const requestsQueue = new RequestsQueue()

