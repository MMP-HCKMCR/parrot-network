var _ = require('lodash');
var moment = require('moment');
var Follow = require('../models/follow.js');
var UserRepo = require('./user_repo.js');

function FollowRepo() { }
module.exports = FollowRepo;

FollowRepo.add = function(user, followee, cb) {
    Follow.findByIdAndUpdate(user._id,
        { $push: { 'following': followee._id } },
        { $safe: true, $upsert: true, $new: true },
        (e, f) => cb(e, f)
    );
}

FollowRepo.remove = function(user, followee, cb) {
    Follow.findByIdAndUpdate(user._id,
        { $pull: { 'following': followee._id } },
        { $safe: true, $upsert: true, $new: true },
        (e, f) => cb(e, f)
    );
}

FollowRepo.findByUserId = function(userId, cb) {
    Follow.find({ 'user': userId })
        .populate('following')
        .exec((e, f) => cb(e, f));
}