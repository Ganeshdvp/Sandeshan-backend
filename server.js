import express from "express";
import connectDB from "./config/database.js";
import { User } from "./models/users.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { authRouter } from './routes/authRouter.js';
import { profileRouter } from './routes/profileRouter.js';


const app = express();

// convert data to json
app.use(express.json());
// environment variables enable
dotenv.config();
// to read cookies from request
app.use(cookieParser())



// routes
app.use('/', authRouter);
app.use('/', profileRouter);




// database connection
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log(`server running successfully ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connected failed" + err.message);
  });
