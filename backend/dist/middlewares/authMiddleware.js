"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebaseAdmin_1 = __importDefault(require("../utils/firebaseAdmin"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization || req.headers.Authorization;
    if (typeof token !== "string" || !(token === null || token === void 0 ? void 0 : token.startsWith("Bearer "))) {
        return res.status(401).json({
            message: "token not found"
        });
    }
    else {
        try {
            const authToken = token.split(" ")[1];
            let checkedRevoked = true;
            yield firebaseAdmin_1.default.auth().verifyIdToken(authToken, checkedRevoked)
                .then((payload) => {
                req.uid = payload.uid;
                next();
            })
                .catch((error) => {
                console.log(error);
                return res.status(402).json({
                    message: "Unauthorized"
                });
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Unauthorized"
            });
        }
    }
});
exports.authMiddleware = authMiddleware;
