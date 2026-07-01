import express from 'express';
import { clerkMiddleware } from "@clerk/express";
// import authRoutes from './routes/auth.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.routes.js';
import profileRoutes from "./routes/profile.routes.js";
import proposalRoutes from "./routes/proposal.routes.js";
import reportRoutes from "./routes/report.routes.js";
import projectRoutes from "./routes/project.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import contractRoutes from "./routes/contract.routes.js";
import dotenv from 'dotenv';
import cors from 'cors';
import authController from './controllers/auth/index.js';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();    
const app = express();
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'GradGig backend is running' });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api', authController); // Register the authController for /api routes

app.use(express.json());
app.use(clerkMiddleware({ publishableKey: clerkPublishableKey }));

// app.use('/auth', authRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes);

// NOTE: other feature routes remain unchanged for later wiring.
app.use('/profile', profileRoutes);
app.use('/proposal', proposalRoutes);
app.use('/report', reportRoutes);
app.use('/project', projectRoutes);
app.use('/review', reviewRoutes);
app.use('/contract', contractRoutes);

app.use(errorMiddleware);

export default app;
