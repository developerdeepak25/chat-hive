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
  getSocketOfRoom,
  getUserIdsFromSockets,
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
    socket.chatId = chatId;
    console.log("joined room chat id: " + chatId);
    addActiveChatParticipant(socket, chatId);
    // Get the list of socket IDs in the room
   const sockets = await getSocketOfRoom(chatId,io)
   const userIds = getUserIdsFromSockets(sockets);
    // const sockets = await io.in(chatId).fetchSockets();
    // const userIds = sockets.map((socket) => {
    //   return socket.userId;
    // });
    console.log("userIds", userIds);

    io.in(chatId).emit("participant joined", userIds);
    console.log("participant joined chat id: " + chatId);
  });

  socket.on("leave chat", (chatId) => {
    removeInactiveChatParticipant(socket, chatId);
    socket.leave(chatId);
    socket.to(chatId).emit("participant left", socket.userId);
    console.log("leaved room chat id: " + chatId);
  });

  socket.on("message", (message) => {
    if (!message || !message.chatId)
      return console.log("no message or missing chat id");
    const chat = message.chatId; // chatId returns chat obj not the id
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

  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

  // call events

  socket.on("outgoing-call", (roomId, recipientId)=>{
    socket.to(recipientId).emit("incoming-call", roomId, socket.userId)
  })

  socket.on("join-call", async (roomId,peerId) => {
    socket.join(roomId);
    const sockets = await  getSocketOfRoom(roomId,io)
   const userIds = getUserIdsFromSockets(sockets);
   console.log('roomID', roomId);
    console.log("joined call romm by", userIds);
    socket.to(roomId).emit("user-connected",peerId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id, socket.userId);
    socket.to(socket.chatId).emit("participant left", socket.userId);
    removeInactiveChatParticipantFromAll(socket);
  });
});
