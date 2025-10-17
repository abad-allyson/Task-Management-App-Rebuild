import express from "express";
import { useTaskController } from "../controllers/task.controller.js";

const router = express.Router();

export default function useTaskRoute() {
  // Get all
  router.get("/", useTaskController().getAll);

  // Get by id
  router.get("/:id", useTaskController().getById);

  // Add new
  router.post("/", useTaskController().add);

  // Update by id
  router.patch("/:id", useTaskController().updateById);

  // Dleete by id
  router.delete("/:id", useTaskController().deleteById);

  return router;
}
