import { Router } from "express";
import { UserModel } from "../model";

export const userRouter = Router()

userRouter.post("/register", (req, res) => {
    const { email, password } = req.body

    const userExits = UserModel.create({
        email,
        password
    })
})