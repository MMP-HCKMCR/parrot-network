// packages and config
var express = require('express');
var passport = require('passport');
var router = express.Router();
var path = require('path');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

module.exports = function() {

    router.get('/', isAuthenticated, function(req, res) {
        res.sendFile(path.join(__dirname, '../views/feed.html'));
    });

    router.get('/login', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        }
        else {
            res.sendFile(path.join(__dirname, '../views/login.html'));
        }
    });

    router.get('/signup', function(req, res) {
        res.sendFile(path.join(__dirname, '../views/register.html'));
    });

    router.get('/profile', isAuthenticated, function(req, res) {
        res.sendFile(path.join(__dirname, '../views/profile.html'));
    });

    router.post('/login',
        passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    router.post('/signup',
        passport.authenticate('signup', {
            successRedirect: '/',
            failureRedirect: '/signup'
        }));

    return router;
}
