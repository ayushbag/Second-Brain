"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const model_1 = require("../model");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/register", (req, res) => {
    const { email, password } = req.body;
    const userExits = model_1.UserModel.create({
        email
    });
});
