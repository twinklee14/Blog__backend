const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/");
    },
    filename: (req, file, callback) => {
        const uniqueName =
            Date.now() + path.extname(file.originalname);
        callback(null, uniqueName);
    }
});

const fileFilter = (req, file, callback) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(file.mimetype);
    if (isValid) {
        callback(null, true);
    } else {
        callback(new Error("Only image files are allowed"));
    }
};

const upload = multer({storage, fileFilter});

module.exports = upload;