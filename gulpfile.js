import gulp from 'gulp';
import plumber from 'gulp-plumber';
import rename from 'gulp-rename';
import gulpData from 'gulp-data';
import nunjucksRender from 'gulp-nunjucks-render';
import fs from 'fs';
import path from 'path';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';

import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import browserSyncLib from 'browser-sync';

const browserSync = browserSyncLib.create();
const sass = gulpSass(dartSass);

const paths = {
  templates: {
    src: 'src/templates/pages/**/*.njk',
    watch: 'src/templates/**/*.njk',
    dest: 'dist/',
    data: 'src/data/global.json',
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/',
  },
};

// HTML (Nunjucks)
function templates() {
  return gulp.src(paths.templates.src)
    .pipe(plumber())
    .pipe(gulpData(() => JSON.parse(fs.readFileSync(paths.templates.data))))
    .pipe(nunjucksRender({ path: ['src/templates/'] }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(paths.templates.dest))
    .pipe(browserSync.stream());
}

// SCSS
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// JS
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// 서버 + 감시
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
    open: true,
    notify: false,
  });

  gulp.watch(paths.templates.watch, templates);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

// 빌드 & 실행 task
const build = gulp.parallel(templates, styles, scripts);
const dev = gulp.series(build, serve);

export { build as default, dev };
