"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
// Routes
app.get("/", (request, response) => {
    response.json({
        message: "Welcome...",
    });
});
// Auth Routes
app.use("/api/auth", require("./routes/auth"));
// User Routes
app.use("/api/user/profile", require("./routes/User/profile"));
app.use("/api/user/password", require("./routes/User/password"));
app.use("/api/user/user", require("./routes/User/user"));
app.use("/api/user/post", require("./routes/User/post"));
app.use("/api/user/post/comment", require("./routes/User/comment"));
app.use("/api/user/post/like", require("./routes/User/like"));
// Server
app.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`);
});
