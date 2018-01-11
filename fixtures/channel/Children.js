'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./children.html.twig'),

  render: function () {
    return this
  }
})
