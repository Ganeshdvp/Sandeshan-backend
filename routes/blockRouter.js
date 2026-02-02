import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import { User } from '../models/users.js';
import { UserRequests } from '../models/requests.js';


export const blockRouter = express.Router();

// all block users
blockRouter.get('/blocked-users', userAuth, async (req,res)=>{
    try{
        const loggInUser = req.user;

        const blockUsers = await UserRequests.find({
            fromUserId: loggInUser._id,
            status: 'blocked'
        }).populate("toUserId", "firstName lastName age gender location ProfileImage bgImage about")

        const filterData = blockUsers.map(user=>{
            return user.fromUserId.toString() === loggInUser._id.toString() ? user.toUserId : user.fromUserId
        })

        res.json({data : filterData});
    }
    catch(err){
        res.status(400).json({message: "ERROR : " + err.message})
    }
})

// block request
blockRouter.post('/blocked/:id', userAuth, async (req,res)=>{
    try{
        const toUserId = req.params.id;
        const fromUserData = req.user;

        if(toUserId == fromUserData._id){
            throw new Error("You cannot block yourself!");
        }

        const isUserExists = await User.findById(toUserId);
        if(!isUserExists){
            throw new Error("User is not valid!")
        }

        const isAlreadyBlocked = await UserRequests.findOne({
            $or : [
                {fromUserId: fromUserData._id, toUserId: isUserExists._id, status: 'blocked'},
                {fromUserId: isUserExists._id, toUserId: fromUserData._id, status: 'blocked'},
            ]
        })
 
        if(isAlreadyBlocked){
            throw new Error(`You already blocked`)
        }

        await UserRequests.findOneAndDelete({
            $or : [
                {fromUserId: isUserExists._id, toUserId: fromUserData._id},
                {fromUserId: fromUserData._id, toUserId: isUserExists._id},
            ]
        })

        const blockedData = new UserRequests({
            fromUserId: fromUserData._id,
            toUserId: toUserId,
            status: 'blocked'
        })

        await blockedData.save()

        res.json({message: `Successfully You Blocked the user!`})
    }
    catch(err){
        res.status(400).json({message: "ERROR : " + err.message})
    }
})

// unblock user
blockRouter.delete('/unblock/:id', userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const toUserId = req.params.id;

        const isUserExists = await User.findById(toUserId);
        if(!isUserExists){
            res.status(400).json({message: 'User not found!'})
        }

        if(loggedInUser._id == toUserId){
            res.status(400).json({message: 'You cannot unblock your self!'})
        }

        const isAlreadyBlocked = await UserRequests.findOneAndDelete({
            $or : [
                {fromUserId : loggedInUser._id, toUserId: toUserId, status: 'blocked'},
                {fromUserId: toUserId, toUserId: loggedInUser._id, status: 'blocked'}
            ]
        })
        if(!isAlreadyBlocked){
            res.status(400).json({message: "User is not valid!"})
        }

        res.json({message: "You unblocked the user successfully!"})

    }
    catch(err){
        res.status(400).json({message: err.message})
    }
})