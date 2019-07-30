"use strict";

const db = require('../db');
const tableName = 'gameventories';

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

  static create() {
    return new Promise((resolve, reject) => {
      // might only be needed when user is created
      resolve(true);
    });
  }
}

module.exports = Gameventory;
