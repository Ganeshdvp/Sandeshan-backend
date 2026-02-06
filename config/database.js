import mongoose from 'mongoose';

// database connection string
const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_STRING +'users')
}

export default connectDB;