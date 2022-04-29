const {
  src,
  dest,
  watch,
  parallel,
  series,
} = require("gulp"); /* чтобы работало src и dest "присвоить возможности Галпа" */
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat"); /* сжатие */
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const del = require("del");
const browserSync = require("browser-sync").create();

function cleanDist() {
  return del("dist");
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    notify: false,
  });
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      }) /* минифицировать под браузеры */
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src([
    "node_modules/jquery/dist/jquery.js",
    "node_modules/slick-carousel/slick/slick.js",
    "app/js/main.js ",
  ])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function build() {
  return src(["app/**/*.html", "app/css/style.min.css", "app/js/main.min.js"], {
    base: "app",
  }) /* чтобы перебрасывалось вместе с папками */
    .pipe(dest("dist"));
}

function watching() {
  watch(["app/scss/**/*.scss"], styles); /* слежение за style.scss */
  watch(
    ["app/js/**/*.js", "!app/js/main.min.js"],
    scripts
  ); /* слежение за файлами js, кроме min.js */
  watch(["app/**/*.html"]).on("change", browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.build = series(
  cleanDist,
  build
); /*  series-последовательно выполняет работу над вписанными функциями */

exports.default = parallel(
  styles,
  scripts,
  browsersync,
  watching
); /* запускает все функции */
