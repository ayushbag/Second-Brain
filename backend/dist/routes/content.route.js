"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentRouter = void 0;
const express_1 = require("express");
const content_controller_1 = require("../controllers/content.controller");
exports.contentRouter = (0, express_1.Router)();
exports.contentRouter.get('/', content_controller_1.getContent);
exports.contentRouter.post('/', content_controller_1.createContent);
exports.contentRouter.delete('/:contentId', content_controller_1.deleteContent);
