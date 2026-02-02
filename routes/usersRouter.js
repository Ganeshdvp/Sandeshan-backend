import express from 'express';
import { User } from '../models/users.js';
import { userAuth } from '../middlewares/auth.js';
import { UserRequests } from '../models/requests.js';

export const usersRouter = express.Router();


// fetching all users
usersRouter.get('/users', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        // find requests in DB
        const findRequests = await UserRequests.find({   //array
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        findRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString())
        })

        const filterUsers = await User.find({
            $and: [{ _id: { $ne: loggedInUser._id } }, { _id: { $nin: Array.from(hideUserFromFeed) } }]
        })


        // send response back
        res.json({ data: filterUsers })
    }
    catch (err) {
        res.status(400).json({ message: "Failed to fetch users! " + err.message });
    }
})

// sending requested/accepted/rejected to user
usersRouter.post('/user/requested/:id', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.id;
        const status = 'requested';

        // Find to user exists in DB
        const isToUserExists = await User.findOne({ _id: toUserId })
        if (!isToUserExists) {
            throw new Error("User Not Found!")
        }

        // validate user
        if (fromUserId == toUserId) {
            throw new Error("Cannot send connection request to yourself!")
        }

        // Find Users Request exists or not in DB
        const isUserExits = await UserRequests.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });
        if (isUserExits) {
            throw new Error("Request already exists!")
        }

        // Find toUserData
        const toUserData = await User.findById(toUserId);

        // Send response back
        const requestData = new UserRequests({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        })

        await requestData.save();

        // send response back
        res.json({ message: `${req.user.firstName} is ${status} to ${toUserData.firstName}` })
    }
    catch (err) {
        res.status(400).json({ message: "ERROR : " + err.message })
    }
})
