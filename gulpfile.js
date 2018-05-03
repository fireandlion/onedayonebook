// NOTE: gulp-responsive-images requires GraphicsMagick to be installed.
// See https://github.com/dcgauld/gulp-responsive-images for details.

'use strict';

var gulp = require('gulp'),
    responsive = require('gulp-responsive-images'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    watch = require('gulp-watch'),
    newer = require('gulp-newer'),
    gm = require('gulp-gm'),
    svgmin = require('gulp-svgmin'),
    fileExists = require('file-exists');

// set up paths for later
var paths = {
    img: {
        source: '_source/images/',
        output: 'images/'
    },
    js: {
        src: 'js/',
        dest: 'js/'
    }
};

// Set bitmap filetypes to convert, comma separated, no spaces.
var filetypes = 'jpg,jpeg,gif,png';

// User guidance
console.log('If you\'re having trouble with image conversions, check that you have GraphicsMagick installed (http://www.graphicsmagick.org/).')

// Minify and clean SVGs and copy to destinations.
gulp.task('images:svg', function () {
    console.log('Processing SVG images from ' + paths.img.source);
    gulp.src(paths.img.source + '*.svg')
    .pipe(svgmin({
       plugins: [{
            removeAttrs: { attrs: 'data.*' }
        }, {
            removeUnknownsAndDefaults: {
                defaultAttrs: false
            }
        }],
    }))
    .pipe(gulp.dest(paths.img.output));
});

// Take the print images and optimise and resize them
gulp.task('images:optimise', function () {
    console.log('Optimising images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.output))
            .pipe(responsive({
            '*': [{
                width: 810,
                quality: 90,
                upscale: false
            }]
        }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.output));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
});

// Make small size images for use in srcset in _includes/figure
gulp.task('images:small', function () {
    console.log('Creating small images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.output))
            .pipe(responsive({
            '*': [{
                width: 320,
                quality: 90,
                upscale: false,
                suffix: '-320'
            }]
        }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.output));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
});

// Make medium size images for use in srcset in _includes/figure
gulp.task('images:medium', function () {
    console.log('Creating medium-sized images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.output))
            .pipe(responsive({
            '*': [{
                width: 640,
                quality: 80,
                upscale: false,
                suffix: '-640'
            }]
        }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.output));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
});

// Make large size images for use in srcset in _includes/figure
gulp.task('images:large', function () {
    console.log('Creating large images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.output))
            .pipe(responsive({
            '*': [{
                width: 1024,
                quality: 80,
                upscale: false,
                suffix: '-1024'
            }]
        }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.output));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
});

// minify JS files to make them smaller
gulp.task('js', function() {
    console.log('Minifying scripts in ' + paths.js.source);
    gulp.src(paths.js.src)
    .pipe(uglify())
    .pipe(rename({ suffix:'.min' }))
    .pipe(gulp.dest(paths.js.dest));
});

// lint the JS files: check for errors and inconsistencies
gulp.task('jslint', function() {
    console.log('Linting scripts in ' + paths.js.source);
    gulp.src(paths.js.src)
    .pipe(eslint({
        configFile: 'eslint.json',
        fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// watch the JS files for changes, run jslin and js tasks when they do
gulp.task('watch', function() {
    console.log('Watching scripts in ' + paths.js.source);
    gulp.watch(paths.js.src, ['jslint', 'js']);
});

// when running `gulp`, do the four image tasks
gulp.task('default', ['images:svg', 'images:optimise', 'images:small', 'images:medium', 'images:large']);
