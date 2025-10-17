import Joi from "joi";
import { schemaTask } from "../models/task.model.js";
import { useTaskRepo } from "../repositories/task.repository.js";

export function useTaskController() {
  // GET all
  async function getAll(req, res) {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const status = req.query.status || "pending";
    const search = req.query.search ?? "";
    try {
      const items = await useTaskRepo().getAll({ page, status, search });
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to fetch tasks" });
      return;
    }
  }

  // GET by Id
  async function getById(req, res) {
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
      const items = await useTaskRepo().getById(req.params.id);
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get task by id" });
      return;
    }
  }

  // ADD new
  async function add(req, res) {
    const value = req.body;
    const { error } = schemaTask.validate(value);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useTaskRepo().add(value);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to add task" });
      return;
    }
  }

  // UPDATE
  async function updateById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
      task: Joi.string().trim().min(1).max(200).required(),
      description: Joi.string().trim().min(1).max(200).allow(""),
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
      const message = await useTaskRepo().updateById(id, req.body);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get update" });
      return;
    }
  }

  // DELETE
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
      const message = await useTaskRepo().deleteById(req.params.id);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get delete task" });
      return;
    }
  }

  return { add, getAll, getById, updateById, deleteById };
}
