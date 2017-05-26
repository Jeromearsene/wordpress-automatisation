"use strict"

const db = require('diskdb');
db.connect('./BDD/', ['wordpressAccountDatabase']);

const Nightmare = require('nightmare');
const nightmare = Nightmare({
    openDevTools: {
        mode: 'detach'
    },
    show: true });

let mail
let username
const password = "Passw0rd"
const tempmailWebsite = "https://tempail.com/fr/"


nightmare
    .goto(tempmailWebsite)
    .wait(1000)
    // Récupère l'adresse mail et génère un username à partir de celle-ci
    .evaluate(()=>
        {
            mail = document.getElementById('eposta_adres').value
            username = mail.split("@")[0]
            return {"mail": mail, "username": username}
        }
    )
    .then((result)=> {
        mail = result.mail
        username = result.username

        // Va créer un Wordpress
        return nightmare.goto("https://wordpress.com/start/website/design-type/fr?ref=homepage")
            .click(".design-type__choice-link")
            .wait(3000)
            .click(".card.theme.is-actionable a.theme__active-focus")
            .type("#search-component-1", username)
            .wait(5000)
            .click(".domain-suggestion")
            .wait(2000)
            .click(".plan-features__actions-buttons button.is-free-plan")
            .wait(1000)
            .type("input#email", mail)
            .type("input#password", password)
            .click(".logged-out-form__footer button")
            .wait(function() {
                const button = document.querySelector('button.email-confirmation__button');
                return button && button.textContent === 'Continuer';
            }, 1000)
            .click("button.email-confirmation__button")
            .wait(3000)

            .evaluate(()=> {
                return document.querySelector("#wp-admin-bar-blog-info a.ab-item .ab-site-description").textContent
            })
            .then((websiteName)=> {
                // Sauvegarde les données du compte Wordpress créé en BDD
                db.wordpressAccountDatabase.save({"mail": mail, "siteName": websiteName, "password": password, "username": username});

                // Va checker le mail de confirmation de Wordpress
                return nightmare
                    .goto(tempmailWebsite)
                    .wait("ul.mailler li.mail")
                    .evaluate(()=>{
                        // Retourne le lien de confirmation
                        return document.querySelector("ul.mailler li.mail a").href
                    })
                    .then((url)=>{
                        return nightmare
                            .goto(url)
                            .evaluate(()=>
                            {
                                return document.querySelector("#iframe").contentDocument.querySelector("table .content-mc-region p.btn-calltoaction a").href
                            })
                            .then((result)=>{
                                return nightmare
                                    .goto(result)
                                    .evaluate(()=>{
                                    })
                                    .then((url)=>
                                    {

                                    })
                                    .end()
                            })
                    })
            })

    })