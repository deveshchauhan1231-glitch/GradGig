import Conversation from '../models/Conversation.model.js';
import Message from '../models/Message.model.js';
import User from '../models/User.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';

export const getParticipantName = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const participant = await User.findById(userId).select('firstName lastName email role');

  if (!participant) {
    throw new ApiError(404, 'User not found');
  }

  const fullName = [participant.firstName, participant.lastName].filter(Boolean).join(' ').trim();
  return res.status(200).json(new ApiResponse(200, {
    _id: participant._id,
    name: fullName || participant.email,
    email: participant.email,
    role: participant.role
  }, 'Participant retrieved successfully'));
});

export const getConversations = asyncHandler(async (req, res) => {
  const clerkId = req.auth.userId;
  const userRecord = await User.findOne({ clerkId });
  if (!userRecord) return res.status(404).json(new ApiResponse(404, null, 'User not found'));

  const userId = userRecord._id;
  const conversations = await Conversation.find({
    $or: [{ user1: userId }, { user2: userId }]
  }).populate('user1 user2', 'firstName lastName email role').sort({ updatedAt: -1 });

  const conversationsWithLastMessage = await Promise.all(
    conversations.map(async (conv) => {
      const lastMessage = await Message.findOne({ conversationId: conv._id })
        .sort({ createdAt: -1 })
        .populate('senderId', 'firstName lastName email role');

      const participant = conv.user1?._id?.toString() === userId.toString() ? conv.user2 : conv.user1;

      const unreadForMe = conv.user1?._id?.toString() === userId.toString()
        ? Boolean(conv.unreadByUser1)
        : Boolean(conv.unreadByUser2);

      return {
        ...conv.toObject(),
        participant,
        lastMessage,
        unreadForMe
      };
    })
  );

  return res.status(200).json(new ApiResponse(200, conversationsWithLastMessage, 'Conversations retrieved successfully'));
});

export const createConversation = asyncHandler(async (req, res) => {
  const { user2Id } = req.body;
  const clerkId = req.auth.userId;

  if (!user2Id) {
    throw new ApiError(400, 'Recipient ID is required');
  }

  const user1Record = await User.findOne({ clerkId });
  if (!user1Record) throw new ApiError(404, 'Sender not found');

  const user1Id = user1Record._id;
  if (user1Id.toString() === user2Id.toString()) {
    const existingConv = await Conversation.findOne({
      $or: [
        { user1: user1Id, user2: user1Id },
        { user1: user1Id, user2: user1Id }
      ]
    });

    if (existingConv) {
      return res.status(200).json(new ApiResponse(200, existingConv, 'Conversation already exists'));
    }

    const conversation = new Conversation({
      user1: user1Id,
      user2: user1Id
    });

    await conversation.save();

    return res.status(201).json(new ApiResponse(201, conversation, 'Conversation created successfully'));
  }

  const existingConv = await Conversation.findOne({
    $or: [
      { user1: user1Id, user2: user2Id },
      { user1: user2Id, user2: user1Id }
    ]
  });

  if (existingConv) {
    return res.status(200).json(new ApiResponse(200, existingConv, 'Conversation already exists'));
  }

  const conversation = new Conversation({
    user1: user1Id,
    user2: user2Id
  });

  await conversation.save();

  return res.status(201).json(new ApiResponse(201, conversation, 'Conversation created successfully'));
});

export const markConversationAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const clerkId = req.auth.userId;
  const userRecord = await User.findOne({ clerkId });
  if (!userRecord) throw new ApiError(404, 'User not found');

  const userId = userRecord._id;
  const conversation = await Conversation.findOne({
    _id: conversationId,
    $or: [{ user1: userId }, { user2: userId }]
  });

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  if (conversation.user1.toString() === userId.toString()) {
    conversation.unreadByUser1 = false;
  } else {
    conversation.unreadByUser2 = false;
  }

  await conversation.save();

  return res.status(200).json(new ApiResponse(200, conversation, 'Conversation marked as read'));
});

export const getConversationById = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const clerkId = req.auth.userId;
  const userRecord = await User.findOne({ clerkId });
  if (!userRecord) throw new ApiError(404, 'User not found');

  const userId = userRecord._id;
  const conversation = await Conversation.findOne({
    _id: conversationId,
    $or: [{ user1: userId }, { user2: userId }]
  }).populate('user1 user2', 'firstName lastName email role');

  if (!conversation) {
    throw new ApiError(404, 'Conversation not found');
  }

  const participant = conversation.user1?._id?.toString() === userId.toString() ? conversation.user2 : conversation.user1;

  return res.status(200).json(new ApiResponse(200, {
    ...conversation.toObject(),
    participant
  }, 'Conversation retrieved successfully'));
});