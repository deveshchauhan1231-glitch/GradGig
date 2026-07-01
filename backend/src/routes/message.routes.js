import express from 'express';
import { getMessages, sendMessage } from '../controllers/message.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get('/:conversationId', getMessages);
router.post('/', sendMessage);

export default router;