'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./template.html.twig'),

  getJSON: function () {
    return {
      name: 'RecursiveChildrenView'
    }
  },

  children: require('./one-children-view/OneChildrenWithModelView'),
  render: function () {
    return this
  }
})
