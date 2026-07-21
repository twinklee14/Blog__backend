const Blog = require("../models/Blog");
const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                message: "Title and Content are required"
            });

        }
        const imageNames = req.files? req.files.map(file => file.filename): [];
        const blog = new Blog({
            title,
            content,
            images: imageNames,
            author: req.user.id
        });
        await blog.save();
        res.status(201).json({
            message: "Blog Created Successfully",
            blog
        });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    } 
};
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({
            count: blogs.length,
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "name email");
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        // Authorization Check
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to update this blog"
            });
        }
        blog.title = title || blog.title;
        blog.content = content || blog.content;
        await blog.save();
        res.status(200).json({
            message: "Blog updated successfully",
            blog
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });

    }
};
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this blog"
            });
        }
        await blog.deleteOne();
        res.status(200).json({
            message: "Blog deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }

};
module.exports = {createBlog,getAllBlogs,getBlogById,updateBlog,deleteBlog};