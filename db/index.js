"use strict";

const db = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME,
  }
});

db.schema.hasTable('users').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('users', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.text('username').notNullable().unique();
        t.text('email').notNullable().unique();
        t.text('password').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
      });
  }
});

db.schema.hasTable('tokens').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('tokens', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.uuid('user_id').references('id').inTable('users').unique();
        t.uuid('token');
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
      });
  }
});

db.schema.hasTable('games').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('games', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.integer('igdb_id');
        t.text('igdb_name');
        t.integer('igdb_first_release_date');
        t.text('igdb_cover_url');
        t.text('igdb_summary');
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
    });
  }
});

db.schema.hasTable('user_games').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('user_games', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.uuid('user_id').references('id').inTable('users').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
    });
  }
});

db.schema.hasTable('tags').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('tags', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.text('tag_name').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
    });
  }
});

db.schema.hasTable('user_game_tags').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('user_game_tags', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.uuid('user_id').references('id').inTable('users').notNullable();
        t.uuid('game_id').references('id').inTable('games').notNullable();
        t.text('tag_name').notNullable();
        t.integer('tag_hits').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
    });
  }
});

module.exports = db;
