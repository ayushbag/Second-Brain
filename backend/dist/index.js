"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./routes/user.routes");
const db_1 = require("./db");
const cors_1 = __importDefault(require("cors"));
const content_route_1 = require("./routes/content.route");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const shareBrain_route_1 = require("./routes/shareBrain.route");
const tags_routes_1 = require("./routes/tags.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
//connect to DB
(0, db_1.connectDB)();
app.use("/user", user_routes_1.userRouter);
app.use("/content", authMiddleware_1.authMiddleware, content_route_1.contentRouter);
app.use("/brain", shareBrain_route_1.brainShareRouter);
app.use("/tags", authMiddleware_1.authMiddleware, tags_routes_1.tagsRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
