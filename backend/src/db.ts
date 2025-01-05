import mongoose from "mongoose";

export async function connectDB() {
    try {
       await mongoose.connect(process.env.MONGO_URL as string)
        .then(() => console.log("DB Connected")) 
    } catch (error) {
        console.log("Error while connecting to DB", error)
    }
}
