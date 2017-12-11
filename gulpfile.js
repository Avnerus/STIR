'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var autoprefixer = require ('gulp-autoprefixer');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rollup = require('rollup-stream');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var buble = require( 'rollup-plugin-buble');
var riot = require('rollup-plugin-riot');
var nodent = require('rollup-plugin-nodent');
var uglify = require('rollup-plugin-uglify');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');
var todo = require('gulp-todo');
var exec = require('child_process').exec;

var server;
var watchEvent;

var rollupCache;

// ENV
gulp.task('env', function() {
  process.env.APP_BASE_PATH = __dirname;
});

gulp.task('todo', function() {
    gulp.src('src/**/*.js')
    .pipe(todo())
    .pipe(gulp.dest('./'));
    // -> Will output a TODO.md with your todos
});

gulp.task('css', function() {
    // Extract the CSS from the JS Files and place into a single style with autoprefixer
    return gulp.src('src/app/**/*.tag')
    .pipe(replace(/(^[\s\S]*<style>|<\/style>[\s\S]*$)/gm, ''))
    .pipe(concat('style.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('public/css'));
});

gulp.task('css-watch',['css'], function() {
      gulp.watch(['./src/app/**/*.tag'], ['css']);
});

gulp.task('rollup', function() {
 
 var rollupOptions = {
    entry: 'src/client/index.js',
    external: ['jquery'],
    globals: {
        jquery: '$'
    },
    cache: rollupCache,
    format: 'umd',
    plugins: [
      riot({skip: 'css'}),
      nodent({runtime: true}),
      buble(),
      commonjs(),
      nodeResolve({
        jsnext: true,
        main: true
      })
    ]
 };

 if (process.env.NODE_ENV == 'production') {
     rollupOptions.plugins.push(uglify());
 }

 var stream = rollup(rollupOptions)
  .on('error', function(error) {
      console.error("Rollup error", error);
      stream.end();
  })
  .on('bundle', function(bundle) {
      rollupCache = bundle;
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./public'));

  return stream;
});

gulp.task('rollup-watch',['rollup'], function() {
      gulp.watch(['./src/app/**/*.*','./src/client/**/*.js'], ['rollup']);

});

// serve task
gulp.task('serve', ['env','rollup-watch', 'css-watch'] , function(cb) {

    /*
    if (process.env.NODE_ENV == 'production') {
      var nodeProcess =  exec('node ./src/server/index.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      });

      nodeProcess.stdout.pipe(process.stdout);
      nodeProcess.stderr.pipe(process.stderr);
      nodeProcess.on('exit', function(code) {
          console.log("NODE EXIT  - CODE",code);
          process.exit(code);
      });

    } else {*/
        return nodemon({
             //exec: './node_modules/.bin/babel-node --presets es2015-riot,stage-2',
             exec: 'node',
             script: './src/server/index.js',
             watch: './src/server/'
        });
    //}


  //gulp.watch(['./src/**/*.js'], function(event) {
  /*
      watchEvent = event;
      gulp.start('reload-server');
  });
  gulp.watch('app.js', server.start);*/
});

gulp.task('reload-server', ['public'], function() {
    console.log("Reloading server!")
    server.notify(watchEvent) ;
});


// Delete build Directory
gulp.task('delete-build', function() {
  rimraf('./build', function(err) {
    plugins.util.log(err);
  });
});


// Default
gulp.task('default', ['serve']);



// DISTRIBUTION TASKS (TODO)
//===============================================
