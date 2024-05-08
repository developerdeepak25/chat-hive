const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { sendMessage, getMessages } = require("../controllers/messageController");

const Router = express.Router();

Router.use(authMiddleware);

Router.post("/send",sendMessage);
Router.get("/getMessages/:chatId",getMessages);

module.exports = Router;
