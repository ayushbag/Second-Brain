"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.TagsModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
const contentTypes = ['image', 'video', 'audio', 'article'];
const contentSchema = new mongoose_1.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.Types.ObjectId, ref: 'Tags' }],
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }
});
const tagsSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    userId: { type: mongoose_1.Types.ObjectId, required: true, ref: 'User' },
    contentId: { type: mongoose_1.Types.ObjectId, required: true, ref: 'Content' }
});
const linkSchema = new mongoose_1.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true }
});
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
exports.ContentModel = (0, mongoose_1.model)('Content', contentSchema);
exports.TagsModel = (0, mongoose_1.model)('Tags', tagsSchema);
exports.LinkModel = (0, mongoose_1.model)('Link', linkSchema);
