"use strict";

const db = require('../db');
const tableName = 'posts';

class Post {
  static getAll() {
    return new Promise((resolve, reject) => {
      db
        .orderBy('id')
        .from(tableName)
        .then(rows => {
          resolve(rows);
        })
        .catch(err => {
          reject(err)
        });
    });
  }

  static get(id) {
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

  static createForUser(record, userId) {
    return new Promise((resolve, reject) => {
      db
        .insert({
          userId: userId,
          content: record
        })
        .into(tableName)
        .returning('*')
        .then(rows => {
          resolve(rows[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static updateForUser(params, userId) {
    const { id, content } = params;
    return new Promise((resolve, reject) => {
      db
        .from(tableName)
        .where({
          id: id,
          userId: userId
        })
        .update({
          content: content,
          modifiedAt: db.fn.now()
        })
        .returning('*')
        .then(rows => {
          resolve(rows[0]);
        })
        .catch(err => {
          reject(err)
        });
    });
  }
}

module.exports = Post;
