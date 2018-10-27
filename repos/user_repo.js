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
    User.findOne({ 'username': username }, (e, u) => cb(e, u));
}

UserRepo.findByEmail = function(email, cb) {
    User.findOne({ 'email': email }, (e, u) => cb(e, u));
}