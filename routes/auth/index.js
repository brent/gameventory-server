"use strict";

const router = require('express').Router();
const User = require('../../models/User');
const Token = require('../../models/Token');
const handleResponse = require('../routeHelpers').handleResponse;
const requireAuth = require('./authHelpers').requireAuth;

router.post('/signup', (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  User.create(user).then(user => {
    Token.saveTokenForUser(user.id)
      .then((refreshToken) => {
        const jwt = Token.generateAccessToken(user.id);
        const data = {
          user,
          'access': jwt,
          'refresh': refreshToken,
        };

        handleResponse(res, data);
      })
      .catch(err => console.log(err));
  })
  .then(() => {
    // create gameventory
  })
  .catch(err => console.log(err));
});

router.post('/login', (req, res, next) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  User.comparePassword(user)
    .then(user => {
      Token.findTokenForUser(user.id)
        .then((refreshToken) => {
          const jwt = Token.generateAccessToken(user.id);
          const data = {
            user,
            'access': jwt,
            'refresh': refreshToken,
          };

          handleResponse(res, data);
        })
        .catch((err) => {
          Token.saveTokenForUser(user.id)
            .then((refreshToken) => {
              const jwt = Token.generateAccessToken(user.id);
              const data = {
                user,
                'access': jwt,
                'refresh': refreshToken,
              };

              handleResponse(res, data);
            })
            .catch(err => next(err));
        });
    })
    .catch(err => next(err));
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.refreshToken;

  Token.refreshAccessToken(refreshToken)
    .then((newAccessToken) => {
      const data = {
        'token': newAccessToken,
      };

      handleResponse(res, data);
    })
    .catch(err => console.log(err))
});

module.exports = router;
