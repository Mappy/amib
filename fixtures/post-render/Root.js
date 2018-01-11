'use strict'
var Backbone = require('backbone')

module.exports = Backbone.View.extend({
  template: require('./root.html.twig'),
  getJSON: function () {
    return {
      name: 'Root'
    }
  },
  children: {
    promised: require('./ChildPromise'),
    postRender: require('./ChildPostRender')
  },
  postRender: function () {
  }
})
