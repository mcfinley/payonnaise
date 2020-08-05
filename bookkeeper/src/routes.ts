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
/* We cannot update a profile there is no fields for it there */
router.delete('/profiles/:profileId', routeHandler(profiles.delete))

router.post('/profiles/:profileId/accounts', routeHandler(accounts.post))
router.get('/profiles/:profileId/accounts', routeHandler(accounts.list))
router.get('/profiles/:profileId/accounts/:accountId', routeHandler(accounts.get))
router.get('/profiles/:profileId/accounts/:accountId/balance', routeHandler(accounts.getBalance))
/* No account update */
router.delete('/profiles/:profileId/accounts/:accountId', routeHandler(accounts.delete))

// router.post('/users/:userId/accounts/:accountId/transfers', routeHandler(accounts.post))
// router.get('/users/:userId/accounts/:accountId/transfers', routeHandler(accounts.list))
// router.get('/users/:userId/accounts/:accountId/transfers/:transferId', routeHandler(accounts.get))
// router.put('/users/:userId/accounts/:accountId/transfers/:transferId', routeHandler(accounts.update))
// router.patch('/users/:userId/accounts/:accountId/transfers/:transferId', routeHandler(accounts.update))
// router.delete('/users/:userId/accounts/:accountId/transfers/:transferId', routeHandler(accounts.delete))

/**
 * Accounts routes
 */

router.post('/accounts', routeHandler(accounts.post))
router.get('/accounts', routeHandler(accounts.list))
router.get('/accounts/:accountId', routeHandler(accounts.get))
router.get('/accounts/:accountId/balance', routeHandler(accounts.getBalance))
/* No account update */
router.delete('/accounts/:accountId', routeHandler(accounts.delete))

// router.post('/accounts/:accountId/transfers', routeHandler(accounts.post))
router.get('/accounts/:accountId/transfers', routeHandler(transfers.list))
// router.get('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.get))
// router.put('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.update))
// router.patch('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.update))
// router.delete('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.delete))

/**
 * Transfers routes
 */

router.post('/transfers', routeHandler(transfers.post))
router.get('/transfers', routeHandler(transfers.list))

export default router