var passport = require('passport');
var Account = require('../models/account');

module.exports = function() {
  passport.serializeUser(function(user, done) {
     done(null, user.id);
  });

    passport.deserializeUser(function(id, done) {
       Account.findById(id, function(err, user) {
           done(err,  user);
       });
    });
};