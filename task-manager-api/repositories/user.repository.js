import { ObjectId } from "mongodb";
import { db } from "../index.js";
import { schemaUser, modelUser } from "../models/user.model.js";
import { paginate } from "../utils/paginate.util.js";
import { logger } from "../utils/logger.util.js";

export function useUserRepo() {
  const collection = db.collection("users");
  if (!db) {
    console.log("Mongodb client is requred");
    logger.log({ level: "error", message: "Mongodb client is requred" });
  }

  async function createUserIndexes() {
    try {
      await collection.createIndexes([
        { key: { email: 1 }, unique: true },
        {
          key: {
            email: "text",
          },
          name: "emailTextSearch",
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
      throw new Error("Failed to get users: " + error.message);
    }
  }

  async function getById(id) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id");
    }

    try {
      return await collection.findOne({});
    } catch (error) {
      throw new Error("Failed to get by id: " + error.message);
    }
  }

  async function getByEmail(email) {
    try {
      return await collection.findOne({ email });
    } catch (error) {
      throw new Error("Failed to get by email: " + error.message);
    }
  }

  async function add(value) {
    try {
      value = modelUser(value);
      await collection.insertOne(value);
      return "Successfully added user";
    } catch (error) {
      throw new Error("Failed to add users: " + error.message);
    }
  }

  async function updateById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id");
    }

    const { error } = schemaUser.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: id }, { $set: value });
      return "Successfully updated user";
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
      throw new Error("Failed to delete users: " + error.message);
    }
  }

  return {
    getAll,
    getById,
    add,
    updateById,
    deleteById,
    createUserIndexes,
    getByEmail,
  };
}
