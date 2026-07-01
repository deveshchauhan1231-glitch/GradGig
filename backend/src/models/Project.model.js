import mongoose from 'mongoose';

const projectSchema=new mongoose.Schema({
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
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
    deadline:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    skills_needed:{
        type:[String],
        required:true
    },
    category:{
        type:String,
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
const projects=mongoose.model('projects',projectSchema)
export default projects;
