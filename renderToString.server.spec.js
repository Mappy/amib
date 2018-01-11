/* eslint-env es6 */
// jshint ignore: start
'use strict'

var expect = require('chai').expect
var renderToString = require('./render').renderToString
var nodify = require('./nodify-backbone')
const sinon = require('sinon')
require('sinon-chai')

require('../../../../../node/node-twigify')

describe('renderToString', () => {
  var sandbox
  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })
  afterEach(() => {
    sandbox.restore()
  })

  it('OneChildrenWithModelView', () => {
    var View = require('./fixtures/one-children-with-model/OneChildrenWithModelView')
    return renderToString(View, nodify).then(view => {
      expect(view.el.outerHTML).to.eql(`<div>
    <h1>OneChildrenWithModelView</h1>
    <div>
    <h2>NoChildrenWithPromiseModelView</h2>
</div>

</div>
`)
    })
  })

  it('NoChildrenView', () => {
    var View = require('./fixtures/no-children/NoChildrenView')
    return renderToString(View, nodify).then(view => {
      expect(view.el.outerHTML).to.eql(`<div>
    <h1>NoChildrenView</h1>
</div>
`)
    })
  })

  it('NoChildrenWithModelView', () => {
    var View = require('./fixtures/no-children-with-model/NoChildrenWithModelView')
    return renderToString(View, nodify, {body: 'body'}).then(view => {
      expect(view.el.outerHTML).to.eql(`<div>
    <h1>NoChildrenWithModelView</h1>
    body
</div>
`)
    })
  })

  it('MultipleChildrenView', () => {
    var View = require('./fixtures/multiple-children-view/MultipleChildrenView')
    return renderToString(View, nodify).then(view => {
      expect(view.el.outerHTML).to.eql(`<div>
    <h1>MultipleChildrenView</h1>
    <div><div>
    <h2>NoChildrenWithPromiseModelView</h2>
</div>
</div>
    <div><div>
    <h2>SecondView</h2>
</div>
</div>
</div>
`)
    })
  })
  it('RecursiveChildrenView', () => {
    var View = require('./fixtures/recursive-children-view/RecursiveChildrenView')
    return renderToString(View, nodify).then(view => {
      expect(view.el.outerHTML).to.eql(`<div>
    <h1>RecursiveChildrenView</h1>
    <div><div>
    <h2>OneChildrenWithModelView</h2>
    <div>deep</div>
</div>
</div>
</div>
`)
    })
  })

  it('ChildContext', () => {
    var View = require('./fixtures/child-context/View')
    return renderToString(View, nodify).then(view => {
      expect(view.el.outerHTML).to.eql('<div><h1>value</h1>\n</div>\n')
    })
  })

  describe('options', () => {
    const options = {channel: 'hello'}
    it('should be passed to root', () => {
      var Root = require('./fixtures/channel/Root')
      sandbox.stub(Root.prototype, 'initialize')
      return renderToString(Root, nodify, options).then(_ => {
        expect(Root.prototype.initialize.firstCall.args[0]).to.eql(options)
      })
    })
    it('should be passed to child', () => {
      var Root = require('./fixtures/channel/Root')
      var Children = require('./fixtures/channel/Children')
      sandbox.stub(Children.prototype, 'initialize')

      return renderToString(Root, nodify, options).then(_ => {
        expect(Children.prototype.initialize.firstCall.args[0]).to.eql(options)
      })
    })
  })

  describe('remove', () => {
    it('should remove everybody', () => {
      var Root = require('./fixtures/children-view/View')

      var rootRemove = sandbox.spy(Root.prototype, 'remove')
      var childrenRemove = sandbox.spy(Root.prototype.children.prototype, 'remove')

      return renderToString(Root, nodify, {}).then(_ => {
        expect(rootRemove).to.have.been.callCount(1)
        expect(childrenRemove).to.have.been.callCount(1)
      })
    })

    it('should remove everybody even when it fail', () => {
      var Root = require('./fixtures/children-view/View')

      var rootRemove = sandbox.spy(Root.prototype, 'remove')
      var childrenRemove = sandbox.spy(Root.prototype.children.prototype, 'remove')
      sandbox.stub(Root.prototype, 'getJSON').rejects()

      return renderToString(Root, nodify, {})
                .then(_ => Promise.reject(new Error('should not have succeed')))
                .catch(() => {
                  expect(rootRemove).to.have.been.callCount(1)
                  expect(childrenRemove).to.have.been.callCount(1)
                })
    })

    it('should remove everybody even when root fail', () => {
      var Root = require('./fixtures/children-view/View')

      var rootRemove = sandbox.spy(Root.prototype, 'remove')
      var childrenRemove = sandbox.spy(Root.prototype.children.prototype, 'remove')
      sandbox.stub(Root.prototype, 'getJSON').rejects()

      return renderToString(Root, nodify, {})
                .then(_ => Promise.reject(new Error('should not have succeed')))
                .catch(() => {
                  expect(rootRemove).to.have.been.callCount(1)
                  expect(childrenRemove).to.have.been.callCount(1)
                })
    })

    it('should remove everybody even when children fail', () => {
      var Root = require('./fixtures/children-view/View')

      var rootRemove = sandbox.spy(Root.prototype, 'remove')
      var childrenRemove = sandbox.spy(Root.prototype.children.prototype, 'remove')
      sandbox.stub(Root.prototype.children.prototype, 'getJSON').rejects()

      return renderToString(Root, nodify, {})
                .then(_ => Promise.reject(new Error('should not have succeed')))
                .catch(() => {
                  expect(rootRemove).to.have.been.callCount(1)
                  expect(childrenRemove).to.have.been.callCount(1)
                })
    })

    it.skip('should remove everybody even when second children fail', () => {
      var Root = require('./fixtures/multiple-children-view/MultipleChildrenView')

      var rootRemove = sandbox.spy(Root.prototype, 'remove')
      var firstRemove = sandbox.spy(Root.prototype.children.first.prototype, 'remove')
      var secondRemove = sandbox.spy(Root.prototype.children.second.prototype, 'remove')
      sandbox.stub(Root.prototype.children.second.prototype, 'getJSON').rejects()

      return renderToString(Root, nodify, {})
                .then(_ => Promise.reject(new Error('should not have succeed')))
                .catch(() => {
                  expect(rootRemove).to.have.been.callCount(1)
                  expect(firstRemove).to.have.been.callCount(1)
                  expect(secondRemove).to.have.been.callCount(1)
                })
    })

    it('should have the good error when failing', () => {
      var Root = require('./fixtures/children-view/View')

      var error = new Error()
      error.type = 'notfound'
      sandbox.stub(Root.prototype.children.prototype, 'getJSON').rejects(error)

      return renderToString(Root, nodify, {})
                .then(_ => Promise.reject(new Error('should not have succeed')))
                .catch((v) => {
                  expect(v).to.have.property('error')
                  expect(v.error).has.property('type', 'notfound')
                })
    })
  })

  describe('Dependency between views', function () {
    var view
    afterEach(function () {
      view.remove()
    })
    it('wait child1 getJSON before child2 getJSON', () => {
      var View = require('./fixtures/view-dependency/Root')
      return renderToString(View, nodify)
            .then((v) => {
              view = v
              expect(view.el.outerHTML).to.eql(`<h1>Root</h1>
<div><p>Child: 1</p>
<p>Child: 1</p>
<p>Results: 2</p>
</div>
`)
            })
    })
  })
})
