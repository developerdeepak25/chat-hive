const express = require("express");
const { signupHandler, refreshAccessToken, googeleSignInHandler, signoutHandler } = require("../controllers/authController");
const { signinHandler } = require("../controllers/authController");

const Router = express.Router();

Router.post("/signup", signupHandler);
Router.post("/signin", signinHandler);
Router.post("/signout", signoutHandler);
Router.get("/refresh", refreshAccessToken);
Router.post('/google-sign-in', googeleSignInHandler);


module.exports = Router;
