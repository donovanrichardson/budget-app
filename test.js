const inquirer = require('inquirer');
require('dotenv').config()

async function inq(){
    const result = await inquirer.prompt([
        {
            name:"dotenv",
            type: "list",
            message:"What do you want?",
            choices:['dotenv']
        }
    ])

    if (result.dotenv === 'dotenv'){
        console.log(process.env);
    }

}

inq()