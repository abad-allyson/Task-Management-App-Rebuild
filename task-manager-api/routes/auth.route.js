import express from "express";
import { useAuthController } from "../controllers/auth.controller.js";

const router = express.Router();

export default function useAuthRoute() {
  const { login } = useAuthController();

  router.post("/", login);

  return router;
}
