import { ObjectId } from "mongodb";
import { db } from "../index.js";
import { schemaStudent, modelStudent } from "../models/student.model.js";
import { paginate } from "../utils/paginate.util.js";

export function useStudentRepo() {
  const collection = db.collection("students");

  async function createStudentIndexes() {
    try {
      await collection.createIndexes([
        { key: { firstName: 1 } },
        { key: { middleName: 1 } },
        { key: { lastName: 1 } },
        { key: { birthDate: 1 } },
        { key: { gradeLevel: 1 } },
        {
          key: {
            firstName: "text",
            middleName: "text",
            lastName: "text",
            gradeLevel: "text",
          },
          name: "studentTextSearch",
        },
      ]);
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function getAll({
    page = 1,
    limit = 10,
    status = "active",
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
      throw new Error("Failed to get students: " + error.message);
    }
  }

  async function getById(id) {
    try {
      return await collection.findOne();
    } catch (error) {
      throw new Error("Failed to get id: " + error.message);
    }
  }

  async function add(value) {
    try {
      value = modelStudent(value);
      await collection.insertOne(value);
      return "Successfully added student";
    } catch (error) {
      throw new Error("Failed to add students: " + error.message);
    }
  }

  async function updateById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id");
    }

    const { error } = schemaStudent.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: id }, { $set: value });
      return "Successfully updated student";
    } catch (error) {}
  }

  async function deleteById(id) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id");
    }

    try {
      await collection.deleteOne({ _id: id });
    } catch (error) {
      throw new Error("Failed to delete students: " + error.message);
    }
  }

  return { getAll, getById, add, updateById, deleteById, createStudentIndexes };
}
