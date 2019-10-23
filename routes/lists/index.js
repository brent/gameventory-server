"use strict";

const router = require('express').Router();
const List = require('../../models/List');
const handleResponse = require('../routeHelpers').handleResponse;

router.get('/', (req, res) => {
  List.getAll()
    .then((data) => handleResponse(res, data))
    .catch(err => next(err));
});

router.get('/:id', (req, res) => {
});

router.post('/', (req, res, next) => {
  const userID = req.body.userID;
  const listID = req.body.listID;
  const listName = req.body.listName;

  List.createListForUser({
    listID: listID,
    userID: userID,
    listName: listName,
  })
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

module.exports = router;
