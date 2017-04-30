var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var lost = require('lost');
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};
var paths = {
  cssSource: '_css/*.css',
  cssDest: '_site/css'
};
//
// gulp.task('styles', function() {
//   return gulp.src('_css/*.css')
//       .pipe(sourcemaps.init())
//       .pipe(postcss([
//         lost(),
//         autoprefixer(),
//         // onError: browserSync.notify
//       ]))
//       .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//       .pipe(sourcemaps.write('./'))
//       .pipe(gulp.dest(paths.cssDest))
//       .pipe(browserSync.reload({stream:true}))
//       .pipe(gulp.dest('css'));
// });

gulp.task('sass', function () {
    var processors = [
    lost(),
    autoprefixer({browsers:['last 2 versions']})
    ];
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('css'));
});
/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */



/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    // gulp.watch('_css/*.css', ['styles']);
    gulp.watch('_scss/*.scss', ['sass']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});
/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
