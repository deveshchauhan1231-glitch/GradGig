import mongoose from 'mongoose';

const reportSchema=new mongoose.Schema({
    reporterId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    reportedId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    reason:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const reports=mongoose.model('reports',reportSchema)
export default reports; 
