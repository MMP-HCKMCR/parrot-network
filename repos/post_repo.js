var _ = require('lodash');
var moment = require('moment');
var Post = require('../models/post.js');
var FollowRepo = require('./follow_repo.js');

function PostRepo() { }
module.exports = PostRepo;

PostRepo.create = function(post, cb) {
    post.save((e) => cb(e, post));
}

PostRepo.findByUserId = function(userId, cb) {
    Post.find({ 'user': userId })
       .sort({ 'created_at': -1 })
       .limit(30)
       .populate('user')
       .exec((e, p) => cb(e, p));
}

PostRepo.get = function(userId, cb) {
    FollowRepo.findByUserId(userId, (e, f) => {
        var fols = [userId];
        _.forEach(f, (v) => {
            fols[fols.length] = v.followee;
        });

        Post.find({ 'user': { $in: fols } })
            .sort({ 'created_at': -1 })
            .limit(30)
            .populate('user')
            .exec((e, p) => cb(e, p));
    });
}

PostRepo.findById = function(id, cb) {
    Post.findById(id).populate('user').exec((e, p) => cb(e, p));
}