import path from 'path'
import { Bacon } from 'sigh-core'
import _ from 'lodash'

import { mapEvents } from 'sigh-core/lib/stream'

function eventCompiler() {
  var babel = require('babel-core')
  var _ = require('lodash')
  var instances = {}

  return function(instance, event) {
    if (instance.createInstance) {
      var newInstance = instance.instance
      instances[newInstance] = instance.opts
      return {}
    }
    var opts = instances[instance]

    const {projectPath, path} = event

    var babelOpts = _.assign({}, {
      filename: path,
      filenameRelative: projectPath,
      moduleId: projectPath.replace(/\..*$/, ''),
      moduleRoot: event.basePath,
      sourceFileName: path,
      sourceMapTarget: path,
      sourceMap: true,
    }, opts)

    var result = babel.transform(event.data, babelOpts)
    return _.pick(result, 'code', 'map')
  }
}

// (de)serialise argument to and result of babel subprocess
function adaptEvent(instance, compiler) {
  return event => {
    if (event.type !== 'add' && event.type !== 'change')
      return event

    var { fileType } = event
    if (fileType !== 'js' && fileType !== 'es6')
      return event

    var result = compiler(instance, _.pick(event, 'type', 'data', 'path', 'basePath', 'projectPath'))

    // without proc pool a Promise.resolve is needed here
    return result.then(result => {
      event.data = result.code
      event.applySourceMap(result.map)
      return event
    })
  }
}

var pooledProc
var lastInstance = 0

export default function(op, opts = {}) {
  if (! pooledProc)
    pooledProc = op.procPool.prepare(eventCompiler)

  ++lastInstance
  pooledProc.all({ createInstance: true, instance: lastInstance, opts })

  return mapEvents(op.stream, adaptEvent(lastInstance, pooledProc))
}
