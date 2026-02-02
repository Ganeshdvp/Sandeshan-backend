import express from 'express';
import { UserRequests } from '../models/requests.js';
import { User } from '../models/users.js';
import { userAuth } from '../middlewares/auth.js';


export const requestRouter = express.Router();


// fetching all requests
requestRouter.get('/requests', userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;

        const data = await UserRequests.find({
            toUserId : loggedInUser._id,
            status : 'requested'
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender","location","ProfileImage","bgImage","about"]);

        const exactData = data.map((row)=> row.fromUserId);

        res.json({data: exactData})
    }
    catch(err){
        res.status(400).json({message: "ERROR : " + err.message});
    }
})

// accept request
requestRouter.post('/requests/:status/:id',userAuth, async (req,res)=>{  // accepted or rejected!
    try{
        const status = req.params.status;
        const toUserId = req.params.id;
        const fromUserData = req.user

        // validate status
        const ALLOWED_STATUS = ['accepted', 'rejected'];
        if(!ALLOWED_STATUS.includes(status)){
            throw new Error(`${status} is incorrect!`)
        }

        // find user in Db
        const isToUserExists = await User.findById(toUserId);
        if(!isToUserExists){
            throw new Error("User Not Found!");
        }

        // validate id's
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

        // remove from requests
        await UserRequests.findOneAndDelete({fromUserId: toUserId})

        const requestData = new UserRequests({
            fromUserId: fromUserData._id,
            toUserId: toUserId,
            status: status
        })

        await requestData.save()

        res.json({message: `${fromUserData.firstName} is ${status} ${isToUserExists.firstName}`})
    }
    catch(err){
        res.status(400).json({message: "ERROR : " + err.message})
    }
})



// block request