/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const models = require('../../../models');
const queries = require('../index');

class User {
  #queue;

  constructor(queue, data = {}) {
    this.#queue = queue;

    this.discordId = data.discordId;
    this.isOnServer = data.isOnServer;
    this.battleNetId = data.battleNetId;
    this.battleNetUsername = data.battleNetUsername;
    this.xp = data.xp;
    this.level = data.level;
    this.warns = data.warns;
    this.messages = data.messages;
    this.vocal = data.vocal;
    this.team = data.team;
    this.isAdmin = data.isAdmin;
    this.isMute = data.isMute;
    this.muteDate = data.muteDate;
    this.isBanned = data.isBanned;
    this.createdAt = data.createdAt;
  }

  setXp(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function setXp needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['xp', value],
    });
  }

  addXp(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function addXp needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['xp', this.xp + value],
    });
  }

  setLevel(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function setLevel needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['level', value],
    });
  }

  addLevel(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function addLevel needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['level', this.level + value],
    });
  }

  setMessage(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function setMessage needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['message', value],
    });
  }

  addMessage(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function addMessage needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['message', this.messages + value],
    });
  }

  setWarns(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function setWarns needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['warns', value],
    });
  }

  addWarns(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function addWarns needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['warns', this.warns + value],
    });
  }

  delWarns(value) {
    if (!value || Number.isNaN(value) || !parseInt(value, 10)) throw new Error('Function delWarns needs a number');
    return this.#queue.addToQueue({
      value: _edit.bind(this),
      args: ['warns', this.warns - value],
    });
  }

  edit(key, value) {
    if (!key) throw new Error('Function edit needs a key');
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

async function _edit(key, value) {
  return new Promise((resolve, error) => {
    models.User.update({
      [key]: value,
    }, {
      where: {
        discordId: this.discordId,
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

async function _delete() {
  return new Promise((resolve, error) => {
    models.User.destroy({
      where: {
        discordId: this.discordId,
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

module.exports = User;
