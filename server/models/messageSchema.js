const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: {
      type: String,
      required: function () {
        return !this.mediaUrl;
      },
    },
    type: { type: String, enum: ["text", "image", "video"], default: "text" },
    // enums allows only values given to it
    mediaUrl: {
      type: String,
      required: function () {
        return !this.content;
      },
    },
    readed:{type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    // Other message-related fields
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
