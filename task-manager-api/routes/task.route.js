import express from "express";
import { useTaskController } from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useTaskRoute() {
  // Get all
  router.get("/", requireAuth, useTaskController().getAll);

  // Get by id
  router.get("/:id", requireAuth, useTaskController().getById);

  // Add new
  router.post("/", requireAuth, useTaskController().add);

  // Update by id
  router.patch("/:id", requireAuth, useTaskController().updateById);

  // Dleete by id
  router.delete("/:id", requireAuth, useTaskController().deleteById);

  return router;
}
