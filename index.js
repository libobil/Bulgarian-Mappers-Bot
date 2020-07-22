const Discord = require('discord.js')
const Bot = new Discord.Client();
const token = require('./json.json')
const fs = require('fs')
const prefix = "bm!"

let content = fs.readFileSync('./dates.txt') + ''
let rows = content.split('\n')
let dates = [], n = 0
let sendmessage = []
console.log("rows[0]: " + rows[0].length)

for (let i = 0 ; rows[i] !== undefined && rows[i].length > 0 ; ++i) {
    dates[i] = rows[i].split(' ')
    ++n;
    sendmessage[i] = 0;
}
for (let i = 0 ; i < n ; ++i) {
    console.log(i + ': ' + dates[i][0] + ' ' + dates[i][1])
}

Bot.on ('ready', () => {
    console.log(`${Bot.user.tag} is reaaaady`)
})

Bot.on('guildMemberAdd', memb => {
    if (!memb.bot) {
        let today = new Date(), ddmmyyyy, d, m, y;
        d = today.getDate() + ''
        m = (today.getMonth()+1) + ''
        y = today.getFullYear() + ''
        mmddyyyy = m + '/' + d + '/' + y
        let bl = 1;
        for (let i = 0 ; i < n && bl ; ++i) {
            if (dates[i][1] == memb.id+'') {
                dates[i][0] = mmddyyyy
                rows[i] = dates[i][0] + ' ' + dates[i][1]
                bl = 0;
                sendmessage[i] = 0;
                console.log("changed: " + memb.id + ' ' + (ddmmyyyy+''))
            }
        }
        if (bl) {
            console.log("dd/mm/yyyy: " + mmddyyyy)
            sendmessage[n] = 0;
            dates[n] = []
            dates[n][0] = mmddyyyy
            dates[n][1] = memb.id + ''
            rows[n] = dates[n][0] + ' ' + dates[n][1]
            console.log('today is: ' + dates[n][0])
            console.log('member id: ' + dates[n][1])
            console.log('rows[' + n + ']: ' + rows[n])
            ++n
        }
        let towrite = '';
        for (let i = 0 ; i < n ; ++i)
            towrite += rows[i] + '\n';
        fs.writeFileSync('./dates.txt', towrite)
    }
})

function f (x) {
    x += ''
    let xcpy = parseInt(x, 10)
    if (xcpy % 400 == 0) return 1;
    if (xcpy % 100 == 0) return 0;
    if (xcpy % 4 == 0) return 1;
    return 0;
}

Bot.on('message', msg => {
    let words = msg.content.split(' ')
    /*if (msg == prefix + 'Ping')
        msg.guild.send('Pong')*/
    if (words[0] == prefix + 'setdate') {
        let mention = msg.mentions.users.first();
        if (mention == undefined) {
            msg.channel.send('There is no defined user')
        } else {
            metion = mention.id
            if (msg.member.roles.cache.has('627919969711292417') || msg.member.roles.cache.has('627920505512394753')) {
                for (let i = 0 ; i < n ; ++i) {
                    if (dates[i][1] == mention) {
                        dates[i][0] = words[2]
                        msg.channel.send('Sucess!')
                    }
                }
            } else {
                msg.channel.send('No perms!')
            }
        }
    }
    let today = new Date();
    for (let i = 0 ; i < n ; ++i) {
        let currdate = new Date(dates[i][0])
        console.log("today: " + currdate)
        let mil_sec =  today.getTime() - currdate.getTime();
        let days = mil_sec / (1000 * 3600 * 24);
        console.log("passed days: " + days)
        console.log("visokosna: " + f(today.getFullYear()) + ' ' + f(currdate.getFullYear()))
        if (Math.floor(days) >= 365 + (f(today.getFullYear()) || f(currdate.getFullYear())) && !sendmessage[i]) {
            // send message to @libobil and @StarZapBG
            let libo = Bot.users.cache.get('413041751528308736')
            let star = Bot.users.cache.get('272701530258276352')
            libo.send("A year has passed for: " + Bot.users.cache.get(dates[i][1]+'').tag)
            star.send("A year has passed for: " + Bot.users.cache.get(dates[i][1]+'').tag)
            sendmessage[i] = 1;
        }
    }
})

Bot.login(token.token)
