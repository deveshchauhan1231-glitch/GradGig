const onlineUsers = new Map(); // socketId -> userId

export const addUser = (socketId, userId) => {
  onlineUsers.set(socketId, userId);
};

export const removeUser = (socketId) => {
  onlineUsers.delete(socketId);
};

export const getUser = (socketId) => {
  return onlineUsers.get(socketId);
};

export const getSocketId = (userId) => {
  for (let [socketId, id] of onlineUsers) {
    if (id === userId) return socketId;
  }
  return null;
};

export default onlineUsers;