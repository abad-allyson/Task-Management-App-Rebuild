import Joi from "joi";
import { schemaStudent } from "../models/student.model.js";
import { useStudentRepo } from "../repositories/student.repository.js";

export function useStudentController() {
  // Get all
  async function getAll(req, res) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const status = req.query.status || "active";
    const search = req.query.search ?? "";
    try {
      const items = await useStudentRepo().getAll({ page, status, search });
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get students" });
      return;
    }
  }

  async function getById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = validation.validate(req.params.id);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const items = await useStudentRepo().getById(req.params.id);
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get students by id" });
      return;
    }
  }

  async function add(req, res) {
    const value = req.body;
    const { error } = schemaStudent.validate(value);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useStudentRepo().add(value);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to add student" });
      return;
    }
  }

  async function updateById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
      firstName: Joi.string().trim().min(1).max(200).required(),
      middleName: Joi.string().trim().min(1).max(200).allow(""),
      lastName: Joi.string().trim().min(1).max(200).required(),
      birthDate: Joi.string().trim().min(1).max(200).required(),
      gradeLevel: Joi.string().trim().min(1).max(200).required(),
    });

    const id = req.params.id;
    const payload = { id, ...req.body };

    const { error } = validation.validate(payload);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useStudentRepo().updateById(id, req.body);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to update student" });
      return;
    }
  }

  async function deleteById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = validation.validate(req.params);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useStudentRepo().deleteById(req.params.id);
      res.status(200).json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete student" });
      return;
    }
  }

  return { getAll, getById, add, updateById, deleteById };
}
