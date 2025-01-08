import { Router } from "express";
import { createSharableLink, getContentsViaShareLink } from "../controllers/share.controller";

export const brainShareRouter = Router()

brainShareRouter.post('/share', createSharableLink)
brainShareRouter.get('/:shareLink', getContentsViaShareLink)