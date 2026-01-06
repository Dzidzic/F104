const express = require("express");
const authRouter = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");

authRouter.get("/login", authController.getLogin);
authRouter.get("/register", authController.getRegister);
authRouter.post("/login", authController.postLogin);
authRouter.post("/register", authController.postRegister);
authRouter.get("/logout", authController.logout);

module.exports = authRouter;
