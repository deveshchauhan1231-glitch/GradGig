import Message from '../models/Message.model.js';
import Conversation from '../models/Conversation.model.js';
import User from '../models/User.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import { getIO } from '../socket/index.js';

export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const clerkId = req.auth.userId;
  const user = await User.findOne({ clerkId });
  if (!user) throw new ApiError(404, 'User not found');

  const userId = user._id;
  const conversation = await Conversation.findOne({
    _id: conversationId,
    $or: [{ user1: userId }, { user2: userId }]
  });

  if (!conversation) {
    throw new ApiError(403, 'Access denied');
  }

  const messages = await Message.find({ conversationId })
    .populate('senderId', 'email role')
    .populate('receiverId', 'email role')
    .sort({ createdAt: 1 });

  return res.status(200).json(new ApiResponse(200, messages, 'Messages retrieved successfully'));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content, receiverId } = req.body;
  const clerkId = req.auth.userId;
  const sender = await User.findOne({ clerkId });
  if (!sender) throw new ApiError(404, 'Sender not found');

  const senderId = sender._id;
  const conversation = await Conversation.findOne({
    _id: conversationId,
    $or: [{ user1: senderId }, { user2: senderId }]
  });

  if (!conversation) {
    throw new ApiError(403, 'Access denied');
  }

  const effectiveReceiverId = receiverId || (conversation.user1.toString() === senderId.toString() ? conversation.user2 : conversation.user1);
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

  const io = getIO();
  if (io) {
    io.to(conversationId.toString()).emit('receiveMessage', {
      _id: populatedMessage._id,
      conversationId: populatedMessage.conversationId,
      senderId: populatedMessage.senderId,
      receiverId: populatedMessage.receiverId,
      content: populatedMessage.content,
      createdAt: populatedMessage.createdAt
    });
  }

  return res.status(201).json(new ApiResponse(201, populatedMessage, 'Message sent successfully'));
});