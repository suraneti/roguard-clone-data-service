const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

function cloneEquipmentData(pages) {
    for (let i = 1; i <= pages; i++) {
        if (i === 1) {
            serializeEquipmentData('', resp => {
                fs.writeFile(`./database/equipment/data${i}.json`, JSON.stringify(resp, null, 4), function (err) {
                    if (err) return console.log(err)
                })
            })
        } else {
            serializeEquipmentData('?page=' + i, resp => {
                fs.writeFile(`./database/equipment/data${i}.json`, JSON.stringify(resp, null, 4), function (err) {
                    if (err) return console.log(err);
                })
            })
        }
    }
}

function serializeEquipmentData(pages, callback) {
    JSDOM.fromURL(`https://www.roguard.net/db/equipment/${pages}`).then(resp => {
        const dom = new JSDOM(resp.serialize());
        const tbody = dom.window.document.querySelector('tbody').innerHTML
        const match = tbody.match(/<tr[\s\S]*?<\/tr>/g)

        const monsterData = [];

        match.forEach(element => {
            const equipmentImage = (element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/) !== null) ? element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/)[1] : null
            const equipmentName = element.match(/<a (.*)>(.+?)<\/a>/)[2]
            const equipmentSlot = element.match(/<div style="color: (.*);">(.+?)<\/div>/)[2];

            // split by td tag element into array
            const splitdata = element.split('</td>')
            const splitEquipmentStatusDiv = splitdata[3]

            equipmentStatus = ''

            // if effect card has multiple lines
            if (splitEquipmentStatusDiv.match(/<br ?\/?>/)) {
                const effectCard = splitEquipmentStatusDiv.split('<br>')

                effectCard.forEach((element, index) => {
                    if (index === 0) {
                        equipmentStatus = element.match(/<td (.*)>\s*(.*)/)[2]
                    } else {
                        equipmentStatus = equipmentStatus + ', ' + element.match(/\r\n|\r|\n(.*)/)[1]
                    }
                })

                // if effect card has single lines
            } else {
                equipmentStatus = (splitdata[2].match(/<td (.*)>\s*(.*)/)[2] !== '') ? splitdata[2].match(/<td (.*)>\s*(.*)/)[2] : 'unknown'
                if (equipmentStatus === 'unknown') {
                    equipmentStatus = (element.split('</td>')[3].match(/<td (.*)>\s*(.*)/)[2] !== null) ? element.split('</td>')[3].match(/<td (.*)>\s*(.*)/)[2] : 'unknown'
                }
            }

            monsterData.push(
                {
                    'imgsrc': equipmentImage,
                    'name': equipmentName,
                    'slot': equipmentSlot,
                    'status': equipmentStatus
                })
        })

        callback(monsterData)
    })
}

module.exports = {

    clone(pages) {
        cloneEquipmentData(pages)
    }

}