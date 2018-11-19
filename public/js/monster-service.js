const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

function cloneMonsterData(pages) {
    for (let i = 1; i <= pages; i++) {
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
            const monsterImage = (element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/) !== null) ? element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/)[1] : null 
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

module.exports = {

    clone(pages) {
        cloneMonsterData(pages)
    }

}