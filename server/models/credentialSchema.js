const mongoose = require("mongoose");

const credentialsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Credentials = mongoose.model("Credentials", credentialsSchema);
module.exports = Credentials;