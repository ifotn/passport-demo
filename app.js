var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// added
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');


var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

var app = express();

var configDb = require('./config/db.js');
mongoose.connect(configDb.url);

// mongoose.connect('mongodb://localhost/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// add flash module
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// enable session support
app.use(session({
  secret: 'auth demo',
  resave: true,
  saveUninitialized: false
}));

// passport config
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// facebook auth
passport.use(new facebookStrategy({
      'clientID': '1074981222525428',
      'clientSecret': '37a85786dbc7d7c6ae9b4a3814832438',
      'callbackURL': 'http://localhost:3000/auth/facebook/callback',
      'passReqToCallback': true
  /* clientID: auth.facebookAuth.clientId,
  clientSecret: auth.facebookAuth.clientSecret,
  callbackURL: auth.facebookAuth.callbackUrl */
},
function(token, refreshToken, profile, done) {
  process.nextTick(function() {

    Account.findOne( { 'facebook.id': profile_id }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        return done(null, user);
      }
      else {
        var newUser = new Account;

        newUser.facebook.id = profile.id;
        newUser.facebook.token = token;
        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
        newUser.facebook.email = profile.emails[0].value;

        newUser.save(function(err) {
          if (err) {
            throw err;

            return done(null, newUser);
          }
        });
      }
    });
  })
}
));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);

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
