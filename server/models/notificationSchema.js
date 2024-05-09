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
// index: function () {
//         if (this.type === "reqReceived") {
//           console.log(" not adding expirey");
//           return { expires: null };
//         } else {
//           console.log("adding expirey");
//           return { expires: "5m" }; // Set the TTL index to expire after 5 minutes
//         }
//       },

// used claude ai here  to create this pre hook
// notificationSchema.post( ["save",'update'], function (doc,next) {
//   const notification = doc;
//   console.log("nnn", notification);

//   // If the notification is unread and not of type 'reqFriend', set the expiresAt field
//   console.log(
//     "setting  expiry outside",
//     notification.isRead,
//     notification.type
//   );

//   if (!notification.isRead || notification.type !== "reqReceived") {
//     // notification.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
//     notification.expiresAt = undefined;
//     console.log("not setting expiry ");
//   } else {
//     console.log("setting  expiry");
//     notification.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
//     // If the notification is read or of type 'reqFriend', remove the expiresAt field to prevent expiration
//   }

// next();
// });
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
