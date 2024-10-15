const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
require('dotenv').config();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const adminAuth = require('./src/middlewares/admin-auth');
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
const chaptersRouter = require('./routes/js/chapters');
const articlesRouter = require('./routes/js/articles');
const settingsRouter = require('./routes/js/settings');
const searchRouter = require('./routes/js/search');
const authRouter = require('./routes/js/auth');
const likesRouter = require('./routes/js/likes');
const userAuth = require('./src/middlewares/user-auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/', indexRouter);
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
app.use('/js/chapters', chaptersRouter);
app.use('/js/articles', articlesRouter);
app.use('/js/settings', settingsRouter);
app.use('/js/search', searchRouter);
app.use('/js/auth', authRouter);
app.use('/js/users', userAuth, usersRouter);
app.use('/js/likes', userAuth,likesRouter);
module.exports = app;
