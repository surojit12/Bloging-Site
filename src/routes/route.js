const express = require('express');
const router = express.Router();
const AuthorController = require("../controllers/authorController");
const BlogController = require("../controllers/blogController");
const middlewares = require('../middlewares/auth');

router.post("/authors",AuthorController.createAuthor);
router.post("/login",AuthorController.loginAuthor);
router.post("/blogs",middlewares.authenticate,BlogController.createBlogs);
router.get("/blogs",middlewares.authenticate,BlogController.getBlogs);
router.put("/blogs/:blogId",middlewares.authenticate,middlewares.authorise,BlogController.updateBlog);
router.delete("/blogs/:blogId",middlewares.authenticate,middlewares.authorise,BlogController.deleteBlogById);
router.delete("/blogs",middlewares.authenticate,BlogController.deleteBlog);

module.exports = router;