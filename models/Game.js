"use strict";

const db = require('../db');
const tableName = 'games';
const joinTableName = 'users_games';

class Game {
  static getAll() {
    return new Promise((resolve, reject) => {
      db
        .from(tableName)
        .then(rows => {
          resolve(rows);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static getOne(id) {
    return new Promise((resolve, reject) => {
      db
        .first()
        .from(tableName)
        .where('id', '=', id)
        .then(rows => {
          resolve(rows);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static create(gameData) {
    return new Promise((resolve, reject) => {
      db
        .raw(`
          INSERT INTO ${tableName} (
            igdb_id,
            igdb_name,
            igdb_first_release_date,
            igdb_cover_img_id,
            igdb_summary
          )
          VALUES ( ?, ?, ?, ?, ?)
          ON CONFLICT (igdb_id)
          DO UPDATE
          SET
            igdb_name = ?,
            igdb_cover_img_id = ?,
            igdb_summary = ?
          RETURNING *;
        `,
          [
            gameData.igdb_id,
            gameData.igdb_name,
            gameData.igdb_first_release_date,
            gameData.igdb_cover_img_id,
            gameData.igdb_summary,
            gameData.igdb_name,
            gameData.igdb_cover_img_id,
            gameData.igdb_summary
          ]
        )
        .then(res => {
          resolve(res.rows);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static searchByName(str) {
    return new Promise((resolve, reject) => {
      db
        .select('*')
        .from(tableName)
        .where('igdb_name', 'ilike', `%${str}%`)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static getAllForUser(params) {
    const { userID } = params;

    return new Promise((resolve, reject) => {
      db
        .select('games.*')
        .from(joinTableName)
        .innerJoin(tableName, `${tableName}.id`, `${joinTableName}.game_id`)
        .where('user_id', '=', userID)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  static getAllForUserWithTags(params) {
    const { userID } = params;

    return new Promise((resolve, reject) => {
      db
        .raw(`
          SELECT
            games.*,
            (
              SELECT
                json_agg(ts) as tags
              FROM
                (
                  SELECT tags.*
                  FROM
                    users_games_tags
                  INNER JOIN
                    tags ON users_games_tags.tag_id = tags.id
                  WHERE
                    users_games_tags.game_id = users_games.game_id
                  AND
                    users_games_tags.user_id = users_games.user_id
                  ORDER BY
                    tags.name
                ) as ts
              ) as tags
          FROM
            users_games
          INNER JOIN
            games ON games.id = users_games.game_id
          WHERE
            users_games.user_id = ?
        `, [userID])
        .then(resp => resolve(resp.rows))
        .catch(err => reject(err));
    });
  }

  static addOneForUser(params) {
    const { gameID, userID } = params;

    return new Promise((resolve, reject) => {
      db
        .insert({
          user_id: userID,
          game_id: gameID,
        })
        .into(joinTableName)
        .returning('*')
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err));
    });
  }
}

module.exports = Game;
