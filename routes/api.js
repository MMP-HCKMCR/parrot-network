// packages and config
var express = require('express');
var passport = require('passport');
var router = express.Router();

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json({ error: true, message: 'Not authenticated' });
}

module.exports = function() {

    return router;
}
