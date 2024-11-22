const User = require('../models_mongo/User')
const jwt=require('jsonwebtoken')
const {oauth2client} =require('../Utils/GoogleConfig')
const axios=require('axios')
const jwt_SECRET=process.env.JWT_SECRET;
const googleLogin = async(req,res)=>{
    try{
        const{code} = req.query;
        const googleResponse = await oauth2client.getToken(code);
        console.log(googleResponse)
        oauth2client.setCredentials(googleResponse.tokens);
        const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`)
        console.log(userResponse);
        const {email , name } = userResponse.data;
        console.log("its mail" ,email)
        // check user already exist?

        let user = await User.findOne({email});
        if(!user) {
            console.log("User not found");
            
            user = await User.create({name , email})
        }
        
        const data={
            user:{id:user.id}
    
          }
          
        const authToken=jwt.sign(data , jwt_SECRET)
          const success = true;

        return res.json({success ,authToken});
    }catch(err){res.send(err.message)}
}

module.exports ={ googleLogin};