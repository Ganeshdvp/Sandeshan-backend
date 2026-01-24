# Sandeshan Backend

# Task-1
- npm init
- npm install express nodemon
- create server.js file,  create server and listen
- install mongoose database :- npm i mongoose
- created config folder
    - created database.js file

        - import mongoose from 'mongoose';

        const connectDB = async ()=>{
               await mongoose.connect('mongodb+srv://sandeshan_username:COtg7RpZEgkqLHeU@sandeshan.7nbsxl8.mongodb.net/users')
        }

        export default connectDB;

- created models folder
    - created users.js file and create schema and model!

- in server.js
     - connect to DB like,
    
     connectDB().then(() => {
            console.log("Database connected successfully");
            app.listen(PORT, () => {
            console.log(`server running successfully ${PORT}`);
            });
        })
        .catch((err) => {
            console.log("Database connected failed", err);
        });

- add middle app.use(express.json());
- run the server "nodemon server.js"

# Task-2
- create the .env file and store sensitive data
- Now, create the API's logic
    - GET /users
    - POST /signup
    - GET /user
    - DELETE /users/:id
    - PATCH /users/:id

- install the validator.js and validate email,photoURL and password...etc in db level but if u want u can go api level also!
    - npm i validator
    - validate : {
            validator: (value)=>{
                if(!validator.isEmail(value)){
                    throw new Error("invalid email format!")
                }
            }
        }

- # Task-3
- create a utils folder
   - create validations.js file to validate api level because dont NEVER trust the req.body
      - import validator from 'validator';

      export const validateSignUpData = (req)=>{
        const {firstName, lastName, emailId, password, age, gender, location, ProfileImage, bgImage, about} = req;

        if(!firstName || !lastName){
             throw new Error("Name is not valid!")
        }
         else if(firstName < 4 || firstName > 50){
            throw new Error("Characters must be in 4-50")
        }
        else if(lastName < 4 || lastName > 50){
            throw new Error("Characters must be in 4-50")
        }
        else if(!validator.isEmail(emailId)){
            throw new Error("Email is not valid format!")
        }
        else if(!validator.isStrongPassword(password)){
            throw new Error("Enter a strong password!")
        }
        else if(age<18 || age>80){
            throw new Error("Age must be in 18-80!")
        }
        else if(!['male','female','others'].includes(gender)){
            throw new Error("Gender is not valid!")
        }
    }
- In server.js file
    - /signup 
       - validateSignUpData(req.body);

- Install Bcrypt to hash the password
    - npm i bcrypt
- convert ur password to hash and store it on db
    - const passwordHash = await bcrypt.hash(password, 10)

- Create POST /signin API

# Task-4
- Install JWT 
     - npm i jsonwebtoken
- Create JWT token when user login-- /signin
      - import jwt from 'jsonwebtoken';
       // created token
        const token = jwt.sign({_id : isUserPresent._id},'<secret_code>');
        // store token to cookie
        res.cookie("token", token)
- Install Cookie-parser to read cookies from requests
   - npm i cookie-parser
   - import cookieParser from "cookie-parser";

    app.use(cookieParser())

- read the cookie /profile
    - const cookie = req.cookies;
      const {token} = cookie;

      if(!token){
        throw new Error("Token not found!")
      }
- validate that cookie
   - const decoded = await jwt.verify(token, '<secret_code>');
   // it gives ID because we create token by using ID so.
     const {_id} = decoded;

    // find user by using that ID

# Task-5
- created middleware folder
  - created auth.js file
     - import jwt from "jsonwebtoken";
     - import { User } from "../models/users.js";

        export const userAuth = async (req,res,next)=>{
            try{
                // read token
                const {token} = req.cookies

                if(!token){
                    throw new Error("Token not found!")
                }

                // validate token
                const decoded = await jwt.verify(token, "GANesh@515")
                const {_id} = decoded;

                // find user
                const user = await User.findById(_id);

                if(!user){
                    throw new Error("User not Exists!")
                }
                req.user = user;
                next();  // it will call handlers
            }
            catch(err){
                res.status(400).send("ERROR : " + err.message)
            }
        }
    - Remove the code in /profile
- use this auth to the requests.
- added the expiration of token
  - { expiresIn: '1d' }