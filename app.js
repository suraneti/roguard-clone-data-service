require('dotenv').config()

const monsterService = require('./public/js/monster-service')
const cardService = require('./public/js/card-service')
const equipmentService = require('./public/js/equipment-service')
const itemService = require('./public/js/item.service')

ROGUARD_MONSTER_PAGES = 12
ROGUARD_CARD_PAGES = 15
ROGUARD_EQUIPMENT_PAGES = 149
ROGUARD_ITEM_PAGES = 254

runAsync = async () => {
  // clone and generate monster data from ROGuard
  await monsterService.cloneAsync(ROGUARD_MONSTER_PAGES)

  // clone and generate card data from ROGuard
  await cardService.cloneAsync(ROGUARD_CARD_PAGES)

  // clone and generate equipment data from ROGuard
  await equipmentService.cloneAsync(ROGUARD_EQUIPMENT_PAGES)
  
  // clone and generate item data from ROGuard
  await itemService.cloneAsync(ROGUARD_ITEM_PAGES)
}

runParallel = () => {
  // clone and generate monster data from ROGuard
  monsterService.cloneParallel(ROGUARD_MONSTER_PAGES)

  // clone and generate card data from ROGuard
  cardService.cloneParallel(ROGUARD_CARD_PAGES)

  // clone and generate equipment data from ROGuard
  equipmentService.cloneParallel(ROGUARD_EQUIPMENT_PAGES)
  
  // clone and generate item data from ROGuard
  itemService.cloneParallel(ROGUARD_ITEM_PAGES)
}

start = () => {
  if (process.env.RUN_ASYNC === true) {
    runAsync()
  } else {
    runParallel()
  }
}

start()
