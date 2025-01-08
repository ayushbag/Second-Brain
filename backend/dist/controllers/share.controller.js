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
exports.getContentsViaShareLink = exports.createSharableLink = void 0;
const model_1 = require("../model");
const random_1 = require("../utils/random");
const createSharableLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    const userId = req.userId;
    if (share) {
        const existingLink = yield model_1.LinkModel.findOne({
            userId: userId
        });
        if (existingLink) {
            return res.status(201).json({
                hash: existingLink.hash
            });
        }
        const hash = (0, random_1.random)(10);
        yield model_1.LinkModel.create({
            userId,
            hash: hash
        });
        return res.status(200).json({
            message: 'Link of Brain',
            hash
        });
    }
    else {
        yield model_1.LinkModel.deleteOne({
            userId
        });
        return res.status(500).json({
            message: 'Removed Link'
        });
    }
});
exports.createSharableLink = createSharableLink;
const getContentsViaShareLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield model_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        return res.status(411).json({
            message: 'Incorrect Input'
        });
    }
    const content = yield model_1.ContentModel.find({
        userId: link.userId
    });
    console.log(content);
    if (!content) {
        return res.status(403).json({
            message: 'Content Not Found'
        });
    }
    return res.status(200).json({
        message: 'Content found!',
        content: content
    });
});
exports.getContentsViaShareLink = getContentsViaShareLink;
