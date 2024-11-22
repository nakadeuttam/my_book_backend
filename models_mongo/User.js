const mongoose=require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({ 
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
     required: true,
    unique: true
    },
    password: {
        type:String , default:null
    },
    googleId: { 
        type: String
     },
    date: {
        type: Date,
        default:Date.now

    }

    });
    const user="USER"

    module.exports=mongoose.model(user,UserSchema);