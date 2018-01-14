var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

// 静态服务器
gulp.task('reload', function() {
    nodemon({
        srcript: 'bin/www',
        ignore: [],
        env: {
            'NODE_ENV': 'development'
        }
    }).on('start',function(){
        browserSync.init({
            proxy: 'http://localhost:3000',
            files: ['public/**/*.*', 'views/**/*.*'],
            port: 5000
        });
    })
});

gulp.task('watch',function(){
    gulp.watch('src/css/*.css',['concatcss']);
});

gulp.task('concatcss',function(){
    //首页
    gulp.src(['src/css/base.css','src/css/index.css'])
        .pipe(concat('index.css'))
        .pipe(gulp.dest('public/css'));

    //注册
    gulp.src(['src/css/base.css','src/css/reg.css'])
        .pipe(concat('reg.css'))
        .pipe(gulp.dest('public/css'));

    //登录
    gulp.src(['src/css/base.css','src/css/login.css'])
        .pipe(concat('login.css'))
        .pipe(gulp.dest('public/css'));

    //所有文章
    gulp.src(['src/css/base.css','src/css/article_list.css'])
        .pipe(concat('article_list.css'))
        .pipe(gulp.dest('public/css'));

    //文章详情
    gulp.src(['src/css/base.css','src/css/article_detail.css'])
        .pipe(concat('article_detail.css'))
        .pipe(gulp.dest('public/css'));

    //添加文章
    gulp.src(['src/css/base.css','src/css/user_article_add.css'])
        .pipe(concat('user_article_add.css'))
        .pipe(gulp.dest('public/css'));

    //添加文章
    gulp.src(['src/css/base.css','src/css/user_article_edit.css'])
        .pipe(concat('user_article_edit.css'))
        .pipe(gulp.dest('public/css'));

    //用户中心
    gulp.src(['src/css/base.css','src/css/user_center.css'])
        .pipe(concat('user_center.css'))
        .pipe(gulp.dest('public/css'));

    //我的文章
    gulp.src(['src/css/base.css','src/css/user_article.css'])
        .pipe(concat('user_article.css'))
        .pipe(gulp.dest('public/css'));


    //错误
    gulp.src(['src/css/base.css','src/css/error.css'])
        .pipe(concat('error.css'))
        .pipe(gulp.dest('public/css'));
});


gulp.task('default',['reload','watch','concatcss']);