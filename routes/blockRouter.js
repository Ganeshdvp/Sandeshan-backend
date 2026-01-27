import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { User } from '../models/users.js';
import { UserRequests } from '../models/requests.js';


export const blockRouter = express.Router();


// block request
// blockRouter.patch('/blocked/:id', userAuth, async (req,res)=>{
//     try{
//         const toUserId = req.params.id;
//         const fromUserData = req.user;

//         if(toUserId == fromUserData._id){
//             throw new Error("You cannot block yourself!");
//         }

//         const isUserExists = await User.findById(toUserId);
//         if(!isUserExists){
//             throw new Error("User is not valid!")
//         }

//         const isAlreadyBlocked = await UserRequests.findOne({
//             $or : [
//                 {fromUserId: fromUserData._id, toUserId: isUserExists._id, status: 'blocked'},
//                 {fromUserId: isUserExists._id, toUserId: fromUserData._id, status: 'blocked'},
//             ]
//         })
//         if(isAlreadyBlocked){
//             throw new Error(`You already blocked ${isAlreadyBlocked.firstName}`)
//         }

//         res.json({message: `Successfully You Blocked the user!`})
//     }
//     catch(err){
//         res.status(400).json({message: "ERROR : " + err.message})
//     }
// })