"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = exports.handleRegister = void 0;
const zod_1 = require("zod");
const model_1 = require("../model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        email: zod_1.z.string().email("Enter a Valid Email"),
        password: zod_1.z
            .string()
            .min(8, "Password should be minimum 8 characters")
            .max(20, "Should not exceed 20 characters"),
    });
    const parseBody = requiredBody.safeParse(req.body);
    console.log(parseBody);
    if (!parseBody.success) {
        return res.status(411).json({
            message: "validation error",
            errors: parseBody.error.errors,
        });
    }
    const { email, password } = parseBody.data;
    try {
        const user = yield model_1.UserModel.findOne({ email });
        if (user !== null) {
            return res.status(403).json({
                message: "User Already Exists",
            });
        }
        const hashPassword = yield bcryptjs_1.default.hash(password, 12);
        yield model_1.UserModel.create({
            email,
            password: hashPassword,
        });
        res.status(200).json({
            message: "Registered Successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error While Register",
        });
    }
});
exports.handleRegister = handleRegister;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        email: zod_1.z.string().email("Enter a Valid Email"),
        password: zod_1.z
            .string()
            .min(8, "Password should be minimum 8 characters")
            .max(20, "Should not exceed 20 characters"),
    });
    const parseBody = requiredBody.safeParse(req.body);
    if (!parseBody.success) {
        return res.status(411).json({
            message: "validation error",
            errors: parseBody.error.errors,
        });
    }
    const { email, password } = parseBody.data;
    try {
        const user = yield model_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "User not Exists- Signup first",
            });
        }
        const hashedPassword = user.password;
        const comparePassword = yield bcryptjs_1.default.compare(password, hashedPassword);
        if (comparePassword) {
            try {
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_PASSWORD, { expiresIn: '1hr' });
                return res.status(200).json({
                    message: "Login Success",
                    token: token,
                });
            }
            catch (error) {
                return res.status(411).json({
                    message: "error while signin",
                    error
                });
            }
        }
        else {
            return res.status(500).json({
                message: "Incorrect Password!"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error,
        });
    }
});
exports.handleLogin = handleLogin;
