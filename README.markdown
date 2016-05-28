# sigh-babel

[![build status](https://circleci.com/gh/sighjs/sigh-babel.png)](https://circleci.com/gh/sighjs/sigh-babel)

Sigh plugin for transpiling files with babel6 over multiple CPUs/processes.

## Usage

You will need to `npm install --save-dev babel` before using this plugin, it uses your own installation of babel rather than bundling one. Since babel-6/sigh-babel-0.12 you will also need to install any plugins/presets you wish to use to customise babel.

Create a pipeline that transpiles the given source files using babel:
```javascript
module.exports = function(pipelines) {
  pipelines['js'] = [
    glob('*.js'),
    babel({ presets: ['es2015-loose'], plugins: ['transform-es2015-modules-amd'] }),
    write('build')
  ]
}
```

## babel 5

You will need to use sigh-babel verson 0.11.x and below for babel 5 support.
```
   npm install sigh-babel@0.11
```
