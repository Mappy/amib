'use strict'

var _ = require('lodash/core')
var assign = require('lodash/assign')
var invoke = require('lodash/invoke')
var backbone = require('backbone')
var debug = require('debug')('render')

function objectLiteral (key, value) {
  var o = {}
  o[key] = value
  return o
}

function objectReducer (objAsArray, resolved) {
  return resolved.reduce(function (reduced, view) {
    var key = objAsArray[Object.keys(reduced).length].key

    return assign({}, reduced, objectLiteral(key, view))
  }, {})
}

function arrayReducer (objAsArray, resolved) {
  return resolved.reduce(function (reduced, view) {
    return reduced.concat(view)
  }, [])
}

function mappable (obj) {
  if (typeof obj === 'object') {
    return {mappable: obj, reducer: objectReducer}
  }
  return {mappable: [obj], reducer: arrayReducer}
}

function promisify (model) {
  return (model instanceof Promise) ? model : Promise.resolve(model)
}

function buildPlaceHolder (view) {
  return view ? '<div id="' + view.cid + '"></div>' : ''
}

function applyEach (obj, transform) {
  if (!obj) {
    return ''
  } else if (_.isArray(obj) && obj.length > 0) {
    return transform(obj[0])
  }
  return _.reduce(obj, function (reduced, value, key) {
    reduced[key] = transform(value)
    return reduced
  }, {})
}

function renderLeaf (view, postRender, add2model) {
  return function (resolvedChildren) {
    debug('renderLeaf', view.type)
    return promisify((view.getJSON || _.noop).call(view)).then(function (resolvedJSON) {
      debug('renderLeaf.getJSON', view.type)
      var model = assign({}, resolvedJSON, {children: applyEach(resolvedChildren, buildPlaceHolder)}, (add2model || _.noop)())
      var html = view.template.render(model)
      debug(view.cid, view.displayName, html)
      view.setElement(html)

      var callbackForChildren = postRender(view)
      applyEach(resolvedChildren, callbackForChildren)
      debug('renderLeaf.getJSON-end', view.type)

      return view
    }, function (error) {
      view.error = error
      debug('renderLeaf.catch', view.type, view.cid, 'error')
      return Promise.reject(view)
    })
  }
}

function resolveValuesAsPromise (objKeyPromise, reducer) {
  var objAsArray = _.map(objKeyPromise, function (view, key) {
    return {view: view, key: key}
  })
  return Promise.all(objAsArray.map(function (x) {
    return x.view
  })).then(function (resolved) {
    return reducer(objAsArray, resolved)
  })
}

function getSubViews (nodifyBackbone, view, recursive) {
  if (view && view.children) {
    var childrenList = mappable(view.children)
    return {
      mappable: _.map(childrenList.mappable, function (childClass, name) {
        debug('getSubViews', view.type, name)
        return {
          name: name,
          view: recursive(childClass, nodifyBackbone)
        }
      }),
      reducer: childrenList.reducer
    }
  }
  return {mappable: [], reducer: arrayReducer}
}

function rebuildChildrenModel (reduced, subViewModel) {
  return assign({}, reduced, objectLiteral(subViewModel.name, subViewModel.view))
}

function renderNode (postRender, options, add2model, View, viewTransformer) {
  var view = new (viewTransformer(View))(options)
  debug('renderNode.new', view.type, view.cid)

  var newOptions = assign({}, invoke(view, 'getChildContext'), options)
  var subViews = getSubViews(viewTransformer, view, renderNode.bind(null, postRender, newOptions, add2model))

  var childrenModel = subViews.mappable.reduce(rebuildChildrenModel, {})

  return resolveValuesAsPromise(childrenModel, subViews.reducer)
        .then(function (resolvedChildren) {
          view.views = resolvedChildren
          return resolvedChildren
        })
        .catch(function (child) {
          debug('renderNode.catch0', view.type, view.cid, 'current error=', Boolean(view.error), child.type, child.cid, 'child error=', Boolean(child.error))
          view.views = [child]
          view.error = child.error
          return Promise.reject(view)
        })
        .then(renderLeaf(view, postRender, add2model))
        .catch(function (e) {
          debug('renderNode.catch', view.type, view.cid, 'error')
          if (!(e instanceof backbone.View)) {
            view.error = e
          }
          return Promise.reject(view)
        })
}

function renderToString (View, viewTransformer, options, add2model) {
  function clean (view) {
    view.remove()
    return view
  }
  function postRender (view) {
    return function replaceChildren (child) {
      view.el.outerHTML = view.el.outerHTML.replace(buildPlaceHolder(child), (child.el && child.el.outerHTML) || '')
    }
  }

  return renderNode(postRender, options, add2model, View, viewTransformer)
        .then(clean)
        .catch(function (v) {
          clean(v)
          return Promise.reject(v)
        })
}

function renderToDOM (View, options) {
  function postRender (view) {
    return function replaceChildren (child) {
      debug('replaceChildren', view.cid, view.displayName, child.cid, child.displayName)
      view.$el.find('#' + child.cid).replaceWith(child.$el)
    }
  }

  return renderNode(postRender, options, _.noop, View, _.identity)
}

function invokePostRender (view) {
  debug('invokePostRender', view.cid, view.displayName)
  _.forEach(view.views, invokePostRender)
  invoke(view, 'postRender')
}

module.exports.renderToString = renderToString
module.exports.renderToDOM = renderToDOM
module.exports.promisify = promisify
module.exports.invokePostRender = invokePostRender
