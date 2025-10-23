// Header
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

// App Config
const app = express();
app.use(cookieParser());

import { PORT, MONGO_URI, MONGO_DB } from "./config.js";

// Database Connection
const client = new MongoClient(MONGO_URI);
async function connectToDB() {
  await client.connect();
  console.log("✅ Connected to MongoDB");
}

// Middleware
app.use(cors());
app.use(express.json());

// Health Route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Routes Import
import useTaskRoute from "./routes/task.route.js";
import useStudentRoute from "./routes/student.route.js";
import useAuthRoute from "./routes/auth.route.js";

export let db;

import setup from "./setup.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./utils/logger.util.js";

// Database Export & Setup Script
connectToDB().then(async () => {
  db = client.db(MONGO_DB);

  try {
    await setup();
    console.log("Successfully ran setup script");
  } catch (error) {
    console.error("Failed to run setup script:", error.message);
  }

  app.use("/api/tasks", useTaskRoute());
  app.use("/api/students", useStudentRoute());
  app.use("/api/auth", useAuthRoute());

  app.use(errorHandler);

  // Server Starter
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    logger.log({
      level: "info",
      message: `🚀 Server running at http://localhost:${PORT}`,
    });
  });
});
