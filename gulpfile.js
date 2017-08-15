var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Compiles SCSS files from /scss into /css
gulp.task('sass', function() {
  return gulp.src('scss/tangerinebeauty.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
  return gulp.src('css/tangerinebeauty.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify custom JS
gulp.task('minify-js', function() {
  var gulpTask = gulp.src(['js/contact_me.js', 'js/jqBootstrapValidation.js', 'js/tangerinebeauty.js']);
  if (process.env.NODE_ENV === 'production') gulpTask = gulpTask.pipe(uglify());
  return gulpTask
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Copy vendor files from /node_modules into dist/vendor
// NOTE: requires `npm install` before running!
// Copy other static assets to dist
gulp.task('copy', function() {
  gulp.src([
      'node_modules/bootstrap/dist/**/*',
      '!**/npm.js',
      '!**/bootstrap-theme.*',
      '!**/*.map'
    ])
    .pipe(gulp.dest('dist/vendor/bootstrap'));

  gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('dist/vendor/jquery'));

  gulp.src(['node_modules/popper.js/dist/umd/popper.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(gulp.dest('dist/vendor/popper'));

  gulp.src(['node_modules/jquery.easing/*.js'])
    .pipe(gulp.dest('dist/vendor/jquery-easing'));

  gulp.src([
      'node_modules/font-awesome/**',
      '!node_modules/font-awesome/**/*.map',
      '!node_modules/font-awesome/.npmignore',
      '!node_modules/font-awesome/*.txt',
      '!node_modules/font-awesome/*.md',
      '!node_modules/font-awesome/*.json'
    ])
    .pipe(gulp.dest('dist/vendor/font-awesome'));

  // Copy img
  gulp.src([
        'img/**',
      ])
      .pipe(gulp.dest('dist/img'));
})

gulp.task('copy-html', function () {
  // Copy html
  return gulp.src([
    'index.html',
  ])
  .pipe(gulp.dest('dist'));
});

// Default task
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'copy', 'copy-html']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    port: 8080,
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js', 'copy', 'copy-html'], function() {
  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', ['copy-html', browserSync.reload]);
  gulp.watch('js/**/*.js', browserSync.reload);
});
