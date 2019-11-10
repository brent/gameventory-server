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
        t.uuid('user_id').references('id').inTable('users').unique().notNullable();
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
        t.integer('igdb_id').unique();
        t.text('igdb_name');
        t.integer('igdb_first_release_date');
        t.text('igdb_cover_img_id');
        t.text('igdb_summary');
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
        t.index(['igdb_id']);
    });
  }
});

db.schema.hasTable('users_games').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('users_games', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.uuid('user_id').references('id').inTable('users').notNullable();
        t.uuid('game_id').references('id').inTable('games').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
        t.index(['user_id', 'game_id']);
        t.unique(['user_id', 'game_id']);
    });
  }
});

db.schema.hasTable('tags').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('tags', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.text('name').unique().notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
        t.index('name');
    });
  }
});

db.schema.hasTable('users_games_tags').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('users_games_tags', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.uuid('user_id').references('id').inTable('users').notNullable();
        t.uuid('game_id').references('id').inTable('games').notNullable();
        t.uuid('tag_id').references('id').inTable('tags').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
        t.index(['user_id', 'game_id', 'tag_id']);
        t.unique(['user_id', 'game_id', 'tag_id']);
    });
  }
});

db.schema.hasTable('lists').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('lists', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.text('name').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
        t.index('name');
    });
  }
});

db.schema.hasTable('users_lists').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('users_lists', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.uuid('list_id').references('id').inTable('lists').notNullable();
        t.uuid('user_id').references('id').inTable('users').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
        t.index(['user_id', 'list_id']);
        t.unique(['user_id', 'list_id']);
    });
  }
});

db.schema.hasTable('users_lists_games').then((exists) => {
  if (!exists) {
    return db.schema
      .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .createTable('users_lists_games', t => {
        t.uuid('id').notNullable().primary().defaultTo(db.raw("uuid_generate_v4()"));
        t.uuid('user_id').references('id').inTable('users').notNullable();
        t.uuid('game_id').references('id').inTable('games').notNullable();
        t.uuid('list_id').references('id').inTable('lists').notNullable();
        t.timestamp('created_at').defaultTo(db.fn.now());
        t.timestamp('modified_at').defaultTo(db.fn.now());
        t.index(['user_id', 'game_id', 'list_id']);
        t.unique(['user_id', 'game_id', 'list_id']);
    });
  }
});

module.exports = db;
