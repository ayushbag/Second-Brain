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
const model_1 = require("../model");
const dotenv_1 = __importDefault(require("dotenv"));
const firebaseAdmin_1 = __importDefault(require("../utils/firebaseAdmin"));
dotenv_1.default.config();
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.body.username;
    const idtoken = yield firebaseAdmin_1.default.auth().verifyIdToken(req.body.idtoken);
    if (username === undefined) {
        let index = idtoken.email.indexOf("@");
        username = idtoken.email.substring(0, index);
    }
    const userExists = yield model_1.UserModel.findOne({ firebaseUid: idtoken.uid });
    if (userExists) {
        return res.status(200).json({ message: "User already exists!" });
    }
    else {
        try {
            const newUser = new model_1.UserModel({
                email: idtoken.email,
                firebaseUid: idtoken.uid,
                username: username
            });
            yield newUser.save().then(() => {
                const email = newUser.email.substring(0, newUser.email.indexOf("@"));
                return res.status(200).json({
                    message: "User Registered Successfully",
                    user: email
                });
            }).catch((error) => {
                return res.status(403).json({ message: "error while register" });
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Internal Server Issue" });
        }
    }
});
exports.handleRegister = handleRegister;
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idtoken = yield firebaseAdmin_1.default.auth().verifyIdToken(req.body.idtoken);
    const userExists = yield model_1.UserModel.findOne({ firebaseUid: idtoken.uid, email: idtoken.email });
    if (!userExists) {
        return res.status(404).json({
            message: "User doesn't exists"
        });
    }
    else {
        const email = userExists.email.substring(0, userExists.email.indexOf("@"));
        return res.status(200).json({
            message: "Logged in",
            user: email
        });
    }
});
exports.handleLogin = handleLogin;
// export const handleRegister = async (
//   req: Request<{}, {}, User>,
//   res: Response
// ): Promise<any> => {
//   const requiredBody = z.object({
//     username: z.string().min(6, "Username should be minimum 6 characters") ,
//     email: z.string().email("Enter a Valid Email"),
//     password: z
//       .string()
//       .min(8, "Password should be minimum 8 characters")
//       .max(20, "Should not exceed 20 characters"),
//   });
//   const parseBody = requiredBody.safeParse(req.body);
//   console.log(parseBody);
//   if (!parseBody.success) {
//     return res.status(411).json({
//       message: "validation error",
//       errors: parseBody.error.errors,
//     });
//   }
//   const { username, email, password } = parseBody.data;
//   try {
//     const user = await UserModel.findOne({ email });
//     if (user !== null) {
//       return res.status(403).json({
//         message: "User Already Exists",
//       });
//     }
//     const hashPassword = await bcryptjs.hash(password, 12);
//     await UserModel.create({
//       username,
//       email,
//       password: hashPassword,
//     });
//     res.status(200).json({
//       message: "Registered Successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error While Register",
//     });
//   }
// };
// export const handleLogin = async (
//   req: Request<{}, {}, User>,
//   res: Response
// ): Promise<any> => {
//   const requiredBody = z.object({
//     username: z.string().min(6, "Username should be minimum 6 characters"),
//     email: z.string().email("Enter a Valid Email"),
//     password: z
//       .string()
//       .min(8, "Password should be minimum 8 characters")
//       .max(20, "Should not exceed 20 characters"),
//   });
//   const parseBody = requiredBody.safeParse(req.body);
//   if (!parseBody.success) {
//     return res.status(411).json({
//       message: "validation error",
//       errors: parseBody.error.errors,
//     });
//   }
//   const { username, password } = parseBody.data;
//   try {
//     const user = await UserModel.findOne({ username });
//     if (!user) {
//       return res.status(403).json({
//         message: "User not Exists- Signup first",
//       });
//     }
//     const hashedPassword = user.password;
//     const comparePassword = await bcryptjs.compare(password, hashedPassword);
//     if (comparePassword) {
//       try {
//         const token = jwt.sign(
//           {userId: user._id},
//           process.env.JWT_PASSWORD as string,
//           { expiresIn: '1hr' }
//         );
//         return res.status(200).json({
//           message: "Login Success",
//           token: token,
//         });
//       } catch (error: any) {
//         return res.status(411).json({
//             message: "error while signin",
//             error
//         })
//       }
//     } else {
//         return res.status(500).json({
//             message: "Incorrect Password!"
//         })
//     }
//   } catch (error: any) {
//     res.status(500).json({
//       message: "Internal Server Error",
//       error,
//     });
//   }
// };
