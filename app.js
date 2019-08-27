const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const conn = require('./config/dbconnect');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const dashboardRouter = require('./modules/dashboard');
const usersRouter = require('./modules/users');
const usersAPI = require('./modules/users/api');
const loginRouter = require('./modules/login');

const testRouter = require('./modules/test');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
	secret: process.env.SESSION_SECRET_KEY,
	store: new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 60 * 60,
    expiration : 60 * 60 * 12 ,// detik * menit * jam * hari * minggu
    createDatabaseTable: true
	}, conn)
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);

app.use('/dashboard',dashboardRouter);
app.use('/users', usersRouter);
app.use('/api/user', usersAPI);
app.use('/login', loginRouter);

app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
