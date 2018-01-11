'use strict'
var ChildrenView = require('../../../../view/ChildrenView')

module.exports = ChildrenView.extend({
  events: {
    'click': 'onClick'
  },

  template: require('./child.html.twig'),

  onClick: function (event) {
    this.options.channel.trigger('hello', {name: 'world'})
  },

  render: function () {
    return this
  }
})
