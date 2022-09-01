const Queuing = require('./queue');
const UserManager = require('./managers/UserManager');
const TeamManager = require('./managers/TeamManger');

const dbQueue = new Queuing();

class Queries {
  constructor() {
    this.user = new UserManager(dbQueue);
    this.team = new TeamManager(dbQueue);
  }
}

module.exports = new Queries();
