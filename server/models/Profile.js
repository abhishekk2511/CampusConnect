
const mongoose=require("mongoose")

const profileSchema= new mongoose.Schema({
           name:{
                type:String,
                required:true,
            },
            
            image:{
                type:String,
                default: 'default.png',
            },
            year:{
                type:String,
                required:true,
            },

            branch:{
                type:String,
                required:true,
            },
            email:{
                type:String,
                required:true,
            },
            posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'uploadpost' }],
            messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'messages' }],
            rollNo:{
                type:String,
                required:true,
            },
            company: {
                type: String,
                default: ""
            },
            jobTitle: {
                type: String,
                default: ""
            },
            friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
            friendRequests: [
                {
                    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
                    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
                }
            ],
            sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }]

           
            
})
module.exports=mongoose.model("Profile",profileSchema);
