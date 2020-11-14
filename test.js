const inquirer = require('inquirer');
require('dotenv').config()
const mongoose = require('mongoose')
const Statement = require('./models/statement')

mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

async function inq(){
    const result = await inquirer.prompt([
        {
            name:"option",
            type: "list",
            message:"What do you want?",
            choices:['dotenv', 'find']
        }
    ])

    if (result.option === 'dotenv'){
        console.log(process.env.DATABASE_URL);
    } else if (result.dotenv === 'find'){
        const found = await Statement.find()
    }

}

inq()