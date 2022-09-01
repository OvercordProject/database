/* eslint-disable no-param-reassign */
/* eslint-disable no-new-object */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const Sequelize = require('sequelize');

const Team = require('../types/Team');
const models = require('../../../models');

class TeamManager {
  constructor(dbQueue) {
    this.dbQueue = dbQueue;
  }

  create(userId, data = {}) {
    if (!userId || !data.name || !data.image) throw new Error('create function is missing parameters');
    return this.dbQueue.addToQueue({
      value: _create.bind(this),
      args: [userId, data],
    });
  }

  fetch(toSearch) {
    return this.dbQueue.addToQueue({
      value: _fetch.bind(this),
      args: [toSearch],
    });
  }

  leaderboard(data = {}) {
    if (data.limit && !parseInt(data.limit, 10)) throw new Error('leaderboard function parameter obj.limit needs to be a number!');
    if (data.limit) data.limit = parseInt(data.limit, 10);
    if (data.filter && !(data.filter instanceof Function)) throw new Error('Leaderboard function parameter obj.filter needs to be a function!');
    if (!data.filter) data.filter = (x) => x;
    return this.dbQueue.addToQueue({
      value: _leaderboard.bind(this),
      args: [data],
    });
  }
}

async function _create(userId, data) {
  return new Promise((resolve, error) => {
    models.Team.create({
      name: data.name,
      leaderId: userId,
      img: data.image,
    })
      .then((team) => {
        resolve(new Team(this.dbQueue, team.dataValues));
      })
      .catch((e) => {
        if (e.name === 'SequelizeUniqueConstraintError') {
          error('Team already exists');
        }
        error(e);
      });
  });
}

async function _fetch(toSearch) {
  if (!toSearch) throw new Error('fetch function is missing parameters!');
  return new Promise((resolve, error) => {
    let query;
    if (toSearch.includes('-')) {
      query = {
        id: toSearch,
      };
    } else {
      query = {
        name: toSearch,
      };
    }
    models.Team.findOne({
      where: query,
    })
      .then((team) => {
        if (team) {
          return resolve(new Team(this.dbQueue, team.dataValues));
        }
        return resolve(null);
      })
      .catch((e) => error(e));
  });
}

async function _leaderboard(data) {
  return new Promise((resolve, error) => {
    if (data.search) {
      models.Team.findAll({
        where: {
          sr: {
            [Sequelize.Op.gt]: 0,
          },
        },
      }).then((teams) => {
        const output = teams.map((l) => new Object({
          name: l.name,
          sr: l.sr,
        })).sort((a, b) => {
          if (parseInt(b.sr, 10) > parseInt(a.sr, 10)) return 1;
          if (parseInt(b.sr, 10) === parseInt(a.sr, 10)) return 1;
          return -1;
        }).filter(data.filter).slice(0, data.limit)
          .findIndex((l) => l.name === data.search);

        if (output === -1) return resolve('Not found');
        return resolve(output + 1);
      })
        .catch((e) => error(e));
    }

    models.Team.findAll({
      where: {
        sr: {
          [Sequelize.Op.gt]: 0,
        },
      },
    }).then((teams) => {
      const output = teams.map((l) => new Object({
        name: l.name,
        sr: l.sr,
      })).sort((a, b) => {
        if (parseInt(b.sr, 10) > parseInt(a.sr, 10)) return 1;
        if (parseInt(b.sr, 10) === parseInt(a.sr, 10)) return 1;
        return -1;
      }).filter(data.filter).slice(0, data.limit);

      return resolve(output);
    })
      .catch((e) => error(e));
  });
}

module.exports = TeamManager;
