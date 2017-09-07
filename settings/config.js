'use strict';

const DATABASE_URL =
  process.env.DATABASE_URL  ||
  global.DATABASE_URL       ||
  'mongodb://localhost/restaurants-app';

const PORT = process.env.PORT || 8000;

module.exports = {
  DATABASE_URL : DATABASE_URL,
  PORT : PORT
};