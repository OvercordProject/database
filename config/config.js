const debug = require('debug')('overcord:sequelize');
const path = require('path');

const db = {
  dialect: 'sqlite',
  storage: path.resolve(process.env.DB_PATH, process.env.DB_FILE),
  logging: false,
};

module.exports = {
  development: {
    ...db,
    logging: debug,
  },
  test: db,
  production: db,
};
