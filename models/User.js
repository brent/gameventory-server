"use strict";

const db = require('../db');
const bcrypt = require('bcrypt');
const List = require('./List');

const tableName = 'users';

class User {
  static getAll() {
    return new Promise((resolve, reject) => {
      db
        .orderBy('id')
        .from(tableName)
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static get(id) {
    return new Promise((resolve, reject) => {
      db
        .first()
        .from(tableName)
        .where('id', '=', id)
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      db
        .first()
        .from(tableName)
        .where('username', '=', username)
        .then(rows => resolve(rows))
        .catch(err => reject(err));
    });
  }

  static create(params) {
    const { username, email, password } = params;

    return new Promise((resolve, reject) => {
      User.generateHash(password).then(hash => {
          db
            .insert({
              username: username,
              email: email,
              password: hash,
            })
            .into(tableName)
            .returning(['id', 'username'])
            .then(rows => {
              addDefaultListsToUser({ userID: rows[0]['id'] }).then((res) => {
                resolve(rows[0]);
              });
            })
            .catch(err => reject(err));
        });
    });

    function addDefaultListsToUser(params) {
      const { userID } = params;
      let promises = [];

      ['Playing', 'Backlog', 'Finished'].forEach((listName) => {
        promises.push(new Promise((resolve, reject) => {
          db
            .first()
            .from('lists')
            .where('name', '=', listName)
            .then((list) => { 
              List.createListForUser({
                listID: list.id,
                listName: listName,
                userID: userID,
                listDescription: '',
              })
              .then(() => resolve(true))
              .catch((err) => reject(err))
            })
            .catch((err) => reject(err));
        }));
      });

      return new Promise((resolve, reject) => {
        Promise.all(promises)
          .then((promises) => resolve(promises))
          .catch(err => reject(err));
      });
    }
  }

  static update(params) {
    const { id, username, email, password } = params;

    return new Promise((resolve, reject) => {
      User.generateHash(password).then(hash => {
        db
          .from(tableName)
          .where('id', '=', id)
          .update({
            username: username,
            email: email,
            password: hash,
            modified_at: db.fn.now()
          })
          .returning('*')
          .then(rows => resolve(rows[0]))
          .catch(err => reject(err));
      });
    });
  }

  static generateHash(password) {
    const saltRounds = 10;

    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (!err) {
            resolve(hash);
          } else {
            reject(err);
          }
        });
      });
    });
  }

  static comparePassword(params) {
    const { username, password } = params;

    return new Promise((resolve, reject) => {
      User.findByUsername(username)
        .then(user => {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res == true) {
              resolve(user);
            } else if (res == false) {
              resolve(false);
            } else {
              reject(Error('could not compare passwords'));
            }
          });
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = User;
