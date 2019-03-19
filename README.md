[![Build Status](https://travis-ci.com/suraneti/roguard-clone-service.svg?branch=master)](https://travis-ci.com/suraneti/roguard-clone-service)

## Running

Make sure you have [Node.js](http://nodejs.org/)

```sh
git clone https://suraneti@bitbucket.org/thainoveldev/roguard_clone_service.git
cd roguard_clone_service
npm install
node app.js
```

## JavaScript API

```js
// number of monster pages
ROGUARD_MONSTER_PAGES = 12
// number of card pages
ROGUARD_CARD_PAGES = 17
// number of equipment pages
ROGUARD_EQUIPMENT_PAGES = 138

// clone and generate monster data from ROGuard
monsterService.clone(ROGUARD_MONSTER_PAGES)

// clone and generate card data from ROGuard
cardService.clone(ROGUARD_CARD_PAGES)

// clone and generate equipment data from ROGuard
equipmentService.clone(ROGUARD_EQUIPMENT_PAGES)
```
