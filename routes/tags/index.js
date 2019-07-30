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
});

router.put('/:id', (req, res) => {
});

module.exports = router;
