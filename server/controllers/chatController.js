const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatSchema");

const getAllChats = asyncHandler(async (req, res) => {
  const currentUserId = req.user.userId;

  // Find all chats where the current user is a participant
  const chats = await Chat.find({
    participants: { $in: [currentUserId] },
  })
    .populate("participants", "username profilePicture")
    .populate("latestMessage")
    .populate('unreadMessages')
    .sort("-updatedAt")
    .lean();

  // Process the chats data
  const processedChats = chats.map((chat) => {
    const [chatPartner] = chat.participants.filter(
      (participant) => participant._id.toString() !== currentUserId
    );
    const { participants, ...rest } = chat;

    return { ...rest, chatPartner };
  });

  res.status(200).json(processedChats);
});

module.exports = {
  getAllChats,
};
