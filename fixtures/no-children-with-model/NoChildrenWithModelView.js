'use strict'

var Backbone = require('backbone')
var assign = require('lodash/assign')

module.exports = Backbone.View.extend({
  template: require('./multiple-children.html.twig'),
  initialize: function (options) {
    this.options = options
  },

  getJSON: function () {
    return assign({}, this.options, {
      title: 'NoChildrenWithModelView'
    })
  },

  render: function () {
    return this
  },

  postRender: function () {
  }
})
