import express from "express";
import { useStudentController } from "../controllers/student.controller.js";

const router = express.Router();

export default function useStudentRoute() {
  // GET all
  router.get("/", useStudentController().getAll);

  // GET by Id
  router.get("/:id", useStudentController().getById);

  // ADD new
  router.post("/", useStudentController().add);

  // Update by Id
  router.patch("/:id", useStudentController().updateById);

  // Delete by Id
  router.delete("/:id", useStudentController().deleteById);

  return router;
}
