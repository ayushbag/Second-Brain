import { Router } from "express";
import { createTag, getTags } from "../controllers/tags.controller";

export const tagsRouter = Router()

tagsRouter.post("/", createTag)
tagsRouter.get("/", getTags)