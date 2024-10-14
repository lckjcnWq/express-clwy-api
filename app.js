const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//
const adminAuth = require('./src/middlewares/admin-auth');
require('dotenv').config();
//后台路由文件
const adminArticleRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingRouter = require('./routes/admin/setting');
const adminUserRouter = require('./routes/admin/user');
const adminCourseRouter = require('./routes/admin/course');
const adminChapterRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');

//前端路由文件
const categoriesRouter = require('./routes/js/categories');
const coursesRouter = require('./routes/js/courses');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', adminAuth,usersRouter);
app.use('/admin/articles',adminAuth, adminArticleRouter);
app.use('/admin/categories', adminAuth,adminCategoriesRouter);
app.use('/admin/set', adminAuth,adminSettingRouter);
app.use('/admin/user', adminAuth,adminUserRouter);
app.use('/admin/course', adminAuth,adminCourseRouter);
app.use('/admin/chapter', adminAuth,adminChapterRouter);
app.use('/admin/charts', adminAuth,adminChartsRouter);
app.use('/admin/auths', adminAuthRouter);

//前端路由
app.use('/js/categories', categoriesRouter);
app.use('/js/courses', coursesRouter);
module.exports = app;
