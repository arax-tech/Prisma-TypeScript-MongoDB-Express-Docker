import "dotenv/config"

import express from "express"
import { Request, Response } from "express";
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express();
const PORT = process.env.PORT || 8000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));


// Routes
app.get("/", (request: Request, response: Response) => {
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
