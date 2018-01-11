'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./multiple-children-view.html.twig'),

  initialize: function () {
    this.type = 'MultipleChildrenView'
  },

  getJSON: function () {
    return {
      name: 'MultipleChildrenView'
    }
  },

  children: {
    first: require('./../one-children-with-model/no-children-with-promise-model/NoChildrenWithPromiseModelView'),
    second: require('./SecondView')
  },
  render: function () {
    return this
  }
})
