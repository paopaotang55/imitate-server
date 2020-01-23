const Sequelize = require("sequelize");
const sequelize = require("../config/index");

const Boards = sequelize.define("boards", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  boardName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

Boards.sync().then(() => console.log("Boards table created"));

module.exports = Boards;
