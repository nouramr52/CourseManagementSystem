import express from "express";
import { register, login, googleCallback, completeProfile } from "../controllers/authController.js";
import { sendOTPHandler, verifyOTPHandler, resendOTPHandler } from "../controllers/emailVerificationController.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/google/callback", googleCallback);
router.patch("/complete-profile", completeProfile);

// Email verification routes
router.post("/send-otp", sendOTPHandler);
router.post("/verify-otp", verifyOTPHandler);
router.post("/resend-otp", resendOTPHandler);

export default router;