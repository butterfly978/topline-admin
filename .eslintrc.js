module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    // 'space-before-function-paren': ['error', {
    //   'anonymous': 'never', // 匿名函數 function () {}
    //   'named': 'never', // 命名函數 function too () {}
    //   'asyncArrow': 'never' // 箭頭函數 async () => {}
    // }] // 'semi': ['error', 'always']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
