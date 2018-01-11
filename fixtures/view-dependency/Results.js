'use strict'
var ChildrenView = require('../../../view/ChildrenView')

module.exports = ChildrenView.extend({
  template: require('./results.html.twig'),
  initialize: function (options) {
    ChildrenView.prototype.initialize.call(this, options)
    this.childResponse = 0
    this.value = 0
  },
  getJSON: function () {
    return new Promise(function (resolve) {
      this.listenTo(this.options.channel, 'resolved:child', function (obj) {
        this.value += obj.value
        this.childResponse++
        if (this.childResponse === 2) {
          resolve({value: this.value})
        }
      }.bind(this))
    }.bind(this))
  },
  render: function () {
    return this
  }
})
