var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: false });
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var gulpSass = require('gulp-sass')(require('sass'));

var paths = {
	src: {
		scripts: {
			entry: './app/js/main.js',
			all: './app/js/**/*.js',
		},
		stylesheets: './app/sass/**/*.sass',
	},
	dist: './dist',
};

gulp.task('lint', function () {
	return gulp.src(paths.src.scripts.all).pipe($.jshint()).pipe($.jshint.reporter('default'));
});

gulp.task(
	'scripts',
	gulp.series('lint', function () {
		return browserify(paths.src.scripts.entry, {
			debug: false,
		})
			.bundle()
			.pipe(source('bundle.js'))
			.pipe(gulp.dest(paths.dist))
			.pipe($.rename('bundle.min.js'))
			.pipe($.streamify($.uglify()))
			.pipe(gulp.dest(paths.dist));
	}),
);

gulp.task('sass', async function () {
	var autoprefixer = (await import('gulp-autoprefixer')).default;
	return gulp
		.src(paths.src.stylesheets)
		.pipe(gulpSass({ indentedSyntax: true }).on('error', gulpSass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.dist))
		.pipe($.rename('main.min.css'))
		.pipe($.cleanCss())
		.pipe(gulp.dest(paths.dist));
});

gulp.task('watch', function () {
	gulp.watch([paths.src.scripts.all], gulp.series('scripts'));
	gulp.watch([paths.src.stylesheets], gulp.series('sass'));
});

gulp.task('deploy', function () {
	return gulp
		.src(paths.dist + '/**/*', { base: paths.dist, encoding: false })
		.pipe($.ghPages());
});

gulp.task('webserver', function () {
	gulp.src(paths.dist).pipe(
		$.webserver({
			host: '0.0.0.0',
			livereload: true,
			open: true,
		}),
	);
});

gulp.task('build', gulp.parallel('scripts', 'sass'));

gulp.task('default', gulp.series('build', gulp.parallel('webserver', 'watch')));
