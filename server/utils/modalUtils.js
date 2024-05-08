const Notification = require("../models/notificationSchema");
const User = require("../models/userSchema");
// const mongoose = require("mongoose");


const findUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  return user;
};

const createNotification = async (senderId, recipientId, type) => {
  const newNotification = new Notification({
    senderId,
    recipientId,
    type,
  });

  const newNotifcation = await newNotification.save();
  return newNotifcation;
};

const mongoose = require("mongoose");

function validateId(receiverId, res) {
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid Id" });
  }
}

const findNotification = async (senderId, recipientId, type) => {
  try {
    const existingNotification = await Notification.findOne({
      senderId,
      recipientId,
      type,
    });
    return existingNotification;
  } catch (error) {
    console.error("Error finding notification:", error);
    throw error;
  }
};
const deleteNotification = async (senderId, recipientId, type) => {
  try {
    const result = await Notification.deleteOne({
      senderId,
      recipientId,
      type,
    });
    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};


module.exports = {
  findUserById,
  createNotification,
  validateId,
  findNotification,
  deleteNotification,
};
