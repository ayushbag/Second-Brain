import { Request, Response } from "express";
import { ContentModel, TagsModel } from "../model";

export const createTag = async(req:Request, res:Response):Promise<any> => {
    const title = req.body.title;
    const contentId = req.body.contentId
    const userId = req.userId

    try {
        const tag = await TagsModel.create({
            title,
            userId,
            contentId
        })

        const content = await ContentModel.findById(contentId)

        if (!content) {
            return res.status(404).json({
                message: 'Content not found'
            })
        }

        content.tags.push(tag._id);
        await content.save()

        return res.status(200).json({
            message: 'Created Tags Successfully',
            tag,
            content
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error while creating Tags',
            error
        })
    }
}

export const getTags = async (req:Request, res:Response):Promise<any> => {
    const contentId = req.params

    try {
        const content = await ContentModel.find({
            _id: contentId,
            userId: req.userId
        }).populate('tags')

        if (!content) {
            return res.status(404).json({
                message: 'Content not found or not authorized'
            })
        }

        return res.status(200).json({
            message: 'Tags found!',
            tagsAndContent: content
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error while getting tags',
            error
        })
    }
}