var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');



gulp.task('lessToCompressedCss', function () {
    // Take the LESS from a folder
    return gulp.src('style/*.less')
        .pipe(sourcemaps.init())
        // Compile the LESS
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        // Minify
        .pipe(cleanCSS({compatibility: 'ie8'}))
        // Makes map
        .pipe(sourcemaps.write('maps'))
        // and put it at folder
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

// adding watcher
gulp.task('taskWatch', function () {
    livereload.listen();
    // if any .less file was changed do the task
    gulp.watch('style/*.less', ['lessToCompressedCss']);
})


gulp.task('default', ['lessToCompressedCss']);
