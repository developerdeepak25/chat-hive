const Chat = require("../models/chatSchema");
const asyncHandler = require("express-async-handler");
const { validateId } = require("../utils/modalUtils");
const Message = require("../models/messageSchema");

const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.userId;
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // this check may be unnecessary
  if (typeof text !== "string") {
    return res.status(400).json({ message: "Text must be a string" });
  }
  if (text.length <= 0) {
    return res.status(400).json({ message: "Text must not be empty" });
  }

  validateId(chatId, res);

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(400).json({ message: "Chat not found" });
  }

  if (!chat.participants.includes(senderId)) {
    return res
      .status(403)
      .json({ message: "You are not a participant in this chat" });
  }
  const newMessage = new Message({
    chatId,
    senderId,
    content: text,
    type: "text",
  });

  // Saving the new message to the database
  const savedMessage = await newMessage.save();

  await (
    await savedMessage.populate("senderId", "username profilePicture")
  ).populate("chatId", "participants ");

  // Updating the latestMessage field of the chat document
  chat.latestMessage = savedMessage._id;

  activeUser = chat.activeParticipants.filter((activeParticipant) => {
    return activeParticipant.toString() !== senderId.toString();
  });
  console.log(activeUser);
  if (!activeUser || activeUser.length === 0) {
    // adding unread messages to the chat
    chat.unreadMessages.push(savedMessage._id);
  }

  await chat.save();

  // if can do this that will be great
  //   io.to(chatId).emit("new message", newMessage);

  res.status(200).json(savedMessage);
});

// controller get all messages of a chat
const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { chatId } = req.params;

  validateId(chatId, res);

  const chat = await Chat.findById(chatId).populate(
    "unreadMessages",
    "senderId"
  );
  if (!chat) {
    return res.status(400).json({ message: "Chat not found" });
  }
  if (!chat.participants.includes(userId)) {
    return res
      .status(403)
      .json({ message: "You are not a participant in this chat" });
  }

  const messages = await Message.find({ chatId: chatId }).populate(
    "senderId",
    "username profilePicture"
  );

  // removing all messages gfrom un read msg except for current user messages
  console.log("chat.unreadMessages", chat.unreadMessages);
  const unreadMessages = chat?.unreadMessages.filter(
    (unreadMessage) => unreadMessage.senderId.toString() === userId.toString()
  );
  console.log("chat.unreadMessages after", chat.unreadMessages);
  console.log(`unreadMessages`, unreadMessages);

  // await Message.updateMany( //! not using now
  //   {
  //     _id: { $nin: unreadMessages },
  //     senderId: { $ne: userId },
  //     chatId: { $eq: chatId },
  //   },
  //   { $set: { readed: true } }
  // );
  // .populate("chatId");
  await Chat.findOneAndUpdate({ _id: chatId }, { unreadMessages });

  res.status(200).json(messages);
});

module.exports = {
  sendMessage,
  getMessages,
};
