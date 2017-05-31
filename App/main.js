"use strict"

const cp = require('child_process')
const db = require('diskdb');
db.connect('./App/BDD/', ['wordpressAccountDatabase']);

let counter = 0
const numberOfCount = 20
const numberOfCountInDatabase = db.wordpressAccountDatabase.find().length

const createSomeWordpressAccount = (numberOfWordpress)=>
{
    const child = cp.fork(__dirname + '/createWordpress.js')

    if(counter < numberOfWordpress)
    {
        counter ++
        console.log(counter + "/" + numberOfWordpress)
        child.on('disconnect', () =>
        {
            console.log("Process finished")
            createSomeWordpressAccount(numberOfWordpress)
        })
    }

    else
        console.log("All Wordpress created !")
}

createSomeWordpressAccount(numberOfCount - numberOfCountInDatabase)