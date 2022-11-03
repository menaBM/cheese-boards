const {User, Board,  Cheese} = require('../models')
const db = require('./db')

async function seed(){
    await db.sync({
        force:true
        })
}

module.exports = seed
