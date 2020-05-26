//Подключаем модули gulp
 const  gulp = require('gulp');
 const  concat = require('gulp-concat');
 const autoprefixer = require('gulp-autoprefixer');
 const cleanCSS = require('gulp-clean-css');
 const uglify = require('gulp-uglify');
 const del = require('del');
 const browserSync = require('browser-sync').create();

//Порядок подключения css файлов
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]
//Порядок подключения js файлов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]

 //Task на стили CSS
 function styles() {
     //Шаблон для поиска файлов CSS
     //Все файлы по шаблону './src/css/**/*.css'
    return gulp.src(cssFiles)

    //Обьединение файлов в один
    .pipe(concat('style.css'))
    //Добавить префиксы
    .pipe(autoprefixer({
        cascade: false
    }))
    //Минификация CSS
    .pipe(cleanCSS({
       level: 2
    }))

    //Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
 }

 //Task на скрипты JS
 function scripts() {
    //Шаблон для поиска файлов JS
     //Все файлы по шаблону './src/js/**/*.js'
     return gulp.src(jsFiles)

     //Обьединение файлов в один
    .pipe(concat('script.js'))
    //Минифицируем JS
      .pipe(uglify())

     //Выходная папка для скриптов
     .pipe(gulp.dest('./build/js'))
     .pipe(browserSync.stream());
 }

 //Удалить все в указанной папке
 function clean() {
     return del(['build/*'])
 }
 //Просматривать файлы
 function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //Следить за CSS файлами
    gulp.watch('./src/css/**/*.css', styles)
    //Следить за JS файлами
    gulp.watch('./src/js/**/*.js', scripts)
    //При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload);
 }
 
 //Task вызывающий функцию styles
 gulp.task('styles', styles);

  //Task вызывающий функцию script
  gulp.task('scripts', scripts);

  //Task для очистки папки build
  gulp.task('del', clean)
  //
  gulp.task('watch', watch)
  // Task для удаления файлов в папке build и запуск styles и scripts
  gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
  //Task запускает последовательно build и watch
  gulp.task('dev', gulp.series('build', 'watch'));