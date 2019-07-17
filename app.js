const monsterService = require('./public/js/monster-service')
const cardService = require('./public/js/card-service')
const equipmentService = require('./public/js/equipment-service')

ROGUARD_MONSTER_PAGES = 12
ROGUARD_CARD_PAGES = 15
ROGUARD_EQUIPMENT_PAGES = 149

const start = async () => {
  // clone and generate monster data from ROGuard
  await monsterService.clone(ROGUARD_MONSTER_PAGES)

  // clone and generate card data from ROGuard
  await cardService.clone(ROGUARD_CARD_PAGES)

  // clone and generate equipment data from ROGuard
  await equipmentService.clone(ROGUARD_EQUIPMENT_PAGES)
}

start()