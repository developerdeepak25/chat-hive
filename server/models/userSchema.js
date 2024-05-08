const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    profilePicture: { type: String },
    // Other user-related fields
    googleId: {
      type: String,
      unique: true,
      // default: null,
    },
    unreadNotifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" ,default:[]},
    ],
    // googleAccessToken: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
