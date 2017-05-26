"use strict"

const db = require('diskdb');
db.connect('./BDD/', ['clerverbotAccount', 'cleverbotDiscussion']);

const key1 = db.clerverbotAccount.find()[0].apiKey
const key2 = db.clerverbotAccount.find()[1].apiKey


const  Cleverbot = require('cleverbot-node');
const cleverbot1 = {bot: new Cleverbot, name:"José"};
const cleverbot2 = {bot: new Cleverbot, name:"Alain"};
let whoWrite = cleverbot1;

cleverbot1.bot.configure({botapi: key1});
cleverbot2.bot.configure({botapi: key2});

function cleverbotWrite(message)
{
    console.log(whoWrite.name, ": ", message)
    db.cleverbotDiscussion.save({"botName": whoWrite.name, "message": message});

    whoWrite.bot.write(message, function (response)
    {
        whoWrite = (whoWrite == cleverbot2) ? cleverbot1 : cleverbot2
        cleverbotWrite(response.message)
    })
}

cleverbotWrite("Hey !")