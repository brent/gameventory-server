"use strict";

const router = require('express').Router();
const Gameventory = require('../../models/Gameventory');
const handleResponse = require('../routeHelpers').handleResponse;

router.get('/', (req, res) => {
});

router.get('/:id', (req, res) => {
  Gameventory.getOne(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => console.log(err));
});

router.post('/', (req, res) => {
});

router.put('/:id', (req, res) => {
});

module.exports = router;
