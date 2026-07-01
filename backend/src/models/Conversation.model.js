import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    unreadByUser1: {
        type: Boolean,
        default: false
    },
    unreadByUser2: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;