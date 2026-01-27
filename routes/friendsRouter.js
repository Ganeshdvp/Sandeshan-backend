import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { UserRequests } from '../models/requests.js';


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
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender","location","ProfileImage","bgImage","about"])

        res.send(friendsData);
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})