import { Request, Response } from "express";
import { ContentModel, LinkModel } from "../model";
import { random } from "../utils/random";

export const createSharableLink = async (req: Request, res: Response):Promise<any> => {
    const share = req.body.share;
    const userId = req.userId
    if (share) {
        const existingLink = await LinkModel.findOne({ 
            userId: userId 
        })

        if (existingLink) {
            return res.status(201).json({
                hash: existingLink.hash
            })
        }

        const hash = random(10);

        await LinkModel.create({
            userId,
            hash: hash
        })

        return res.status(200).json({
            message: 'Link of Brain',
            hash
        })
    } else {
        await LinkModel.deleteOne({
            userId
        })

        return res.status(500).json({
            message: 'Removed Link'
        })
    }
}

export const getContentsViaShareLink = async (req: Request, res: Response):Promise<any> => {
    const hash = req.params.shareLink;
    
    const link = await LinkModel.findOne({ 
        hash
    })

    if (!link) {
        return res.status(411).json({
            message: 'Incorrect Input'
        })
    }

    const content = await ContentModel.find({
        userId: link.userId
    })

    console.log(content)

    if (!content) {
        return res.status(403).json({
            message: 'Content Not Found'
        })
    }

    return res.status(200).json({
        message: 'Content found!',
        content: content
    })
}   