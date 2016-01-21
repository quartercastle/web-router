var gulp = require('gulp'),
    util = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    ftp = require('vinyl-ftp'),
    browserify = require('gulp-browserify'),
    del = require('del');


gulp.task('clean', function(){
  del(['dist']);
});


gulp.task('js', function(){
  gulp.src(['src/app.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(browserify({
      insertGlobals: true,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/'));
});


gulp.task('build', ['clean', 'js']);


gulp.task('default',function() {
    gulp.watch(['src/**/*.js'], ['js']);
});
