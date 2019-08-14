"use strict";

const router = require('express').Router();
const User = require('../../models/User');
const Tag = require('../../models/Tag');
const Gameventory = require('../../models/Gameventory');
const handleResponse = require('../routeHelpers').handleResponse;

router.get('/', (req, res) => {
  User.getAll()
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
  User.get(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.get('/:id/tags', (req, res) => {
  Tag.getAllForUser(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.get('/:id/games', (req, res) => {
  Gameventory.getForUserWithTags(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.post('/games', (req, res, next) => {
  const userID = req.body.userID;
  const gameID = req.body.gameID;

  Gameventory.addGameForUser(gameID, userID)
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const params = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  User.create(params)
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const params = { 
    id: req.params.id, 
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  User.update(params)
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

module.exports = router;
