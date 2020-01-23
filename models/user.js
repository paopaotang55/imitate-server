const Sequelize = require("sequelize");
const sequelize = require("../config/index");

const Users = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING(100),
    unique: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING(100),
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Users.sync().then(() => console.log("Users table created"));

module.exports = Users;
