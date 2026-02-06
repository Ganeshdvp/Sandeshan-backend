import jwt from "jsonwebtoken";
import { User } from "../models/users.js";


export const userAuth = async (req,res,next)=>{
 try{
   // read token
    const {token} = req.cookies

    if(!token){
      res.status(401).json({message: "Your are not authorized!"})
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