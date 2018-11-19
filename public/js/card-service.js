const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

function cloneCardData(pages) {
    for (let i = 1; i <= pages; i++) {
        if (i === 1) {
            serializeCardData('', resp => {
                fs.writeFile(`./database/card/data${i}.json`, JSON.stringify(resp, null, 4), function (err) {
                    if (err) return console.log(err)
                })
            })
        } else {
            serializeCardData('?page=' + i, resp => {
                fs.writeFile(`./database/card/data${i}.json`, JSON.stringify(resp, null, 4), function (err) {
                    if (err) return console.log(err)
                })
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

module.exports = {

    clone(pages) {
        cloneCardData(pages)
    }

}