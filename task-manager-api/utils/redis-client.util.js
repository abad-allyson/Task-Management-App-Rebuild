// utils/redisClient.ts
import Redis from "ioredis";

let redisInstance = null;

export function useRedis() {
  function init(options) {
    if (redisInstance) {
      return redisInstance;
    }

    options.host = options.host ?? "localhost";
    options.port = options.port ?? 6379;
    options.password = options.password ?? "";
    options.username = options.username ?? "default";

    redisInstance = new Redis({
      host: options.host,
      port: options.port,
      password: options.password,
      username: options.username,
    });

    redisInstance.on("connect", () => {
      console.log("[Redis] Connected");
    });

    redisInstance.on("error", (err) => {
      console.error("[Redis] Error:", err.message);
    });

    return redisInstance;
  }

  function getClient() {
    if (!redisInstance) {
      throw new Error(
        "[Redis] Redis instance is not initialized. Call init() first."
      );
    }

    return redisInstance;
  }

  return { init, getClient };
}
