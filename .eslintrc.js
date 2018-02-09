// http://eslint.org/docs/user-guide/configuring
/*global module, process*/

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    "standard"
  ],
  // required to lint *.vue files
  plugins: [
    "html"
  ],
  // add your custom rules here
  "rules": {
    "indent": ["error", 4],
    "quotes": ["warn", "double"],
    "semi": ["error", "always"],
    "operator-linebreak": ["error", "after"],
    "one-var": ["error", {"uninitialized": "always"}],
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    "no-console": process.env.NODE_ENV === "production" ? 2 : 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
  }
};
