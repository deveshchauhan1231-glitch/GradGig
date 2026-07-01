import mongoose from 'mongoose';

const contractSchema=new mongoose.Schema({
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users' 
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'projects',
        default:null
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    markedCompletedByClient:{
        type:Boolean,
        default:false
    },
    markedCompletedByProvider:{
        type:Boolean,
        default:false
    }   
})
const contracts=mongoose.model('contracts',contractSchema)
export default contracts;   
