[![Build Status](https://travis-ci.com/suraneti/roguard-clone-data-service.svg?branch=master)](https://travis-ci.com/suraneti/roguard-clone-data-service)

# ROGuard Clone Data Service

> just for inspiration!

Service that clone ragnarok mobile data (monster, card, equipment, item) and generate as json file from https://www.roguard.net

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

* [Node.js](https://nodejs.org/en/) 8 or later

### Setup environments and running

```sh
git clone https://github.com/suraneti/roguard-clone-data-service.git
cd roguard-clone-data-service
npm install
node app.js
```

or use `npm run crawler` or if you have your yarn `yarn crawler`

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime (7 or later)
* [NPM](https://www.npmjs.com/) - Package Manager

## ENV Configuration

```env
# If you want to run async set to 'false'
# Make sure your computer have more memory to run as pararelle (pararelle is faster than async)

RUN_ASYNC=true
```

## JavaScript API

```js
// number of monster pages
ROGUARD_MONSTER_PAGES = 12
// number of card pages
ROGUARD_CARD_PAGES = 17
// number of equipment pages
ROGUARD_EQUIPMENT_PAGES = 138
// number of item pages
ROGUARD_ITEM_PAGES = 254

// clone and generate monster data from ROGuard
monsterService.clone(ROGUARD_MONSTER_PAGES)

// clone and generate card data from ROGuard
cardService.clone(ROGUARD_CARD_PAGES)

// clone and generate equipment data from ROGuard
equipmentService.clone(ROGUARD_EQUIPMENT_PAGES)

// clone and generate item data from ROGuard
itemService.clone(ROGUARD_ITEM_PAGES)
```

## Authors

* **Suraneti Rodsuwan** - *Initial work* - [suraneti](https://github.com/suraneti)

## License

This project is licensed under the FUCK License - see the [LICENSE](LICENSE.fuck) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc

## Contributors

* **way21x** - [way21x](https://github.com/way21x)
* **Daison Cariño** - [daison12006013](https://github.com/daison12006013)
