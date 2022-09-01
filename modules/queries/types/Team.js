/* eslint-disable consistent-return */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */
const models = require('../../../models');

class Team {
  #queue;

  constructor(queue, data = {}) {
    this.#queue = queue;

    this.id = data.id;
    this.name = data.name;
    this.leaderId = data.leaderId;
    this.members = _toJSON(data.members);
    this.history = _toJSON(data.history);
    this.wins = data.wins;
    this.losses = data.losses;
    this.sr = data.sr;
    this.img = data.img;
    this.createdAt = data.createdAt;
  }

  /**
   * Add a member in team
   * Allowed perms:
   * - 1 -> Recruit, base perms
   * - 2 -> Assistant, can edit team, add user to the team, ban users
  */
  addMember(userId, data = {}) {
    if (!userId) throw new Error('addMember function needs an userId');
    if (!data.perms || data.perms !== 1 || data.perms !== 2) throw new Error('the perms value must be 1 or 2');
    if (data.role
      && (data.role !== 'Healer'
      || data.role !== 'Dps'
      || data.role !== 'Tank')) throw new Error('the perms value must be 1 or 2');
    return this.#queue.addToQueue({
      value: _addMember.bind(this),
      args: [userId, data.perms],
    });
  }

  removeMember(userId) {
    if (!userId) throw new Error('removeMember function needs an userId');
    return this.#queue.addToQueue({
      value: _removeMember.bind(this),
      args: [userId],
    });
  }

  edit(key, value) {
    if (!key) throw new Error('edit function needs an key');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: [key, value],
    });
  }

  delete() {
    return this.#queue.addToQueue({
      value: _delete.bind(this),
      args: [],
    });
  }
}

function _toJSON(data) {
  return JSON.parse(data);
}

function _toString(data) {
  return JSON.stringify(data);
}

function querySelector(value) {
  return value.includes('-') ? { id: value } : { name: value };
}

function searchUser(toSearch, members) {
  for (let i = 0; i < members.length; i++) {
    if (members[i].id === toSearch) {
      members[i].pos = i;
      return members[i];
    }
  }
  return null;
}

async function _edit(key, value) {
  return new Promise((resolve, error) => {
    models.Team.update({
      [key]: value,
    }, {
      where: {
        id: this.id,
      },
    })
    .then(([edited]) => {
      if (edited) {
        this[key] = value;
        return resolve(this);
      }
      return error('An error occured');
    })
    .catch((e) => error(e));
  });
}

async function _addMember(userId, data) {
  return new Promise((resolve, error) => {
    if (searchUser(userId, this.members) || userId === this.leaderId) {
      return error('Member already in team');
    }
    if (this.members.length === 7) return error('Team is full');
    const toPush = { id: userId, perms: data.perms, role: data.role };
    this.members.push(toPush);
    models.Team.update({
      members: _toString(this.members),
    }, {
      where: {
        id: this.id,
      },
    })
      .then(([edited]) => {
        if (edited) {
          return resolve(this);
        }
        return error('An error occured');
      })
      .catch((e) => error(e));
  });
}

async function _removeMember(userId) {
  return new Promise((resolve, error) => {
    if (this.members.length < 1) return error('Team is empty');
    const user = searchUser(userId, this.members);
    if (!user) return error('This user is not a member of the team');
    if (userId === this.leaderId) return error('Can\'t remove leader from the team');

    this.members.splice(user.pos, 1);
    models.Team.update({
      members: _toString(this.members),
    }, {
      where: {
        id: this.id,
      },
    }).then(([edited]) => {
      if (edited) {
        return resolve(this);
      }
      error('An error occured');
    });
  })
  .catch((e) => error(e));
}

async function _delete() {
  return new Promise((resolve, error) => {
    models.Team.destroy({
      where: {
        id: this.id,
      },
    })
      .then((deleted) => {
        if (deleted) {
          Object.keys(this).forEach((e) => {
            delete this[e];
          });
          this.deleted = true;
          return resolve(true);
        }
        return error('An error occured');
      })
      .catch((e) => error(e));
  });
}

module.exports = Team;
