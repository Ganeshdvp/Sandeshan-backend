import mongoose from "mongoose";

// only messages
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String,
        required: true
    }
}, { timestamps: true });

// entire user messages
const chatSchema = new mongoose.Schema({
    participants: [
        {type: mongoose.Schema.Types.ObjectId, ref: "User", required : true},
    ],
    messages: [messageSchema]
})

export const Chat = mongoose.model("Chat", chatSchema)