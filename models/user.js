module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      discordId: { type: DataTypes.STRING, unique: true },
      isOnServer: { type: DataTypes.BOOLEAN, defaultValue: false },
      battleNetId: { type: DataTypes.STRING, unique: true },
      battleNetUsername: { type: DataTypes.STRING, unique: true },
      xp: { type: DataTypes.INTEGER, defaultValue: 0 },
      level: { type: DataTypes.INTEGER, defaultValue: 1 },
      warns: { type: DataTypes.INTEGER, defaultValue: 0 },
      messages: { type: DataTypes.INTEGER, defaultValue: 0 },
      vocal: { type: DataTypes.INTEGER, defaultValue: 0 },
      team: { type: DataTypes.STRING },
      isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
      isMute: { type: DataTypes.BOOLEAN, defaultValue: false },
      muteDate: { type: DataTypes.DATE },
      isBanned: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {},
  );
  return User;
};
