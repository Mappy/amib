'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  initialize: function () {
    this.type = 'SecondView'
  },
  template: require('./../one-children-with-model/no-children-with-promise-model/no-children-model.html.twig'),

  getJSON: function () {
    return {
      title: 'SecondView'
    }
  },

  render: function () {
    return this
  }
})
