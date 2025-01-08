"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brainShareRouter = void 0;
const express_1 = require("express");
const share_controller_1 = require("../controllers/share.controller");
exports.brainShareRouter = (0, express_1.Router)();
exports.brainShareRouter.post('/share', share_controller_1.createSharableLink);
exports.brainShareRouter.get('/:shareLink', share_controller_1.getContentsViaShareLink);
