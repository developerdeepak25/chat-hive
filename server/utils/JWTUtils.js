const jwt = require("jsonwebtoken");

// Generate an access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      userPic: user.profilePicture,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "30m", // Access token expires in 15 minutes
    }
  );
};

// Generate a refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      userPic: user.profilePicture,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d", // Refresh token expires in 7 days
    }
  );
};

const verifyAccessToken = async (accessToken) => {
  try {
    const payload = await jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
    return { payload, isValid: true };
  } catch (error) {
    return { payload: null, isValid: false };
  }
};


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
