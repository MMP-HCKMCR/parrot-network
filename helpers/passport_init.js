var UserRepo = require('../repos/user_repo.js');
var User = require('../models/user.js');
var PassportLocal = require('passport-local');
var validator = require('validator');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done) {
        UserRepo.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('login', new PassportLocal({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        UserRepo.findByUsername(username, (err, user) => {
            if (err) {
                console.log(err);
                return done(null, false, { message: err });
            }

            if (!user) {
                return done(null, false, { message: 'Invalid username' });
            }

            if (!user.verifyPasswordSync(password)) {
                return done(null, false, { message: 'Invalid password' });
            }

            return done(null, user);
        })
    }));

    passport.use('signup', new PassportLocal({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        var email = req.body.email;
        var confirmPassword = req.email.confirmPassword
        var fullname = req.body.fullname;
        //var dob = req.body.dob;

        if (!username || validator.isEmpty(username)) {
            return done(null, false, { message: 'Invalid username' });
        }

        if (!email || validator.isEmpty(email)) {
            return done(null, false, { message: 'Invalid email address' });
        }

        if (!fullname || validator.isEmpty(fullname)) {
            return done(null, false, { message: 'Invalid fullname' });
        }

        if (password != confirmPassword) {
            return done(null, false, { message: 'Passwords do not match' });
        }

        UserRepo.findByUsername(username, (err, user) => {
            if (err) {
                console.log(err);
                return done(null, false, { message: err });
            }

            if (user) {
                return done(null, false, { message: 'Username already taken' });
            }

            var _user = new User({
                username: username,
                email: email,
                fullname: fullname,
                password: password,
                is_private: false
            });

            UserRepo.create(_user, (err, user) => {
                if (err) {
                    console.log(err);
                    return done(null, false, { message: err });
                }

                return done(null, user);
            });
        });
    }));

}