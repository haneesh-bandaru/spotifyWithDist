import express from "express";
import cookie from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/app/v1/routes/user.routes.js";
import verifyToken from "./src/app/v1/middleware/middleware.js";
import { login, createUser } from "./src/app/v1/controllers/auth.controller.js";
import artistRoutes from "./src/app/v1/routes/artist.routes.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cookie());
app.use(cors());

app.use(express.static(path.join(__dirname, "dist")));

//Routes
app.get("/check", (_req, res) => {
  res.send("working");
});

app.post("/login", login);
app.use("/signup", createUser);

app.use("/v1", verifyToken);
app.use("/v1/app", userRoutes);
app.use("/v1/app", artistRoutes);


// Serve static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

//Port
app.listen(PORT, () => {
  console.log(`This application is running on port number ${PORT}`);
});
