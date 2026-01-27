import mongoose from "mongoose";

const requestsSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User"
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User"
    },
    status : {
        type : String,
        enum : {
            values: ['requested', 'accepted', 'rejected','blocked'],
            message: `{VALUE} is incorrect status type!`
        },
        required : true
    }
}, {timestamps:true})

requestsSchema.index({fromUserId: 1, toUserId: 1});   // indexing

export const UserRequests = mongoose.model("User Requests", requestsSchema)