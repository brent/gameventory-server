"use strict";

const db = require('../db');
const tableName = 'games';

class Game {
  static getAll() {
    return new Promise((resolve, reject) => {
      const fakeData = [
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
      ];

      if (fakeData) {
        resolve(fakeData);
      } else {
        reject({ 'error': 'no data' });
      }
    });
  }

  static getOne(id) {
    return new Promise((resolve, reject) => {
      const fakeData = {
          'gameID': id,
          'gameName': 'game name',
      };

      if (fakeData) {
        resolve(fakeData);
      } else {
        reject({ 'error': 'no data' });
      }
    });
  }

  static createGame(gameData) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

module.exports = Game;
