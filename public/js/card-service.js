const fs = require('fs-extra')
const jsdom = require('jsdom')

const { JSDOM } = jsdom
const dir = './database/card'

cloneCardData = async (pages) => {
  // Check and create dir when dir not exist
  await fs.ensureDir(dir)

  for (let i = 1; i <= pages; i++) {
    const page = i === 1 ? '' : `?page=${i}`
    const resp = await serializeCardData(page)

    await fs.writeFile(`${dir}/data${i}.json`, JSON.stringify(resp, null, 4), (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`WRITE CARD DATA SUCCESSFUL, data${i}.json`)
      }
    })
  }
}

serializeCardData = async (pages) => {
  const respDom = await JSDOM.fromURL(`https://www.roguard.net/db/cards/${pages}`)
  const dom = new JSDOM(respDom.serialize())
  const tbody = dom.window.document.querySelector('tbody').innerHTML
  const match = tbody.match(/<tr[\s\S]*?<\/tr>/g)

  const monsterData = []

  for (const element of match) {
    const cardImage = (element.match(/src\s*=\s*\\*"\/\/(.+?)\\*"\s*/) !== null) ? element.match(/src\s*=\s*\\*"\/\/(.+?)\\*"\s*/)[1] : null
    const cardName = element.match(/<a (.*)>(.+?)<\/a>/)[2]
    const cardUrl = element.match(/<a href="(.*)">/)[1]

    // split by td tag element into array
    const splitdata = element.split('</td>')
    // array effect card 
    const splitEffectCardDiv = splitdata[2].split('</div>')
    // array slot and type card
    const splitSlotCardDiv = splitdata[3].split('</div>')

    let cardEffect = ''

    const permaBuff = splitEffectCardDiv[3].match(/<div>(.*)/)[1]
    const cardSlot = (splitSlotCardDiv[1].match(/<div>(.*)/)[1] === '?') ? 'unknown' : splitSlotCardDiv[1].match(/<div>(.*)/)[1]
    const cardType = (splitSlotCardDiv[3].match(/<div>(.*)/)[1] === '?') ? 'unknown' : splitSlotCardDiv[3].match(/<div>(.*)/)[1]

    // if effect card has multiple lines
    if (splitEffectCardDiv[1].match(/<br ?\/?>/)) {
      const effectCardDiv = splitEffectCardDiv[1].split('<br>')

      effectCardDiv.forEach((element, index) => {
        if (index === 0) {
          cardEffect = element.match(/<div>(.*)/)[1]
        } else {
          cardEffect = `${cardEffect}, ${element.match(/\r\n|\r|\n(.*)/)[1]}`
        }
      })
      // if effect card has single lines
    } else {
      cardEffect = splitEffectCardDiv[1].match(/<div>(.*)/)[1]
    }

    const metadata = await serializeCardFullData(cardUrl)
    monsterData.push(
      {
        'imgsrc': cardImage,
        'name': cardName,
        'effect': cardEffect,
        'perma_buff': permaBuff,
        'card_slot': cardSlot,
        'card_type': cardType,
        'metadata': metadata
      })
  }

  return monsterData
}

serializeCardFullData = async (url) => {
  const respDom = await JSDOM.fromURL(`https://www.roguard.net${url}`)
  const dom = new JSDOM(respDom.serialize())
  const content = dom.window.document.querySelector('#content').innerHTML
  const splitDiv = content.split('<div style="width: 230px; display: inline-block; margin-top: 10px; vertical-align:top; margin-right: 5px;">')

  // common data dom element
  const commonDom = new JSDOM(splitDiv[1])
  const commonTbody = commonDom.window.document.querySelector('tbody').innerHTML
  const commonMatch = commonTbody.match(/<tr[\s\S]*?<\/tr>/g)

  // common data
  const cardLevel = commonMatch[1].match(/<td class="text-right">(.*)<\/td>/)[1]
  const cardMaxStack = commonMatch[2].match(/<td class="text-right">(.*)<\/td>/)[1]
  const cardSellable = commonMatch[3].match(/<td class="text-right">(.*)<\/td>/)[1]
  const cardSellPrice = commonMatch[4].match(/<td class="text-right">(.*)<\/td>/)[1]
  const cardAuctionable = commonMatch[5].match(/<td class="text-right">(.*)<\/td>/)[1]
  const cardStorageable = (commonMatch[6] && commonMatch[6].match(/<td class="text-right">(.*)<\/td>/) ? commonMatch[6].match(/<td class="text-right">(.*)<\/td>/)[1] : 'unknown')

  const metadata = {
    'common_data': {
      'level': cardLevel,
      'max_stack': cardMaxStack,
      'sellable': cardSellable,
      'sell_price': cardSellPrice,
      'auctionable': cardAuctionable,
      'storageable': cardStorageable
    },
    'drop_data': {
      'dropped_by': 'no drop',
      'monster_level': 'unknown',
      'drop_rate': 'unknown'
    }
  }

  // drop data dom element
  if (splitDiv[3]) {
    const dropDom = splitDiv[3].split('<div style="width: 230px; display: inline-block; margin-top: 10px; vertical-align:top;">')
    const dropElement = (dropDom[0]) ? dropDom[0].split('</div>').slice(1) : []

    // drop data
    const cardDroppedBy = (dropElement[0] && dropElement[0].match(/<a .*>(.*)<\/a>/) ? dropElement[0].match(/<a .*>(.*)<\/a>/)[1] : 'unknown')
    const cardMonsterLevel = (dropElement[1] && dropElement[1].match(/.*>(.*)/) ? dropElement[1].match(/.*>(.*)/)[1] : 'unknown')
    const cardDropRate = (dropElement[2] && dropElement[2].match(/.*>(.*)/) ? dropElement[2].match(/.*>(.*)/)[1] : 'unknown')

    metadata.drop_data.dropped_by = cardDroppedBy
    metadata.drop_data.monster_level = cardMonsterLevel
    metadata.drop_data.drop_rate = cardDropRate === '?%' ? 'unknow' : cardDropRate
  }

  return metadata
}

module.exports = {
  clone(pages) {
    cloneCardData(pages)
  }
}

