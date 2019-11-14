var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var version = require('./package.json').version;

gulp.task('clean', function () {
    return gulp.src([
        'example/js',
        'dist/'
    ]).pipe($.clean({force: true}));
});

gulp.task('js', function () {
    return gulp.src([
        'node_modules/long/dist/long.min.js',
        'node_modules/zlibjs/bin/gunzip.min.js',
        'node_modules/rusha/rusha.min.js',
        'node_modules/ioc-js/dist/ioc-js.min.js',

        'src/vendor/**/*.js',
        'src/js/**/*.js',

        'src/telegramApi.js',
        'src/IoC.js'
    ])
        .pipe($.concat('telegramApi.js'))
        .pipe($.wrapper({
            header:  '(function(){\n',
            footer: '\n})();'
        }))
        .pipe(gulp.dest('example'))

        // .pipe($.rename({suffix: '.min'}))
        // .pipe($.uglify())
        // .pipe($.wrapper({header: about}))
        .pipe(gulp.dest('example'));
});

gulp.task('copy', function () {
    gulp.src('dist/**/*.js')
        .pipe(gulp.dest('example/js'));
});

gulp.task('server', function () {
    gulp.start('js');
    gulp.src('example')
        .pipe($.webserver({open: true, livereload: true}));
});

gulp.task('build', ['clean', 'js']);
