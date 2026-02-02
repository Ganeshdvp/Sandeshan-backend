import mongoose from "mongoose";
import validator from 'validator';

const usersSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require:true,
        minLength: 4,
        maxLength: 50
    },
    lastName:{
        type: String,
        require:true,
        minLength: 4,
        maxLength: 50
    },
    emailId:{
        type: String,
        require:true,
        unique:true,
        lowercase: true,
        trim : true,
        validate : {
            validator: (value)=>{
                if(!validator.isEmail(value)){
                    throw new Error("invalid email format!")
                }
            }
        }
    },
    password:{
        type: String,
        require:true,
        validate: {
            validator: (value)=>{
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a strong password dear!")
                }
            }
        }
    },
    age:{
        type: Number,
        require:true,
        min: 18,
        max:80
    },
    gender:{
        type: String,
        require:true,
        validate : {
            validator: (value)=>{
                if(!['male','female','others'].includes(value)){
                    throw new Error ("failed to add the gender!")
                }
            }
        }
    },
    location:{
        type: String,
        require:true,
        default: "India"
    },
    ProfileImage:{
        type: String,
        require:true,
        default: "https://img.freepik.com/premium-vector/user-profile-icon-circle_1256048-12499.jpg?semt=ais_hybrid&w=740&q=80",
        validate: {
            validator: (value)=>{
                if(!validator.isURL(value)){
                    throw new Error("Profile URL is not correctly!")
                }
            }
        }
    },
    bgImage:{
        type: String,
        require:true,
        default: "https://www.creativefabrica.com/wp-content/uploads/2019/02/User-icon-EPS10-by-Kanggraphic.jpg",
        validate: {
            validator: (value)=>{
                if(!validator.isURL(value)){
                    throw new Error("Background URL is not correctly!")
                }
            }
        }
    },
    about:{
        type: String,
        require:true,
        default: "Hey there! Welcome to the Profile!"
    }
}, {timestamps: true})

export const User = mongoose.model("User", usersSchema);