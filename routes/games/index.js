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

  Game.searchByName(gameName)
    .then((data) => {
      if (data.length > 0) {
        handleResponse(res, data);
      } else {
        igdbClient
          .search(gameName)
          .fields('id,name,cover.*,first_release_date,platforms.*,summary,popularity')
          .limit(50)
          .request('/games')
          .then(response => {
            const gameData = response.data;

            let useableGameData = [];
            gameData.map((game, i) => {
              if (
                game === undefined
                || !game.cover
                || !game.summary
                || !game.name
                || !game.first_release_date
                || !game.id
              ) {
                return;
              } else {
                useableGameData.push(game);
              }
            });

            let gameSavePromises = useableGameData.map((game, i) => {
              const params = {
                igdb_id: game.id,
                igdb_name: game.name,
                igdb_first_release_date: game.first_release_date,
                igdb_cover_img_id: game.cover.image_id,
                igdb_summary: game.summary
              };

              return new Promise((resolve, reject) => {
                Game.create(params)
                  .then(data => resolve(data))
                  .catch(err => reject(err));
              });
            });

            Promise.all(gameSavePromises).then((promises) => {
              let promiseResults = promises.map((promise) => {
                if (promise) {
                  return promise[0];
                }
              });

              handleResponse(res, promiseResults);
            });
          });
      }
    })
    .catch(err => next(err));
});

module.exports = router;
