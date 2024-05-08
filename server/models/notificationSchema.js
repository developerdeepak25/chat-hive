const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // chatId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Chat",
    // },
    type: {
      type: String,
      // enum: ["reqReceived", "reqAccepted", "reqRejected", "reqFriend"],
      enum: ["reqReceived", "reqAccepted", "reqRejected"],
      required: true,
    },
    // content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      index: { expires: "5m" }, // Set the TTL index to expire after 5 minutes
    },
    // Other notification-related fields
  },
  { timestamps: true }
);

// used claude ai here  to create this pre hook
notificationSchema.pre(["save", "updateOne"], function (next) {
  const notification = this;

  // If the notification is unread and not of type 'reqFriend', set the expiresAt field
  if (!notification.isRead && notification.type !== "reqReceived") {
    // notification.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
    notification.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
  } else {
    // If the notification is read or of type 'reqFriend', remove the expiresAt field to prevent expiration
    notification.expiresAt = undefined;
  }

  next();
});
notificationSchema.post("save", async function (doc, next) {
  try {
    const User = mongoose.model("User");
    const recipientUser = await User.findById(doc.recipientId);

    if (recipientUser) {
      recipientUser.unreadNotifications.push(doc._id);
      await recipientUser.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
