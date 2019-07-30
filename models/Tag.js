"use strict";

const db = require('../db');
const tableName = 'tags';

class Tag {
  static getAll() {
    return new Promise((resolve, reject) => {
      const fakeData = [
        {
          'tagID': 123456789,
          'tagName': 'tag3',
          'tagHits': 0,
        },
        {
          'tagID': 123456788,
          'tagName': 'tag2',
          'tagHits': 0,
        },
        {
          'tagID': 123456787,
          'tagName': 'tag1',
          'tagHits': 0,
        }
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
        'tagID': id,
        'tagName': 'tag',
        'tagHits': 0,
      };

      if (fakeData) {
        resolve(fakeData);
      } else {
        reject({ 'error': 'no data' });
      }
    });
  }

  static createTagForGame(tagName, userId, gameId) {
    return true;
  }
}

module.exports = Tag;
