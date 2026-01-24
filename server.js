import express from "express";
import connectDB from "./config/database.js";
import { User } from "./models/users.js";
import dotenv from 'dotenv';
import {validateSignUpData} from './utils/validations.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import { userAuth } from './middlewares/auth.js';

const app = express();
app.use(express.json());
dotenv.config();
app.use(cookieParser())





// sign up user
app.post("/signup", async (req, res) => {

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
  res.send("Registration is successfully completed");

  } catch (err) {
    res.status(400).send("Failed to register : " + err.message);
  }
});

// sign in user
app.post('/signin', async (req,res)=>{
   try{
    const {emailId, password} = req.body;
  
    // find user
   const isUserPresent = await User.findOne({emailId: emailId});
   if(!isUserPresent){
    throw new Error("User Not found!");
   }

   // comparing passwords and it return boolean value
   const isPasswordValid = await bcrypt.compare(password, isUserPresent.password)

   if(isPasswordValid){
    // creating jwt token
    const token = jwt.sign({_id : isUserPresent._id},process.env.JWT_SECRET, { expiresIn: '1d' });
    // set in cookie and send response
    res.cookie("token", token)
    res.send("Sign in successfully!")
   }
   else{
    throw new Error("Invalid credentials!")
   }
   }
   catch(err){
    res.status(400).send("Something went wrong : " + err.message);
   }
})

// get user
app.get("/user", async (req, res) => {
  const userCredentials = req.body.emailId;

  try {
    const user = await User.find({emailId: userCredentials})
    res.send(user);
  } catch (err) {
    res.status(400).send("Failed to Sign in :" +  err.message);
  }
});

// all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find({}); // filter
    if (allUsers.length === 0) return res.status(404).send("Users Not Found");
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Failed to load users : " + err.message);
  }
});

// delete user
app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully!");
  } catch (err) {
    res.status(400).send("Failed to delete user : " + err.message);
  }
});

// update user
app.patch("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  try {
    const ALLOWED_DATA = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "location",
      "ProfileImage",
      "bgImage",
      "about",
    ];

    const isUpdatedAllowed = Object.keys(userData).every((value) => {  // true or false
      return ALLOWED_DATA.includes(value);  
    });

    if (!isUpdatedAllowed) {
      throw new Error("update is not allowed!");
    }
    await User.findByIdAndUpdate(userId, userData, {
      runValidators: true,
    });
    res.send("updated user successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// profile
app.get('/profile', userAuth, async (req,res)=>{
  try{
    const user = req.user;
    res.send(user)
  }
  catch(err){
    res.status(400).send(err);
  }
})

// database connection
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`server running successfully ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connected failed" + err.message);
  });
