import gulp from 'gulp';
import { src, dest, watch, series, parallel } from 'gulp';
import ttf2woff2 from 'gulp-ttf2woff2';
import browserSync from 'browser-sync';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import fileInclude from 'gulp-file-include';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';
import { deleteAsync } from 'del';
import merge from 'merge-stream'; // ДОБАВИЛИ ДЛЯ СЛИЯНИЯ ПОТОКОВ

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const scss = gulpSass(dartSass);

import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';
import svgmin from 'gulp-svgmin';

import changed from 'gulp-changed';
import cache from 'gulp-cache';

const bs = browserSync.create();

// Очистка билда
async function cleanDist() {
  return await deleteAsync(['docs']);
}

// Очистка кэша: npm run clear
export const clear = (done) => {
  return cache.clearAll(done);
};

// HTML (сборка инклюдов)
function html() {
  return src('src/*.html')
    .pipe(fileInclude({ prefix: '@@', basepath: './src/' }))
    .pipe(dest('docs'))
    .pipe(bs.stream());
}

// Стили
function styles() {
  return src('src/styles/main.scss', { sourcemaps: true })
    .pipe(
      scss
        .sync({
          api: 'modern-compiler',
          outputStyle: 'compressed',
          loadPaths: ['src/styles'],
        })
        .on('error', scss.logError)
    )
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'] }))
    .pipe(cleanCss())
    .pipe(dest('docs/styles', { sourcemaps: '.' }))
    .pipe(bs.stream());
}

// JS
function scripts() {
  return src('src/js/**/*.js')
    .pipe(concat('main.min.js'))
    .pipe(
      terser().on('error', (e) => {
        console.error('JS Error: ', e.message);
      })
    )
    .pipe(dest('docs/js'))
    .pipe(bs.stream());
}

// Шрифты
function fonts() {
  const dist = 'docs/fonts';
  return src('src/fonts/**/*.ttf', { encoding: false })
    .pipe(changed(dist, { extension: '.woff2' }))
    .pipe(ttf2woff2())
    .pipe(dest(dist))
    .pipe(bs.stream());
}

// КАРТИНКИ (ИСПРАВЛЕНО: ТЕПЕРЬ ВСЁ ЖДЕТ ЗАВЕРШЕНИЯ)
function images() {
  const dist = 'docs/images';
  const srcPath = [
    'src/images/**/*.{jpg,jpeg,png,avif}',
    '!src/images/icons/**/*',
  ];

  // Поток для WebP
  const webpStream = src(srcPath, { encoding: false })
    .pipe(changed(dist, { extension: '.webp' }))
    .pipe(webp())
    .pipe(dest(dist));

  // Поток для Оригиналов
  const optimizedStream = src(srcPath, { encoding: false })
    .pipe(changed(dist))
    .pipe(cache(imagemin()))
    .pipe(dest(dist));

  // Склеиваем их, чтобы Gulp видел оба return
  return merge(webpStream, optimizedStream).pipe(bs.stream());
}

// Спрайт
function sprite(done) {
  return src('src/images/icons/**/*.svg')
    .pipe(
      svgmin({
        multipass: true,
        plugins: ['preset-default', 'removeDimensions', 'collapseGroups'],
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          const shapes = 'path, circle, rect, ellipse, polygon, polyline';

          // 1. Возвращаем fill переменные (до 4-х цветов)
          const fillElements = $(shapes).filter(function () {
            return $(this).attr('fill') !== undefined;
          });

          if (fillElements.length <= 4) {
            fillElements.each(function (i) {
              $(this).attr('fill', `var(--color-${i + 1})`);
            });
          }

          // 2. Возвращаем stroke переменные (до 2-х цветов)
          const strokeElements = $(shapes).filter(function () {
            return $(this).attr('stroke') !== undefined;
          });

          if (strokeElements.length <= 2) {
            strokeElements.each(function (i) {
              $(this).attr('stroke', `var(--stroke-${i + 1})`);
            });
          }

          // 3. Чистим инлайновые стили
          $('*').removeAttr('style');
          $('style').remove();
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: { stack: { sprite: '../stack.svg' } },
      })
    )
    .pipe(dest('docs/images/icons'))
    .on('end', done);
}

// Сервер
function server() {
  bs.init({
    server: { baseDir: 'docs' },
    notify: false,
    open: true,
  });
}

// Наблюдение
function watching() {
  watch(['src/**/*.html'], html);
  watch(['src/styles/**/*.scss'], styles);
  watch(['src/js/**/*.js'], scripts);
  watch(['src/images/**/*', '!src/images/icons/**/*'], images);
  watch(['src/images/icons/**/*.svg'], sprite);
  watch(['src/fonts/**/*'], fonts);
}

export { html, styles, scripts, fonts, images, sprite, cleanDist };

export default series(
  cleanDist,
  parallel(fonts, html, styles, scripts, images, sprite),
  parallel(server, watching)
);
