var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/Account');

exports.isLoggedIn = function(req, res, next) {
if (req.isAuthenticated()) {
    return next();
}
    res.redirect('/');
}
