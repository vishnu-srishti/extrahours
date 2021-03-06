// app.js

// set up ======================================================================
// get all the tools we need
var express 	= require('express');
var path 		= require('path');
var favicon 	= require('serve-favicon');
var logger 		= require('morgan');
var passport 	= require('passport');
var flash    	= require('connect-flash');
var morgan      = require('morgan');

var cookieParser 	= require('cookie-parser');
var bodyParser 	 	= require('body-parser');
var mongoose 	 	= require("mongoose");
var session     	= require('express-session');

var routes		= require('./routes/index');
var users   	= require('./routes/users');
var configDB 	= require('./config/database.js');

// port = process.env.PORT || 8080;

var app = express();

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//view engine setup for html
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

//include image file 
app.use('/img', express.static('public/images'));

// set up our express application
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(morgan('dev')); // log every request to the console
//app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
