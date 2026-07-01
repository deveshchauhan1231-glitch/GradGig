import mongoose from 'mongoose';

const reviewSchema=new mongoose.Schema({
    reviewerId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    reviewedId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    review:{
        type:String,
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    }
})
const reviews=mongoose.model('reviews',reviewSchema)
export default reviews; 
