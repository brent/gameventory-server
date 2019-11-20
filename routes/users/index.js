"use strict";

const router = require('express').Router();
const User = require('../../models/User');
const Tag = require('../../models/Tag');
const Game = require('../../models/Game');
const List = require('../../models/List');
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

router.get('/:id/games', (req, res, next) => {
  Game.getAllForUserWithTags({ userID: req.params.id })
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.get('/:id/lists', (req, res, next) => {
  List.getAllForUserWithGames({ userID: req.params.id })
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.get('/:userID/lists/:listRef', (req, res, next) => {

  if (!req.params.listRef.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    List.findByName({ listName: req.params.listRef })
      .then((rows) => {
        List.getGamesWithTagsInListForUser({
          userID: req.params.userID,
          listID: rows[0]['id'],
        })
          .then(data => handleResponse(res, data))
          .catch(err => next(err));
          })
      .catch((err) => console.log(err))
  } else {
    List.getGamesWithTagsInListForUser({
      userID: req.params.userID,
      listID: req.params.listRef,
    })
      .then(data => handleResponse(res, data))
      .catch(err => next(err));
  }
});

router.post('/games', (req, res, next) => {
  const userID = req.decoded.user_id;
  const gameID = req.body.gameID;

  Game.addOneForUser({ 
    gameID: gameID,
    userID: userID,
  })
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

router.patch('/:id', (req, res, next) => {
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
