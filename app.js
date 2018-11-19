const monsterService = require('./public/js/monster-service')
const cardService = require('./public/js/card-service')

ROGUARD_MONSTER_PAGES = 12
ROGUARD_CARD_PAGES = 17

// // clone and generate monster data from ROGuard
monsterService.clone(ROGUARD_MONSTER_PAGES)

// // clone and generate card data from ROGuard
cardService.clone(ROGUARD_CARD_PAGES)
