require('coffee-script/register');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var session = require("express-session");

var merge = require('merge');

var routes = require('./routes/index');
var sign_up = require('./routes/sign_up');

var app = express();

// view engine setup
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(favicon('public/img/favicon.ico'));
app.use(express.static('public/'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: 'SUPER SECRET KEY', cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, 'public')));

// Add session jazz
app.use(function(req,res,next){

    if(req.session.customer) {
      res.locals.hasCustomer = true;
      res.locals.customer = req.session.customer;
    } else {
      res.locals.hasCustomer = false;
    }

    if(req.session.signup) {
      res.locals.just_signed_up = true;
      req.session.signup = null;
    }

    next();
});

app.use('/', routes);
app.use('/sign_up', sign_up);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

// Globals
app.locals = merge(app.locals, {
  site: {
    title: '@Risk',
    description: 'Watching at risk people!'
  },
  author: {
    name: 'Pez & Team',
    contact: 'email@domain.com'
  }
})

module.exports = app;
