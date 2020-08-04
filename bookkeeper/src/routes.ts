import express from 'express'
import _ from 'lodash'

import { routeHandler } from './libs/utils'
import accounts from './controllers/accounts'
import users from './controllers/users'

const router = express.Router()

/**
 * Users routes
 */

router.post('/users/', routeHandler(users.post))
router.get('/users/', routeHandler(users.list))
router.get('/users/:userId', routeHandler(users.get))
router.put('/users/:userId', routeHandler(users.update))
router.patch('/users/:userId', routeHandler(users.update))
router.delete('/users/:userId', routeHandler(users.delete))

router.post('/users/:userId/accounts', routeHandler(accounts.post))
router.get('/users/:userId/accounts', routeHandler(accounts.list))
router.get('/users/:userId/accounts/:accountId', routeHandler(accounts.get))
router.put('/users/:userId/accounts/:accountId', routeHandler(accounts.update))
router.patch('/users/:userId/accounts/:accountId', routeHandler(accounts.update))
router.delete('/users/:userId/accounts/:accountId', routeHandler(accounts.delete))

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
router.put('/accounts/:accountId', routeHandler(accounts.update))
router.patch('/accounts/:accountId', routeHandler(accounts.update))
router.delete('/accounts/:accountId', routeHandler(accounts.delete))

// router.post('/accounts/:accountId/transfers', routeHandler(accounts.post))
// router.get('/accounts/:accountId/transfers', routeHandler(accounts.list))
// router.get('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.get))
// router.put('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.update))
// router.patch('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.update))
// router.delete('/accounts/:accountId/transfers/:transferId', routeHandler(accounts.delete))

export default router