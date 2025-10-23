import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI ?? "";
export const MONGO_DB = process.env.MONGO_DB ?? "";
export const REDIS_HOST = process.env.REDIS_HOST ?? "";
export const REDIS_PORT = process.env.REDIS_PORT ?? 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? "";
export const PORT = process.env.PORT ?? 5000;
export const DEFAULT_USER_EMAIL =
  process.env.DEFAULT_USER_EMAIL ?? "admin@goweekdays.com";
export const DEFAULT_USER_PASSWORD =
  process.env.DEFAULT_USER_PASSWORD ?? "@iamsurelygoweekdays!";
