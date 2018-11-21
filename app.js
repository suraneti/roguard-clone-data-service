const monsterService = require('./public/js/monster-service')
const cardService = require('./public/js/card-service')
const equipmentService = require('./public/js/equipment-service')

ROGUARD_MONSTER_PAGES = 12
ROGUARD_CARD_PAGES = 17
ROGUARD_EQUIPMENT_PAGES = 138

// clone and generate monster data from ROGuard
monsterService.clone(ROGUARD_MONSTER_PAGES)

// clone and generate card data from ROGuard
cardService.clone(ROGUARD_CARD_PAGES)

// clone and generate equipment data from ROGuard
equipmentService.clone(ROGUARD_EQUIPMENT_PAGES)