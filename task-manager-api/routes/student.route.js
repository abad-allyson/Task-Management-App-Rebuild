import express from "express";
import { useStudentController } from "../controllers/student.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useStudentRoute() {
  // GET all
  router.get("/", requireAuth, useStudentController().getAll);

  // GET by Id
  router.get("/:id", requireAuth, useStudentController().getById);

  // ADD new
  router.post("/", requireAuth, useStudentController().add);

  // Update by Id
  router.patch("/:id", requireAuth, useStudentController().updateById);

  // Delete by Id
  router.delete("/:id", requireAuth, useStudentController().deleteById);

  return router;
}
