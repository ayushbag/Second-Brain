import dotenv from "dotenv"
dotenv.config() 
import express from "express"
import { userRouter } from "./routes/user.routes"
import { connectDB } from "./db"
import cors from "cors"
import { contentRouter } from "./routes/content.route"
import { authMiddleware } from "./middlewares/authMiddleware"
import { brainShareRouter } from "./routes/shareBrain.route"
import { tagsRouter } from "./routes/tags.routes"

const app = express()

app.use(express.json())
app.use(cors())

//connect to DB
connectDB() 

app.use("/user", userRouter);
app.use("/content", authMiddleware, contentRouter)
app.use("/brain", brainShareRouter)
app.use("/tags", authMiddleware, tagsRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Running on port ${PORT}`))