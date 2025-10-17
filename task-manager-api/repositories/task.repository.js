import { db } from "../index.js";
import { schemaTask, modelTask } from "../models/task.model.js";
import { ObjectId } from "mongodb";
import { paginate } from "../utils/paginate.util.js";

export function useTaskRepo() {
  const collection = db.collection("tasks");

  // Create Indexes
  async function createTaskIndexes() {
    try {
      await collection.createIndexes([
        { key: { task: 1 } },
        { key: { status: 1 } },
        {
          key: {
            task: "text",
            status: "text",
          },
          name: "taskTextSearch",
        },
      ]);
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }
  // GET all
  async function getAll({
    page = 1,
    limit = 10,
    status = "pending",
    search = "",
  } = {}) {
    page = page > 0 ? page - 1 : page;
    const query = { status };
    if (search) {
      query.$text = { $search: search };
    }
    try {
      const items = await collection
        .aggregate([
          {
            $match: query,
          },
          {
            $skip: page * limit,
          },
          {
            $limit: limit,
          },
        ])
        .toArray();

      const length = await collection.countDocuments(query);
      return paginate({ items, page, limit, length });
    } catch (error) {
      throw new Error("Failed to fetch tasks: " + error.message);
    }
  }

  // GET by id
  async function getById(id) {
    try {
      await collection.findOne();
    } catch (error) {
      throw new Error("Failed to fetch tasks: " + error.message);
    }
  }

  // ADD new
  async function add(value) {
    try {
      value = modelTask(value);
      await collection.insertOne(value);
      return "Successfully created task.";
    } catch (error) {
      throw new Error("Failed to add task: " + error.message);
    }
  }

  // UPDATE
  async function updateById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid ID format");
    }

    const { error } = schemaTask.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: id }, { $set: value });
      return "Successfully updated task.";
    } catch (error) {
      throw new Error("Failed to fetch tasks: " + error.message);
    }
  }

  // DELETE
  async function deleteById(id) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid ID format");
    }

    try {
      await collection.deleteOne({ _id: id });
    } catch (error) {
      throw new Error("Failed to delete tasks: " + error.message);
    }
  }

  return { add, getAll, getById, updateById, deleteById, createTaskIndexes };
}
