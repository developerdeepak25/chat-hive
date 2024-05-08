const { default: mongoose } = require("mongoose");
const Notification = require("../models/notificationSchema");
const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatSchema");
const {
  findUserById,
  createNotification,
  validateId,
  findNotification,
} = require("../utils/modalUtils");

// notifications controllers

const getNotification = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    // Find all notifications for the user
    const notifications = await Notification.find({ recipientId: userId })
      .populate("senderId", "username profilePicture")
      .sort({ createdAt: -1 })
      .select("_id recipientId senderId type")
      .lean();

    // Did this hoping that user will be isReaded as false for new notifications 
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    // Remove all elements from the unreadNotifications array in the User document
    await User.updateOne(
      { _id: userId },
      { $set: { unreadNotifications: [] } }
    );

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// notificaiton and social req controller

const createFriendRequestNotification = asyncHandler(async (req, res) => {
  const currentUserId = req.user.userId;
  const { receiverId } = req.body;

  // Validate receiverId
  validateId(receiverId, res);

  // Check if the receiver exists
  const receiver = await findUserById(receiverId);
  // if (!receiver) {
  //   return res
  //     .status(404)
  //     .json({ message: `User with ID ${receiverId} not found` });
  // }

  // Check if the sender and receiver are not the same
  if (currentUserId === receiverId) {
    return res
      .status(400)
      .json({ message: "You cannot send a friend request to yourself" });
  }

  const existingChat = await Chat.findOne({
    participants: { $all: [receiverId, currentUserId] },
  });

  if (existingChat) {
    return res.status(200).json({ message: "Already exist in the chats" });
  }

  // Check if a friend request notification already exists
  // const existingNotification = await Notification.findOne({
  //   senderId: currentUserId,
  //   recipientId: receiverId,
  //   type: "reqReceived",
  // });

  const existingNotification = await findNotification(
    currentUserId,
    receiverId,
    "reqReceived"
  );

  if (existingNotification) {
    return res.status(400).json({
      message: "Friend request already sent to this user",
    });
  }

  // Create a new friend request notification
  const createdNotification = await createNotification(
    currentUserId,
    receiverId,
    "reqReceived"
  );
  // const newNotification = new Notification({
  //   senderId: currentUserId,
  //   recipientId: receiverId,
  //   type: "reqReceived",
  // });

  //   try {
  // await newNotification.save();
  //   res.status(201).json({
  //     senderId,
  //     receiverId,
  //     senderPic: req.user.profilePicture,
  //     senderName: req.user.username,
  //     senderEmail: req.user.email,
  //   });
  res.status(201).json({
    message: "Friend request sent",
    notification: createdNotification,
  });
  //   } catch (error) {
  // console.error(error);
  // res
  //   .status(500)
  //   .json({ message: "Failed to create friend request notification" });
  //   }
});

const acceptFriendAndCreateChat = asyncHandler(async (req, res) => {
  const { friendId } = req.params; // may need to change according to how i write notification
  const currentUserId = req.user.userId;

  // Check if the current user is trying to create a chat with themselves
  if (currentUserId === friendId) {
    return res
      .status(400)
      .json({ message: "You cannot create a chat with yourself" });
  }

  const friend = await findUserById(friendId);
  if (!friend) {
    return res.status(404).json({ message: "This user does not exist" });
  }

  // Check if a chat already exists between the current user and the friend
  // kind of unnecessay check as notification/req will not be there if chat already exist
  // const existingChat = await Chat.findOne({
  //   // TODO - make utility
  //   participants: { $all: [currentUserId, friendId] },
  // });

  // if (existingChat) {
  //   return res.status(200).json(existingChat); // TODO
  // }

  // Create a new chat
  const newChat = new Chat({
    participants: [currentUserId, friendId],
  });

  // Remove the "reqReceived" notification for the friend
  await Notification.findOneAndDelete({
    recipientId: currentUserId,
    senderId: friendId,
    type: "reqReceived",
  });

  // notification to tell sender req was accepted
  const notificationForAccept = await createNotification(
    currentUserId,
    friendId,
    "reqAccepted"
  );
  await newChat.save();

  res.status(200).json({
    message: "friend request accepted",
    newChat,
    notification: notificationForAccept,
  });
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { friendId } = req.params;
  const currentUserId = req.user.userId;

  // Check if the current user is trying to reject their own friend request
  if (currentUserId === friendId) {
    return res
      .status(400)
      .json({ message: "You cannot reject your own friend request" });
  }

  const friend = await findUserById(friendId);
  if (!friend) {
    return res.status(404).json({ message: "This user does not exist" });
  }

  // Remove the "reqReceived" notification for the friend
  await Notification.findOneAndDelete({
    recipientId: currentUserId,
    senderId: friendId,
    type: "reqReceived",
  });

  // Create a "reqRejected" notification for the sender
  const notificationForRejection = await createNotification(
    currentUserId,
    friendId,
    "reqRejected"
  );

  res.status(200).json({
    message: "Friend request rejected",
    notification: notificationForRejection,
  });
});

module.exports = {
  createFriendRequestNotification,
  getNotification,
  acceptFriendAndCreateChat,
  rejectFriendRequest,
};
