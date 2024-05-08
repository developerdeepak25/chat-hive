const express = require("express");
const { addFriendCreateChat, getUsersBySearchQuery } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const Router = express.Router();

Router.use(authMiddleware)


Router.get("/get-users", getUsersBySearchQuery);


module.exports = Router;
