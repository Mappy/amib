'use strict'
var ChildrenView = require('../../../view/ChildrenView')
var Radio = require('backbone.radio')

module.exports = ChildrenView.extend({
  defaults: {
    options: {channel: Radio.channel('depencency-view-channel')}
  },
  template: require('./root.html.twig'),
  children: {
    first: require('./Child'),
    second: require('./Child'),
    results: require('./Results')
  },
  render: function () {
    return this
  }
})
