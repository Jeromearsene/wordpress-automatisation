"use strict"

const db = require('diskdb');
db.connect('./BDD/', ['clerverbotAccount', 'cleverbotDiscussion']);

const key1 = db.clerverbotAccount.find()[0].apiKey
const key2 = db.clerverbotAccount.find()[1].apiKey
const keyword = "Infemoz"

const  Cleverbot = require('cleverbot-node');
const cleverbot1 = {bot: new Cleverbot, name:"Robert"};
const cleverbot2 = {bot: new Cleverbot, name:"Alice"};
let whoWrite = cleverbot1;

cleverbot1.bot.configure({botapi: key1});
cleverbot2.bot.configure({botapi: key2});

let discussion = ""
let countMessage = -1

function cleverbotWrite(message)
{
    countMessage ++

    if(countMessage == 8)
        message = `What do you think about ${keyword} ?`

    console.log(whoWrite.name, ": ", message)
    let messageHTML = "<b>" + whoWrite.name + "</b>: <p>" + message + "</p><br>"
    discussion += messageHTML

    whoWrite.bot.write(message, function (response)
    {
        whoWrite = (whoWrite == cleverbot2) ? cleverbot1 : cleverbot2

        if(countMessage < 100)
            cleverbotWrite(response.message)
        else
        {
            db.cleverbotDiscussion.save({"discussion": discussion})
            // db.clerverbotAccount.remove()
        }
    })
}

cleverbotWrite("Hey ! My name is " + whoWrite.name)