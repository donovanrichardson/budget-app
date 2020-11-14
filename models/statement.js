const mongoose = require('mongoose')

const statementSchema = new mongoose.Schema({
    owe: Number,
    expend: Number,
    date: Date
})

const Statement = mongoose.model('Statement', statementSchema)

module.exports = {Statement}