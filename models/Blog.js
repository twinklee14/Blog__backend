const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        default: ""
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
{
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);