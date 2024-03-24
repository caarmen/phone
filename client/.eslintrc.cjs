module.exports = {
  "env": {
      "browser": true,
      "es2021": true,
      "mocha": true,
  },
  "extends": "eslint:recommended",
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  "globals": {
    "process": true,
  },
  "rules": {
    "consistent-return": 2,
    "indent"           : [1, 4],
    "no-else-return"   : 1,
    "semi"             : [1, "always"],
    "space-unary-ops"  : 2
  }
}
