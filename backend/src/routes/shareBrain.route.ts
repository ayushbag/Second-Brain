import { Router } from "express";
import { createSharableLink, getContentsViaShareLink } from "../controllers/share.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export const brainShareRouter = Router()

brainShareRouter.post('/share', authMiddleware, createSharableLink)
brainShareRouter.get('/:shareLink', getContentsViaShareLink)