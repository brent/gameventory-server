"use strict";

const router = require('express').Router();
const Game = require('../../models/Game');
const handleResponse = require('../routeHelpers').handleResponse;

const igdb = require('igdb-api-node').default;
const igdbClient = igdb('d9cb85a65658e480a619647386aaec3c');

router.get('/', (req, res, next) => {
  Game.getAll()
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  Game.getOne(req.params.id)
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const params = {
    igdb_id: req.body.igdb_id,
    igdb_name: req.body.igdb_name,
    igdb_first_release_date: req.body.igdb_first_release_date,
    igdb_cover_img_id: req.body.igdb_cover_img_id,
    igdb_summary: req.body.igdb_summary,
  };

  Game.create(params)
    .then(data => handleResponse(res, data))
    .catch(err => next(err));
});

router.put('/:id', (req, res) => {
});

router.post('/search', async (req, res, next) => {
  const gameName = req.body.gameName;

  try {
    const igdbRes = await igdbClient
      .search(gameName)
      .fields('id,name,cover.*,first_release_date,platforms.*,summary,popularity')
      .limit(50)
      .request('/games');

    const gameData = igdbRes.data;

    // TODO: below probably belongs in the Game model
    gameData.forEach((game, i) => {
      if (
        !game.cover
        || !game.summary
        || !game.name
        || !game.first_release_date
        || !game.id
      ) {
        gameData.splice(i, 1);
        return;
      }

      const params = {
        igdb_id: game.id,
        igdb_name: game.name,
        igdb_first_release_date: game.first_release_date,
        igdb_cover_img_id: game.cover.image_id,
        igdb_summary: game.summary
      };

      Game.create(params)
        .catch(err => {
          next(err);
        });
    });

    handleResponse(res, gameData);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
