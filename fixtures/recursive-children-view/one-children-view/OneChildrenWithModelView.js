'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./one-children-with-model.html.twig'),
  initialize: function () {
    this.model = this.getJSON()
  },

  getJSON: function () {
    return {
      title: 'OneChildrenWithModelView'
    }
  },

  children: require('./deep-view/DeepView'),

  render: function () {
    return this
  }
})
