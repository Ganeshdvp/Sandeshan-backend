import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { UserRequests } from '../models/requests.js';
import { User } from '../models/users.js';


export const friendsRouter = express.Router();

// all friends
friendsRouter.get('/friends', userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const friendsData = await UserRequests.find({
            $or : [
                {toUserId: loggedInUser._id, status: 'accepted'},
                {fromUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate("toUserId", ["firstName", "lastName", "age", "gender","location","ProfileImage","bgImage","about"])
        .populate("fromUserId", ["firstName", "lastName", "age", "gender","location","ProfileImage","bgImage","about"])
        
        const friends = friendsData.map(req=>{
            return req.fromUserId._id.toString() === loggedInUser._id.toString() ? req.toUserId : req.fromUserId
        })

        res.json({data: friends});
    }
    catch(err){
        res.status(400).json({message: "ERROR : " + err.message});
    }
})

// unfriend request
friendsRouter.delete('/unfriend/:id', userAuth, async (req,res)=>{
    try{
        const toUserId = req.params.id;
        const fromUserId = req.user;

        const isUserExists = await User.findById(toUserId);
        if(!isUserExists){
            throw new Error("User is not valid");
        }

        const userStatus = await UserRequests.findOneAndDelete({
            $or : [
                {fromUserId: isUserExists._id, toUserId: fromUserId._id, status: 'accepted'},
                {fromUserId: fromUserId._id, toUserId: isUserExists._id, status: 'accepted'},
            ]
        })
        if(!userStatus){
            throw new Error("Your are not friends!")
        }

        res.json({message: "successfully removed from friend lis!"})
    }
    catch(err){
        res.status(400).json({message: "ERROR : " + err.message});
    }
})
