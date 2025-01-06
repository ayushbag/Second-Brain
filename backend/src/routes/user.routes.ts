import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/user.controller"

export const userRouter = Router()

userRouter.post("/register", handleRegister)
userRouter.post("/login", handleLogin)