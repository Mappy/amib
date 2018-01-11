'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  events: {
    'click': 'onClick'
  },

  template: require('./template.html.twig'),

  onClick: function (event) {
    $(event.target).text('clicked')
  },

  render: function () {
    return this
  }
})
