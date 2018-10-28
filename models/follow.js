var mongoose = require('mongoose');
var MonSchema = mongoose.Schema;
var User = require('./user.js');

var schema = new MonSchema({
    user: {
        type: MonSchema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    followee: {
        type: MonSchema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    }
})

var Follow = mongoose.model('Follow', schema);
module.exports = Follow;