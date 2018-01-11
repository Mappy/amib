'use strict'
const Module = require('module')
const twig = require('twig').twig
const debug = require('debug')('node-twigify')

Module._extensions['.twig'] = (module, filename) => {
  debug('filename', filename)
  const template = twig({path: filename, async: false, rethrow: true})
  debug('template', template)
  module.exports = template
}
