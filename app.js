const monsterService = require('./public/js/monster-service')
const cardService = require('./public/js/card-service')
const equipmentService = require('./public/js/equipment-service')
const itemService = require('./public/js/item.service')

const ROGUARD_MONSTER_PAGES = 12
const ROGUARD_CARD_PAGES = 15
const ROGUARD_EQUIPMENT_PAGES = 149
const ROGUARD_ITEM_PAGES = 254

// clone and generate monster data from ROGuard
monsterService.clone(ROGUARD_MONSTER_PAGES)

// clone and generate card data from ROGuard
cardService.clone(ROGUARD_CARD_PAGES)

// clone and generate equipment data from ROGuard
equipmentService.clone(ROGUARD_EQUIPMENT_PAGES)

// clone and generate item data from ROGuard
itemService.clone(ROGUARD_ITEM_PAGES)
