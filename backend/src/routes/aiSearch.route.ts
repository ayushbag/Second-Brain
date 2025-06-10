import { Router } from "express";
import { aiSearchRouteController } from "../controllers/aiSearch.controller";

export const aiSearchRouter = Router()

aiSearchRouter.post("/", aiSearchRouteController)