import { NextFunction, Request, Response } from "express";
import admin from "../utils/firebaseAdmin";

export interface AuthenticatedRequest extends Request {
    uid?: string;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<any> => {
    const token = req.headers.authorization || req.headers.Authorization
    console.log(token)
    if (typeof token !== "string" || !token?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "token not found"
        })
    } else {
        try {
            const authToken = token.split(" ")[1]
            let checkedRevoked = true
            await admin.auth().verifyIdToken(authToken, checkedRevoked)
                .then((payload) => {
                    req.uid = payload.uid
                    next()
                })
                .catch((error) => {
                    console.log(error)
                    return res.status(402).json({
                        message: "Unauthorized"
                    })
                })        
        } catch (error) {
            return res.status(500).json({
                message: "Unauthorized"
            })
        }
    }
}