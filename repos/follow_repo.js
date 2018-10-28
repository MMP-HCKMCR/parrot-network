var _ = require('lodash');
var moment = require('moment');
var Follow = require('../models/follow.js');
var UserRepo = require('./user_repo.js');

function FollowRepo() { }
module.exports = FollowRepo;

FollowRepo.add = function(followee, cb) {
    followee.save((e) => cb(e, followee));
}

FollowRepo.remove = function(userId, followeeId, cb) {
    Follow.findOneAndRemove({ 'user': userId, 'followee': followeeId })
        .exec((e, r) => cb(e, r));
}

FollowRepo.findByUserAndFolloweeId = function(userId, followeeId, cb) {
    Follow.findOne({ 'user': userId, 'followee': followeeId })
        .populate('user')
        .populate('followee')
        .exec((e, f) => cb(e, f));
}

FollowRepo.findByUserId = function(userId, cb) {
    Follow.find({ 'user': userId })
        .exec((e, f) => cb(e, f));
}