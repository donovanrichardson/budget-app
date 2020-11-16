const inquirer = require('inquirer');
require('dotenv').config()
const mongoose = require('mongoose')
const {Statement} = require('./models/statement')
const {DateTime} = require('luxon')
const dailyBudget = 12.80
const interest = 5

mongoose.connect('mongodb://localhost/budget', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

async function promptForNumber(prompt){
    const result = await inquirer.prompt([
        {
            name:'result',
            type:'number',
            message:prompt
        }
    ])
    if(isNaN(result.result)){
        return promptForNumber(prompt)
    }else{
        return result.result
    }
}

async function addFirst(){
    console.log("Adding your first statement!");
    const year = await promptForNumber('What was the year?')
    const month = await promptForNumber('What was the month?')
    const date = await promptForNumber('What was the date?')
    const hour = await promptForNumber('What was the hour (24-hour system)?')
    const owe = await promptForNumber('What did you owe?')
    const exp = await promptForNumber('What were your expenditures?')
    const budg = await Statement.create({
        owe: owe,
        expend: exp,
        date: DateTime.local(year, month, date, hour)
    })
    console.log(budg);
}

function getBalance(owe, expend, todayBudget, theInterest) {
    const total = owe + expend - todayBudget;
    let totalInt;
    if (total > 0) {
      totalInt = total * (theInterest / 100);
      return {
        balance: total + totalInt,
        interest: totalInt,
      };
    } else {
      return {
        balance: 0,
        interest: 0,
      };
    }
  }

async function addBudget(date, stmt){
    console.log(`for ${date.toLocaleString(DateTime.DATE_HUGE)}`)
    const exp = await promptForNumber('What were your expenditures?')
    //the pre-owe will be yesterday's owe + yesterday's expenditures - yesterday's budget
     const preOwe = stmt.owe + stmt.expend - dailyBudget;
     const newOwe = preOwe < 0 ? 0 : preOwe
     const newBalance = getBalance(stmt.balance, exp,dailyBudget,interest)
     const budg = await Statement.create({
        owe: stmt.balance,
        expend: exp,
        date: date,
        balance:newBalance.balance
    })
    // console.log(budg);
    console.log("owe:",budg.owe.toFixed(2))
    console.log("expenditures:",budg.expend.toFixed(2))
    console.log("budget:",dailyBudget.toFixed(2))
    console.log("interest:",newBalance.interest.toFixed(2))
    console.log("interest percentage:",((newBalance.interest * 100)/dailyBudget).toFixed(1))
    console.log("balance:",budg.balance.toFixed(2))

}

async function addNew(){
    while(true){
        const now = DateTime.local()
        const theNew = await Statement.findOne().sort({date:-1});
        const newDate = DateTime.fromISO(theNew.date.toISOString())
        if (newDate > now.startOf('day')){
            console.log('done for today');
            return;
        }else{
            dayAgo = now.minus({days:1})
            if (newDate > dayAgo.startOf('day')){
                await addBudget(now, theNew)
            }else{
                await addBudget(newDate.plus({days:1}),theNew)
            }
        }
    }
}

async function budget(){
    const found = await Statement.find();
    // const budg = await Statement.create({
    //     owe: 54.39,
    //     expend: 0,
    //     date: DateTime.local(2020, 11, 2,20)
    // })
    if (found.length === 0){
        await addFirst()
    }else{
        await addNew()
    }

    // budg.save()
    // console.log(budg);
    // await budg.deleteOne()
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
    } else if (result.option === 'find'){
        // const found = await Statement.findOne().exec()
        // console.log(DateTime.fromISO(found.date.toISOString()));
        console.log(DateTime.local().startOf('day'))
    }

}

inq()