require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const path = require("path");
const app = express();

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentRoutes);
//Whenever someone requests a URL beginning with /uploads, look inside the physical uploads folder and return the requested file if it exists
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//__dirname is a global variable, It contains the absolute path of the current file
//path.join joins the name of the directory with 'uploads' folder
// eg : /dekstop/project/uploads
//static is an express middleware that checks whether a requested file exists in a directory and, if it does, sends it back directly without reaching API controllers

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});