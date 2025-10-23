import Joi from "joi";
import { useUserRepo } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { useCache } from "../utils/cache.util.js";
import { BadRequestError, NotFoundError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";

export function useAuthService() {
  const { getByEmail } = useUserRepo();
  const { setCache } = useCache("sessions");

  async function login({ email, password } = {}) {
    // Validate credentials using schema
    const validation = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).required(),
    });

    const { error } = validation.validate({ email, password });
    if (error) {
      throw new BadRequestError(error.details);
    }

    try {
      // Get user by email to check if user exists
      const user = await getByEmail(email);

      if (!user) {
        throw new NotFoundError("Invalid email.");
      }

      // If user exists, hash the password and compare it, else, return an error invalid email
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestError("Invalid password");
      }

      // If password matched, create session id
      const sid = uuidv4();
      // Store session id on redis database
      setCache(`sid:${sid}`, sid, 14400)
        .then(() => {
          logger.log({
            level: "info",
            message: `Set user ${user._id} session id`,
          });
        })
        .catch(() => {
          logger.log({
            level: "error",
            message: "Failed to create user session id",
          });
        });

      // Return user id
      return { sid, user: user._id };
    } catch (error) {
      throw error;
    }
  }

  async function comparePassword(password, hashPassword) {
    return new Promise((resolve) => {
      bcrypt.compare(password, hashPassword, (err, result) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(result);
        return;
      });
    });
  }
  return { login };
}
