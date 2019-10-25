"use strict";

const db = require('../db');
const tableName = 'lists';
const joinTableName = 'users_lists';
const gamesJoinTableName = 'users_lists_games';

class List {
  static getAll() {
    return new Promise((resolve, reject) => {
      db
        .select('*')
        .from(tableName)
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static getOne(id) {
  }

  static create(params) {
    const { listName } = params;

    return new Promise((resolve, reject) => {
      db
        .insert({ list_name: listName })
        .into(tableName)
        .returning('*')
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err));
    });
  }

  static createListForUser(params) {
    const {
      listID,
      listName,
      userID,
    } = params;

    function addListToUser() {
      return new Promise((resolve, reject) => {
        db
          .insert({
            list_id: listID,
            user_id: userID,
          })
          .into(joinTableName)
          .returning('*')
          .then(rows => resolve(rows[0]))
          .catch(err => reject(err));
      });
    }

    if (listID === null) {
      return new Promise((resolve, reject) => {
        List.create({ listName: listName })
          .then(() => addListToUser())
          .then(list => resolve(list))
          .catch(err => reject(err));
      })
    } else {
      return new Promise((resolve, reject) => {
        addListToUser()
          .then(list => resolve(list))
          .catch(err => reject(err));
      });
    }
  }

  static getAllForUser(params) {
    const { userID } = params;

    return new Promise((resolve, reject) => {
      db
        .select(`${tableName}`)
        .where('user_id', '=', userID)
        .from(joinTableName)
        .join(tableName, `${tableName}.id`, `${joinTableName}.list_id`)
        .distinct()
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static addGameToListForUser(params) {
    const { gameID, listID, userID } = params;

    return new Promise((resolve, reject) => {
      db
        .insert({
          user_id: userID,
          list_id: listID,
          game_id: gameID,
        })
        .into(gamesJoinTableName)
        .returning('*')
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err));
    });
  }
}

module.exports = List;
