import gulp from 'gulp'
import zip from 'gulp-zip'
import del from 'del'
import install from 'gulp-install'
import runSequence from 'run-sequence'
import awsLambda from "node-aws-lambda"
import babel from 'gulp-babel'

gulp.task('clean', function() {
    return del(['./dist', './dist.zip']);
});

gulp.task('js', function() {
    return gulp.src('src/*')
        .pipe(
            babel({
                presets: ['es2015']
            })
        )
        .pipe(gulp.dest('dist/'));
});

gulp.task('node-mods', function() {
    return gulp.src('./package.json')
        .pipe(gulp.dest('dist/'))
        .pipe(install({production: true}));
});

gulp.task('zip', function() {
    return gulp.src(['dist/**/*', '!dist/package.json'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', function(callback) {
    awsLambda.deploy('./dist.zip', require("./conf/lambda-config.js"), callback);
});

gulp.task('deploy', function(callback) {
    return runSequence(
        ['clean'],
        ['js', 'node-mods'],
        ['zip'],
        ['upload'],
        callback
    );
});