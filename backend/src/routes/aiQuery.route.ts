import { Router } from "express";
import { aiQueryController } from "../controllers/aiQuery.controller";

export const aiQueryRouter = Router()

aiQueryRouter.post("/", aiQueryController)