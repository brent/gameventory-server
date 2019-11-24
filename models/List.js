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
        .insert({ name: listName })
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
      listDescription,
      userID,
    } = params;

    function addListToUser(params) {
      const { listID, userID, listDescription } = params;

      return new Promise((resolve, reject) => {
        db
          .insert({
            list_id: listID,
            user_id: userID,
            list_description: listDescription,
          })
          .into(joinTableName)
          .returning('*')
          .then(rows => resolve(rows[0]))
          .catch(err => reject(err));
      });
    }

    if (!listID) {
      return new Promise((resolve, reject) => {
        List.create({ listName: listName })
          .then((res) => addListToUser({
            listID: res.id,
            userID: userID,
            listDescription: listDescription,
          }))
          .then((list) => resolve(list))
          .catch(err => reject(err));
      })
    } else {
      return new Promise((resolve, reject) => {
        addListToUser({
          listID: listID,
          userID: userID,
          listDescription: listDescription,
        })
          .then(list => resolve(list))
          .catch(err => reject(err));
      });
    }
  }

  static getAllForUser(params) {
    const { userID } = params;

    return new Promise((resolve, reject) => {
      db
        .select(`*`)
        .where('user_id', '=', userID)
        .from(joinTableName)
        .join(tableName, `${tableName}.id`, `${joinTableName}.list_id`)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  static getAllForUserWithGames(params) {
    const { userID } = params;

    return new Promise((resolve, reject) => {
      List.getAllForUser(params)
        .then((lists) => {
          const listIDs = [...new Set(lists.map(list => list.list_id))];
          const promises = [];
          listIDs.forEach((listID) => promises.push(
            List.getGamesWithTagsInListForUser({
              userID: userID,
              listID: listID,
            })
          ));

          Promise.all(promises)
            .then((res) => {
              resolve(res);
            });
        })
        .catch((err) => reject(err));
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

  static moveGameToListForUser(params) {
    const { gameID, listID, userID } = params;

    return new Promise((resolve, reject) => {
      db
        .update({ list_id: listID })
        .where({ user_id: userID })
        .andWhere({ game_id: gameID })
        .from(gamesJoinTableName)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  static getGamesWithTagsInListForUser(params) {
    const { userID, listID } = params;

    const listGames = new Promise((resolve, reject) => {
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
                    users_games_tags.game_id = users_lists_games.game_id
                  AND
                    users_games_tags.user_id = users_lists_games.user_id
                  ORDER BY
                    tags.name
                ) as ts
              ) as tags
          FROM
            users_lists_games
          INNER JOIN
            games ON games.id = users_lists_games.game_id
          WHERE
            users_lists_games.user_id = :user_id
          AND
            users_lists_games.list_id = :list_id
        `, { user_id: userID, list_id: listID })
        .then(res => { resolve(res.rows) })
        .catch(err => reject(err));
    });

    const listName = new Promise((resolve, reject) => {
      db
        .select(`${tableName}.*`)
        .where('id', '=', listID)
        .from(tableName)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });

    const listDescription = new Promise((resolve, reject) => {
      db
        .select(`${joinTableName}.list_description`)
        .where('list_id', '=', listID)
        .from(joinTableName)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });

    return new Promise((resolve, reject) => {
      Promise.all([listName, listGames, listDescription])
        .then((promises) => {
          const listMeta = {
            ...promises[0][0],
            ...promises[2][0],
          };

          resolve({
            ...listMeta,
            games: promises[1],
          });
        })
        .catch(err => reject(err));
    });
  }

  static findByName(params) {
    const { listName } = params;

    return new Promise((resolve, reject) => {
      db
        .select(`*`)
        .from(`${tableName}`)
        .where('name', '=', listName)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }
}

module.exports = List;
