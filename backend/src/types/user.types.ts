import mongoose from "mongoose"

export interface User {
    _id?: mongoose.Types.ObjectId,
    username: string,
    email: string,
    password: string
}

export interface newUserResponse {
    message: string,
    user: {
        _id: mongoose.Types.ObjectId,
        email: string
    }
}