import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        default: null
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    verdict:{
        type:Boolean,
        default:null
    },
    isRejected:{
        type:Boolean,
        default:false
    },
    deadline:{
        type:Date,
        required:true   
    }
})
const proposals = mongoose.model('proposals', proposalSchema)

export default proposals;
