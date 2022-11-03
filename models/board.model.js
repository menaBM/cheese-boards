const db = require('../db/db')
const {Sequelize, DataTypes, Model} = require ('sequelize')

class Board extends Model{}

Board.init({
    type: {
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.STRING
    },
    rating:{
        type: DataTypes.INTEGER
    }
}, {sequelize:db})

module.exports = Board