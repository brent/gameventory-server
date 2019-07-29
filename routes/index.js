"use strict";

const router = require('express').Router();
const handleResponse = require('./routeHelpers').handleResponse;
const errorHandler = require('./routeHelpers').errorHandler;
const requireAuth = require('./auth/authHelpers').requireAuth;

router.get('/', (req, res) => {
  handleResponse(res, { 'message': 'OK' });
});

router.use('/auth', require('./auth'));
router.use('/posts', requireAuth, require('./posts'));
router.use('/users', requireAuth, require('./users'));

router.use(errorHandler);

module.exports = router;
