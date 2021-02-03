const mongoose = require('mongoose');
var schema = mongoose.Schema;


var userschema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    data: {
        type: Date,
        default: Date.now
    }

});

const User = mongoose.model("User", userschema);
module.exports = User;