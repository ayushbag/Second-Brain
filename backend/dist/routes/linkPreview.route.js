"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkPreview = void 0;
const express_1 = require("express");
const linkPreview_controller_1 = require("../controllers/linkPreview.controller");
exports.linkPreview = (0, express_1.Router)();
exports.linkPreview.post('/', linkPreview_controller_1.linkPreviewController);
