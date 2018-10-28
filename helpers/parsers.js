var parrot_map = require('../config/parrots.js');
var validator = require('validator');
var _ = require('lodash');

exports.parseMessageToParrots = function(msg) {
    if (validator.isEmpty(msg)) {
        return '';
    }

    var new_msg ='';
    var words = _.words(msg);

    _.forEach(words, (v) => {
        if (parrot_map[v] && !validator.isEmpty(parrot_map[v])) {
            new_msg += parrot_map[v];
            new_msg += ' ';
        }
    })

    if (validator.isEmpty(new_msg)) {
        new_msg = parrot_map['confused'];
    }

    return new_msg.trim();
}