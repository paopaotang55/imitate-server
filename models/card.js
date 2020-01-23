const Sequelize = require("sequelize");
const sequelize = require("../config/index");

const Cards = sequelize.define("cards", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cardName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  container_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

Cards.sync().then(() => console.log("Cards table created"));

module.exports = Cards;
