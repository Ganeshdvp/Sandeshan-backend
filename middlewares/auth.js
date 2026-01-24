import jwt from "jsonwebtoken";
import { User } from "../models/users.js";


export const userAuth = async (req,res,next)=>{
 try{
       // read token
    const {token} = req.cookies

    if(!token){
      throw new Error("Token not found!")
    }

    // validate token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
    const {_id} = decoded;

    // find user
    const user = await User.findById(_id);

    if(!user){
        throw new Error("User not Exists!")
    }
    req.user = user;
    next();  // it will call handlers
 }
 catch(err){
    res.status(400).send("ERROR : " + err.message)
 }
}