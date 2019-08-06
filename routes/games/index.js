"use strict";

const router = require('express').Router();
const Game = require('../../models/Game');
const handleResponse = require('../routeHelpers').handleResponse;

router.get('/', (req, res) => {
  Game.getAll()
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
  Game.getOne(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.post('/', (req, res) => {
  const params = {
    igdb_id: req.body.igdb_id,
    igdb_name: req.body.igdb_name,
    igdb_first_release_date: req.body.igdb_first_release_date,
    igdb_cover_img_id: req.body.igdb_cover_img_id,
    igdb_summary: req.body.igdb_summary,
  };

  Game.create(params)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.put('/:id', (req, res) => {
});

module.exports = router;
