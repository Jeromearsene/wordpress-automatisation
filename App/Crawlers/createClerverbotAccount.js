"use strict"

const db = require('diskdb');
db.connect('./App/BDD/', ['clerverbotAccount']);

const Nightmare = require('nightmare');
const nightmare = Nightmare({
 /*   openDevTools: {
        mode: 'detach'
    },*/
    show: false });

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
        })
    .then((result)=>
    {
        mail = result.mail
        username = result.username

        return nightmare
            .goto("https://www.cleverbot.com/api/product/api-5k-free-trial/")
            .click(".single_add_to_cart_button.button.alt")
            .wait(3000)
            .type("#billing_first_name", "michel")
            .type("#billing_last_name", "denis")
            .type("#billing_email", mail)
            .type("#billing_phone", "0612321232")
            .type("#billing_address_1", "12 avenue des minimes")
            .type("#billing_postcode", "31200")
            .type("#billing_city", "Toulouse")
            .type("#account_password", password)
            .click("#terms")
            .click("#place_order")

            // Va checker le mail de confirmation
            .goto(tempmailWebsite)
            .wait("ul.mailler li.mail")
            .evaluate(()=>{
                const allMails = document.querySelectorAll('ul.mailler li.mail .baslik');
                for (let i=0; i< allMails.length; i++)
                {
                    if(allMails[i].textContent === 'Cleverbot API - verify your email address')
                    {
                        return allMails[i].parentNode.href
                    }
                }
            })
            .then((url)=>
            {
                return nightmare
                    .goto(url)
                    .evaluate(()=>
                    {
                        return document.querySelector("#iframe").contentDocument.querySelector("body p a").href
                    })
                    .then((result)=>{
                        return nightmare
                            .goto(result)
                            .type("#username", mail)
                            .type("#password", password)
                            .click("input.woocommerce-Button.button")
                            .wait(3000)
                            .evaluate(()=>{
                                return document.querySelectorAll(".woocommerce-MyAccount-content p")[2].textContent
                            })
                            .then((text)=>
                            {
                                text = text.split("API Key: ").pop().split("Total")[0];
                                db.clerverbotAccount.save({"mail": mail, "apiKey": text, "password": password});
                            })
                            .end()
                    })
            })
    })