'use strict'
var ChildrenView = require('../../../view/ChildrenView')

module.exports = ChildrenView.extend({
  template: require('./child.html.twig'),
  getJSON: function () {
    return new Promise(function (resolve) {
      var value = {value: 1}
      setTimeout(function () {
        this.options.channel.trigger('resolved:child', Object.assign({}, value))
        resolve(value)
      }.bind(this), 1)
    }.bind(this))
  },
  render: function () {
    return this
  }
})
