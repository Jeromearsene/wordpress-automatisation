"use strict"

const db = require('diskdb');
db.connect('./App/BDD/', ['wordpressAccountDatabase', 'cleverbotDiscussion']);

const Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);

const nightmare = Nightmare({
    openDevTools: {
     mode: 'detach'
     },
    show: true });


// Récupère le premier compte stocké en BDD
const account = db.wordpressAccountDatabase.find()[0]
const discussion = db.cleverbotDiscussion.find()[0]

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
        .wait(".editor__header .editor-title textarea")
        .type(".editor__header .editor-title textarea", "Test")
        .wait(4000)
        .click(".segmented-control__item:nth-child(2) a")
        .insert("#tinymce-1", discussion.discussion)
        .click(".editor-ground-control__publish-combo button.editor-publish-button")
        .evaluate(()=>
        {
        })
        .then((result)=>
        {
            db.cleverbotDiscussion.remove({_id : discussion._id});
        })
    .end()
}

// ... sinon on précise qu'il n'y a pas de comptes existant enregistrés
else
{
    console.log("Pas de compte en base de données")
}

