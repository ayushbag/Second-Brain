import { Router } from "express";
import { getContent, createContent, deleteContent } from "../controllers/content.controller"; 

export const contentRouter = Router();

contentRouter.get('/', getContent)
contentRouter.post('/', createContent)
contentRouter.delete('/:contentId', deleteContent)