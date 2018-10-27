// packages and config
var parser = require('../helpers/parsers.js');
var express = require('express');
var router = express.Router();

module.exports = function() {

    // http://<url>/parrots?phrase=hello world
    router.get('/', (req, res) => {
        var msg = parser.parseMessageToParrots(req.query.phrase);
        res.json({ message: msg});
    })

    return router;
}
