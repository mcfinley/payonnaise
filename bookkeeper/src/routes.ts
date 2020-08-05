import express from 'express'
import _ from 'lodash'

import { routeHandler } from './libs/utils'
import accounts from './controllers/accounts'
import profiles from './controllers/profiles'
import transfers from './controllers/transfers'

const router = express.Router()

/**
 * Users routes
 */

router.post('/profiles/', routeHandler(profiles.post))
router.get('/profiles/', routeHandler(profiles.list))
router.get('/profiles/:profileId', routeHandler(profiles.get))
router.delete('/profiles/:profileId', routeHandler(profiles.delete))

router.post('/profiles/:profileId/accounts', routeHandler(accounts.post))
router.get('/profiles/:profileId/accounts', routeHandler(accounts.list))
router.get('/profiles/:profileId/accounts/:accountId', routeHandler(accounts.get))
router.get('/profiles/:profileId/accounts/:accountId/balance', routeHandler(accounts.getBalance))
router.delete('/profiles/:profileId/accounts/:accountId', routeHandler(accounts.delete))

router.get('/profiles/:profileId/accounts/:accountId/transfers', routeHandler(transfers.list))

/**
 * Accounts routes
 */

router.post('/accounts', routeHandler(accounts.post))
router.get('/accounts', routeHandler(accounts.list))
router.get('/accounts/:accountId', routeHandler(accounts.get))
router.get('/accounts/:accountId/balance', routeHandler(accounts.getBalance))
router.delete('/accounts/:accountId', routeHandler(accounts.delete))

router.get('/accounts/:accountId/transfers', routeHandler(transfers.list))

/**
 * Transfers routes
 */

router.post('/transfers', routeHandler(transfers.post))
router.get('/transfers', routeHandler(transfers.list))

export default router