const db = require('../db/db')
const {Sequelize, DataTypes, Model} = require ('sequelize')

class User extends Model{}

User.init({
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    email:{
        type: DataTypes.STRING
    }
}, {sequelize:db})

module.exports = User