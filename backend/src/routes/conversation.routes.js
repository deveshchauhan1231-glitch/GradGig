import express from 'express';
import { getConversations, createConversation, getConversationById, getParticipantName, markConversationAsRead } from '../controllers/conversation.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get('/', getConversations);
router.post('/', createConversation);
router.post('/:conversationId/read', markConversationAsRead);
router.get('/participant/:userId', getParticipantName);
router.get('/:conversationId', getConversationById);

export default router;