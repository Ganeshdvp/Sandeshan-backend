import express from 'express';
import {validateSignUpData} from '../utils/validations.js';
import bcrypt from 'bcrypt';
import { User } from "../models/users.js";
import jwt from 'jsonwebtoken';
import { userAuth } from '../middlewares/auth.js';

export const authRouter = express.Router();

// sign up user
authRouter.post("/signup", async (req, res) => {
  try {
    // validate data
    validateSignUpData(req.body);

    const {firstName, lastName, emailId, password, age, gender, location, ProfileImage, bgImage, about} = req.body
  
  // encrypt password
  const passwordHash = await bcrypt.hash(password, 10)

  // creating instance for data
  const userData = new User({
    firstName,
    lastName,
    emailId,
    age,
    gender,
    location,
    ProfileImage,
    bgImage,
    about,
    password : passwordHash
  });

  // saving data on DB
  await userData.save();
  

  // send response to back
  res.json({message: "Registration is successfully completed", data: userData});

  } catch (err) {
    res.status(400).json({message: "Failed to register : " + err.message});
  }
});


// sign in user
authRouter.post('/signin', async (req,res)=>{
   try{
    const {emailId, password} = req.body;
  
    // find user
   const isUserPresent = await User.findOne({emailId: emailId});
   if(!isUserPresent){
    throw new Error("User Not found!");
   }

   // comparing passwords and it return boolean value
   const isPasswordValid = await bcrypt.compare(password, isUserPresent.password)

   // logged User without sending password back
   const loggedUserData = await User.findOne({emailId: emailId}).select("firstName lastName emailId age gender location ProfileImage bgImage about createdAt updatedAt")

   if(isPasswordValid){
    // creating jwt token
    const token = jwt.sign({_id : isUserPresent._id},process.env.JWT_SECRET, { expiresIn: '1d' });
    // set in cookie and send response
    res.cookie("token", token)
    res.json({message: "Sign in successfully!", data: loggedUserData})
   }
   else{
    throw new Error("Invalid credentials!")
   }
   }
   catch(err){
    res.status(400).json({message: err.message});
   }
})


// sign out
authRouter.post('/signout',userAuth, async (req,res)=>{
    try{
        res.cookie('token',null, {
            expires: new Date(Date.now())
        })
        
        res.json({message: "Sign out successfully!"})
    }
    catch(err){
        res.status(400).json({message: "Failed to sign out!" + err.message});
    }
})