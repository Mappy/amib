'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  initialize: function () {
    this.type = 'NoChildrenWithPromiseModelView'
  },

  template: require('./no-children-model.html.twig'),

  getJSON: function () {
    return Promise.resolve({
      title: 'NoChildrenWithPromiseModelView'
    })
  }
})
