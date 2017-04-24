"use strict"

const db = require('diskdb');
db.connect('./', ['wordpressAccountDatabase']);

const Nightmare = require('nightmare');
const nightmare = Nightmare({
    /*openDevTools: {
     mode: 'detach'
     },*/
    show: true });

// Récupère le premier compte stocké en BDD
const account = db.wordpressAccountDatabase.find()[0]

// Si il existe un compte en BDD...
if (account)
{
    nightmare
        .goto("https://fr.wordpress.com")
        .wait("li.menu-login a.login-link")
        .click("li.menu-login a.login-link")
        .wait("input#user_login")
        .type("input#user_login", account.username)
        .type("input#user_pass", account.password)
        .click("#wp-submit")
        .wait(".masterbar__publish a.masterbar__item-new")
        .click(".masterbar__publish a.masterbar__item-new")
        .wait(".editor__header .editor__title textarea")
        .evaluate(()=>
            {
            }
        )
        .then((result)=>
        {
        })
    // .end()
}

// ... sinon on précise qu'il n'y a pas de comptes existant enregistrés
else
{
    console.log("Pas de compte en base de données")
}

