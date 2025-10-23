import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error("Failed to hash password.");
  }
}
