"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiSearchRouteController = void 0;
const cheerio = __importStar(require("cheerio"));
const genai_1 = require("@google/genai");
require("dotenv/config");
const mongodb_1 = require("mongodb");
const aiSearchRouteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    try {
        const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const dbClient = new mongodb_1.MongoClient(process.env.MONGO_URI);
        yield dbClient.connect().then(() => console.log("DB CONNECTED🔗✅"));
        yield ingest({ url: 'http://localhost:5173/app', ai, dbClient }).then(() => {
            const response = chat({ question: query, ai, dbClient });
            res.status(200).json({
                message: `Success`,
                response
            });
        });
    }
    catch (error) {
        res.status(403).json({
            message: `Error`,
            error
        });
    }
});
exports.aiSearchRouteController = aiSearchRouteController;
const scrapeWebPage = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (url = '') {
    const { data } = yield axios.get(url);
    const $ = cheerio.load(data);
    const body = $('body').html();
    return {
        body: body
    };
});
const generateVectorEmbeddings = (_a) => __awaiter(void 0, [_a], void 0, function* ({ text, ai }) {
    const response = yield ai.models.embedContent({
        model: "text-embedding-004",
        contents: text
    });
    return response.embeddings && response.embeddings[0].values;
});
const StoreToDB = (_a) => __awaiter(void 0, [_a], void 0, function* ({ embedding, body, dbClient }) {
    try {
        const collection = dbClient.db('SecondBrain').collection('WEB_COLLECTION');
        yield collection.insertOne({
            embeddings: embedding,
            metadata: [{ body }]
        });
    }
    catch (error) {
        console.log(error);
    }
});
const ingest = (_a) => __awaiter(void 0, [_a], void 0, function* ({ url = 'localhost:5173/app', ai, dbClient }) {
    try {
        const { body } = yield scrapeWebPage(url);
        const bodyChunks = chunkText(body !== null && body !== void 0 ? body : "", 2000);
        for (const chunk of bodyChunks) {
            const bodyEmbeddings = yield generateVectorEmbeddings({ text: chunk, ai });
            yield StoreToDB({ embedding: bodyEmbeddings, body: chunk, dbClient });
        }
        console.log(`INGESTING SUCCESS! ✅`);
    }
    catch (error) {
        console.log(`INGESTING ERROR! ☹`);
    }
});
const chat = (_a) => __awaiter(void 0, [_a], void 0, function* ({ question = '', ai, dbClient }) {
    var _b, _c, _d, _e, _f;
    const questionEmbedding = yield generateVectorEmbeddings({ text: question, ai });
    const collection = dbClient.db('SecondBrain').collection('WEB_COLLECTION');
    const result = yield collection.aggregate([
        {
            $vectorSearch: {
                index: "SecondBrain",
                path: "embeddings",
                queryVector: questionEmbedding,
                numCandidates: 100,
                limit: 3
            }
        }
    ]).toArray();
    const body = result.map(doc => { var _a; return (_a = doc.metadata) === null || _a === void 0 ? void 0 : _a.map((e) => e.body); });
    const chat = yield ai.chats.create({
        model: "gemini-1.5-flash",
        history: [
            {
                role: "model",
                parts: [
                    { text: "You're an AI support agent expert in providing supprt to users on behalf of a webpage. Given the context about page content, reply the user accordingly." }
                ]
            },
            {
                role: "user",
                parts: [
                    {
                        text: 'Im giving you context!'
                    }
                ]
            }
        ]
    });
    const response = yield chat.sendMessage({
        message: `
                Query: ${question}\n\n
                Retrived Context: ${body}\n\n
                Retrived Context: Give each div id from body to get content id
            `
    });
    const LLMResponse = {
        message: `🤖: ${(_f = (_e = (_d = (_c = (_b = response === null || response === void 0 ? void 0 : response.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text}`
    };
    return LLMResponse;
});
function chunkText(text, chunkSize) {
    if (!text || chunkSize <= 0)
        return [];
    const words = text.split(/\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
    }
    return chunks;
}
