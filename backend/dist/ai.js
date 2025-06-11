"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ai = void 0;
const genai_1 = require("@google/genai");
require("dotenv/config");
exports.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
