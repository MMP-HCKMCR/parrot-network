var gulp = require('gulp');

gulp.task('default', function() {
    // jquery
    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('public/scripts/'));

    // moment.js
    gulp.src('node_modules/moment/min/moment.min.js')
        .pipe(gulp.dest('public/scripts/'));

    // validator.js
    gulp.src('node_modules/validator/validator.min.js')
        .pipe(gulp.dest('public/scripts/'));
});
