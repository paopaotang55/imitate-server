const Sequelize = require('sequelize')
const sequelize = require('../config/index')

const Containers = sequelize.define('containers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    containerName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    board_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
})

Containers.sync().then(() => console.log('Containers table created'))

module.exports = Containers