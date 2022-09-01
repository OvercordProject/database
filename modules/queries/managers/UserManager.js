/* eslint-disable no-new-object */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const Sequelize = require('sequelize');

const User = require('../types/User');
const models = require('../../../models');

class UserManager {
  constructor(dbQueue) {
    this.dbQueue = dbQueue;
  }

  fetch(discordId) {
    if (!discordId) throw new Error('fetch function is missing parameters!');
    return this.dbQueue.addToQueue({
      value: _fetch.bind(this),
      args: [discordId],
    });
  }

  leaderboard(data = {}) {
    if (data.limit && !parseInt(data.limit, 10)) throw new Error('Leaderboard function parameter obj.limit needs to be a number!');
    if (data.limit) data.limit = parseInt(data.limit, 10);
    if (data.filter && !(data.filter instanceof Function)) throw new Error('Leaderboard function parameter obj.filter needs to be a function!');
    if (!data.filter) data.filter = (x) => x;
    return this.dbQueue.addToQueue({
      value: _leaderboard.bind(this),
      args: [data],
    });
  }
}

async function _fetch(discordId) {
  return new Promise((resolve, error) => {
    models.User.findOne({
      where: {
        discordId,
      },
    }).then((user) => {
      if (user) {
        return resolve(new User(this.dbQueue, user.dataValues));
      }
      return resolve(null);
    }).catch((e) => error(e));
  });
}

async function _leaderboard(data) {
  return new Promise((resolve, error) => {
    if (data.search) {
      models.User.findAll({
        where: {
          xp: {
            [Sequelize.Op.gt]: 0,
          },
          level: {
            [Sequelize.Op.gt]: 0,
          },
        },
      }).then((users) => {
        const output = users.map((l) => new Object({
          discordId: l.discordId,
          level: l.level,
          xp: l.xp,
        })).sort((a, b) => {
          if (parseInt(b.level, 10) > parseInt(a.level, 10)) return 1;
          if (parseInt(b.level, 10) === parseInt(a.level, 10)
            && parseInt(b.xp, 10) > parseInt(a.xp, 10)) return 1;
          return -1;
        }).filter(data.filter).slice(0, data.limit)
          .findIndex((l) => l.userid === data.search);
        if (output === -1) return resolve('Not found');
        return resolve(output + 1);
      })
        .catch((e) => error(e));
    }
    models.User.findAll({
      where: {
        xp: {
          [Sequelize.Op.gt]: 0,
        },
        level: {
          [Sequelize.Op.gt]: 0,
        },
      },
    }).then((users) => {
      const output = users.map((l) => new Object({
        userid: l.discordId,
        level: l.level,
        xp: l.xp,
      })).sort((a, b) => {
        if (parseInt(b.level, 10) > parseInt(a.level, 10)) return 1;
        if (parseInt(b.level, 10) === parseInt(a.level, 10)
          && parseInt(b.xp, 10) > parseInt(a.xp, 10)) return 1;
        return -1;
      }).filter(data.filter).slice(0, data.limit);
      return resolve(output);
    })
      .catch((e) => error(e));
  });
}

module.exports = UserManager;
