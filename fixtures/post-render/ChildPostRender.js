'use strict'

var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./child-post-render.html.twig'),
  postRender: function () {
  }
})
