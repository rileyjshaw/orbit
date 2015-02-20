var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var paths = {
  src: {
    scripts: {
      entry: './app/js/main.js',
      all: './app/js/**/*.js'
    },
    stylesheets: './app/sass/**/*.sass'
  },
  dist: './dist'
};

gulp.task('lint', function () {
  return gulp.src(paths.src.scripts.all)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function () {
  return browserify(paths.src.scripts.entry, {
      debug: false
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe($.rename('bundle.min.js'))
    .pipe($.streamify($.uglify()))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('sass', function () {
  return gulp.src(paths.src.stylesheets)
    .pipe($.sass({ indentedSyntax: true }))
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.dist))
    .pipe($.rename('main.min.css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.dist))
});

gulp.task('watch', function () {
  gulp.watch([paths.src.scripts.all], ['scripts']);
  gulp.watch([paths.src.stylesheets], ['sass']);
});

gulp.task('deploy', function () {
  gulp.src(paths.dist + '/*.*')
    .pipe($.ghPages('https://github.com/rileyjshaw/orbit.git', 'origin'));
});

gulp.task('webserver', function () {
  gulp.src(paths.dist)
    .pipe($.webserver({
      host: '0.0.0.0',
      livereload: true,
      open: true
    }));
});

gulp.task('build', ['scripts', 'sass']);

gulp.task( 'default', [ 'build', 'webserver', 'watch' ] );
