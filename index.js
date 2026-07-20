require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const app = express();

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});