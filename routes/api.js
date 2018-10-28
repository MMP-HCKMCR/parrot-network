// packages and config
var parsers = require('../helpers/parsers.js');
var express = require('express');
var router = express.Router();
var validator = require('validator');
var PostRepo = require('../repos/post_repo.js');
var UserRepo = require('../repos/user_repo.js');
var FollowRepo = require('../repos/follow_repo.js');
var Post = require('../models/post.js');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.json({ error: true, message: 'Not authenticated' });
}

module.exports = function() {

    // global posts
    router.post('/posts', isAuthenticated, function(req, res) {
        var msg = req.body.message;
        if (!msg || validator.isEmpty(msg)) {
            res.json({ error: true, message: 'Invalid message' });
            return
        }

        if (msg.length <= 2) {
            res.json({ error: true, message: 'Invalid message - too short' });
            return
        }

        if (msg.length >= 140) {
            res.json({ error: true, message: 'Invalid message - too long' });
            return
        }

        msg = parsers.parseMessageToParrots(msg);

        var _post = new Post({
            message: msg,
            user: req.user
        });

        PostRepo.create(_post, (err, post) => {
            if (err) {
                console.log(err);
                res.json({ error: true, message: err });
            }

            res.json({ error: false, post: post })
        });
    });

    router.get('/posts', isAuthenticated, function(req, res) {
        PostRepo.get((e, p) => {
            if (e) {
                console.log(e);
                res.json({ error: true, message: e });
                return;
            }

            res.json({ error: false, posts: p });
        });
    });

    // user posts
    router.get('/posts/:username', isAuthenticated, function(req, res) {
        UserRepo.findByUsername(req.params.username, (e, u) => {
            if (e) {
                console.log(e);
                res.json({ error: true, message: e });
                return;
            }

            PostRepo.findByUserId(u._id, (e, p) => {
                if (e) {
                    console.log(e);
                    res.json({ error: true, message: e });
                    return;
                }

                res.json({ error: false, posts: p });
            });
        });
    })

    // user posts for current user
    router.get('/users/posts', isAuthenticated, function(req, res) {
        UserRepo.findByUsername(req.user.username, (e, u) => {
            if (e) {
                console.log(e);
                res.json({ error: true, message: e });
                return;
            }

            PostRepo.findByUserId(u._id, (e, p) => {
                if (e) {
                    console.log(e);
                    res.json({ error: true, message: e });
                    return;
                }

                res.json({ error: false, posts: p });
            });
        });
    })

    // user info
    router.get('/users/:username', isAuthenticated, function(req, res) {
        UserRepo.findByUsername(req.params.username, (e, u) => {
            if (e) {
                console.log(e);
                res.json({ error: true, message: e });
                return;
            }

            res.json({ error: false, user: u });
        });
    })

    // user info for current user
    router.get('/user', isAuthenticated, function(req, res) {
        UserRepo.findByUsername(req.user.username, (e, u) => {
            if (e) {
                console.log(e);
                res.json({ error: true, message: e });
                return;
            }

            res.json({ error: false, user: u });
        });
    })

    // current user follow another user
    router.post('/user/follow/:username', isAuthenticated, function(req, res) {
        UserRepo.findByUsername(req.params.username, (e, u) => {
            if (e) {
                console.log(e);
                res.json({ error: true, message: e });
                return;
            }

            // follow the user
            FollowRepo.add(req.user, u, (e, f) => {
                if (e) {
                    console.log(e);
                    res.json({ error: true, message: e });
                    return;
                }

                res.json({ error: false, user: req.user, following: f });
            })
        });
    })

    // current user unfollow another user
    router.post('/user/unfollow/:username', isAuthenticated, function(req, res) {
        UserRepo.findByUsername(req.params.username, (e, u) => {
            if (e) {
                console.log(e);
                res.json({ error: true, message: e });
                return;
            }

            // unfollow the user
            FollowRepo.remove(req.user, u, (e, f) => {
                if (e) {
                    console.log(e);
                    res.json({ error: true, message: e });
                    return;
                }

                res.json({ error: false, user: req.user, following: f });
            })
        });
    })

    return router;
}
