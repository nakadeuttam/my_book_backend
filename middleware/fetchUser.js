const jwt = require('jsonwebtoken');
const jwt_SECRET='Uttamnakadeneverifykiyahai'

const fetchUserData = async (req,res,next) =>{
    const Token=req.header("auth-token");       //here we passed auth-token by thunder client via header
    if(!Token) {
        return res.status(401).send("Access denied");

    }
    
    try{
    const data= jwt.verify(Token,jwt_SECRET);        //here req is in the form of token holding UserId in it so middileware will decode it and
    req.user=data.user;                             //and send the id of user via req in next function
    next();
    }catch(error){
        res.status(401).send("Access denied");
    }
}

module.exports = fetchUserData