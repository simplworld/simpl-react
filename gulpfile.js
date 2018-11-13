const gulp = require('gulp');
const babel = require('gulp-babel');
const esdoc = require('gulp-esdoc');
const connect = require('gulp-connect');


gulp.task('serveDocs', () => (
  connect.server({
    root: 'docs',
    livereload: true,
    port: 5000,
  })
));

gulp.task('docs', () => (
  gulp.src('src')
    .pipe(esdoc({ destination: './docs' }))
));

gulp.task('babel', () => (
  gulp.src('src/*.js')
    .pipe(babel())
    .pipe(connect.reload())
    .pipe(gulp.dest('lib'))
));

/* Watch Files For Changes */
gulp.task('watch', () => (
  gulp.watch('src/**/*.js', ['babel', 'docs'])
));

gulp.task('default', ['docs', 'babel', 'watch', 'serveDocs']);
