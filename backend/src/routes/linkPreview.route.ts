import { Router } from "express";
import { linkPreviewController } from "../controllers/linkPreview.controller";

export const linkPreview = Router()

linkPreview.post('/', linkPreviewController)