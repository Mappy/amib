'use strict'
var ChildrenView = require('../../../view/ChildrenView')

module.exports = ChildrenView.extend({
  template: require('./view.html.twig'),
  children: require('./child/Child'),
  initialize: function () {
    ChildrenView.prototype.initialize.apply(this, arguments)
    this.channel = 'value'
  },
  getChildContext: function () {
    return {channel: this.channel}
  }
})
