

const mongoose=require("mongoose")

const uploadSchema= new mongoose.Schema({
 
    description: {
        type: String,
        required: false,
        default: ""
    },
    rollNo: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: null,
    },
    name:
    {
        type: String,
        required: true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
    },
    likes: [{
        type: String
    }],
    comments: [{
        content: String,
        author: String,
        rollNo: String,
        createdAt: { type: Date, default: Date.now }
    }]
            
})
module.exports=mongoose.model("uploadpost",uploadSchema);

