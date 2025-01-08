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
exports.deleteContent = exports.getContent = exports.createContent = void 0;
const model_1 = require("../model");
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({
            message: "UserId not found in token"
        });
    }
    try {
        const content = yield model_1.ContentModel.create({
            link,
            type,
            title: req.body.title,
            userId,
            tags: []
        });
        yield content.save();
        return res.status(200).json({
            message: "Created Content Successfully",
            content
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
    const userId = req.userId;
    try {
        const content = yield model_1.ContentModel.find({
            userId: userId
        }).populate('userId', 'email');
        console.log(content);
        if (!content || content.length === 0) {
            return res.status(403).json({
                message: 'Content not found!'
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
    const userId = req.userId;
    try {
        const content = yield model_1.ContentModel.findById(contentId);
        if (!content) {
            return res.status(403).json({
                message: "Content not exists"
            });
        }
        yield model_1.ContentModel.findByIdAndDelete(contentId);
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
