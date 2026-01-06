const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController")

const communitiesRouter = require("./communitiesRouter");
const postsRouter = require("./postsRouter");
const authRouter = require("./authRouter");

router.use("/c", communitiesRouter);
router.use("/c/:commId", postsRouter);
router.use("/auth", authRouter);

router.get("/", mainController.getCommunities);
router.get("/about", mainController.getAbout);
router.get("/user/:username", mainController.getProfile);

module.exports = router;
