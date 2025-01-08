import { Request, Response } from "express";
import { ContentModel } from "../model";

export const createContent = async (req: Request, res:Response):Promise<any> => {
    const link = req.body.link;
    const type = req.body.type;
    const userId = req.userId

    if (!userId) {
        return res.status(403).json({
            message: "UserId not found in token"
        })
    }

    try {
        const content = await ContentModel.create({
            link,
            type,
            title: req.body.title,
            userId,
            tags: []
        })   
    
        await content.save()
        
        return res.status(200).json({
            message: "Created Content Successfully",
            content
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error while creation of content',
            error
        })
    }
}

export const getContent = async (req: Request, res: Response):Promise<any> => {
    const userId = req.userId;
    try {
        const content = await ContentModel.find({ 
            userId: userId
        }).populate('userId','email')

        console.log(content);

        if (!content || content.length === 0) {
            return res.status(403).json({
                message: 'Content not found!' 
            })
        }

        return res.status(200).json({
            message: 'Fetched Content Successfully',
            content: content
        })

    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while fetching the content.',
            error
        })
    }
}

export const deleteContent = async (req: Request, res: Response):Promise<any> => {
    const contentId = req.params.contentId
    const userId = req.userId

    try {
        const content = await ContentModel.findById(contentId)

        if (!content) {
            return res.status(403).json({
                message: "Content not exists"
            })
        }

        await ContentModel.findByIdAndDelete(contentId)

        return res.status(200).json({
            message: "Content Deleted"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error while deletion",
            error
        })
    }
}
