const fs = require('fs')
const jsdom = require("jsdom")
const { JSDOM } = jsdom

cloneMonsterData = async (pages) => {
  for (let i = 1; i <= pages; i++) {
    if (i === 1) {
      const resp = await serializeMonsterData('')
      await fs.writeFile(`./database/monster/data${i}.json`, JSON.stringify(resp, null, 4), (err) => {
        if (err) {
          return console.log(err)
        } else {
          console.log(`WRITE MONSTER DATA SUCCESSFUL, data${i}.json`)
        }
      })
    } else {
      const resp = await serializeMonsterData(`?page=${i}`)
      fs.writeFile(`./database/monster/data${i}.json`, JSON.stringify(resp, null, 4), (err) => {
        if (err) {
          return console.log(err)
        } else {
          console.log(`WRITE MONSTER DATA SUCCESSFUL, data${i}.json`)
        }
      })
    }
  }
}

serializeMonsterData = async (pages) => {
  const respDom = await JSDOM.fromURL(`https://www.roguard.net/db/monsters/${pages}`)
  const dom = new JSDOM(respDom.serialize());
  const tbody = dom.window.document.querySelector('tbody').innerHTML
  const match = tbody.match(/<tr[\s\S]*?<\/tr>/g)

  const monsterData = [];

  for (const element of match) {
    const monsterImage = (element.match(/src\s*=\s*\\*"(.+?)\\*"\s*/) !== null) ? element.match(/src\s*=\s*\\*"\/\/(.+?)\\*"\s*/)[1] : null
    const monsterName = element.match(/<a (.*)>(.+?)<\/a>/)[2]
    const monsterElement = element.match(/<div style="color: (.*);">(.+?) • (.*)<\/div>/)[2];
    const monsterRace = element.match(/<div style="color: (.*);">(.+?) • (.*)<\/div>/)[3];
    const monsterInfo = element.match(/<td (.*)><div>(.+?)<\/div><div>(.+?)<\/div><\/td>/)

    // Extract monsterInfo
    const monsterLevel = monsterInfo[2]
    const monsterHp = monsterInfo[3]
    const monsterExp = element.match(/<td (.*)><div>(.* Base Exp)<\/div><div>(.* Job Exp)<\/div><\/td>/)
    const monsterBaseExp = monsterExp[2]
    const monsterJobExp = monsterExp[3]
    const monsterUrl = element.match(/<a href="(.*)">/)[1]

    const metadata = await serializeMonsterFullData(monsterUrl)
    monsterData.push(
      {
        'imgsrc': monsterImage,
        'name': monsterName,
        'element': monsterElement,
        'race': monsterRace,
        'level': monsterLevel,
        'hp': monsterHp,
        'base_exp': monsterBaseExp,
        'job_exp': monsterJobExp,
        'metadata': metadata
      })
  }
  return monsterData
}

serializeMonsterFullData = async (url) => {
  const respDom = await JSDOM.fromURL(`https://www.roguard.net${url}`)
  const dom = new JSDOM(respDom.serialize());
  const content = dom.window.document.querySelector('#content').innerHTML
  const splitDiv = content.split('<div style="width: 230px; display: inline-block; margin-top: 10px; vertical-align:top; margin-right: 5px;">')

  // monster description
  const monsterDescription = splitDiv[0].match(/<p style="padding: 10px;">(.*)<\/p>/)[1]

  // common data dom element
  const commonDom = new JSDOM(splitDiv[1])
  const commonTbody = commonDom.window.document.querySelector('tbody').innerHTML
  const commonMatch = commonTbody.match(/<tr[\s\S]*?<\/tr>/g)

  // common data
  const monsterLevel = commonMatch[1].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterType = commonMatch[2].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterZone = commonMatch[3].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterRace = commonMatch[4].match(/<td class="text-right"><a href=".*">(.*)<\/a><\/td>/)[1]
  const monsterElement = commonMatch[5].match(/<td class="text-right"><a href=".*">(.*)<\/a><\/td>/)[1]
  const monsterSize = commonMatch[6].match(/<td class="text-right"><a href=".*">(.*)<\/a><\/td>/)[1]
  const monsterPassiveLevel = commonMatch[7].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterBaseExp = commonMatch[8].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterJobExp = commonMatch[9].match(/<td class="text-right">(.*)<\/td>/)[1]

  // attributes data dom element
  const attributesDom = new JSDOM(splitDiv[2])
  const attributesTbody = attributesDom.window.document.querySelector('tbody').innerHTML
  const attributesMatch = attributesTbody.match(/<tr[\s\S]*?<\/tr>/g)

  // attributes data
  const monsterATK = attributesMatch[0].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterMATK = attributesMatch[1].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterDEF = attributesMatch[2].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterMDEF = attributesMatch[3].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterHP = attributesMatch[4].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterHit = attributesMatch[5].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterFlee = attributesMatch[6].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterMoveSpd = attributesMatch[7].match(/<td class="text-right">(.*)<\/td>/)[1]
  const monsterATKSpd = attributesMatch[8].match(/<td class="text-right">(.*)<\/td>/)[1]

  // card data dom element
  const cardTbody = (attributesDom.window.document.querySelector('div')) ? attributesDom.window.document.querySelector('div').innerHTML : null
  const cardMatch = (cardTbody) ? cardTbody.match(/<div[\s\S]*?<\/div>/g) : null

  // card data
  const cardImg = (cardMatch && cardMatch[0].match(/src="\/\/(.*)"/) && cardMatch[0].match(/src="\/\/(.*)"/)[1]) ? cardMatch[0].match(/src="\/\/(.*)"/)[1] : null
  const cardName = (cardMatch && cardMatch[1] && cardMatch[1].match(/<a .*>(.*)<\/a>/) && cardMatch[1].match(/<a .*>(.*)<\/a>/)[1]) ? cardMatch[1].match(/<a .*>(.*)<\/a>/)[1] : null

  let cardEffect = null
  let cardBuff = null

  if (cardMatch && cardMatch[3] && cardMatch[3].match(/<div .*>(.*)<br>\n(.*)<\/div>/)) {
    cardEffect = cardMatch[3].match(/<div .*>((.*)<br>\n(.*))<\/div>/)[1].replace('<br>\n', ', ')
  } else {
    cardEffect = (cardMatch && cardMatch[3] && cardMatch[3].match(/<div .*>(.*)<\/div>/) && cardMatch[3].match(/<div .*>(.*)<\/div>/)[1]) ? cardMatch[3].match(/<div .*>(.*)<\/div>/)[1] : null
  }

  if (cardMatch && cardMatch[5] && cardMatch[5].match(/<div .*>(.*)<br>\n(.*)<\/div>/)) {
    cardBuff = cardMatch[5].match(/<div .*>((.*)<br>\n(.*))<\/div>/)[1].replace('<br>\n', ', ')
  } else {
    cardBuff = (cardMatch && cardMatch[5] && cardMatch[5].match(/<div .*>(.*)<\/div>/)) ? cardMatch[5].match(/<div .*>(.*)<\/div>/)[1] : null
  }

  // drop data dom element        
  const dropDom = splitDiv[2].split('<div style="width: 230px; display: inline-block; margin-top: 10px; vertical-align:top;">')
  const dropElement = (dropDom[2]) ? dropDom[2].split('<div style="text-align: center; margin-bottom: 4px;">').slice(1) : []

  // drop data
  const dropList = []
  if (dropElement.length) {
    dropElement.forEach(element => {
      dropList.push(
        {
          'imgsrc': (element.match(/src="\/\/(.*)"/)) ? element.match(/src="\/\/(.*)"/)[1] : null,
          'name': element.match(/<a .*>(.*)<\/a>/)[1],
          'drop_rate': element.match(/((.*)%)/)[1].replace(/ /g, "").replace('(', "")
        })
    })
  }

  // location data dom element
  const locationElement = (dropDom[3]) ? dropDom[3].split('<div style="text-align: center; margin-top: 5px;">').slice(1) : []

  // location data
  const locationList = []
  locationElement.forEach(element => {
    locationList.push({
      'location': element.match(/<a .*>(.*)<\/a>/)[1],
      'suggestion_level': element.match(/<\/a>(.*)<\/div>/)[1].replace(/ /g, "")
    })
  })

  const metadata = {
    'description': monsterDescription,
    'common_data': {
      'level': monsterLevel,
      'type': monsterType,
      'zone': monsterZone,
      'race': monsterRace,
      'element': monsterElement,
      'size': monsterSize,
      'passive_level': monsterPassiveLevel,
      'base_exp': monsterBaseExp,
      'job_exp': monsterJobExp
    },
    'attribute_data': {
      'atk': monsterATK,
      'matk': monsterMATK,
      'def': monsterDEF,
      'mdef': monsterMDEF,
      'hp': monsterHP,
      'hit': monsterHit,
      'flee': monsterFlee,
      'move_spd': monsterMoveSpd,
      'atk_spd': monsterATKSpd
    },
    'card_data': {
      'imgsrc': cardImg,
      'name': cardName,
      'effect': cardEffect,
      'perma_buff': cardBuff
    },
    'drop_data': dropList,
    'location_data': locationList
  }

  return metadata
}

module.exports = {

  async clone(pages) {
    await cloneMonsterData(pages)
  }

}
