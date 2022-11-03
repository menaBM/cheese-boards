const db = require('../db/db')
const {Sequelize, DataTypes, Model} = require ('sequelize')

class Cheese extends Model{}

Cheese.init({
    title: {
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.STRING
    }
}, {sequelize:db})

module.exports = Cheese