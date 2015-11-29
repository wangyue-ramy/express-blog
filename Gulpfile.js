var less = require('gulp-less');
var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('templates' ,function() {
    gulp.src('./dev/templates/*')
        .pipe(gulp.dest('./public/views'));
});

gulp.task('less', function() {
    gulp.src('./dev/less/styles.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('jshint', function() {
    gulp.src('./dev/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
})

gulp.task('uglify', function() {
    gulp.src('./dev/scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('images', function() {
    gulp.src('./dev/images/*')
        .pipe(gulp.dest('./public/images'));
});

gulp.task('watch', function() {
    gulp.watch('dev/less/*.less', ['less']);
    gulp.watch('dev/scripts/*.js', ['uglify']);
    gulp.watch('dev/images', ['images']);
    gulp.watch('dev/templates/*', ['templates']);
});


gulp.task('default', function() {
    gulp.run('templates', 'less', 'jshint', 'uglify', 'images', 'watch');
});
