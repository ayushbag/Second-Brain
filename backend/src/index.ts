import dotenv from "dotenv"
dotenv.config() 
import express from "express"
import { userRouter } from "./router/userRouter"
import { connectDB } from "./db"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

//connect to DB
connectDB() 

app.use("/user", userRouter);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Running on port ${PORT}`))