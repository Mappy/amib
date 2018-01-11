'use strict'
var ChildrenView = require('../../../view/ChildrenView')
var Radio = require('backbone.radio')

module.exports = ChildrenView.extend({
  defaults: {
    options: {channel: Radio.channel('mychannel')}
  },
  template: require('./view.html.twig'),
  children: require('./child/Child'),
  render: function () {
    return this
  }
})
