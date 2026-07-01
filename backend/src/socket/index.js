import { Server } from "socket.io";
import chatSocket from "./chatSocket.js";

let ioInstance = null;

const initSocket = (server) => {
  if (ioInstance) return ioInstance;

  ioInstance = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("a user connected");
    chatSocket(ioInstance, socket);
  });

  return ioInstance;
};

export const getIO = () => ioInstance;
export default initSocket;