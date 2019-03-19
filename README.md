[![Build Status](https://travis-ci.com/suraneti/roguard-clone-service.svg?branch=master)](https://travis-ci.com/suraneti/roguard-clone-service)

# ROGuard Clone Service

Service that clone ragnarok mobile data (monster, card, equipment, item) and generate as json file from https://www.roguard.net

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them

* [Node.js](https://www.google.com)  

### Setup environments and running

```sh
git clone https://suraneti@bitbucket.org/thainoveldev/roguard_clone_service.git
cd roguard_clone_service
npm install
node app.js
```

## Built With

* [Node.js](https://www.google.com) - JavaScript runtime
* [NPM](https://www.npmjs.com/) - Package Manager

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

## Authors

* **Suraneti Rodsuwan** - *Initial work* - [suraneti](https://github.com/suraneti)

## License

This project is licensed under the FUCK License - see the [LICENSE](LICENSE.fuck) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
