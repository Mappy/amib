'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./no-children.html.twig'),
  events: {
    'click h1': 'onclick'
  },

  onclick: function () {

  },

  getJSON: function () {
    return {
      title: 'NoChildrenView'
    }
  },

  render: function () {
    return this
  }
})
