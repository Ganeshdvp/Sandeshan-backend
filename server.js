import express from "express";
import connectDB from "./config/database.js";
import { User } from "./models/users.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { authRouter } from './routes/authRouter.js';
import { profileRouter } from './routes/profileRouter.js';
import { usersRouter } from './routes/usersRouter.js';
import { requestRouter } from "./routes/requestRouter.js";
import { friendsRouter } from './routes/friendsRouter.js';
import { blockRouter } from './routes/blockRouter.js';
import cors from 'cors';
import {createServer} from 'http';
import { initialSocketConnection } from './utils/socket.js';
import { chatRouter } from './routes/chatRouter.js';



const app = express();

// cors
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
// convert data to json
app.use(express.json());
// environment variables enable
dotenv.config();
// to read cookies from request
app.use(cookieParser())


// routes
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', usersRouter);
app.use('/', requestRouter);
app.use('/', friendsRouter);
app.use('/', blockRouter);
app.use('/', chatRouter)


// websocket
const httpServer = createServer(app);
initialSocketConnection(httpServer);

// database connection
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    httpServer.listen(process.env.PORT, () => {
      console.log(`server running successfully ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connected failed" + err.message);
  });
