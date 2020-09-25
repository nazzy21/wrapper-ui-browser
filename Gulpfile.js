'use strict';

const gulp = require('gulp'),
    babel = require('@babel/core'),
    through = require('through2'),
    fs = require('fs'),
    beautify = require('gulp-beautify'),
    clean = require('gulp-clean');

gulp.task("cleanup", function() {
	return gulp.src('./dist', {allowEmpty: true})
       .pipe(clean());
});

gulp.task("create-package", function() {
    const json = require('./package');

    json.dependencies["@wrapper/ui"] = "file:./ui";

    delete json.devDependencies;
    delete json.scripts;

    fs.writeFileSync( './dist/package.json', JSON.stringify(json));

    return gulp.src('./dist/package.json')
            .pipe(beautify({index_size: 2}))
            .pipe(gulp.dest('./dist'));
});

gulp.task("transpile-src", function() {
    return gulp.src([
        "./src/**"
        ])
    .pipe(transpiler())
    .pipe(gulp.dest("./dist/lib"));
});

gulp.task("add-ui", function() {
    return gulp.src([
        "../ui/dist/**",
        "!../ui/dist/node_modules"
        ])
    .pipe(gulp.dest("./dist/ui"));
});

gulp.task("copy-bundle", function() {
    return gulp.src("./bundle.js")
        .pipe(gulp.dest("./dist"));
});

gulp.task("bundle", function(done) {
    gulp.series("cleanup", "transpile-src", "add-ui", "copy-bundle", "create-package")();

    done();
});

function transpiler() {
    return through.obj(function(file, enc, cb) {
        if (!file.isBuffer()) {
            return cb();
        }

        const content = babel.transform(file.contents.toString());
        file.contents = Buffer.from(content.code);
        file.path = file.path.replace('.jsx', '.js');

        cb(null, file);
    });
}
