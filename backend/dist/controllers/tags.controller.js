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
exports.getTags = exports.createTag = void 0;
const model_1 = require("../model");
const createTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const contentId = req.body.contentId;
    const userId = req.userId;
    try {
        const tag = yield model_1.TagsModel.create({
            title,
            userId,
            contentId
        });
        const content = yield model_1.ContentModel.findById(contentId);
        if (!content) {
            return res.status(404).json({
                message: 'Content not found'
            });
        }
        content.tags.push(tag._id);
        yield content.save();
        return res.status(200).json({
            message: 'Created Tags Successfully',
            tag,
            content
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error while creating Tags',
            error
        });
    }
});
exports.createTag = createTag;
const getTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params;
    try {
        const content = yield model_1.ContentModel.find({
            _id: contentId,
            userId: req.userId
        }).populate('tags');
        if (!content) {
            return res.status(404).json({
                message: 'Content not found or not authorized'
            });
        }
        return res.status(200).json({
            message: 'Tags found!',
            tagsAndContent: content
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Error while getting tags',
            error
        });
    }
});
exports.getTags = getTags;
