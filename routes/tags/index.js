"use strict";

const router = require('express').Router();
const Tag = require('../../models/Tag');
const handleResponse = require('../routeHelpers').handleResponse;

router.get('/', (req, res) => {
  Tag.getAll()
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
  Tag.getOne(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.post('/', (req, res) => {
  const tagName = req.body.tagName;
  const userID = req.body.userID;
  const gameID = req.body.gameID;

  Tag.createTag(tagName)
    .then(tagData => {
      Tag.createUserTagForGame(userID, tagData.id, gameID)
        .then(data => handleResponse(res, data))
        .catch(err => console.log(err));
    })
    .catch(err => {
      if (err.code === '23505') {
        Tag.findByName(tagName)
          .then(tag => {
            Tag.createUserTagForGame(userID, tag.id, gameID)
              .then(data => handleResponse(res, data))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      } else {
        console.log(err);
      }
    });
});

router.put('/:id', (req, res) => {
});

module.exports = router;
