"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsRouter = void 0;
const express_1 = require("express");
const tags_controller_1 = require("../controllers/tags.controller");
exports.tagsRouter = (0, express_1.Router)();
exports.tagsRouter.post("/", tags_controller_1.createTag);
exports.tagsRouter.get("/", tags_controller_1.getTags);
