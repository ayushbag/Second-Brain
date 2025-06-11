"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiQueryRouter = void 0;
const express_1 = require("express");
const aiQuery_controller_1 = require("../controllers/aiQuery.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.aiQueryRouter = (0, express_1.Router)();
exports.aiQueryRouter.post("/store", authMiddleware_1.authMiddleware, aiQuery_controller_1.extractMetadata);
exports.aiQueryRouter.post("/query", authMiddleware_1.authMiddleware);
