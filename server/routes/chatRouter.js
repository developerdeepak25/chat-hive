const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAllChats } = require("../controllers/chatController");

const Router = express.Router();

Router.use(authMiddleware);

Router.get('/get-chats',getAllChats)

module.exports = Router;
