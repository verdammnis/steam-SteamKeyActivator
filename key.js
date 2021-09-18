const steamCommunity = require('steamcommunity');
var community = new steamCommunity();
const steamTotp = require("steam-totp");
const readline = require("readline-sync");
const chalk = require("chalk");
const util = require("util");
var path = require("path");
let config = null;
config = require(path.resolve("settings.json"));
const limited = config.limited;
const secret = config.secret;

if(!limited) {
if(!secret) return console.log(chalk.red("you didn't set secret code in settings.json"));
console.log(chalk.yellow("You set non-limited account"));
let login = readline.question("login: ");
let password = readline.question("password: ");
let key = readline.question("enter key: ");
const logOnOptions = {
    accountName: login,
    password: password,
    twoFactorCode: steamTotp.generateAuthCode(secret),
};  
community.login({
    "accountName": logOnOptions.accountName,
    "password": logOnOptions.password,
    "twoFactorCode": logOnOptions.twoFactorCode
    },
function (err, sessionID, cookies, steamguard, oAuthToken) {
    if (err) { util.log('Unable to auth.' +  " Reason: " + String(err)); }
    if (!err) {
        var options = {
            formData: {product_key: key, sessionid: sessionID},
            headers: { Cookie: cookies, Host: 'store.steampowered.com', Origin: 'https://store.steampowered.com' },
            json: true
        };
        util.log(chalk.green("Sending activation request"));
        community.httpRequestPost(
            'https://store.steampowered.com/account/ajaxregisterkey/',options, (err, res, data) => {
                if (err) {
                    util.log('Unable to auth.'.red +  " Reason: " + String(err));
                }
                if (!err) {
                    util.log(chalk.green("starting to activate..."));
                if(data.purchase_receipt_info.line_items < 1) {
                    util.log(chalk.red("Invalid Key")); 
                }else if(data.success == 2 && !data.purchase_receipt_info.line_items < 1) {
                    util.log(chalk.red("Already activated this game: " + data.purchase_receipt_info.line_items[0].line_item_description)); 
                }else{
                    util.log(chalk.green("Status Code: " + data.success + " Game Actived: " + data.purchase_receipt_info.line_items[0].line_item_description));
                    }
                }
            },
            "steampowered"
        );
        }});
    }

    if(limited) {
        console.log(chalk.yellow("You set limited account"));
        let login = readline.question("login: ");
        let password = readline.question("password: ");
        let key = readline.question("enter key: ");
        const logOnOptions = {
            accountName: login,
            password: password,
        };  
        community.login({
            "accountName": logOnOptions.accountName,
            "password": logOnOptions.password,
            },
        function (err, sessionID, cookies, steamguard, oAuthToken) {
            if (err) {
            util.log('Unable to auth.' +  " Reason: " + String(err)); 
           }
            if (!err) {
                var options = {
                    formData: {product_key: key, sessionid: sessionID},
                    headers: { Cookie: cookies, Host: 'store.steampowered.com', Origin: 'https://store.steampowered.com' },
                    json: true
                };
                util.log(chalk.green("Sending activation request"));
                community.httpRequestPost(
                    'https://store.steampowered.com/account/ajaxregisterkey/',options, (err, res, data) => {
                        if (err) {
                            util.log('Unable to auth.'.red +  " Reason: " + String(err));
                        }
                        if (!err) {
                            util.log(chalk.green("starting to activate..."));
                        if(data.purchase_receipt_info.line_items < 1) {
                            util.log(chalk.red("Invalid Key")); 
                        }else if(data.success == 2 && !data.purchase_receipt_info.line_items < 1) {
                            util.log(chalk.red("Already activated this game: " + data.purchase_receipt_info.line_items[0].line_item_description)); 
                        }else{
                            util.log(chalk.green("Status Code: " + data.success + " Game Actived: " + data.purchase_receipt_info.line_items[0].line_item_description));
                            }
                        }
                    },
                    "steampowered"
                );
                }});
    }
