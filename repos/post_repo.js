var _ = require('lodash');
var moment = require('moment');
var Post = require('../models/post.js');

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

PostRepo.get = function(cb) {
    Post.find({})
       .sort({ 'created_at': -1 })
       .limit(30)
       .populate('user')
       .exec((e, p) => cb(e, p));
}

PostRepo.findById = function(id, cb) {
    Post.findById(id).populate('user').exec((e, p) => cb(e, p));
}