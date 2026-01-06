const express = require("express");
const postsRouter = express.Router({ mergeParams: true });
const postsController = require("../controllers/postsController");
const { postExists, isPostOwner } = require("../middlewares/postMiddleware");
const { requireAuth } = require("../middlewares/authMiddleware");

postsRouter.get("/post/add", requireAuth, postsController.getAddPost);
postsRouter.post("/post/add", requireAuth, postsController.postAddPost);
postsRouter.get("/post/:postId", postExists, postsController.getPost);
postsRouter.get("/post/:postId/edit", postExists, requireAuth, isPostOwner, postsController.getEditPost);
postsRouter.post("/post/:postId/edit", postExists, requireAuth, isPostOwner, postsController.postEditPost);
postsRouter.post("/post/:postId/like", postExists, requireAuth, postsController.postLikePost);
postsRouter.post("/post/:postId/delete", postExists, requireAuth, isPostOwner, postsController.postDeletePost);

module.exports = postsRouter;
