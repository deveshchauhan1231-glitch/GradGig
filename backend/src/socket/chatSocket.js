import { addUser, removeUser, getUser, getSocketId } from './onlineUsers.js';
import Message from '../models/Message.model.js';
import Conversation from '../models/Conversation.model.js';
import User from '../models/User.model.js';

const chatSocket = (io, socket) => {
  console.log('User connected:', socket.id);

  socket.on('authenticate', (data) => {
    const { clerkId, email } = data || {};
    (async () => {
      try {
        let user = null;
        if (clerkId) user = await User.findOne({ clerkId });
        if (!user && email) user = await User.findOne({ email: (email || '').toLowerCase() });

        if (user) {
          addUser(socket.id, user._id.toString());
          socket.emit('authenticated', { success: true, userId: user._id.toString() });
        } else {
          socket.emit('authenticated', { success: false, message: 'User not registered' });
        }
      } catch (err) {
        socket.emit('authenticated', { success: false, message: 'Authentication error' });
      }
    })();
  });

  socket.on('joinConversation', (conversationId) => {
    const userId = getUser(socket.id);
    if (userId && conversationId) {
      socket.join(conversationId.toString());
      socket.emit('joinedConversation', { conversationId: conversationId.toString(), success: true });
      console.log(`User ${userId} joined conversation ${conversationId}`);
    }
  });

  socket.on('sendMessage', async (data) => {
    const { conversationId, content, receiverId } = data || {};
    const senderId = getUser(socket.id);

    if (!senderId || !conversationId || !content) {
      socket.emit('error', { message: 'Missing message data' });
      return;
    }

    try {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        $or: [{ user1: senderId }, { user2: senderId }]
      });

      if (!conversation) {
        socket.emit('error', { message: 'Conversation not found' });
        return;
      }

      const effectiveReceiverId = receiverId || (conversation.user1.toString() === senderId ? conversation.user2 : conversation.user1);
      const isSelfChat = conversation.user1.toString() === conversation.user2.toString();
      const message = new Message({
        conversationId,
        senderId,
        receiverId: effectiveReceiverId,
        content
      });

      if (senderId.toString() === conversation.user1.toString()) {
        conversation.unreadByUser2 = !isSelfChat;
      } else if (senderId.toString() === conversation.user2.toString()) {
        conversation.unreadByUser1 = !isSelfChat;
      }

      await conversation.save();
      await message.save();

      const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'email role')
        .populate('receiverId', 'email role');

      const payload = {
        _id: populatedMessage._id,
        conversationId: populatedMessage.conversationId,
        senderId: populatedMessage.senderId,
        receiverId: populatedMessage.receiverId,
        content: populatedMessage.content,
        createdAt: populatedMessage.createdAt
      };

      io.to(conversationId.toString()).emit('receiveMessage', payload);

      const recipientSocketId = getSocketId(effectiveReceiverId.toString());
      if (recipientSocketId && recipientSocketId !== socket.id) {
        io.to(recipientSocketId).emit('receiveMessage', payload);
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', (data) => {
    const { conversationId, isTyping } = data || {};
    if (!conversationId) return;
    socket.to(conversationId.toString()).emit('userTyping', { userId: getUser(socket.id), isTyping });
  });

  socket.on('disconnect', () => {
    const userId = getUser(socket.id);
    removeUser(socket.id);
    console.log('User disconnected:', socket.id, userId);
  });
};

export default chatSocket;