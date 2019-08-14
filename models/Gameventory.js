"use strict";

const db = require('../db');
const tableName = 'users_games';

class Gameventory {
  static getAll() {
    // don't think this is needed
  }

  static getOne(id) {
    return new Promise((resolve, reject) => {
      const fakeData = {
        'gameventoryID': id,
        'userID': 1001,
        'games': [
          {
            'gameID': 123456789,
            'gameName': 'game name',
          },
          {
            'gameID': 123456788,
            'gameName': 'game name',
          },
          {
            'gameID': 123456787,
            'gameName': 'game name',
          },
        ]
      };

      if (fakeData) {
        resolve(fakeData);
      } else {
        reject({ 'error': 'no data' });
      }
    });
  }

  static getForUser(userID) {
    return new Promise((resolve, reject) => {
      db
        .select('games.*')
        .where(`${tableName}.user_id`, '=', userID)
        .from(tableName)
        .join('games', 'games.id', `${tableName}.game_id`)
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static getForUserWithTags(userID) {
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
                    tags.tag_name
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

  static addGameForUser(gameID, userID) {
    return new Promise((resolve, reject) => {
      db
        .insert({
          user_id: userID,
          game_id: gameID,
        })
        .into(tableName)
        .returning('*')
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err));
    });
  }
}

module.exports = Gameventory;
