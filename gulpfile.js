"use strict";

var gulp            = require('gulp');
var connect         = require('gulp-connect');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var minifyCss       = require('gulp-minify-css');
var uglify          = require('gulp-uglify');
var traceur         = require('gulp-traceur');
var plumber         = require('gulp-plumber');
var concat          = require('gulp-concat');
var svgstore        = require('gulp-svgstore');
var svgmin          = require('gulp-svgmin');
var inject          = require('gulp-inject');


// ============== CONFIG ==============
var cfg = {
	src: {},
	build: {}
};

cfg.src.dir = './src/';
cfg.src.scssPattern = cfg.src.dir + 'scss/*.scss';
cfg.src.scssDir = cfg.src.dir + 'scss/';
cfg.src.htmlPattern = cfg.src.dir + '*.html';
cfg.src.jsPattern = cfg.src.dir + 'js/*.js';
cfg.src.iconPattern = cfg.src.dir + 'icons/*.svg';
cfg.src.picPattern = cfg.src.dir + 'pics/*.*';

cfg.build.dir = './build/';
cfg.build.cssDir = cfg.build.dir + 'css/';
cfg.build.jsDir = cfg.build.dir + 'js/';
cfg.build.mainJsFile = 'script.js';
cfg.build.picDir = cfg.build.dir + 'pics/';

// ============== MAIN ==============


//connect
gulp.task('connect', function () {
    connect.server({
        root: cfg.build.dir,
        livereload: true
    });
});


// sass
gulp.task('sass', function () {
    console.log('gulp: sass');
    gulp.src(cfg.src.scssPattern)
        .pipe(plumber())
        .pipe(sass({
            includePaths: [cfg.src.scssDir]
        }))
        .pipe(autoprefixer('last 15 versions'))
        .pipe(minifyCss())
        .pipe(gulp.dest(cfg.build.cssDir))
        .pipe(connect.reload());
});


// js
gulp.task('js', function () {
    console.log('gulp: js');
    gulp.src(cfg.src.jsPattern)
        .pipe(plumber())
        .pipe(concat(cfg.build.mainJsFile))
        .pipe(traceur())
        .pipe(uglify())
        .pipe(gulp.dest(cfg.build.jsDir))
        .pipe(connect.reload());
});


// html
gulp.task('html', function () {
    console.log('gulp: html');
    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    var svgs = gulp
        .src(cfg.src.iconPattern)
        .pipe(svgstore({ inlineSvg: true }));

    gulp.src(cfg.src.htmlPattern)
        .pipe(plumber())
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest(cfg.build.dir))
        .pipe(connect.reload());
});


gulp.task('pics', function() {
    console.log('gulp: pics');
    gulp.src(cfg.src.picPattern)
        .pipe(gulp.dest(cfg.build.picDir));
});


// watch
gulp.task('watch', function () {
    gulp.watch(cfg.src.scssPattern, ['sass']);
    gulp.watch(cfg.src.htmlPattern, ['html']);
    gulp.watch(cfg.src.jsPattern, ['js']);
    gulp.watch(cfg.src.picPattern, ['pics']);
});


// default
gulp.task('default', ['connect', 'sass', 'js', 'html', 'pics', 'watch']);