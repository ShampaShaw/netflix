const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema ({
    title : {
        type: String,
        required: true,
        unique: true,
    },
    type : {
        type: String, //either movie or series
    },
    genre: {
        type: String,
    },
    content: {
        type: Array,
    }
    }, { timestamps: true} // it show when it is created and updated by putting it to true
);

module.exports = mongoose.model("List", ListSchema);