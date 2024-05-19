const mongoose=require('mongoose');
const {Schema}=mongoose;
const NotesSchema= new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId, //foregin key as user_id in user table
        ref:'user'
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    date:{
        type:Date,
        default:Date.now
    }
    
})
const notes="its_your_notes";
module.exports=mongoose.model(notes,NotesSchema);