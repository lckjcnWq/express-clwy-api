const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//后台路由文件
const adminArticleRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingRouter = require('./routes/admin/setting');
const adminUserRouter = require('./routes/admin/user');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/articles', adminArticleRouter);
app.use('/admin/categories', adminCategoriesRouter);
app.use('/admin/set', adminSettingRouter);
app.use('/admin/user', adminUserRouter);

module.exports = app;
