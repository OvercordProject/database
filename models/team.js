const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'Team',
    {
      id: {
        type: DataTypes.UUID, unique: true, defaultValue: uuidv4(), primaryKey: true,
      },
      name: { type: DataTypes.STRING, unique: true },
      leaderId: { type: DataTypes.STRING },
      members: { type: DataTypes.STRING, defaultValue: '[]' },
      history: { type: DataTypes.STRING, defaultValue: '[]' },
      wins: { type: DataTypes.INTEGER, defaultValue: 0 },
      losses: { type: DataTypes.INTEGER, defaultValue: 0 },
      sr: { type: DataTypes.INTEGER },
      img: { type: DataTypes.STRING },
    },
    {},
  );
  return Team;
};
