"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
(0, dotenv_1.config)();
const serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PROJECT_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URL,
    "token_uri": process.env.FIREBASE_TOKEN_URL,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
};
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error("Missing service config");
}
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
exports.default = firebase_admin_1.default;
