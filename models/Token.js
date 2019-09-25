"use strict";

const db = require('../db');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const TABLE_NAME = 'tokens';

class Token {
  static saveTokenForUser(userID) {
    const token = Token.generateRefreshToken();

    return new Promise((resolve, reject) => {
      db
        .returning('token')
        .insert({
          user_id: userID,
          token: token,
        })
        .into(TABLE_NAME)
        .then(rows => resolve(rows[0]))
        .catch(err => reject(err))
    });
  }

  static findTokenForUser(userID) {
    return new Promise((resolve, reject) => {
        db
          .first()
          .from(TABLE_NAME)
          .where('user_id', '=', userID)
          .then(rows => resolve(rows['token']))
          .catch(err => reject(err));
    });
  }

  // TODO: Refactor
  // a token should be generateable with just
  // a user id as well
  static generateAccessToken(user) {
    const params = {
      user_id: user.id,
      username: user.username,
    };

    const token = jwt.sign(params, JWT_SECRET, { expiresIn: 300 });

    return token;
  }

  static decode(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }

  static updateRefreshToken(userID, refreshToken) {
    return new Promise((resolve, reject) => {
      const newToken = Token.generateRefreshToken();
      db
        .where({
          'user_id': userID,
          'token': refreshToken
        })
        .update('token', newToken)
        .from(TABLE_NAME)
        .then(() => resolve(newToken))
        .catch(err => reject(err))
    });
  }

  static generateRefreshToken() {
    return uuidv4();
  }
}

module.exports = Token;
