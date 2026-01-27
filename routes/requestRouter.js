import express from 'express';
import { UserRequests } from '../models/requests.js';
import { User } from '../models/users.js';
import { userAuth } from '../middlewares/auth.js';


export const requestRouter = express.Router();


// fetching all requests
requestRouter.get('/requests',userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const data = await UserRequests.find({
            toUserId : loggedInUser._id,
            status : 'requested'
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender","location","ProfileImage","bgImage","about"])

        res.send(data)
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

// accept request
requestRouter.post('/requests/:status/:id',userAuth, async (req,res)=>{  // accepted or rejected!
    try{
        const status = req.params.status;
        const toUserId = req.params.id;
        const fromUserData = req.user

        // validate
        const ALLOWED_STATUS = ['accepted', 'rejected'];
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error(`${status} is incorrect!`)
        }

        const isToUserExists = await User.findById(toUserId);
        if(!isToUserExists){
            throw new Error("User Not Found!");
        }

        if(toUserId == fromUserData._id){
            throw new Error(`Cannot ${status} your self!`)
        }

        const request = await UserRequests.findOne({
            $or : [
                { fromUserId: fromUserData._id, toUserId: isToUserExists._id, status: 'requested'},
                { fromUserId: isToUserExists._id, toUserId: fromUserData._id, status: 'requested'},
            ]
        })
        if(!request){
            throw new Error(`Request is invalid!`)
        }

        const isRequestExists = await UserRequests.findOne({
            $or : [
                { fromUserId: fromUserData._id, toUserId: isToUserExists._id, status: 'accepted'},
                { fromUserId: isToUserExists._id, toUserId: fromUserData._id, status: 'accepted'},
                { fromUserId: fromUserData._id, toUserId: isToUserExists._id, status: 'rejected'},
                { fromUserId: isToUserExists._id, toUserId: fromUserData._id, status: 'rejected'},
            ]
        })
        if(isRequestExists){
            throw new Error(`${fromUserData.firstName} is already ${isRequestExists.status} ${isToUserExists.firstName}`)
        }

        const requestData = new UserRequests({
            fromUserId: fromUserData._id,
            toUserId: toUserId,
            status: status
        })

        await requestData.save()

        res.send(`${fromUserData.firstName} is ${status} ${isToUserExists.firstName}`)
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    }
})



// block request