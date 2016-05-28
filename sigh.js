var glob, pipeline, babel, debounce, write, mocha

module.exports = function(pipelines) {


  pipelines.build = [
    glob({ basePath: 'src' }, '*.js'),
    babel({
      presets: [ 'es2015-loose', 'stage-1'],
      plugins: ['transform-es2015-modules-commonjs'],
    }),
    write('lib')
  ]

  pipelines.test = [
    pipeline('build'),
    debounce(700),
    pipeline({ activate: true }, 'mocha')
  ]

  pipelines.explicit.mocha = [ mocha({ files: 'lib/*.spec.js' }) ]
}
