const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const Credentials = require("../models/credentialSchema");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/JWTUtils");
// const { OAuth2Client } = require("google-auth-library");

// sign up controller
const signupHandler = asyncHandler(async (req, res) => {
  const { name: username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email });
  const savedUser = await newUser.save();

  // if(!userCred && !newUser) return res.status(400).json({ error: "Unable to create Account" });
  const userCred = new Credentials({
    user: savedUser._id,
    password: hashedPassword,
  });
  await userCred.save();

  // console.log(newUser,userCred);

  res.status(200).json({
    message: "User registered successfully.",
  });
});

// sign in controller
const signinHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({ email });
  if (!user) {
    console.log("here");
    return res.status(400).json({ error: "Email not registered" });
  }
  // console.log("🚀 ~ signinHandler ~ user:", user)
  const cred = await Credentials.findOne({ user: user._id });
  // console.log("🚀 ~ signinHandler ~ cred:", cred)
  const isPasswordMatch = await bcrypt.compare(password, cred.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
    // throw new Error("Invalid email or password");
  }
  // Generate a JSON Web Token
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: "30d", // Token expires in 30 days
  // });
  // Generate access and refresh tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  console.log("refresh token when generated", refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }).status(200).json({
    // Send the access token and user data in the response
    message: "user signed in successfully",
    _id: user._id,
    name: user.username,
    email: user.email,
    accessToken,
    unreadNotifications: user.unreadNotifications,
    // userPic: user.profilePicture,
    ...(user.profilePicture && { userPic: user.profilePicture }), // Only include userPic if it exists
  });
});

//  refresh access token controller

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  // console.log('refreshToken',refreshToken);
  if (!refreshToken) {
   return res.status(401).json({ message: "Unauthorized, no refresh token" });
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return res.status(403).json({ message: "Forbidden, invalid refresh token" });
  }
  const user = await User.findById(payload.userId);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized, user not found" });
  }

  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  res
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(200)
    .json({
      _id: user._id,
      name: user.username,
      email: user.email,
      unreadNotifications: user.unreadNotifications,
      accessToken,
      ...(user.profilePicture && { userPic: user.profilePicture }), // Only include userPic if it exists
    });
});

const googeleSignInHandler = asyncHandler(async (req, res) => {
  const { name: username, email, image, uid } = req.body;

  let user = await User.findOne({ googleId: uid });
  if (!user) {
    user = new User({
      username,
      email,
      profilePicture: image,
      googleId: uid,
    });
    console.log("here google user db creation takes place");
    await user.save();
  } else {
    // here, updating existing user
    user.username = username;
    user.profilePicture = image;
    console.log("here google user db updation takes place");
    await user.save();
  }
  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  res
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(200)
    .json({
      message: "user signed in successfully",
      _id: user._id,
      name: user.username,
      email: user.email,
      accessToken,
      userPic: user.profilePicture,
      unreadNotifications: user.unreadNotifications,
    });
});

const signoutHandler = asyncHandler(async (req, res) => {
  // Clear the refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({ message: "User logged out successfully" });
});


// const googeleSignInHandler = asyncHandler(async (req, res) => {
//   const { id_token, access_token } = req.body;
//   const client = new OAuth2Client(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET
//   );
//   console.log(id_token, access_token);

//   // If the id_token is available, verify it with Google
//   if (id_token) {
//     console.log("id_token");
//     const ticket = await client.verifyIdToken({
//       idToken: id_token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     console.log("🚀 ~ googeleSignInHandler ~ payload:", payload);

//     // Check if the user already exists in your application's database
//     let user = await User.User.findOne({ googleId: payload.sub });

//     if (!user) {
//       // If the user doesn't exist, create a new user
//       user = new User({
//         googleId: payload.sub,
//         email: payload.email,
//         username: payload.name,
//         accessToken: access_token, // Store the access token
//       });
//       await user.save();
//     } else {
//       // Update the existing user's access token
//       // user = await updateUserGoogleAccessToken(user.id, access_token);
//     }
//   } else if (access_token) {
//     console.log("access_token");
//     // If only the access_token is available, use it to fetch user information from Google
//     // const tokenInfo = await client.getTokenInfo(access_token);
//     // const r = await client.getToken(access_token);
//     // console.log("🚀 ~ googeleSignInHandler ~ r:", r);

// client.setCredentials(access_token);
//     // take a look at the scopes originally provisioned for the access token
//     // console.log(tokenInfo);
//     // console.log(tokenInfo.scopes);

//     const { data } = await client.request({
//       url: `https://www.googleapis.com/oauth2/v1/userinfo`,
//       // url: `https://www.googleapis.com/auth/userinfo.profile`,
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     });
//     console.log("from access_token_google", data);
//     // Check if the user already exists in your application's database
//     let user = await User.findOne({ googleId: data.sub });

//     if (!user) {
//       // If the user doesn't exist, create a new user
//       user = new User({
//         googleId: data.sub,
//         email: data.email,
//         username: data.name,
//         accessToken: access_token, // Store the access token
//       });
//     } else {
//       // Update the existing user's access token
//       // user = await updateUserGoogleAccessToken(user.id, access_token);
//     }
//   } else {
//     // If neither id_token nor access_token are available, return an error
//     return res.status(400).json({ error: "No Google credential provided" });
//   }

//   // Generate a session token or cookie for the user
//   const sessionToken = generateSessionToken(user);

//   // Return the session token or cookie to the frontend
//   res
//     .status(200)
//     .json({ sessionToken, message: "User Signed in successfully" });
// });

module.exports = {
  signupHandler,
  signinHandler,
  refreshAccessToken,
  googeleSignInHandler,
  signoutHandler,
};
