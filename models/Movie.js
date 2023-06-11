const mongoose = require("mongoose");

const MovieSchema = new mongoose.schema ({
    title : {
        type: String,
        required: true,
        unique: true,
    },
    desc : {
        type: String,
    },
    img : {
        type: String,
    },
    imgTitle: {
        type: String,
    },
    imgSm: {
        type: String,
    },
    trailer: {
        type: String,
    },
    video: {
        type: String,
    },
    year: {
        type: String,
    },
    limit: {
        type: Number,
    },
    genre: {
        type: String,
    },
    isSeries: {
        type: Boolean,
        default: false, //if not series then its false by default
    }
    }, { timestamps: true} // it show when it is created and updated by putting it to true
);

module.exports = mongoose.model("Movie", MovieSchema);