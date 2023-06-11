const mongoose = require("mongoose");

const UserSchema = new mongoose.schema ({
    username : {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        requires: true,
    },
    profilePic: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false, //if u are not registered then u are not admin so its false by default
    }
    }, { timestamps: true} // it showa when it is created and updated by putting it to true
);

module.exports = mongoose.model("User", UserSchema);