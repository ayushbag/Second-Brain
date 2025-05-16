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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.getContent = exports.createContent = exports.typeOfContent = void 0;
const model_1 = require("../model");
const typeOfContent = (link) => {
    if (link.includes("youtube") || link.includes("youtu.be")) {
        return "youtube";
    }
    else if (link.includes("x.com") || link.includes("twitter.com")) {
        return "twitter";
    }
    else {
        return "link";
    }
};
exports.typeOfContent = typeOfContent;
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title, tags } = req.body;
    const firebaseUid = req.uid;
    if (!firebaseUid) {
        return res.status(403).json({
            message: "UserId not found in token"
        });
    }
    try {
        const user = yield model_1.UserModel.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: "User not found in the database" });
        }
        const type = (0, exports.typeOfContent)(link);
        const tagArray = typeof tags === 'string' ? tags.split(",").map(tag => tag.trim()) : tags;
        const content = yield model_1.ContentModel.create({
            link,
            type,
            title,
            userId: user._id,
            tags: []
        });
        const tagDocs = yield Promise.all(tagArray.map((tagTitle) => __awaiter(void 0, void 0, void 0, function* () {
            let tag = yield model_1.TagsModel.findOne({ title: tagTitle });
            if (!tag) {
                tag = yield model_1.TagsModel.create({
                    title: tagTitle,
                    userId: user._id,
                    contentId: content._id
                });
            }
            return tag._id;
        })));
        content.tags = tagDocs;
        yield content.save().then(() => {
            return res.status(200).json({
                message: "Created Content Successfully",
                content
            });
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error while creation of content',
            error
        });
    }
});
exports.createContent = createContent;
const getContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firebaseUid = req.uid;
    try {
        const user = yield model_1.UserModel.findOne({ firebaseUid });
        if (!user) {
            return res.status(402).json({ messagee: "User not found in database" });
        }
        const content = yield model_1.ContentModel.find({
            userId: user._id
        }).populate('userId', 'email').populate({
            path: 'tags',
            select: 'title',
            transform: (doc) => doc.title
        });
        if (!content || content.length === 0) {
            return res.status(403).json({
                message: 'Content not found!',
                content: []
            });
        }
        return res.status(200).json({
            message: 'Fetched Content Successfully',
            content: content
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'An error occurred while fetching the content.',
            error
        });
    }
});
exports.getContent = getContent;
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.contentId;
    const firebaseUid = req.uid;
    try {
        const user = yield model_1.UserModel.findOne({ firebaseUid });
        if (!user) {
            return res.status(403).json({ message: "user not found in database" });
        }
        const content = yield model_1.ContentModel.findOne({ _id: contentId, userId: user._id });
        if (!content) {
            return res.status(404).json({
                message: "Content not exists"
            });
        }
        yield model_1.ContentModel.findOneAndDelete({ _id: contentId, userId: user._id });
        return res.status(200).json({
            message: "Content Deleted"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error while deletion",
            error
        });
    }
});
exports.deleteContent = deleteContent;
