'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const indexjs = require('./index');
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseUrl:'"/apis/"',
  exportUrl: '"'+indexjs.dev.proxyTable['/apis'].target.replace(/\/css2\/?$/,'')+'"'
})
