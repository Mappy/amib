'use strict'

var expect = require('chai').expect
var sinon = require('sinon')
var renderToDOM = require('./render').renderToDOM
var invokePostRender = require('./render').invokePostRender

var NoChildrenView = require('./fixtures/no-children/NoChildrenView')
var NoChildrenWithModelView = require('./fixtures/no-children-with-model/NoChildrenWithModelView')
var RecursiveChildrenView = require('./fixtures/recursive-children-view/RecursiveChildrenView')
var OneChildrenWithModelView = require('./fixtures/recursive-children-view/one-children-view/OneChildrenWithModelView')
var MultipleChildrenView = require('./fixtures/multiple-children-view/MultipleChildrenView')
var RootPostRenderView = require('./fixtures/post-render/Root')
var ChildPostRenderView = require('./fixtures/post-render/ChildPostRender')
var ChildPromiseView = require('./fixtures/post-render/ChildPromise')
var ThrowErrorView = require('./fixtures/throw-error/ThrowError')
var View = require('./fixtures/children-view/View')

describe('renderToDOM', function () {
  var sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })
  afterEach(function () {
    sandbox.restore()
  })

  it('call set element', function () {
    sandbox.spy(NoChildrenView.prototype, 'setElement')
    return renderToDOM(NoChildrenView).then(function (view) {
      expect(view.setElement.callCount).to.equal(2)
            // @see http://backbonejs.org/docs/backbone.html#section-152
    })
  })

  describe('generate HTML elements', function () {
    it('render terminal view with model', function () {
      return renderToDOM(NoChildrenWithModelView, {body: 'body'}).then(function (view) {
        expect(view.$el.html()).to.equal('<h1>NoChildrenWithModelView</h1> body ')
      })
    })

    it('call render multiple children', function () {
      return renderToDOM(MultipleChildrenView).then(function (view) {
        var h2Count = view.$el.find('h2').size()
        expect(h2Count).to.equal(2)
      })
    })

    it('call render recurse children', function () {
      return renderToDOM(RecursiveChildrenView).then(function (view) {
        expect(view.$el.html()).to.contain('deep')
      })
    })

    it('channel go in child view on a ChildrenView', function () {
      return renderToDOM(View)
                .then(function (view) {
                  expect(view).to.have.property('options')
                  expect(view.options).to.have.property('channel')
                  sandbox.stub(view.options.channel, 'trigger')

                  view.$el.find('h3').click()

                  expect(view.options.channel.trigger.called).to.equal(true)
                })
    })
  })

  describe('#invokePostRender', function () {
    it('should call postRender on a unique view', function () {
      sandbox.spy(ChildPostRenderView.prototype, 'postRender')

      return renderToDOM(ChildPostRenderView).then(function (view) {
        expect(view.postRender.callCount).to.equal(0)
        invokePostRender(view)
        expect(view.postRender.callCount).to.equal(1)
      })
    })
    it('should call postRender on all views', function () {
      sandbox.spy(RootPostRenderView.prototype, 'postRender')
      sandbox.spy(ChildPromiseView.prototype, 'postRender')
      sandbox.spy(ChildPostRenderView.prototype, 'postRender')

      return renderToDOM(RootPostRenderView).then(function (view) {
        view.postRender.should.have.callCount(0)
        invokePostRender(view)
        view.postRender.should.have.callCount(1)
        view.views.promised.postRender.should.have.callCount(1)
        view.views.postRender.postRender.should.have.callCount(1)
      })
    })
  })

  describe('attach listeners', function () {
    it('should attach to root component', function () {
      sandbox.stub(NoChildrenView.prototype, 'onclick')
      return renderToDOM(NoChildrenView).then(function (view) {
        view.$el.find('h1').click()
        expect(view.onclick.callCount).to.equal(1)
      })
    })

    it('should attach to deep component', function () {
      return renderToDOM(RecursiveChildrenView).then(function (view) {
        var deepNode = view.$el.find('div div div')
                // When
        deepNode.click()

                // Then
        expect(view.$el.find('div div div').text()).to.equal('clicked')
      })
    })

    it('should have child instances', function () {
      return renderToDOM(RecursiveChildrenView).then(function (view) {
        expect(view.views).to.be.an('array').and.to.have.length.of(1)
        expect(view.views[0]).to.be.an('object').and.to.have.a.property('template')
        expect(view.views[0].template).to.be.an('object').and.to.have.a.property('id')
        expect(view.views[0].template.id).to.equal(OneChildrenWithModelView.prototype.template.id)
      })
    })

    it('should have child instances even if child fail', function () {
      sandbox.stub(RecursiveChildrenView.prototype.children.prototype, 'getJSON').rejects()
      return renderToDOM(RecursiveChildrenView).then(function (view) {
        return Promise.reject(new Error('should not be resolved'))
      }).catch(function (view) {
        expect(view).to.have.property('views')
        expect(view.views).to.be.an('array').and.to.have.length.of(1)
        expect(view.views[0]).to.be.an('object').and.to.have.a.property('template')
        expect(view.views[0].template).to.be.an('object').and.to.have.a.property('id')
        expect(view.views[0].template.id).to.equal(OneChildrenWithModelView.prototype.template.id)
      })
    })
  })

  describe('error managment', function () {
    it('should return view & error on error', function () {
      return renderToDOM(ThrowErrorView).then(function (view) {
        throw new Error('should not call success callback')
      }, function (view) {
        expect(view).to.not.equal(undefined)
        expect(view).to.have.property('cid')
        expect(view.error.message).to.equal('error from getJSON')
      })
    })
  })
})
