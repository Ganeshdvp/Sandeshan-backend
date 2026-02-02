import { Server } from "socket.io";
import crypto from 'crypto';

const getRoomId = (loggedInUserId, targetId)=>{
  return crypto.createHash("sha256").update([loggedInUserId,targetId].sort().join('$')).digest("hex");
}


export const initialSocketConnection = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
          origin: ["http://localhost:5173"],
      }
      });

      io.on("connection", (socket) => {
        // handlers
        socket.on("joinChat",({firstName,ProfileImage, loggedInUserId, targetId})=>{
          const roomId = getRoomId(loggedInUserId, targetId);
          console.log(firstName + " is joined to " + roomId);
          socket.join(roomId);
        }),

        socket.on("sendMessage", ({
          firstName,
          ProfileImage,
          loggedInUserId,
          targetId,
          text,
        })=>{
          const roomId = getRoomId(loggedInUserId, targetId);
          console.log(firstName + ' ' + text)
          io.to(roomId).emit("messageRecevied",{firstName,ProfileImage,text})
        })
      });
}