import { Request, Response } from "express";
import { ContentModel, LinkModel, UserModel } from "../model";
import { random } from "../utils/random";

export const createSharableLink = async (req: Request, res: Response): Promise<any> => {
    const share = req.body.share;
    const firebaseUid = (req as any).uid;

    if (!firebaseUid) {
        return res.status(403).json({ message: "UserId not found in token" });
    }

    try {
        const user = await UserModel.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        const userId = user._id;

        if (share) {
            const existingLink = await LinkModel.findOne({ userId });

            if (existingLink) {
                return res.status(201).json({
                    hash: existingLink.hash
                });
            }

            const hash = random(10);

            await LinkModel.create({
                userId,
                hash
            });

            return res.status(200).json({
                message: 'Link of Brain',
                hash
            });
        } else {
            await LinkModel.deleteOne({ userId });

            return res.status(200).json({
                message: 'Removed Link'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error while handling share link',
            error
        });
    }
};

export const getContentsViaShareLink = async (req: Request, res: Response): Promise<any> => {
    const hash = req.params.shareLink;

    // Add a log to ensure hash is coming correctly
    console.log('Share link hash:', hash);

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        return res.status(411).json({
            message: 'Incorrect Input'
        });
    }

    console.log('Link found:', link);

    const content = await ContentModel.find({
        userId: link.userId
    });

    if (!content || content.length === 0) {
        return res.status(403).json({
            message: 'Content Not Found'
        });
    }

    const user = await UserModel.findOne({
        firebaseUid: link.userId // Ensure you're using `firebaseUid` here
    });

    return res.status(200).json({
        message: 'Content found!',
        user: user,
        content: content
    });
};
