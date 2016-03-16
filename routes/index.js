var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Passport Demo',
    user: req.user,
    views: req.session.views
  });
});

router.get('/admin', isLoggedIn, function(req, res, next) {
  res.render('admin', {
    user: req.user
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

module.exports = router;
