import gulp from "gulp";
import imagemin from 'gulp-imagemin';
import extReplace from 'gulp-ext-replace';
import webp from 'imagemin-webp';

gulp.task("copy", () => {
    return gulp.src("uploads/**/*").pipe(gulp.dest("test-uploads"));
})

gulp.task("min", () => {
    return gulp.src("test-uploads/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("test-uploads-min"));
})

gulp.task('webp', async () => {
    return gulp.src('./uploads/thumbnail/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest("thumbnail-webp"))
  });
  