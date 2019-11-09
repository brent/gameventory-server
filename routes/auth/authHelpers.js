"use strict";

const Token = require('../../models/Token');

const requireAuth = (req, res, next) => {
  const token = ((authHeader) => {
    const token = authHeader.split(' ')[1];
    return token;
  })(req.headers.authorization);

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
