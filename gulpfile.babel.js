import autoprefixer from 'autoprefixer';
import cp from 'child_process';
import del from 'del';
import util from 'util';
import gulp from 'gulp';
import babel from 'gulp-babel';
import changed from 'gulp-changed';
import concat from 'gulp-concat';
import connect from 'gulp-connect';
import eslint from 'gulp-eslint';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import posthtml from 'gulp-posthtml';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import stylelint from 'gulp-stylelint';
import uglify from 'gulp-uglify';
import minifyCSS from 'postcss-clean';
import validateHTML from 'posthtml-w3c';

// Config
const config = require('./gulpfile.config.json');

// Clean
const clean = () => del('dist/');
export {clean}

// Modernizr
export function modernizr() {
    return cp.exec('./node_modules/modernizr/bin/modernizr -c ./modernizr.config.json -d ./dist/js/modernizr.js -u');
}

// Views
export function views() {
    return gulp.src(config.paths.views.src)
        .pipe(plumber(function (error) {
            util.log(error.message);
            this.emit('end');
        }))
        .pipe(changed(config.paths.views.dest))
        .pipe(pug(config.options.pug))
        .pipe(gulp.dest(config.paths.views.dest))
        .pipe(connect.reload());
}

// Vendor styles
export function vendorStyles() {
    return gulp.src(config.paths.vendorStyles.src)
        .pipe(concat(config.paths.vendorStyles.concat))
        .pipe(postcss([
            minifyCSS()
        ]))
        .pipe(gulp.dest(config.paths.vendorStyles.dest));
}

// Styles
export function styles() {
    return gulp.src(config.paths.styles.src)
        .pipe(plumber(function (error) {
            util.log(error.message);
            this.emit('end');
        }))
        .pipe(sass(config.options.sass))
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest(config.paths.styles.dest))
        .pipe(connect.reload());
}

// Vendor scripts
export function vendorScripts() {
    return gulp.src(config.paths.vendorScripts.src)
        .pipe(uglify())
        .pipe(concat(config.paths.vendorScripts.concat))
        .pipe(gulp.dest(config.paths.vendorScripts.dest));
}

// Scripts
export function scripts() {
    return gulp.src(config.paths.scripts.src)
        .pipe(plumber(function (error) {
            util.log(error.message);
            this.emit('end');
        }))
        .pipe(babel())
        .pipe(concat(config.paths.scripts.concat))
        .pipe(gulp.dest(config.paths.scripts.dest))
        .pipe(connect.reload());
}

// Vendor fonts
export function vendorFonts() {
    return gulp.src(config.paths.vendorFonts.src)
        .pipe(gulp.dest(config.paths.vendorFonts.dest));
}

// Fonts
export function fonts() {
    return gulp.src(config.paths.fonts.src, {since: gulp.lastRun(fonts)})
        .pipe(gulp.dest(config.paths.fonts.dest))
        .pipe(connect.reload());
}

// Images
export function images() {
    return gulp.src(config.paths.images.src, {since: gulp.lastRun(images)})
        .pipe(imagemin([
            imagemin.gifsicle(config.options.imagemin.gifsicle),
            imagemin.jpegtran(config.options.imagemin.jpegtran),
            imagemin.optipng(config.options.imagemin.optipng),
            imagemin.svgo(config.options.imagemin.svgo)
        ]))
        .pipe(gulp.dest(config.paths.images.dest))
        .pipe(connect.reload());
}

// Files
export function files() {
    return gulp.src(config.paths.files.src, {since: gulp.lastRun(files)})
        .pipe(gulp.dest(config.paths.files.dest))
        .pipe(connect.reload());
}

// Server
export function connectServer() {
    connect.server(config.options.connect);
}

// Watch
export function watch() {
    gulp.watch(config.paths.views.watch, views);
    gulp.watch(config.paths.styles.watch, styles);
    gulp.watch(config.paths.scripts.watch, scripts);
    gulp.watch(config.paths.fonts.src, fonts);
    gulp.watch(config.paths.images.src, images);
    gulp.watch(config.paths.files.src, files);
}

// Lint views
export function lintViews() {
    return gulp.src('dist/*.html')
        .pipe(posthtml([
            validateHTML()
        ]));
}

// Lint styles
export function lintStyles() {
    return gulp.src('dist/css/application.css')
        .pipe(stylelint(config.options.stylelint))
        .pipe(gulp.dest(config.paths.styles.dest));
}

// Lint scripts
export function lintScripts() {
    return gulp.src('dist/js/application.js')
        .pipe(eslint(config.options.eslint))
        .pipe(eslint.format())
        .pipe(gulp.dest(config.paths.scripts.dest));
}

// Tasks
gulp.task('default', gulp.parallel(connectServer, watch));

const build = gulp.series(clean, modernizr, gulp.parallel(views, vendorStyles, styles, vendorScripts, scripts, vendorFonts, fonts, images, files));
export {build}

const lint = gulp.parallel(lintViews, lintStyles, lintScripts);
export {lint}
