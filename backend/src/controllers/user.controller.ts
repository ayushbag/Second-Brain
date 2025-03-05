import { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../model";
import bcryptjs from "bcryptjs";
import { User } from "../types/user.types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "../utils/firebaseAdmin";
dotenv.config();

export const handleRegister = async (req: Request<{},{},{ idtoken:string,username:string }>, res: Response): Promise<any> => {
  let username: string | undefined = req.body.username;
  const idtoken = await admin.auth().verifyIdToken(req.body.idtoken)
  if (username === undefined) {
    let index = idtoken.email!.indexOf("@")
    username = idtoken.email!.substring(0, index)
  }
  const userExists = await UserModel.findOne({ firebaseUid: idtoken.uid })

  if (userExists) {
    return res.status(200).json({ message: "User already exists!" })
  } else {
    try {
        const newUser = new UserModel({
            email: idtoken.email,
            firebaseUid: idtoken.uid,
            username: username
        })

        await newUser.save().then(()=> {
            return res.status(200).json({
                message: "User Registered Successfully"
            })
        }).catch((error) => {
            return res.status(403).json({ message: "error while register" })
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Issue" })
    }
  }
}

export const handleLogin = async (req: Request<{},{},{idtoken:string}>, res: Response): Promise<any> => {
    const idtoken = await admin.auth().verifyIdToken(req.body.idtoken)
    const userExists = await UserModel.findOne({ firebaseUid: idtoken.uid, email: idtoken.email })
    if (!userExists) {
        return res.status(404).json({
            message: "User doesn't exists"
        })
    } else {
        return res.status(200).json({
            message: "Logged in"
        })
    }
}

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
