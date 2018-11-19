const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

ROGUARD_MONSTER_PAGES = 12
ROGUARD_CARD_PAGES = 17

function cloneMonsterData() {
    for (let i = 1; i <= ROGUARD_MONSTER_PAGES; i++) {
        if (i === 1) {
            serializeMonsterData('', resp => {
                fs.writeFile(`./database/monster/data${i}.json`, JSON.stringify(resp), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
            })
        } else {
            serializeMonsterData('?page=' + i, resp => {
                fs.writeFile(`./database/monster/data${i}.json`, JSON.stringify(resp), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            })
        }
    }
}

function serializeMonsterData(pages, callback) {
    JSDOM.fromURL(`https://www.roguard.net/db/monsters/${pages}`).then(resp => {
        const dom = new JSDOM(resp.serialize());
        const tbody = dom.window.document.querySelector('tbody').innerHTML
        const match = tbody.match(/<tr[\s\S]*?<\/tr>/g)

        const monsterData = [];

        match.forEach(element => {
            const monsterImage = element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/)[1]
            const monsterName = element.match(/<a (.*)>(.+?)<\/a>/)[2]
            const monsterElement = element.match(/<div style="color: (.*);">(.+?) • (.*)<\/div>/)[2];
            const monsterRace = element.match(/<div style="color: (.*);">(.+?) • (.*)<\/div>/)[3];
            const monsterInfo = element.match(/<td><div>(.+?)<\/div><div>(.+?)<\/div><\/td>/)
            const monsterLevel = monsterInfo[1]
            const monsterHp = monsterInfo[2]
            const monsterExp = element.match(/<td><div>(.* Base Exp)<\/div><div>(.* Job Exp)<\/div><\/td>/)
            const monsterBaseExp = monsterExp[1]
            const monsterJobExp = monsterExp[2]

            monsterData.push(
                {
                    'imgsrc': monsterImage,
                    'name': monsterName,
                    'element': monsterElement,
                    'race': monsterRace,
                    'level': monsterLevel,
                    'hp': monsterHp,
                    'base_exp': monsterBaseExp,
                    'job_exp': monsterJobExp
                })
        })

        callback(monsterData)
    })
}

function cloneCardData() {
    for (let i = 1; i <= ROGUARD_CARD_PAGES; i++) {
        if (i === 1) {
            serializeCardData('', resp => {
                fs.writeFile(`./database/card/data${i}.json`, JSON.stringify(resp), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                })
            })
        } else {
            serializeCardData('?page=' + i, resp => {
                fs.writeFile(`./database/card/data${i}.json`, JSON.stringify(resp), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            })
        }
    }
}

function serializeCardData(pages, callback) {
    JSDOM.fromURL(`https://www.roguard.net/db/cards/${pages}`).then(resp => {
        const dom = new JSDOM(resp.serialize());
        const tbody = dom.window.document.querySelector('tbody').innerHTML
        const match = tbody.match(/<tr[\s\S]*?<\/tr>/g)

        const monsterData = [];

        match.forEach(element => {
            const cardImage = (element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/) !== null) ? element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/)[1] : null
            const cardName = element.match(/<a (.*)>(.+?)<\/a>/)[2]

            // split by td tag element into array
            const splitdata = element.split('</td>')
            // array effect card 
            const splitEffectCardDiv = splitdata[2].split('</div>')
            // array slot and type card
            const splitSlotCardDiv = splitdata[3].split('</div>')

            let cardEffect = ''
            let permaBuff = splitEffectCardDiv[3].match(/<div>(.*)/)[1]

            const cardSlot = (splitSlotCardDiv[1].match(/<div>(.*)/)[1] === '?') ? 'unknown' : splitSlotCardDiv[1].match(/<div>(.*)/)[1]
            const cardType = (splitSlotCardDiv[3].match(/<div>(.*)/)[1] === '?') ? 'unknown' : splitSlotCardDiv[3].match(/<div>(.*)/)[1]

            // if effect card has multiple lines
            if (splitEffectCardDiv[1].match(/<br ?\/?>/)) {
                const effectCard = splitEffectCardDiv[1].split('<br>')

                effectCard.forEach((element, index) => {
                    if (index === 0) {
                        cardEffect = element.match(/<div>(.*)/)[1]
                    } else {
                        cardEffect = cardEffect + ', ' + element.match(/\r\n|\r|\n(.*)/)[1]
                    }
                })

                // if effect card has single lines
            } else {
                cardEffect = splitEffectCardDiv[1].match(/<div>(.*)/)[1]
            }

            monsterData.push(
                {
                    'imgsrc': cardImage,
                    'name': cardName,
                    'effect': cardEffect,
                    'perma_buff': permaBuff,
                    'card_slot': cardSlot,
                    'card_type': cardType
                })
        })

        callback(monsterData)
    })
}

// clone and generate monster data from ROGuard
cloneMonsterData();
// clone and generate card data from ROGuard
cloneCardData();
