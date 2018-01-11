'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./one-children-with-model.html.twig'),

  getJSON: function () {
    return {
      name: 'OneChildrenWithModelView'
    }
  },

  children: require('./no-children-with-promise-model/NoChildrenWithPromiseModelView'),

  render: function () {
    return this
  }
})
