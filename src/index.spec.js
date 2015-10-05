import _ from 'lodash'
import Promise from 'bluebird'
import { Bacon } from 'sigh-core'
import ProcessPool from 'process-pool'

import Event from 'sigh/lib/Event'
import babel from './'

require('source-map-support').install()
require('chai').should()

describe('babel plugin', () => {
  // TODO: use a single babel plugin for all tests to avoid all the delays due
  //       to starting subprocesses.
  var procPool
  beforeEach(() => { procPool = new ProcessPool })

  it('compiles a single add event', function() {
    this.timeout(2500)

    var data = 'var pump = () => "pumper"'
    var event = new Event({
      basePath: 'root',
      path: 'root/subdir/file.js',
      type: 'add',
      data
    })
    var stream = Bacon.constant([ event ])

    return babel({ stream, procPool }).toPromise(Promise).then(events => {
      events.length.should.equal(1)

      var { data, sourceMap } = events[0]
      data.should.equal('define("subdir/file", ["exports"], function (exports) {\n  "use strict";\n\n  var pump = function pump() {\n    return "pumper";\n  };\n});')
      sourceMap.mappings.should.equal(';;;AAAA,MAAI,IAAI,GAAG,SAAP,IAAI;WAAS,QAAQ;GAAA,CAAA')
      sourceMap.file.should.equal(event.path)
    })
  })
  
  it('forwards module option to Babel module', function() {
    this.timeout(2500)

    var data = 'var pump = () => "pumper"'
    var event = new Event({
      basePath: 'root',
      path: 'root/subdir/file.js',
      type: 'add',
      data
    })
    var stream = Bacon.constant([ event ])

    return babel({ stream, procPool }, { modules: 'common' }).toPromise(Promise).then(events => {
      events.length.should.equal(1)

      var { data, sourceMap } = events[0]
      data.should.equal('"use strict";\n\nvar pump = function pump() {\n  return "pumper";\n};')
      sourceMap.mappings.should.equal(';;AAAA,IAAI,IAAI,GAAG,SAAP,IAAI;SAAS,QAAQ;CAAA,CAAA')
      sourceMap.file.should.equal(event.path)
    })
  })
  
  it('forwards optional settings to Babel module', function() {
    this.timeout(2500)

    var data = 'function* gen() {}'
    var event = new Event({
      basePath: 'root',
      path: 'root/subdir/file.js',
      type: 'add',
      data
    })
    var stream = Bacon.constant([ event ])

    return babel({ stream, procPool }, { optional: ['runtime'] }).toPromise(Promise).then(events => {
      events.length.should.equal(1)

      var { data, sourceMap } = events[0]
      data.should.equal('define("subdir/file", ["exports", "babel-runtime/regenerator"], function (exports, _babelRuntimeRegenerator) {\n  "use strict";\n\n  var marked0$0 = [gen].map(_babelRuntimeRegenerator["default"].mark);\n  function gen() {\n    return _babelRuntimeRegenerator["default"].wrap(function gen$(context$1$0) {\n      while (1) switch (context$1$0.prev = context$1$0.next) {\n        case 0:\n        case "end":\n          return context$1$0.stop();\n      }\n    }, marked0$0[0], this);\n  }\n});')
      sourceMap.mappings.should.equal(';;;mBAAU,GAAG;AAAb,WAAU,GAAG;;;;;;;;GAAK')
      sourceMap.file.should.equal(event.path)
    })
  })
})
