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
});

router.put('/:id', (req, res) => {
});

module.exports = router;
