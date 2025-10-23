import { useTaskRepo } from "./repositories/task.repository.js";
import { useStudentRepo } from "./repositories/student.repository.js";
import { useUserRepo } from "./repositories/user.repository.js";
import { useRedis } from "./utils/redis-client.util.js";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "./config.js";
import { useUserService } from "./services/user.service.js";
import { logger } from "./utils/logger.util.js";

export default async function setup() {
  try {
    await useRedis().init({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    });
  } catch (error) {
    console.log("Failed to connect to Redis server.");
    logger.log({ level: "error", message: error.message });
  }

  const { createTaskIndexes } = useTaskRepo();
  try {
    const message = await createTaskIndexes();
    logger.log({ level: "info", message: message });
  } catch (error) {
    logger.log({ level: "error", message: error.message });
  }

  const { createStudentIndexes } = useStudentRepo();
  try {
    const message = await createStudentIndexes();
    logger.log({ level: "info", message: message });
  } catch (error) {
    logger.log({ level: "error", message: error.message });
  }

  const { createUserIndexes } = useUserRepo();
  try {
    const message = await createUserIndexes();
    logger.log({ level: "info", message: message });
  } catch (error) {
    logger.log({ level: "error", message: error.message });
  }

  const { addDefaultUser } = useUserService();
  try {
    await addDefaultUser();
  } catch (error) {
    logger.log({ level: "error", message: error });
  }
}
