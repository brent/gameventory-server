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
}

module.exports = Game;
