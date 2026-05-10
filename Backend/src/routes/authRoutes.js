import express from "express";
import { register, login, googleCallback, completeProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/google/callback", googleCallback);
router.patch("/complete-profile", completeProfile);

export default router;