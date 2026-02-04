import { Server } from "socket.io";
import crypto from 'crypto';
import { Chat } from "../models/chat.js";
import { User } from '../models/users.js';

const getRoomId = (loggedInUserId, targetId) => {
  return crypto.createHash("sha256").update([loggedInUserId, targetId].sort().join('$')).digest("hex");
}


export const initialSocketConnection = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173"],
    }
  });

  io.on("connection", (socket) => {
    // handlers
    socket.on("joinChat", async ({ firstName, ProfileImage, loggedInUserId, targetId }) => {
      const roomId = getRoomId(loggedInUserId, targetId);

      const targetUser = await User.findById(targetId).select("firstName ProfileImage");

      socket.join(roomId);

      io.to(roomId).emit("joinedRoom", { targetName: targetUser?.firstName, ProfileImage: targetUser.ProfileImage })
    }),

      socket.on("sendMessage", async ({
        firstName,
        ProfileImage,
        loggedInUserId,
        targetId,
        text,
      }) => {
        try {
          const roomId = getRoomId(loggedInUserId, targetId);

          // save in Db
          let chat = await Chat.findOne({
            participants: { $all: [loggedInUserId, targetId] },
          })

          if (!chat) {
            chat = new Chat({
              participants: [loggedInUserId, targetId],
              messages: [],
            })
          }

          chat.messages.push({
            senderId: loggedInUserId,
            text
          });
          await chat.save();

          const lastMessage = chat?.messages[chat.messages.length-1];

          io.to(roomId).emit("messageRecevied", { loggedInUserId, firstName, ProfileImage, text, createdAt: lastMessage?.createdAt })

        }
        catch (err) {
          console.log(err);
        }
      })
  });
}