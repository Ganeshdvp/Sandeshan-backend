import { Server } from "socket.io";
import crypto from 'crypto';
import { Chat } from "../models/chat.js";
import { User } from '../models/users.js';

// room id
const getRoomId = (loggedInUserId, targetId) => {
  return crypto.createHash("sha256").update([loggedInUserId, targetId].sort().join('$')).digest("hex");
}

export const initialSocketConnection = (httpServer) => {
  // server of websockets and enable cors
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://sandeshan-frontend.vercel.app"],  // frontend url
      credentials: true,
    }
  });

  // socket connection
  io.on("connection", (socket) => {
    // event handlers
    socket.on("joinChat", async ({ firstName, ProfileImage, loggedInUserId, targetId }) => {
      const roomId = getRoomId(loggedInUserId, targetId);
      socket.join(roomId);

      // find both users in DB
      const targetUser = await User.findById(targetId).select("firstName ProfileImage");
      const loggedInUser = await User.findById(loggedInUserId).select("firstName ProfileImage");

      socket.emit("joinedRoom", {
        targetName: targetUser?.firstName,
        ProfileImage: targetUser?.ProfileImage
      })
      
      socket.to(roomId).emit("joinedRoom", { targetName: loggedInUser?.firstName, ProfileImage: loggedInUser?.ProfileImage })
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