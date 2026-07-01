import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './database/db.js';
import initSocket from './socket/index.js';
import { createServer } from 'http';

connectDB();

const PORT = process.env.PORT || 5000;
const server = createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});