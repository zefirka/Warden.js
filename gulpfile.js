'use strict';

const gulp        = require('gulp');
const include     = require('gulp-include');
const uglify      = require('gulp-uglify');
const jasmine     = require('gulp-jasmine');
const rename      = require('gulp-rename');
const gzip        = require('gulp-gzip');
const sourcemaps  = require('gulp-sourcemaps');
const benchmark   = require('gulp-benchmark');

gulp
  .task('concat', () => {
    gulp.src('./src/warden.js')
      .pipe( include() )
      .pipe( gulp.dest('./dist'))
  })
  .task('gzip', () => {
    gulp.src('./dist/warden.min.js')
      .pipe(gzip() )
      .pipe(rename('warden.js.gz'))
      .pipe(gulp.dest('./dist'))
  })
  .task('compress', () => {
    gulp.src('./dist/warden.js')
      .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename('warden.min.js'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'))
  })
  .task('dev:test', () => {
    gulp.src('./test/src/*Spec.js')
      .pipe( include() )
      .pipe( gulp.dest('./test/specs/'));
  })
  .task('test', ['dev:test', 'bench'], () => {
    gulp.src('./test/specs/*Spec.js')
      .pipe(jasmine())
  })
  .task('bench', () => {
    gulp.src('./test/benchmarks/*.js', {read: false})
      .pipe(benchmark({
        reporters: benchmark.reporters.etalon('RegExp#test')
      }));
  })
  .task('watch', () => {
    gulp.watch('./src/**/*.js', ['build'])
  })
  .task('build', ['concat', 'compress', 'gzip'])
  .task('default', ['build', 'test', 'watch']);
