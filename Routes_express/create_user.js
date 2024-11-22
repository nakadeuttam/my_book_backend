
const express=require('express');
//const { query } = require('express-validator');
const { body, validationResult } = require('express-validator');
const router=express.Router();
const bcrypt = require('bcrypt');   //used in hashing the password
const jwt = require('jsonwebtoken');
const User = require('../models_mongo/User')
const jwt_SECRET=process.env.JWT_SECRET;
const fetchUser=require('../middleware/fetchUser')

//Sign Up section
router.post('/signUp',[
    body("name","Name must be min 3 letter").isLength({min:3}),
    body("email" , "Enter valid email").isEmail(),
    body("password" , "Enter valid password").isLength({min:8})
],async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let userFound=false;

    try{
    const check_duplicate=await User.findOne({email:req.body.email})
    if(check_duplicate){
      userFound=true;
      return res.status(200).json({userFound ,error :'The user is found with this email..... "Login Or Use different email'})
    }

      //hashing the password using bcrypt npm package

      const saltRounds = 10;
      const secured_password =await bcrypt.hash(req.body.password,saltRounds);

    const user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secured_password,
      })
      const peyload_data = {
       user:{id:user.id}
      }
      console.log(peyload_data)
      const token =jwt.sign(peyload_data,jwt_SECRET)
      res.json(token)
    }catch (error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
      }
});


//create login endPoint
router.post('/login',[
  body("email" , "Enter valid email").isEmail(),
    body("password" , "Enter can not blank").exists(),
],
async (req,res)=>{
  const errors = validationResult(req);
  let success = false;
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }
 
  const {email, password} =req.body;
  let user=await User.findOne({email})
   try{
  if(!user)     //User is not presnt
  {
    success=false;
    return res.status(400).json({success , error : "User not found please sign up first"});
  }
  else{
    const passCompare = await bcrypt.compare(password,user.password);
    if(!passCompare)
    {
      success=false;
     return res.status(400).json({success , error : "password is incorrect"});
    }
    else{
      const data={
        user:{id:user.id}

      }
      const authToken=jwt.sign(data,jwt_SECRET);
      success=true;
      res.json({success , authToken});
    }
  }
}catch(error){
  console.error(error.message);
  res.status(500).send("Internal server error");
}
  
});

//End point to fetch User details
router.post('/getUserData',fetchUser,async (req, res)=>{        //fetchUser is the middleware to decode the jwt token
const user_id=req.user.id;
try{
  const UserData=await User.findById(user_id).select('-password');  //fetching UserData except password
  res.send(UserData);
}catch(error){
  console.error(error.message);
  res.status(500).send("Internal server error");
}
})


module.exports = router;