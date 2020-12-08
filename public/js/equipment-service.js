const fs = require('fs-extra')
const jsdom = require('jsdom')
const imgService = require('./img-service')

const { JSDOM } = jsdom
const dir = './database/equipment'

cloneEquipmentData = async (pages) => {
  // Check and create dir when dir not exist
  await fs.ensureDir(dir)

  for (let i = 1; i <= pages; i++) {
    const page = i === 1 ? '' : `?page=${i}`
    const resp = await serializeEquipmentData(page)
    await fs.writeFile(`${dir}/data${i}.json`, JSON.stringify(resp, null, 4), (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`WRITE EQUIPMENT DATA SUCCESSFUL, data${i}.json`)
      }
    })
  }
}

serializeEquipmentData = async (pages) => {
  const respDom = await JSDOM.fromURL(`https://www.roguard.net/db/equipment/${pages}`)
  const dom = new JSDOM(respDom.serialize())
  const tbody = dom.window.document.querySelector('tbody').innerHTML
  const match = tbody.match(/<tr[\s\S]*?<\/tr>/g)

  const equipmentData = [];

  for (const element of match) {
    const equipmentImage = (element.match(/src\s*=\s*\\*"\/\/(.+?)\\*"\s*/) !== null) ? element.match(/src\s*=\s*\\*"\/\/(.+?)\\*"\s*/)[1] : null
    if (equipmentImage !== null) {
      cloneIMGData('equipment', equipmentImage)
    }
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

    equipmentData.push(
      {
        'imgsrc': equipmentImage,
        'name': equipmentName,
        'slot': equipmentSlot,
        'status': equipmentStatus
      })
  }

  return equipmentData
}

module.exports = {

  async clone(pages) {
    await cloneEquipmentData(pages)
  }
  
}