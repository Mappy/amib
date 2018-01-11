'use strict'

var _ = require('lodash/core')
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./child-promise.html.twig'),

  getJSON: function () {
    return new Promise(function (resolve) {
      _.delay(resolve.bind(null, {
        title: 'ChildPostRender'
      }), 10)
    })
  },
  postRender: function () {
  }
})
