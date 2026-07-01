import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
        enum: ['client', 'student'],
        default: 'student'
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    }
});

const User = mongoose.model('User', userSchema);
export default User;
