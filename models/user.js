var moment = require('moment');
var mongoose = require('mongoose');
var MonSchema = mongoose.Schema;

var schema = new MonSchema({
    username: {
        type: String, required: true, unique: true, index: true, minlength: 2, maxlength: 15
    },
    email: {
        type: String, required: true, unique: true, index: true
    },
    fullname: {
        type: String, required: true, minlength: 2, maxlength: 50
    },
    password: {
        type: String, required: true, bcrypt: true
    },
    is_private: {
        type: Boolean, default: true
    },
    //dob: {
    //    type: Date, default: null
    //},
    created_at: {
        type: Date, default: null
    },
    updated_at: {
        type: Date, default: null
    }
})

schema.pre('save', function(next) {
    var now = moment.utc();

    if (!this.created_at) {
        this.created_at = now;
    }

    this.updated_at = now;
    next();
})

schema.plugin(require('mongoose-bcrypt'), {
    rounds: 9
});

var User = mongoose.model('User', schema);
module.exports = User;