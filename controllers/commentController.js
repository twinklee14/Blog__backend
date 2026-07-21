const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const createComment = async (req, res) => {
    try {
        const { text } = req.body;
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });

        }
        const comment = new Comment({
            text,
            user: req.user.id,
            blog: blog._id
        });
        await comment.save();
        res.status(201).json({
            message: "Comment Added",
            comment
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            blog: req.params.blogId
        })
        .populate("user", "name email")
        .sort({
            createdAt: -1
        });
        res.status(200).json(comments);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }
        await comment.deleteOne();
        res.status(200).json({
            message: "Comment Deleted"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = {createComment,getComments,deleteComment};