'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./throw-error.html.twig'),

  getJSON: function () {
    return Promise.reject(new Error('error from getJSON'))
  },

  render: function () {
    return this
  }
})
