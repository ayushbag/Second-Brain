import { Router } from "express";
import { extractMetadata } from "../controllers/aiQuery.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export const aiQueryRouter = Router()

aiQueryRouter.post("/store", authMiddleware, extractMetadata)
aiQueryRouter.post("/query", authMiddleware, )