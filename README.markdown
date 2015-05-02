# sigh-babel

[![build status](https://circleci.com/gh/sighjs/sigh-babel.png)](https://circleci.com/gh/sighjs/sigh-babel)

Sigh plugin for compiling babel files using multiple CPUs/processes.

## Usage

You will need to `npm install --save-dev babel` before using this plugin, it uses your own installation of babel rather than bundling one.

Create a pipeline that transpiles the given source files using babel:
```javascript
module.exports = function(pipelines) {
  pipelines['js'] = [ glob('*.js'), babel(), write('build') ]
}
```

* getModulePath - A function which turns the relative file path into the module path.
```javascript
babel({ getModulePath: function(path) { return path.replace(/[^/]+\//, '') })
```
* modules - A string denoting the type of modules babel should output e.g. amd/common, see [the babel API](https://babeljs.io/docs/usage/options/).
