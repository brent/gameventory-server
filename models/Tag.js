"use strict";

const db = require('../db');
const tableName = 'tags';
const joinTableName = 'users_games_tags';

class Tag {
  static getAll() {
    return new Promise((resolve, reject) => {
      db
        .from(tableName)
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static getOne(id) {
    return new Promise((resolve, reject) => {
      const fakeData = {
        'tagID': id,
        'tagName': 'tag',
      };

      if (fakeData) {
        resolve(fakeData);
      } else {
        reject({ 'error': 'no data' });
      }
    });
  }

  static getAllForUser(userID) {
    return new Promise((resolve, reject) => {
      db
        .select(`${tableName}.*`)
        .where('user_id', '=', userID)
        .from(joinTableName)
        .join(tableName, `${tableName}.id`, `${joinTableName}.tag_id`)
        .distinct()
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static findByName(tagName) {
    return new Promise((resolve, reject) => {
      db
        .first()
        .where('name', '=', tagName)
        .from(tableName)
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static createTag(tagName) {
    return new Promise((resolve, reject) => {
      db
        .insert({ name: tagName })
        .into(tableName)
        .returning('*')
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err));
    });
  }

  static createUserTagForGame(userID, tagID, gameID) {
    return new Promise((resolve, reject) => {
      db
        .insert({
          user_id: userID,
          tag_id: tagID,
          game_id: gameID
        })
        .into(joinTableName)
        .returning('*')
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err));
    });
  }

  static removeTagFromGameForUser(tagID, gameID, userID) {
    return new Promise((resolve, reject) => {
      db
        .del()
        .from(joinTableName)
        .where({
          tag_id: tagID,
          game_id: gameID,
          user_id: userID,
        })
        .returning('*')
        .then(row => resolve(row[0]))
        .catch(err => reject(err));
    });
  }
}

module.exports = Tag;
