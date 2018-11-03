var _ = require('lodash');
var moment = require('moment');
var User = require('../models/user.js');

function UserRepo() { }
module.exports = UserRepo;

UserRepo.create = function(user, cb) {
    user.save((e) => cb(e, user));
}

UserRepo.findById = function(id, cb) {
    User.findById(id).exec((e, u) => cb(e, u));
}

UserRepo.findByUsername = function(username, cb) {
    var regex = new RegExp(['^', username, '$'].join(''), 'i');
    User.findOne({ 'username': regex }, (e, u) => cb(e, u));
}

UserRepo.findAllByUsername = function(query, cb) {
    var regex = new RegExp(['^.*?', query, '.*?$'].join(''), 'i');

    User.find({ 'username': regex })
        .sort({ 'username': -1 })
        .limit(30)
        .exec((e, u) => cb(e, u));
}

UserRepo.findByEmail = function(email, cb) {
    var regex = new RegExp(['^', email, '$'].join(''), 'i');
    User.findOne({ 'email': regex }, (e, u) => cb(e, u));
}