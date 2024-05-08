const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createFriendRequestNotification, getNotification,  acceptFriendAndCreateChat, rejectFriendRequest } = require("../controllers/notificationController");
const Router = express.Router();

Router.use(authMiddleware);

// routes related ro notification only
Router.get("/get-notifications", getNotification);

// routes related to social req,  notifcation and etc

// route for create friend req with notification
Router.post("/request-friend", createFriendRequestNotification);
Router.get("/accept-request/:friendId", acceptFriendAndCreateChat);
Router.get("/reject-request/:friendId", rejectFriendRequest);


module.exports = Router;
