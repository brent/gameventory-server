"use strict";

const Token = require('../../models/Token');

const requireAuth = (req, res, next) => {
  const token = req.query.auth || req.body.auth;
  Token.decode(token)
    .then(decoded => {
      req.decoded = decoded;
      next();
    })
    .catch(err => {
      err.statusCode = 401;
      next(err);
    });
}

module.exports = {
  requireAuth,
}
