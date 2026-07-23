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
//anything after '?' in request is treated as a query
//query parameters are always strings
//regex is a MongoDB query operator (a special keyword, $ at the start)
// regex is cases sensitive so we use options :"i" to make it case insensitive
const getAllBlogs = async (req, res) => {
        try {
        const { search,
                page=1, //default
                limit=5 //default
         } = req.query;

        //since queries are strings, need to convert them to int
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);

        //tells us the number of bolgs to skip from the beginning
        const skip = (pageNumber - 1) * limitNumber;

        let filter = {};
        if (search) {
            filter = {
                $or: [{title: {
                        $regex: search,
                        $options: "i"
                        }
                    },
                    {
                    content: {
                        $regex: search,
                        $options: "i"
                        }
                    }
                ]
            };
        }
        const totalBlogs= await Blog.countDocuments(filter);

        const blogs = await Blog.find(filter)
            .populate("author", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

            const totalPages = Math.ceil(totalBlogs / limitNumber);

            res.status(200).json({
            currentPage:pageNumber,
            totalPages,
            totalBlogs,
            limit:limitNumber,
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

const toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }
        const userId = req.user.id;
        const alreadyLiked = blog.likes.some(
            id => id.toString() === userId
        );
        if (alreadyLiked) {
            blog.likes = blog.likes.filter(
                id => id.toString() !== userId
            );
            await blog.save();
            return res.status(200).json({
                message: "Blog unliked",
                totalLikes: blog.likes.length,
                likes: blog.likes
            });
        }
        blog.likes.push(userId);
        await blog.save();
        res.status(200).json({
            message: "Blog liked",
            totalLikes: blog.likes.length,
            likes: blog.likes
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
module.exports = {createBlog,getAllBlogs,getBlogById,updateBlog,deleteBlog,toggleLike};