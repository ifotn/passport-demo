var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var configDb = require('../config/db.js');
var gitHubStrategy = require('passport-github2');

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   Account.findById(id, function(err, user) {
      done(err,  user);
   });
});

// var init = require('./init');

//init();

router.get('/login', function(req, res, next) {
   res.render('login', {
      user: req.user,
      messages: req.session.messages || [] /* req.flash('loginMessage') */
   });

   req.session.messages = [];
});

router.post('/login', passport.authenticate('local', {
   successRedirect: '/admin',
   failureRedirect: '/auth/login',
   failureMessage: 'Invalid Login'
   //failureFlash: true
}));

/*
router.post('/login', passport.authenticate('local'), function(req, res, next) {
   res.redirect('/admin');
}); */

router.get('/register', function(req, res, next) {
   res.render('register');
});

router.post('/register', function(req, res, next) {

   Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
      if (err) {
         return res.render('register');
      }
      else {
         req.login(account, function(err) {
            res.redirect('/admin');
         });
      }
   });
});

router.get('/logout', function(req, res, next) {
   req.session.messages = [];
   req.logout();
   res.redirect('/');
});

router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback', function(req, res, next) {
   passport.authenticate('facebook', {
      successRedirect: '/admin',
      failureRedirect: '/auth/login'
   });
});

passport.use(new gitHubStrategy({
       clientID: configDb.githubClientID,
       clientSecret: configDb.clientSecret,
       callbackURL: configDb.callbackURL
        /*'clientID': 'ff02279f3b5ed3129c68',
       'clientSecret': 'cad6757aed447e00e6bf83bf326ac2219054d8b5',
       'callbackURL': 'http://localhost:3000/auth/github/callback'*/
    },
    function(accessToken, refreshToken, profile, done) {
       var searchQuery = { name: profile.displayName };

       var updates = {
          name: profile.displayName,
          someID: profile.id
       };

       var options = {
          upsert: true
       };

       Account.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
          if (err) {
             return done(err);
          }
          else {
             return done(null, user);
          }
       });
    }
));

router.get('/github', passport.authenticate('github', { scope: ['user.email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login'}),
   function(req, res) {
      res.redirect('/admin');
   }
);



// init();

module.exports = router, passport,  {
   'facebookAuth': {
      'clientId': '1074981222525428',
      'clientSecret': '37a85786dbc7d7c6ae9b4a3814832438',
      'callbackUrl': 'http://localhost:3000/auth/facebook/callback'
   }
};