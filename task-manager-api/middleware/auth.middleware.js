import { useRedis } from "../utils/redis-client.util.js";
import { logger } from "../utils/logger.util.js";
import { useCache } from "../utils/cache.util.js";

export async function requireAuth(req, res, next) {
  const sid = req.cookies.sid ?? "";

  if (!sid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { getCache } = useCache("sessions");

  const sessionData = await getCache(`sid:${sid}`);
  if (!sessionData) {
    return res.status(401).json({ error: "Session expired or invalid" });
  }

  const redis = useRedis().getClient();
  redis
    .expire(`sid:${sid}`, 14400)
    .then(() => {
      logger.log({
        level: "info",
        message: `Session ${sid} refreshed successfully`,
      });
    })
    .catch((error) => {
      logger.log({
        level: "error",
        message: `Error refreshing session ${sid}: ${error.message}`,
      });
      return res.status(500).json({ error: "Internal Server Error" });
    });

  next();
}
