import mongoose from 'mongoose';

const profileSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    name:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:['male','female','other']
    },
    college:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    skills:[{
        type:String,
        
    }],
    rating:{
        type:Number,
        default:0  
    },
    completedGigs:{
        type:Number,
        default:0
    },
    role: {
        type: String,
        enum: ['client', 'student'],
        default: 'student'
    },
    image:{
        type: String,
        
    },
    about:{
        type:String,
        
    }
})

const profiles = mongoose.model('profiles', profileSchema)

export default profiles
