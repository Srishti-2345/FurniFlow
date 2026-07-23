const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const User = require("../models/User");

const onlineUsers = new Map();

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });

  // JWT Authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication failed"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {

    console.log(`${socket.user.fullName} connected`);

    onlineUsers.set(
      socket.user._id.toString(),
      socket.id
    );

    io.emit(
      "user_online",
      socket.user._id.toString()
    );

    // Join Conversation
    socket.on(
      "join_conversation",
      async (conversationId) => {
        try {
          const conversation =
            await Conversation.findById(conversationId);

          if (!conversation) return;

          const isParticipant =
            conversation.participants.some(
              (participant) =>
                participant.toString() ===
                socket.user._id.toString()
            );

          if (!isParticipant) {
            return;
          }

          socket.join(conversationId);

          console.log(
            `${socket.user.fullName} joined ${conversationId}`
          );

        } catch (error) {
          console.log(error.message);
        }
      }
    );

    // Send Message
    socket.on(
      "send_message",
      async ({ conversationId, text }) => {

        try {

          const conversation =
            await Conversation.findById(conversationId);

          if (!conversation) return;

          const isParticipant =
            conversation.participants.some(
              (participant) =>
                participant.toString() ===
                socket.user._id.toString()
            );

          if (!isParticipant) return;

          const message =
            await Message.create({
              conversation: conversationId,
              sender: socket.user._id,
              text,
            });

          await Conversation.findByIdAndUpdate(
            conversationId,
            {
              lastMessage: text,
              lastMessageAt: new Date(),
            }
          );

          const populatedMessage =
            await Message.findById(message._id)
              .populate(
                "sender",
                "fullName profileImage"
              );

          io.to(conversationId).emit(
            "receive_message",
            populatedMessage
          );

        } catch (error) {
          console.log(error.message);
        }

      }
    );

    // Typing
    socket.on(
      "typing",
      (conversationId) => {

        socket
          .to(conversationId)
          .emit(
            "user_typing",
            socket.user._id.toString()
          );

      }
    );

    // Stop Typing
    socket.on(
      "stop_typing",
      (conversationId) => {

        socket
          .to(conversationId)
          .emit(
            "user_stop_typing",
            socket.user._id.toString()
          );

      }
    );

    // Read Receipt
    socket.on(
      "mark_read",
      async ({ conversationId, messageId }) => {

        try {

          await Message.findByIdAndUpdate(
            messageId,
            {
              read: true,
            }
          );

          io.to(conversationId).emit(
            "message_read",
            {
              messageId,
            }
          );

        } catch (error) {
          console.log(error.message);
        }

      }
    );

    socket.on("disconnect", () => {

      onlineUsers.delete(
        socket.user._id.toString()
      );

      io.emit(
        "user_offline",
        socket.user._id.toString()
      );

      console.log(
        `${socket.user.fullName} disconnected`
      );

    });

  });
};

module.exports = initializeSocket;
