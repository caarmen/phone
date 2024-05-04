module.exports = {
  "env": {
      "browser": true,
      "es2021": true,
      "mocha": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:jsdoc/recommended",
  ],
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  "globals": {
    "process": true,
  },
  "plugins": [
      "jsdoc",
      "@stylistic/js"
  ],
  "rules": {
    "@stylistic/js/indent": ["error", 4],
    "@stylistic/js/quotes": "error",
    "@stylistic/js/semi": "error",
    "@stylistic/js/space-unary-ops": "error",
    "consistent-return": "error",
    "eqeqeq": ["error", "always"],
    "no-else-return": "error",
  }
}
