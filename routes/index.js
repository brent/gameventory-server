"use strict";

const router = require('express').Router();
const handleResponse = require('./routeHelpers').handleResponse;
const errorHandler = require('./routeHelpers').errorHandler;
const requireAuth = require('./auth/authHelpers').requireAuth;

router.get('/', (req, res) => {
  handleResponse(res, { 'message': 'OK' });
});

router.use('/auth', require('./auth'));
router.use('/users',         requireAuth, require('./users'));
router.use('/games',         requireAuth, require('./games'));
router.use('/tags',          requireAuth, require('./tags'));
router.use('/lists',         requireAuth, require('./lists'));
router.use('/gameventories', requireAuth, require('./gameventories'));

router.use(errorHandler);

module.exports = router;
