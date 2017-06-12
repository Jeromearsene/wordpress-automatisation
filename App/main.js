"use strict"

const cp = require('child_process')
const db = require('diskdb');

db.connect(__dirname + '/BDD/', ['wordpressAccountDatabase', 'clerverbotAccount', 'cleverbotDiscussion']);

const createSomeWordpressAccount = (numberOfWordpress, counter)=>
{
    counter = counter || 0
    const child = cp.fork(__dirname + '/Crawlers/createWordpress.js')

    if(counter < numberOfWordpress && numberOfWordpress > 0)
    {
        counter ++
        console.log(counter + "/" + numberOfWordpress)
        child.on('disconnect', () =>
        {
            console.log("Process finished")
            createSomeWordpressAccount(numberOfWordpress, counter)
        })
    }

    else
        console.log("All Wordpress accounts are created !")
}

createSomeWordpressAccount(5 - db.wordpressAccountDatabase.find().length)





const createSomeClerverbotAccount = (numberOfClerverbot, counter) =>
{
    counter = counter || 0
    const child = cp.fork(__dirname + '/Crawlers/createClerverbotAccount.js')

    if(counter < numberOfClerverbot && numberOfClerverbot > 0)
    {
        counter ++
        console.log(counter + "/" + numberOfClerverbot)
        child.on('disconnect', () =>
        {
            console.log("Process finished")
            createSomeWordpressAccount(numberOfClerverbot, counter)
        })
    }

    else
        console.log("All Clerverbot accounts are created !")
}

createSomeClerverbotAccount(2 - db.clerverbotAccount.find().length)





const createSomeDiscussion = (numberOfDiscussion, counter) =>
{
    counter = counter || 0
    const child = cp.fork(__dirname + '/createDiscussion.js')

    if(counter < numberOfDiscussion && numberOfDiscussion > 0)
    {
        counter ++
        console.log(counter + "/" + numberOfDiscussion)
        child.on('disconnect', () =>
        {
            console.log("Process finished")
            createSomeDiscussion(numberOfDiscussion, counter)
        })
    }

    else
        console.log("All discussions accounts are created !")
}

createSomeDiscussion(3 - db.cleverbotDiscussion.find().length)