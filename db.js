const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI=process.env.mongoURI;

const connectToMongo=()=>{
    mongoose.connect(mongoURI ).then(()=>{
        console.log("Connected to database successfully")
    }).catch((err)=>{console.log('fail to connect')})
}

module.exports = connectToMongo;