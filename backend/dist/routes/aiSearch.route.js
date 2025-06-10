"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSearchRouter = void 0;
const express_1 = require("express");
const aiSearch_controller_1 = require("../controllers/aiSearch.controller");
exports.aiSearchRouter = (0, express_1.Router)();
exports.aiSearchRouter.post("/", aiSearch_controller_1.aiSearchRouteController);
