"use strict";

const db = require('../db');
const tableName = 'user_games';

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
        .where('user_id', '=', userID)
        .from(tableName)
        .join('games', 'games.id', `${tableName}.game_id`)
        .then(rows => resolve(rows))
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
