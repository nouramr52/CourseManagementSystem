import express from "express";
import { register } from "../controllers/authController.js";

const router = express.Router();

// ✅ matches frontend axios: /auth/signup
router.post("/signup", register);

export default router;