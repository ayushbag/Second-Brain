import { model, Schema, Types } from "mongoose";

const userSchema = new Schema({
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
})

const contentTypes = ['image', 'video', 'audio', 'article']

const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes , required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: 'Tags' }],
    userId: { type: Types.ObjectId, ref: 'User', required: true }
})

const tagsSchema = new Schema({
    title: { type: String, required: true },
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    contentId: { type: Types.ObjectId, required: true, ref: 'Content' }
})

const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User' , required: true } 
})

export const UserModel = model('User', userSchema)
export const ContentModel = model('Content', contentSchema)
export const TagsModel = model('Tags', tagsSchema)
export const LinkModel = model('Link', linkSchema)