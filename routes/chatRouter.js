import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { Chat } from '../models/chat.js';
import { User } from '../models/users.js';
import { UserRequests } from '../models/requests.js';

export const chatRouter = express.Router();

chatRouter.get('/chat/:targetId', userAuth, async (req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const targetId = req.params.targetId;

        if(loggedInUserId === targetId){
            res.status(400).json({message: "You cannot send message to your self!"})
        }

        const isUserExists = await User.findById(targetId);
        if(!isUserExists){
            res.status(400).json({message: "User not found!"});
        }

        const validUser = await UserRequests.findOne({
            $or : [
                {fromUserId : loggedInUserId, toUserId : targetId, status: 'accepted'},
                {fromUserId : targetId, toUserId : loggedInUserId, status: 'accepted'},
            ]
        })
        if(!validUser){
            res.status(400).json({message: "Your are not friends!"});
        }

        let chat = await Chat.findOne({
            participants: {$all : [loggedInUserId, targetId]}
        }).populate({
            path: "messages.senderId",
            select: "ProfileImage firstName"
        })

        if(!chat){
            chat = new Chat({
                participants: [loggedInUserId, targetId],
                messages: []
            });
        }
        await chat.save();
        res.json({data: chat})
    }
    catch(err){
        res.status(400).json({message: "Something went wrong!"})
    }
})