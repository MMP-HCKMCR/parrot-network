var moment = require('moment');
var mongoose = require('mongoose');
var MonSchema = mongoose.Schema;
var User = require('./user.js');

var schema = new MonSchema({
    message: {
        type: String, required: true, minlength: 3
    },
    user: {
        type: MonSchema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
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

var Post = mongoose.model('Post', schema);
module.exports = Post;