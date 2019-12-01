"use strict";

const router = require('express').Router();
const Tag = require('../../models/Tag');
const handleResponse = require('../routeHelpers').handleResponse;

router.get('/', (req, res, next) => {
  if (req.query) {
    const tagName = req.query.q;

    Tag.searchByName(tagName)
      .then((data) => handleResponse(res, data))
      .catch((err) => next(err));
  } else {
    Tag.getAll()
      .then(data => handleResponse(res, data))
      .catch(err => next(err));
  }
});

router.get('/:id', (req, res) => {
  Tag.getOne(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.post('/', (req, res, next) => {
  const tagName = req.body.tagName;
  const userID = req.decoded.user_id;
  const gameID = req.body.gameID;

  Tag.createTag(tagName)
    .then(tagData => {
      Tag.createUserTagForGame(userID, tagData.id, gameID)
        .then(data => handleResponse(res, data))
        .catch(err => next(err));
    })
    .catch(err => {
      if (err.code === '23505') {
        Tag.findByName(tagName)
          .then(tag => {
            Tag.createUserTagForGame(userID, tag.id, gameID)
              .then(data => handleResponse(res, data))
              .catch(err => next(err));
          })
          .catch(err => next(err));
      } else {
        next(err);
      }
    });
});

router.patch('/:id', (req, res, next) => {
  const tagID = req.params.id;
  const gameID = req.body.gameID;
  const userID = req.decoded.user_id;

  Tag.removeTagFromGameForUser(tagID, gameID, userID)
    .then((data) => handleResponse(res, data))
    .catch((err) => next(err));
});

module.exports = router;
