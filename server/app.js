const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");

const app = express();

var corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "http://192.168.150.40:5173",
  ], // temp added http://192.168.150.40 to test on network/mobile
  // origin: process.env.CLIENT_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

// // Middleware
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// Routes
const notificationRouter = require("./routes/notificationRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");
app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/notification", notificationRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

// 404 error handler
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

module.exports = app;
