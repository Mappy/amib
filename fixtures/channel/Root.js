'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./root.html.twig'),

  children: require('./Children'),

  render: function () {
    return this
  }
})
