const inquirer = require('inquirer');
require('dotenv').config()
const mongoose = require('mongoose')
const {Statement} = require('./models/statement')
const {DateTime} = require('luxon')

mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

async function budget(){
    const budg = await Statement.create({
        owe: 0,
        expend: 0,
        date: DateTime.local()
    })
    console.log(budg);
    await budg.deleteOne()
}

async function inq(){
    const result = await inquirer.prompt([
        {
            name:"option",
            type: "list",
            message:"What do you owe?",
            choices:['budget', 'find']
        }
    ])

    if (result.option === 'budget'){
        await budget()
    } else if (result.dotenv === 'find'){
        const found = await Statement.find()
    }

}

inq()