const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const Chat = require("../models/chatSchema");




// controller for searching user
const getUsersBySearchQuery = asyncHandler(async (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : "";
  const currentUserId = req.user.userId;

  if (!query) {
    return res.status(400).json({ message: "Please enter a search query" });
  }
  const results = await User.find(
    {
      $and: [
        {
          $or: [
            { email: { $regex: `^${query}`, $options: "i" } },
            { username: { $regex: `^${query}`, $options: "i" } },
          ],
        },
        { _id: { $ne: currentUserId } }, // Exclude the logged-in user's document
      ],
    },
    "username profilePicture _id email"
  );
console.log(results);
  res.status(200).json(results);


});

module.exports = {
  
  getUsersBySearchQuery,
};
