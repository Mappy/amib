'use strict'
var ChildrenView = require('../../../../view/ChildrenView')

module.exports = ChildrenView.extend({
  template: require('./child.html.twig'),
  getJSON: function () {
    return this.options
  }
})
