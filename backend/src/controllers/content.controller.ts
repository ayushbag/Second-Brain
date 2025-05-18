import { Request, Response } from "express";
import { ContentModel, TagsModel, UserModel } from "../model";

export const typeOfContent = (link: string) => {
    if (link.includes("youtube") || link.includes("youtu.be")) {
        return "youtube"
    } else if (link.includes("x.com") || link.includes("twitter.com")) {
        return "twitter"
    } else {
        return "link"
    }
}

export const createContent = async (req: Request<{},{},{link:string, title: string, tags: string}>, res:Response):Promise<any> => {
    const { link, title, tags } = req.body;
    const firebaseUid = (req as any).uid;

    if (!firebaseUid) {
        return res.status(403).json({
            message: "UserId not found in token"    
        })
    }
    try {
        const user = await UserModel.findOne({ firebaseUid })

        if (!user) {
            return res.status(404).json({ message: "User not found in the database" });
        }

        const type = typeOfContent(link);

        const tagArray = typeof tags === 'string' ? tags.split(",").map(tag => tag.trim()) : tags;

        const content = await ContentModel.create({
            link,
            type,
            title,
            userId: user._id,
            tags: []
        })   
    
        const tagDocs = await Promise.all(tagArray.map(async(tagTitle) => {
            let tag = await TagsModel.findOne({ title: tagTitle })

            if (!tag) {
                tag = await TagsModel.create({
                    title: tagTitle,
                    userId: user._id,
                    contentId: content._id
                })
            }

            return tag._id
        }))

        content.tags = tagDocs as any;

        await content.save().then(() => {
            return res.status(200).json({
                message: "Created Content Successfully",
                content
            })}
        ) 

        
    } catch (error) {
        return res.status(500).json({
            message: 'Error while creation of content',
            error
        })
    }
}

export const getContent = async (req: Request, res: Response):Promise<any> => {
    const firebaseUid = (req as any).uid;
    try {
        const user = await UserModel.findOne({ firebaseUid })

        if (!user) {
            return res.status(402).json({ messagee: "User not found in database" })
        }

        const content = await ContentModel.find({ 
            userId: user._id
        }).populate('userId','email').populate({
            path: 'tags',
            select: 'title',
            transform: (doc) => doc.title
        })

        if (!content || content.length === 0) {
            return res.status(201).json({
                message: 'Content not found!',
                content: [],
                email: user.email
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
    const firebaseUid = (req as any).uid

    try {
        const user = await UserModel.findOne({ firebaseUid })

        if (!user) {
            return res.status(403).json({ message: "user not found in database" })
        }

        const content = await ContentModel.findOne({ _id: contentId, userId: user._id })

        if (!content) {
            return res.status(404).json({
                message: "Content not exists"
            })
        }

        await ContentModel.findOneAndDelete({ _id: contentId, userId: user._id })

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
