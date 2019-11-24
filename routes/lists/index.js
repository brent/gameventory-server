"use strict";

const router = require('express').Router();
const List = require('../../models/List');
const handleResponse = require('../routeHelpers').handleResponse;

router.get('/', (req, res) => {
  List.getAll()
    .then((data) => handleResponse(res, data))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const userID = req.decoded.user_id;
  const listID = req.body.listID;
  const listName = req.body.listName;
  const listDescription = req.body.listDescription;

  List.createListForUser({
    listID: listID,
    userID: userID,
    listName: listName,
    listDescription: listDescription,
  })
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const userID = req.decoded.user_id;
  const listID = req.params.id

  List.getGamesWithTagsInListForUser({
    userID: userID,
    listID: listID,
  })
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.patch('/:id', (req, res, next) => {
  const userID = req.decoded.user_id;
  const gameID = req.body.gameID;
  const listID = req.params.id;

  console.log('userID', userID);
  console.log('gameID', gameID);
  console.log('listID', listID);

  List.addGameToListForUser({
    userID: userID,
    listID: listID,
    gameID: gameID,
  })
    .then(data => handleResponse(res, data))
    .catch((err) => {
      List.moveGameToListForUser({
        userID: userID,
        listID: listID,
        gameID: gameID,
      })
        .then((data) => handleResponse(res, data))
        .catch((err) => handleResponse(err));
    });
});

module.exports = router;
