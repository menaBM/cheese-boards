const Board = require("./board.model")
const Cheese = require("./cheese.model")
const User = require("./user.model")

User.hasMany(Board)
Board.belongsTo(User)

Board.belongsToMany(Cheese, {through: "Cheese_Board"})
Cheese.belongsToMany(Board, {through: "Cheese_Board"})

module.exports = {User, Board,  Cheese}