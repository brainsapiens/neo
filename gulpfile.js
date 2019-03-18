const {src, dest, parallel, watch, lastRun, series} = require('gulp');
const autoprefixer = require('autoprefixer');
const cp = require('child_process');
const del = require('del');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const posthtml = require('gulp-posthtml');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const stylelint = require('gulp-stylelint');
const uglify = require('gulp-uglify');
const minifyCSS = require('postcss-clean');
const validateHTML = require('posthtml-w3c');

// Config
const config = require('./gulpfile.config.json');

// Clean

function clean() {
    return del('dist/');
}

// Modernizr
function buildModernizr() {
    return cp.exec('./node_modules/modernizr/bin/modernizr -c ./modernizr.config.json -d ./dist/js/modernizr.js -u');
}

// Views
function buildViews() {
    return src(config.paths.views.src)
        .pipe(plumber(function (error) {
            error.messageFormatted;
        }))
        .pipe(changed(config.paths.views.dest))
        .pipe(pug(config.options.pug))
        .pipe(plumber.stop())
        .pipe(dest(config.paths.views.dest))
        .pipe(connect.reload());
}

// Vendor styles
function vendorStyles() {
    return src(config.paths.vendorStyles.src)
        .pipe(concat(config.paths.vendorStyles.concat))
        .pipe(postcss([
            minifyCSS()
        ]))
        .pipe(dest(config.paths.vendorStyles.dest));
}

// Styles
function buildStyles() {
    return src(config.paths.styles.src)
        .pipe(plumber(function (error) {
            error.messageFormatted;
        }))
        .pipe(sass(config.options.sass))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(plumber.stop())
        .pipe(dest(config.paths.styles.dest))
        .pipe(connect.reload());
}

// Vendor scripts
function vendorScripts() {
    return src(config.paths.vendorScripts.src)
        .pipe(uglify())
        .pipe(concat(config.paths.vendorScripts.concat))
        .pipe(dest(config.paths.vendorScripts.dest));
}

// Scripts
function buildScripts() {
    return src(config.paths.scripts.src)
        .pipe(plumber(function (error) {
            error.messageFormatted;
        }))
        .pipe(babel())
        .pipe(concat(config.paths.scripts.concat))
        .pipe(plumber.stop())
        .pipe(dest(config.paths.scripts.dest))
        .pipe(connect.reload());
}

// Vendor fonts
function vendorFonts() {
    return src(config.paths.vendorFonts.src)
        .pipe(dest(config.paths.vendorFonts.dest));
}

// Fonts
function copyFonts() {
    return src(config.paths.fonts.src, {since: lastRun(fonts)})
        .pipe(dest(config.paths.fonts.dest))
        .pipe(connect.reload());
}

// Images
function optimizeImages() {
    return src(config.paths.images.src, {since: lastRun(images)})
        .pipe(imagemin([
            imagemin.gifsicle(config.options.imagemin.gifsicle),
            imagemin.jpegtran(config.options.imagemin.jpegtran),
            imagemin.optipng(config.options.imagemin.optipng),
            imagemin.svgo(config.options.imagemin.svgo)
        ]))
        .pipe(dest(config.paths.images.dest))
        .pipe(connect.reload());
}

// Files
function copyFiles() {
    return src(config.paths.files.src, {since: lastRun(files)})
        .pipe(dest(config.paths.files.dest))
        .pipe(connect.reload());
}

// Server
function connectServer() {
    return connect.server(config.options.connect);
}

// Watch
function watchChanges () {
    watch(config.paths.views.watch, buildViews);
    watch(config.paths.styles.watch, buildStyles);
    watch(config.paths.scripts.watch, buildScripts);
    watch(config.paths.fonts.src, copyFonts);
    watch(config.paths.images.src, optimizeImages);
    watch(config.paths.files.src, copyFiles);
}

// Lint views
function lintViews() {
    return src('dist/!*.html')
        .pipe(posthtml([
            validateHTML()
        ]));
}

// Lint styles
function lintStyles() {
    return src('dist/css/application.css')
        .pipe(stylelint(config.options.stylelint))
        .pipe(dest(config.paths.styles.dest));
}

// Lint scripts
function lintScripts() {
    return src('dist/js/application.js')
        .pipe(eslint(config.options.eslint))
        .pipe(eslint.format())
        .pipe(dest(config.paths.scripts.dest));
}

// Tasks
exports.default = parallel(connectServer, watchChanges);

exports.lint = parallel(lintViews, lintStyles, lintScripts);

exports.build = series(clean, buildModernizr, parallel(buildViews, vendorStyles, buildStyles, vendorScripts, buildScripts, vendorFonts, copyFonts, optimizeImages, copyFiles));
