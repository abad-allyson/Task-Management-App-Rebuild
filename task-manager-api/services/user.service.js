import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from "../config.js";
import { useUserRepo } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash-password.util.js";
import { logger } from "../utils/logger.util.js";

export function useUserService() {
  const { add } = useUserRepo();

  async function addDefaultUser() {
    try {
      const hashedPassword = await hashPassword(DEFAULT_USER_PASSWORD);
      await add({
        firstName: "Iam",
        lastName: "Admin",
        password: hashedPassword,
        email: DEFAULT_USER_EMAIL,
      });

      logger.log({
        level: "info",
        message: "Successfully created default user.",
      });
    } catch (error) {
      throw new Error("Failed to create default user.");
    }
  }

  return { addDefaultUser };
}
