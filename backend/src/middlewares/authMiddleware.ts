import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const authMiddleware = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: 'Token not found!'
        })
    }

    jwt.verify(token as string , process.env.JWT_PASSWORD || 'string' as string, (err, decoded: any) => {
        if (err) {
            return res.status(403).json({
                message: "token Invalid"
            })
        }

        if (!decoded.userId) {
            return res.status(400).json({
                message: "Invalid token structure!"
            })
        }

        // console.log(decoded);
        req.userId = decoded.userId
        next()
    })
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzdkNjMxOTM3NGZiN2M3OTllZTVkMTEiLCJpYXQiOjE3MzYyNzA2MjgsImV4cCI6MTczNjI3NDIyOH0.1C4MIUJLBKjCUI-sgL1UTpRURzioM_K-1frl5OJ1tcQ