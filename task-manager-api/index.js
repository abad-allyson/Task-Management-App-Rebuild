// Header
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// App Config
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || "";
const DB_NAME = process.env.MONGO_DB || "default";

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

export let db;

import setup from "./setup.js";

// Database Export & Setup Script
connectToDB().then(async () => {
  db = client.db(DB_NAME);
  app.use("/api/tasks", useTaskRoute());
  app.use("/api/students", useStudentRoute());

  try {
    await setup();
    console.log("Successfully ran setup script");
  } catch (error) {
    console.error("Failed to run setup script:", error.message);
  }

  // Server Starter
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
