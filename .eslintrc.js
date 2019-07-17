export default {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "comma-dangle": ["error", "never"],
        "no-console": 0,
        "semi": [2, "never"],
        "indent": 2,
        "quotes": [2, "single"],
        "quote-props": 0,
        "class-methods-use-this": 0,
        "import/newline-after-import": ["error", "never"]
    }
}