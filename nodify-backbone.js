'use strict'

var _ = require('lodash/core')

module.exports = function nodify (View) {
  View.prototype._ensureElement = _.noop
  View.prototype.delegateEvents = _.noop
  View.prototype.setElement = function (html) {
    this.el = {
      outerHTML: html
    }
  }
  View.prototype._removeElement = _.noop
  View.prototype.removeElements = _.noop
  return View
}
