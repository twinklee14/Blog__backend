const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {createComment,getComments,deleteComment} = require("../controllers/commentController");

router.post("/:blogId", protect, createComment);
router.get("/:blogId", getComments);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;