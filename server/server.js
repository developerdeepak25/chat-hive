// server/server.js
require("dotenv").config();

const http = require("http");
const app = require("./app");
// const connectDB = require("./config/dbConfig");

// Create HTTP server
const server = http.createServer(app);

// initializing socket io
const { Server } = require("socket.io");
const connectDB = require("./configs/dbConfig");
const {
  removeInactiveChatParticipant,
  removeInactiveChatParticipantFromAll,
  addActiveChatParticipant,
} = require("./utils/socketUtls");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// / Connect to the database
connectDB();

// Set the port (process.env.PORT for production, 5000 for development)
const port = process.env.PORT || 5000;
app.set("port", port);

// Listen on provided port
server.listen(port);

// Event listener for HTTP server "listening" event
server.on("listening", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("setUp", (id) => {
    socket.userId = id;
    socket.join(id);
    console.log("userid", id);
  });
  socket.on("join chat", async (chatId) => {
    // // chat id can be userid as well for allmost all litners i guess
    // console.log(`userId inside join chat event`, socket.userId);
    socket.join(chatId);
    console.log("joined room chat id: " + chatId);

    addActiveChatParticipant(socket, chatId);
  });
  socket.on("leave chat", (chatId) => {
    removeInactiveChatParticipant(socket, chatId);
    socket.leave(chatId);
    console.log("leaved room chat id: " + chatId);
  });
  socket.on("message", (message) => {
    const chat = message.chatId;
    // console.log(message);
    chat.participants.forEach((participant) => {
      socket.to(participant).emit("newMessage", message);
    });
  });
  socket.on("notification", (notification) => {
    // sending notification may not be necessary as reciver will refetch all notification on newNotification
    if (!notification) {
      return console.log("did not received notification");
    }
    socket.to(notification.recipientId).emit("newNotification", notification);
    console.log("notification sent to ", notification.recipientId);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id, socket.userId);
    removeInactiveChatParticipantFromAll(socket);
  });
});
