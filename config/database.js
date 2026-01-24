import mongoose from 'mongoose';


const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_STRING +'users')
}

export default connectDB;