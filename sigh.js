var glob, pipeline, babel, debounce, write, mocha

module.exports = function(pipelines) {
  pipelines.build = [
    glob({ basePath: 'src' }, '*.js'),
    babel({ modules: 'common' }),
    write('lib')
  ]

  pipelines.test = [
    pipeline('build'),
    debounce(700),
    pipeline({ activate: true }, 'mocha')
  ]

  pipelines.explicit.mocha = [ mocha({ files: 'lib/*.spec.js' }) ]
}
