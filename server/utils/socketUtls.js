const Chat = require("../models/chatSchema");

const addActiveChatParticipant = async (socket, chatId) => {
  try {
    // if(!socket.userId) return
    // console.log(`userId inside join chat event`, socket.userId);

    // // Join the chat room
    // socket.join(chatId);

    // Find the chat document and check if the user is a participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return console.error(`Chat ${chatId} not found`);
    }

    if (!chat.participants.includes(socket.userId)) {
      return console.error(
        `User ${socket.userId} is not a participant in chat ${chatId}`
      );
    }

    // Check if the user is already in the activeParticipants array
    const isActiveParticipant = chat.activeParticipants.includes(socket.userId);

    // If the user is not an active participant, add them to the activeParticipants array
    if (!isActiveParticipant) {
      chat.activeParticipants.push(socket.userId);
      await chat.save();
      console.log(
        `User ${socket.userId} added to active participants in chat ${chatId}`
      );
    } else {
      console.log(
        `User ${socket.userId} is already an active participant in chat ${chatId}`
      );
    }
  } catch (error) {
    console.error("Error joining chat:", error);
  }
};

const removeInactiveChatParticipant = async (socket, chatId) => {
  try {
    // if(!socket.userId) return
    console.log(`User ${socket.userId} leaving chat ${chatId}`);

    // Find the chat document
    // const chat = await Chat.findById(chatId);
    // if (!chat) {
    //   return console.error(`Chat ${chatId} not found`);
    // }
    // chat.activeParticipants = chat.activeParticipants.filter(
    //   (userId) => userId.toString() !== socket.userId
    // );
    //  await chat.save();
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { $pull: { activeParticipants: socket.userId } }
    );
    console.log(`User ${socket.userId} removed from chat ${chatId}`);
  } catch (error) {
    // Remove the user from the activeParticipants array
  }
};

const removeInactiveChatParticipantFromAll = async (socket) => {
  try {
    console.log("User disconnected", socket.id, socket.userId);

    // Remove the user from the activeParticipants array of all chats
    await Chat.updateMany(
      // { "activeParticipants": socket.userId },
      { $pull: { activeParticipants: socket.userId } }
    );

    console.log(
      `User ${socket.userId} removed from active participants in all chats`
    );
  } catch (error) {
    console.error("Error handling user disconnect:", error);
  }
};

module.exports = {
  addActiveChatParticipant,
  removeInactiveChatParticipant,
  removeInactiveChatParticipantFromAll,
};
